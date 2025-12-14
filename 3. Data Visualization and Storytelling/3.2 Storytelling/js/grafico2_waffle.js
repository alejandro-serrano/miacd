d3.json("data/osmi_2022.json").then(data => {

  const container = d3.select("#grafico2");
  container.selectAll("*").remove();

  const svg = container
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  /* ================================
     TOOLTIP GLOBAL (NO SVG)
     ================================ */
  const tooltip = d3.select("#tooltip");

  /* ================================
     DATOS
     ================================ */
  const valid = data.filter(d => d.mental_health);
  const total = valid.length;

  const yesCount = valid.filter(d =>
    d.mental_health.trim().toLowerCase() === "yes"
  ).length;

  const yesPct = yesCount / total;

  const squares = 100;
  const gridSize = 10;

  const squareSize = width / (gridSize + 1.5);
  const padding = squareSize * 0.15;

  const waffleData = Array.from({ length: squares }, (_, i) => ({
    filled: i < Math.round(yesPct * squares)
  }));

  /* ================================
     WAFFLE
     ================================ */
  svg.selectAll("rect.waffle")
    .data(waffleData)
    .enter()
    .append("rect")
      .attr("class", "waffle")
      .attr("x", (_, i) =>
        (i % gridSize) * (squareSize + padding) + squareSize * 0.2
      )
      .attr("y", (_, i) =>
        Math.floor(i / gridSize) * (squareSize + padding) + squareSize * 0.2
      )
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", d => d.filled ? "#7BC6B0" : "#E8A09A")
      .attr("stroke", "#FFFFFF")
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {

        const message = d.filled
          ? `Sí (Yes): ${(yesPct * 100).toFixed(1)}%`
          : `No / Otros: ${(100 - yesPct * 100).toFixed(1)}%`;

        tooltip
          .style("display", "block")
          .html(message);
      })
      .on("mousemove", event => {
        tooltip
          .style("left", (event.clientX + 12) + "px")
          .style("top", (event.clientY - 28) + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"));
});
