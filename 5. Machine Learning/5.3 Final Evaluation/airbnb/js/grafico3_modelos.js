// ============================================================
// GRÁFICO 3 — Comparación de 3 modelos: barras R² + tabla MAE/RMSE
// ============================================================
function drawModelos() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/airbnb_data.json").then(data => {
    const models = data.models;
    const svg = d3.select("#grafico3");
    svg.selectAll("*").remove();

    const width  = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 18, right: 40, bottom: 115, left: 52 };
    const iW = width - margin.left - margin.right;
    const iH = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const colors = ["#a3cef1", "#5499c7", "#7BC6B0"];

    const x = d3.scaleBand().domain(models.map(d => d.name)).range([0, iW]).padding(0.45);
    const yR2 = d3.scaleLinear().domain([0, 0.70]).range([iH, 0]);

    // Grid
    g.selectAll(".grid").data(yR2.ticks(5)).enter().append("line")
      .attr("x1", 0).attr("x2", iW)
      .attr("y1", d => yR2(d)).attr("y2", d => yR2(d))
      .attr("stroke", "#f0f0f0").attr("stroke-width", 1);

    // Barras R²
    g.selectAll(".bar").data(models).enter().append("rect")
      .attr("x", d => x(d.name)).attr("y", iH)
      .attr("width", x.bandwidth()).attr("height", 0)
      .attr("fill", (d, i) => colors[i]).attr("rx", 4)
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`<b>${d.name}</b><br>R²: <b>${d.r2.toFixed(3)}</b><br>MAE: <b>$${d.mae.toFixed(0)}</b><br>RMSE: <b>$${d.rmse.toFixed(0)}</b>`);
      })
      .on("mousemove", event => tooltip.style("left", event.clientX+10+"px").style("top", event.clientY-20+"px"))
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition().duration(900).delay((d, i) => i * 150)
      .attr("y", d => yR2(d.r2)).attr("height", d => iH - yR2(d.r2));

    // Etiqueta R²
    g.selectAll(".r2-lbl").data(models).enter().append("text")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => yR2(d.r2) - 7)
      .attr("text-anchor", "middle").attr("font-size", "13px").attr("font-weight", "bold")
      .attr("fill", (d, i) => i === 2 ? "#5b9d8a" : "#1f4e79").attr("opacity", 0)
      .text(d => `R²  ${d.r2.toFixed(3)}`)
      .transition().delay((d, i) => 600 + i*150).duration(400).attr("opacity", 1);

    // Badge mejor modelo
    const best = models[2];
    g.append("text")
      .attr("x", x(best.name) + x.bandwidth()/2).attr("y", yR2(best.r2) - 24)
      .attr("text-anchor", "middle").attr("font-size", "9px")
      .attr("fill", "#7BC6B0").attr("font-weight", "bold").attr("letter-spacing", "0.06em")
      .attr("opacity", 0).text("✓ MEJOR MODELO")
      .transition().delay(1300).duration(500).attr("opacity", 1);

    // Eje Y
    g.append("g").call(d3.axisLeft(yR2).ticks(5).tickFormat(d => d.toFixed(2)))
      .selectAll("text").attr("font-size", "10px").attr("fill", "#999");
    g.select(".domain").remove();
    g.selectAll(".tick line").remove();

    g.append("text").attr("transform", "rotate(-90)").attr("x", -iH/2).attr("y", -38)
      .attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "#aaa").text("R²");

    // ── Tabla MAE / RMSE ────────────────────────────────────
    const tableTop = margin.top + iH + 22;

    ["MAE", "RMSE"].forEach((metric, mi) => {
      svg.append("text")
        .attr("x", margin.left - 8).attr("y", tableTop + mi * 32 + 14)
        .attr("text-anchor", "end").attr("font-size", "10px").attr("font-weight", "600")
        .attr("fill", "#aaa").attr("letter-spacing", "0.05em").text(metric);
    });

    svg.append("line")
      .attr("x1", margin.left).attr("x2", margin.left + iW)
      .attr("y1", tableTop - 5).attr("y2", tableTop - 5)
      .attr("stroke", "#e8e8e8").attr("stroke-width", 1);

    svg.append("line")
      .attr("x1", margin.left).attr("x2", margin.left + iW)
      .attr("y1", tableTop + 25).attr("y2", tableTop + 25)
      .attr("stroke", "#f2f2f2").attr("stroke-width", 1);

    models.forEach((d, i) => {
      const cx = margin.left + x(d.name) + x.bandwidth()/2;

      svg.append("text").attr("x", cx).attr("y", tableTop - 9)
        .attr("text-anchor", "middle").attr("font-size", "10px")
        .attr("fill", colors[i]).attr("font-weight", "600").attr("opacity", 0)
        .text(d.short || d.name)
        .transition().delay(800 + i*100).duration(400).attr("opacity", 1);

      svg.append("text").attr("x", cx).attr("y", tableTop + 14)
        .attr("text-anchor", "middle").attr("font-size", "13px")
        .attr("font-weight", i === 2 ? "bold" : "normal")
        .attr("fill", i === 2 ? "#5b9d8a" : "#555").attr("opacity", 0)
        .text(`$${d.mae.toFixed(0)}`)
        .transition().delay(900 + i*100).duration(400).attr("opacity", 1);

      svg.append("text").attr("x", cx).attr("y", tableTop + 46)
        .attr("text-anchor", "middle").attr("font-size", "13px")
        .attr("font-weight", i === 2 ? "bold" : "normal")
        .attr("fill", i === 2 ? "#5b9d8a" : "#555").attr("opacity", 0)
        .text(`$${d.rmse.toFixed(0)}`)
        .transition().delay(1000 + i*100).duration(400).attr("opacity", 1);
    });
  });
}
