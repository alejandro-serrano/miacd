// ============================================================
// GRÁFICO 4 — Feature Importance (Random Forest)
// ============================================================
function drawImportancia() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/airbnb_data.json").then(data => {
    const entries = data.feature_importance.slice(0, 8);
    const svg = d3.select("#grafico4");
    svg.selectAll("*").remove();

    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 10, right: 80, bottom: 20, left: 120 };
    const iW = width  - margin.left - margin.right;
    const iH = height - margin.top  - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, d3.max(entries, d => d.importance) * 1.1]).range([0, iW]);
    const y = d3.scaleBand().domain(entries.map(d => d.variable)).range([0, iH]).padding(0.3);

    const highlight = ["bedrooms", "bathrooms"];
    const barColor = d => highlight.includes(d.variable) ? "#e8846a" : "#5499c7";

    g.selectAll(".bar")
      .data(entries)
      .enter().append("rect")
      .attr("x", 0)
      .attr("y", d => y(d.variable))
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", barColor)
      .attr("rx", 3)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`<b>${d.variable}</b><br>Importancia: <b>${(d.importance * 100).toFixed(1)}%</b>`);
      })
      .on("mousemove", event => {
        tooltip.style("left", event.clientX + 10 + "px").style("top", event.clientY - 20 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition().duration(800).delay((d, i) => i * 80)
      .attr("width", d => x(d.importance));

    g.selectAll(".imp-label")
      .data(entries)
      .enter().append("text")
      .attr("x", d => x(d.importance) + 5)
      .attr("y", d => y(d.variable) + y.bandwidth() / 2)
      .attr("alignment-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", d => highlight.includes(d.variable) ? "#c0604a" : "#888")
      .attr("font-weight", d => highlight.includes(d.variable) ? "bold" : "normal")
      .attr("opacity", 0)
      .text(d => `${(d.importance * 100).toFixed(1)}%`)
      .transition().delay((d, i) => 300 + i * 80).duration(400)
      .attr("opacity", 1);

    g.append("g").call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("fill", d => highlight.includes(d) ? "#e8846a" : "#444")
      .attr("font-weight", d => highlight.includes(d) ? "bold" : "normal");

    g.select(".domain").remove();
  });
}
