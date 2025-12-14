function drawStackedBar(minShare = 1) {
  const tooltip = d3.select("#tooltip");

  d3.json("data/osmi_2022.json").then((data) => {
    const svg = d3.select("#grafico3");
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const filtered = data.filter(
      (d) =>
        d.tech_company &&
        d.mh_share &&
        !isNaN(+d.mh_share) &&
        +d.mh_share >= minShare
    );

    const levels = [1, 2, 3, 4, 5];

    const grouped = d3.rollups(
      filtered,
      (v) => {
        const counts = levels.map((l) => ({
          level: l,
          count: v.filter((x) => +x.mh_share === l).length,
        }));
        const total = d3.sum(counts, (d) => d.count);
        counts.forEach((d) => (d.pct = total ? d.count / total : 0));
        return counts;
      },
      (d) => d.tech_company
    );

    const x = d3
      .scaleBand()
      .domain(["Yes", "No"])
      .range([140, width - 140])
      .padding(0.35);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - 50, 30]);

    const colors = d3
      .scaleOrdinal()
      .domain(levels)
      .range(["#d4e6f1", "#a9cce3", "#7fb3d5", "#5499c7", "#2980b9"]);

    grouped.forEach(([group, values]) => {
      let yOffset = height - 50;

      values.forEach((d, i) => {
        const barHeight = (height - 80) * d.pct;

        const rect = svg
          .append("rect")
          .attr("x", x(group))
          .attr("width", x.bandwidth())
          .attr("y", height - 50)
          .attr("height", 0)
          .attr("fill", colors(d.level))
          .on("mouseover", (event) => {
            tooltip
              .style("display", "block")
              .html(`Nivel ${d.level}: ${(d.pct * 100).toFixed(1)}%`);
          })
          .on("mousemove", (event) => {
            tooltip
              .style("left", event.clientX + 10 + "px")
              .style("top", event.clientY - 20 + "px");
          })
          .on("mouseout", () => tooltip.style("display", "none"));

        rect
          .transition()
          .delay(i * 180)
          .duration(900)
          .attr("y", yOffset - barHeight)
          .attr("height", barHeight);

        yOffset -= barHeight;
      });
    });

    const labelMap = {
      Yes: "Onsite",
      No: "Remote",
    };

    svg
      .append("g")
      .attr("transform", `translate(0,${height - 50})`)
      .call(d3.axisBottom(x).tickFormat((d) => labelMap[d] || d));

    svg
      .append("g")
      .attr("transform", "translate(140,0)")
      .call(d3.axisLeft(y).tickFormat((d) => d * 100 + "%"));

    const annotation = svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#555");

    annotation
      .append("tspan")
      .attr("x", width / 2)
      .attr("dy", "0em")
      .text("Niveles de interferencia en labores (1 = mínima, 5 = muy alta)");

    annotation
      .append("tspan")
      .attr("x", width / 2)
      .attr("dy", "1.2em")
      .text("debido a los problemas relacionados con su salud mental.");

    annotation
      .append("tspan")
      .attr("x", width / 2)
      .attr("dy", "1.2em")
      .text("");
  });
}

const select = document.getElementById("interferenciaSelect");

if (select) {
  select.addEventListener("change", (e) => {
    const val = +e.target.value || 1;
    drawStackedBar(val);
  });
}
Reveal.on("slidechanged", (event) => {
  if (event.currentSlide.querySelector("#grafico3")) {
    drawStackedBar(1);
  }
});
