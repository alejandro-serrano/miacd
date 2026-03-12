// ============================================================
// GRÁFICO 5 — Distribución de precios Coyoacán + precio Gabriela
// ============================================================
function drawCoyoacan() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/airbnb_data.json").then(data => {
    const coy = data.coyoacan;
    const svg = d3.select("#grafico5");
    svg.selectAll("*").remove();

    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const iW = width  - margin.left - margin.right;
    const iH = height - margin.top  - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Simulate distribution with normal approximation
    const mean = coy.mean;
    const std  = 620;
    const bins_n = 30;
    const step = (coy.max - coy.min) / bins_n;

    const buckets = d3.range(bins_n).map(i => {
      const lo = coy.min + i * step;
      const hi = lo + step;
      const mid = (lo + hi) / 2;
      const z   = (mid - mean) / std;
      const count = Math.round(coy.count * Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI)) * step);
      return { lo, hi, mid, count: Math.max(0, count) };
    });

    const x = d3.scaleLinear().domain([coy.min, Math.min(coy.max, 5000)]).range([0, iW]);
    const y = d3.scaleLinear().domain([0, d3.max(buckets, d => d.count) * 1.15]).range([iH, 0]);

    g.selectAll(".bar")
      .data(buckets.filter(d => d.lo <= 5000))
      .enter().append("rect")
      .attr("x", d => x(d.lo))
      .attr("y", iH)
      .attr("width", d => Math.max(1, x(d.hi) - x(d.lo) - 1))
      .attr("height", 0)
      .attr("fill", "#5499c7")
      .attr("opacity", 0.75)
      .transition().duration(700).delay((d, i) => i * 20)
      .attr("y", d => y(d.count))
      .attr("height", d => iH - y(d.count));

    // Median line
    g.append("line")
      .attr("x1", x(coy.median)).attr("x2", x(coy.median))
      .attr("y1", iH).attr("y2", 0)
      .attr("stroke", "#78c2ad").attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,4").attr("opacity", 0)
      .transition().delay(800).duration(400).attr("opacity", 1);

    g.append("text")
      .attr("x", x(coy.median) + 6).attr("y", 16)
      .attr("font-size", "10px").attr("fill", "#78c2ad").attr("font-weight", "bold")
      .attr("opacity", 0)
      .text(`Mediana $${coy.median.toLocaleString()}`)
      .transition().delay(1000).duration(400).attr("opacity", 1);

    // Gabriela line
    g.append("line")
      .attr("x1", x(coy.estimated)).attr("x2", x(coy.estimated))
      .attr("y1", iH).attr("y2", 0)
      .attr("stroke", "#e8846a").attr("stroke-width", 2.5)
      .attr("opacity", 0)
      .transition().delay(1200).duration(500).attr("opacity", 1);

    g.append("text")
      .attr("x", x(coy.estimated) + 6).attr("y", 32)
      .attr("font-size", "10px").attr("fill", "#e8846a").attr("font-weight", "bold")
      .attr("opacity", 0)
      .text(`Gabriela $${coy.estimated.toLocaleString()}`)
      .transition().delay(1400).duration(400).attr("opacity", 1);

    g.append("g").attr("transform", `translate(0,${iH})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => `$${d.toLocaleString()}`))
      .selectAll("text").attr("font-size", "10px").attr("transform", "rotate(-25)").attr("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text").attr("font-size", "10px");

    g.select(".domain").remove();
  });
}
