function drawSankey() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/osmi_2022.json").then((data) => {
    const svg = d3.select("#grafico4");
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const LABEL_FONT_SIZE = "12px";
    const TITLE_FONT_SIZE = "14px";

    const grouped = d3.rollups(
      data.filter((d) => d.benefits && d.workplace_resources),
      (v) => v.length,
      (d) => d.benefits,
      (d) => d.workplace_resources
    );

    const origins = [...new Set(grouped.map((d) => d[0]))];
    const destinations = [
      ...new Set(grouped.flatMap((d) => d[1].map((x) => x[0]))),
    ];

    const yOrigins = d3
      .scalePoint()
      .domain(origins)
      .range([80, height - 80]);

    const yDest = d3
      .scalePoint()
      .domain(destinations)
      .range([80, height - 80]);

    const maxValue = d3.max(grouped, (g) => d3.max(g[1], (d) => d[1])) || 1;

    const pastel = ["#A3CEF1", "#8ECAE6", "#F3DFA2", "#FFB703", "#E29578"];
    const color = d3.scaleOrdinal(pastel);

    grouped.forEach(([orig, rows], i) => {
      rows.forEach(([dest, count], j) => {
        const x1 = 150;
        const y1 = yOrigins(orig);
        const x2 = width - 150;
        const y2 = yDest(dest);

        const strokeWidth = (count / maxValue) * 20;
        const length = Math.hypot(x2 - x1, y2 - y1);

        const line = svg
          .append("line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", color(orig))
          .attr("stroke-width", strokeWidth)
          .attr("opacity", 0.5)
          .attr("stroke-dasharray", length)
          .attr("stroke-dashoffset", length);

        line
          .transition()
          .delay(300 + (i + j) * 120)
          .duration(1000)
          .ease(d3.easeCubicOut)
          .attr("stroke-dashoffset", 0);

        line
          .on("mouseover", (event) => {
            tooltip
              .style("display", "block")
              .html(
                `<b>${count}</b> personas<br>` +
                  `Beneficios: <b>${orig}</b><br>` +
                  `Recursos: <b>${dest}</b>`
              );
          })
          .on("mousemove", (event) => {
            tooltip
              .style("left", event.clientX + 10 + "px")
              .style("top", event.clientY - 20 + "px");
          })
          .on("mouseout", () => tooltip.style("display", "none"));
      });
    });

    origins.forEach((o) => {
      svg
        .append("text")
        .attr("x", 140)
        .attr("y", yOrigins(o))
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .attr("font-size", LABEL_FONT_SIZE)
        .attr("opacity", 0)
        .text(o)
        .transition()
        .delay(200)
        .duration(600)
        .attr("opacity", 1);
    });

    destinations.forEach((d) => {
      svg
        .append("text")
        .attr("x", width - 140)
        .attr("y", yDest(d))
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .attr("font-size", LABEL_FONT_SIZE)
        .attr("opacity", 0)
        .text(d)
        .transition()
        .delay(200)
        .duration(600)
        .attr("opacity", 1);
    });

    svg
      .append("text")
      .attr("x", 150)
      .attr("y", 40)
      .attr("font-weight", "bold")
      .attr("font-size", TITLE_FONT_SIZE)
      .attr("opacity", 0)
      .text("Beneficios")
      .transition()
      .delay(100)
      .duration(600)
      .attr("opacity", 1);

    svg
      .append("text")
      .attr("x", width - 150)
      .attr("y", 40)
      .attr("text-anchor", "end")
      .attr("font-weight", "bold")
      .attr("font-size", TITLE_FONT_SIZE)
      .attr("opacity", 0)
      .text("Recursos disponibles")
      .transition()
      .delay(100)
      .duration(600)
      .attr("opacity", 1);
  });
}

Reveal.on("slidechanged", (event) => {
  if (event.currentSlide.querySelector("#grafico4")) {
    drawSankey();
  }
});
