d3.json("data/osmi_2022.json").then(data => {

  const svg = d3.select("#grafico4");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const grouped = d3.rollups(
    data.filter(d => d.benefits && d.workplace_resources),
    v => v.length,
    d => d.benefits,
    d => d.workplace_resources
  );

  const origins = [...new Set(grouped.map(d => d[0]))];
  const destinations = [...new Set(grouped.flatMap(d => d[1].map(x => x[0])))];

  const yOrigins = d3.scalePoint()
    .domain(origins)
    .range([80, height - 80]);

  const yDest = d3.scalePoint()
    .domain(destinations)
    .range([80, height - 80]);

  const maxValue = d3.max(grouped, g => d3.max(g[1], d => d[1])) || 1;

  const pastel = ["#A3CEF1", "#8ECAE6", "#F3DFA2", "#FFB703", "#E29578"];

  const color = d3.scaleOrdinal(pastel);

  // Dibujamos líneas
  grouped.forEach(([orig, rows]) => {
    rows.forEach(([dest, count]) => {

      svg.append("line")
        .attr("x1", 150)
        .attr("y1", yOrigins(orig))
        .attr("x2", width - 150)
        .attr("y2", yDest(dest))
        .attr("stroke", d => color(orig))
        .attr("stroke-width", (count / maxValue) * 20)
        .attr("opacity", 0.5)
        .on("mouseover", event => {
          tooltip.style("display", "block")
            .html(
              `<b>${count}</b> personas<br>` +
              `Beneficios: <b>${orig}</b><br>` +
              `Recursos: <b>${dest}</b>`
            );
        })
        .on("mousemove", event => {
          tooltip.style("left", event.pageX + 10 + "px")
                 .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"));
    });
  });

  // Strata de texto
  origins.forEach(o => {
    svg.append("text")
      .attr("x", 150 - 10)
      .attr("y", yOrigins(o))
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .text(o);
  });

  destinations.forEach(d => {
    svg.append("text")
      .attr("x", width - 150 + 10)
      .attr("y", yDest(d))
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .text(d);
  });

  svg.append("text")
    .attr("x", 150)
    .attr("y", 40)
    .text("Beneficios (benefits)")
    .attr("font-weight", "bold");

  svg.append("text")
    .attr("x", width - 150)
    .attr("y", 40)
    .attr("text-anchor", "end")
    .text("Recursos disponibles (workplace_resources)")
    .attr("font-weight", "bold");
});
