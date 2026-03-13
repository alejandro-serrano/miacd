// ============================================================
// GRÁFICO 7 — Comparación completa reducción dimensionalidad
// Barras horizontales coloreadas por grupo
// ============================================================
function drawDimComparacion() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/airbnb_data.json").then(data => {
    const entries = data.dim_reduction; // ya ordenado por R² desc

    const svg = d3.select("#grafico7");
    svg.selectAll("*").remove();

    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 10, right: 120, bottom: 30, left: 160 };
    const iW = width - margin.left - margin.right;
    const iH = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const groupColor = {
      original:  "#5499c7",
      seleccion: "#f4b942",
      pca:       "#78c2ad"
    };

    const x = d3.scaleLinear().domain([0, 0.65]).range([0, iW]);
    const y = d3.scaleBand().domain(entries.map(d => d.name)).range([0, iH]).padding(0.28);

    // Barras
    g.selectAll(".bar").data(entries).enter().append("rect")
      .attr("x", 0).attr("y", d => y(d.name))
      .attr("height", y.bandwidth()).attr("width", 0)
      .attr("fill", d => groupColor[d.group]).attr("rx", 3)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`<b>${d.name}</b><br>R²: <b>${d.r2.toFixed(3)}</b><br>MAE: <b>$${d.mae.toFixed(0)}</b><br>RMSE: <b>$${d.rmse.toFixed(0)}</b>`);
      })
      .on("mousemove", event => tooltip.style("left", event.clientX+10+"px").style("top", event.clientY-20+"px"))
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition().duration(800).delay((d, i) => i * 80)
      .attr("width", d => x(d.r2));

    // Etiqueta R²
    g.selectAll(".r2-lbl").data(entries).enter().append("text")
      .attr("x", d => x(d.r2) + 5)
      .attr("y", d => y(d.name) + y.bandwidth()/2)
      .attr("alignment-baseline", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", d => d.name.startsWith("GB — orig") ? "bold" : "normal")
      .attr("fill", d => d.name.startsWith("GB — orig") ? "#5b9d8a" : "#666")
      .attr("opacity", 0)
      .text(d => d.r2.toFixed(3))
      .transition().delay((d, i) => 300 + i*80).duration(400).attr("opacity", 1);

    // Eje Y
    g.append("g").call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .attr("font-size", "11px")
      .attr("fill", d => d.startsWith("GB — orig") ? "#5b9d8a" : "#444")
      .attr("font-weight", d => d.startsWith("GB — orig") ? "bold" : "normal");

    g.select(".domain").remove();

    // Eje X
    g.append("g").attr("transform", `translate(0,${iH})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d.toFixed(2)))
      .selectAll("text").attr("font-size", "10px");

    // Leyenda grupos
    const legendData = [
      { label: "Variables originales", color: groupColor.original },
      { label: "Selección de variables", color: groupColor.seleccion },
      { label: "PCA", color: groupColor.pca }
    ];

    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left + iW + 12}, ${margin.top + 20})`);

    legendData.forEach((d, i) => {
      legend.append("rect")
        .attr("x", 0).attr("y", i * 22)
        .attr("width", 12).attr("height", 12)
        .attr("fill", d.color).attr("rx", 2);
      legend.append("text")
        .attr("x", 17).attr("y", i * 22 + 10)
        .attr("font-size", "10px").attr("fill", "#555")
        .text(d.label);
    });
  });
}
