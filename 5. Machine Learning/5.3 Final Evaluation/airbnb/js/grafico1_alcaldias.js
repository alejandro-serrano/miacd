// ============================================================
// GRÁFICO 1 — Precio mediano por alcaldía (bar chart horizontal)
// ============================================================
function drawAlcaldias() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/airbnb_data.json").then(data => {
    const svg = d3.select("#grafico1");
    svg.selectAll("*").remove();

    const raw = data.price_by_neighbourhood;
    const entries = Object.entries(raw)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value);

    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 10, right: 70, bottom: 30, left: 160 };
    const iW = width  - margin.left - margin.right;
    const iH = height - margin.top  - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, d3.max(entries, d => d.value)]).range([0, iW]);
    const y = d3.scaleBand().domain(entries.map(d => d.name)).range([0, iH]).padding(0.28);

    // Highlight Coyoacán
    const barColor = d => d.name === "Coyoacán" ? "#e8846a" : "#5499c7";

    g.selectAll(".bar")
      .data(entries)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => y(d.name))
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", barColor)
      .attr("rx", 3)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`<b>${d.name}</b><br>Precio mediano: <b>$${d.value.toLocaleString()} MXN</b>`);
      })
      .on("mousemove", event => {
        tooltip.style("left", event.clientX + 10 + "px").style("top", event.clientY - 20 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition().duration(900).delay((d, i) => i * 50)
      .attr("width", d => x(d.value));

    // Value labels
    g.selectAll(".val-label")
      .data(entries)
      .enter().append("text")
      .attr("x", d => x(d.value) + 5)
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("alignment-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", d => d.name === "Coyoacán" ? "#e8846a" : "#888")
      .attr("font-weight", d => d.name === "Coyoacán" ? "bold" : "normal")
      .attr("opacity", 0)
      .text(d => `$${d.value.toLocaleString()}`)
      .transition().delay((d, i) => 200 + i * 50).duration(400)
      .attr("opacity", 1);

    // Y axis (names)
    g.append("g").call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("fill", d => d === "Coyoacán" ? "#e8846a" : "#444")
      .attr("font-weight", d => d === "Coyoacán" ? "bold" : "normal");

    g.select(".domain").remove();
  });
}
