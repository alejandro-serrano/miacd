d3.json("data/osmi_2022.json").then(data => {

  const svg = d3.select("#grafico2")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  // Filtrar valores válidos
  const valid = data.filter(d => d.mental_health);
  const total = valid.length;

  const yesCount = valid.filter(d =>
    d.mental_health.trim().toLowerCase() === "yes"
  ).length;

  const yesPct = yesCount / total;

  const squares = 100;
  const gridSize = 10;

  // Tamaño dinámico de cada celda según el tamaño del SVG
  const squareSize = width / (gridSize + 1.5); 
  const padding = squareSize * 0.15;

  const waffleData = Array.from({ length: squares }, (_, i) => ({
    filled: i < Math.round(yesPct * squares)
  }));

  // Tooltip interno
  const tooltip = svg.append("g").style("display", "none");

  tooltip.append("rect")
    .attr("width", 180)
    .attr("height", 35)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("fill", "white")
    .attr("stroke", "#333");

  const tooltipText = tooltip.append("text")
    .attr("x", 10)
    .attr("y", 22)
    .style("font-size", "12px")
    .style("fill", "#333");

  svg.selectAll("rect.waffle")
    .data(waffleData)
    .enter()
    .append("rect")
      .attr("class", "waffle")
      .attr("x", (_, i) => (i % gridSize) * (squareSize + padding) + squareSize * 0.2)
      .attr("y", (_, i) => Math.floor(i / gridSize) * (squareSize + padding) + squareSize * 0.2)
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", d => d.filled ? "#7BC6B0" : "#E8A09A")
      .attr("stroke", "#FFFFFF")
      .on("mouseover", (event, d) => {

        const message = d.filled
          ? `Sí (Yes): ${(yesPct * 100).toFixed(1)}%`
          : `No / Otros: ${(100 - yesPct * 100).toFixed(1)}%`;

        tooltipText.text(message);
        tooltip.style("display", "block");
        tooltip.raise();
      })
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event);
        tooltip.attr("transform", `translate(${mx + 10}, ${my - 20})`);
      })
      .on("mouseout", () => tooltip.style("display", "none"));

});
