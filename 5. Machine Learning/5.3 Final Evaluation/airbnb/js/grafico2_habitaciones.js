// ============================================================
// GRÁFICO 2 — Precio mediano por habitaciones (dot/bar)
// ============================================================
function drawBedrooms() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/airbnb_data.json").then(data => {
    const svg = d3.select("#grafico2");
    svg.selectAll("*").remove();

    const raw   = data.price_by_bedrooms;
    const entries = Object.entries(raw).map(([k, v]) => ({ beds: +k, value: v }));

    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const iW = width  - margin.left - margin.right;
    const iH = height - margin.top  - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(entries.map(d => d.beds)).range([0, iW]).padding(0.45);
    const y = d3.scaleLinear().domain([0, d3.max(entries, d => d.value) * 1.15]).range([iH, 0]);

    const colors = ["#a3cef1","#5499c7","#7BC6B0","#f4b942","#1f4e79"];

    // Bars
    g.selectAll(".bar")
      .data(entries)
      .enter().append("rect")
      .attr("x", d => x(d.beds))
      .attr("y", iH)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d, i) => d.beds === 2 ? "#7BC6B0" : "#5499c7")
      .attr("rx", 4)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`<b>${d.beds} hab.</b><br>Mediana precio: <b>$${d.value.toLocaleString()} MXN</b>`);
      })
      .on("mousemove", event => {
        tooltip.style("left", event.clientX + 10 + "px").style("top", event.clientY - 20 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition().duration(900).delay((d, i) => i * 120)
      .attr("y", d => y(d.value))
      .attr("height", d => iH - y(d.value));

    // Price labels on top
    g.selectAll(".price-label")
      .data(entries)
      .enter().append("text")
      .attr("x", d => x(d.beds) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 8)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", d => d.beds === 2 ? "bold" : "normal")
      .attr("fill", d => d.beds === 2 ? "#7BC6B0" : "#444")
      .attr("opacity", 0)
      .text(d => `$${d.value.toLocaleString()}`)
      .transition().delay((d, i) => 400 + i * 120).duration(400)
      .attr("opacity", 1);

    // Axes
    g.append("g").attr("transform", `translate(0,${iH})`)
      .call(d3.axisBottom(x).tickFormat(d => `${d} hab.`))
      .selectAll("text").attr("font-size", "11px");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d.toLocaleString()}`))
      .selectAll("text").attr("font-size", "10px");

    g.select(".domain").remove();
    g.selectAll(".tick line").attr("stroke", "#eee");

    // Gabriela annotation
    const gab = entries.find(d => d.beds === 2);
    if (gab) {
      g.append("text")
        .attr("x", x(gab.beds) + x.bandwidth() / 2)
        .attr("y", y(gab.value) - 28)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#7BC6B0")
        .attr("opacity", 0)
        .text("← Gabriela")
        .transition().delay(900).duration(500)
        .attr("opacity", 1);
    }
  });
}
