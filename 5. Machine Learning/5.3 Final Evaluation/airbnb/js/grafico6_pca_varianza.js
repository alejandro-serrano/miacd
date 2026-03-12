// ============================================================
// GRÁFICO 6 — Varianza explicada acumulada PCA
// ============================================================
function drawPCAVarianza() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/airbnb_data.json").then(data => {
    const varData = data.pca_variance.map((v, i) => ({ comp: i + 1, var: v }));
    const n80 = varData.find(d => d.var >= 0.80).comp;

    const svg = d3.select("#grafico6");
    svg.selectAll("*").remove();

    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 40, bottom: 45, left: 55 };
    const iW = width - margin.left - margin.right;
    const iH = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([1, varData.length]).range([0, iW]);
    const y = d3.scaleLinear().domain([0, 1]).range([iH, 0]);

    // Área rellena
    const area = d3.area()
      .x(d => x(d.comp)).y0(iH).y1(d => y(d.var))
      .curve(d3.curveMonotoneX);

    const line = d3.line()
      .x(d => x(d.comp)).y(d => y(d.var))
      .curve(d3.curveMonotoneX);

    g.append("path").datum(varData)
      .attr("fill", "#a3cef1").attr("opacity", 0.25)
      .attr("d", area);

    const path = g.append("path").datum(varData)
      .attr("fill", "none").attr("stroke", "#5499c7").attr("stroke-width", 2.5)
      .attr("d", line);

    const totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength).attr("stroke-dashoffset", totalLength)
      .transition().duration(1200).ease(d3.easeCubicOut).attr("stroke-dashoffset", 0);

    // Puntos
    g.selectAll(".dot").data(varData).enter().append("circle")
      .attr("cx", d => x(d.comp)).attr("cy", d => y(d.var))
      .attr("r", 0).attr("fill", "#5499c7")
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`<b>Componente ${d.comp}</b><br>Varianza acumulada: <b>${(d.var*100).toFixed(1)}%</b>`);
      })
      .on("mousemove", event => tooltip.style("left", event.clientX+10+"px").style("top", event.clientY-20+"px"))
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition().delay((d, i) => 100 + i * 55).duration(300)
      .attr("r", 4);

    // Línea 80%
    g.append("line")
      .attr("x1", 0).attr("x2", iW)
      .attr("y1", y(0.80)).attr("y2", y(0.80))
      .attr("stroke", "#e8846a").attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,4").attr("opacity", 0)
      .transition().delay(1300).duration(400).attr("opacity", 1);

    // Línea vertical en n80
    g.append("line")
      .attr("x1", x(n80)).attr("x2", x(n80))
      .attr("y1", 0).attr("y2", iH)
      .attr("stroke", "#e8846a").attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,4").attr("opacity", 0)
      .transition().delay(1400).duration(400).attr("opacity", 1);

    // Etiqueta 80%
    g.append("text").attr("x", iW + 4).attr("y", y(0.80) + 4)
      .attr("font-size", "10px").attr("fill", "#e8846a").attr("font-weight", "bold")
      .attr("opacity", 0).text("80%")
      .transition().delay(1500).duration(400).attr("opacity", 1);

    // Etiqueta n80 componentes
    g.append("text").attr("x", x(n80)).attr("y", -6)
      .attr("text-anchor", "middle").attr("font-size", "10px")
      .attr("fill", "#e8846a").attr("font-weight", "bold").attr("opacity", 0)
      .text(`${n80} comp.`)
      .transition().delay(1500).duration(400).attr("opacity", 1);

    // Ejes
    g.append("g").attr("transform", `translate(0,${iH})`)
      .call(d3.axisBottom(x).ticks(varData.length).tickFormat(d => d))
      .selectAll("text").attr("font-size", "10px");

    g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d*100).toFixed(0)}%`))
      .selectAll("text").attr("font-size", "10px");

    g.select(".domain").remove();

    g.append("text").attr("x", iW/2).attr("y", iH + 38)
      .attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "#aaa")
      .text("Número de componentes principales");
  });
}
