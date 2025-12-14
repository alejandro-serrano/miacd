// ================================
// PIRÁMIDE POBLACIONAL
// ================================
function drawPiramide() {
  const tooltip = d3.select("#tooltip");

  d3.json("data/osmi_2022.json").then((data) => {
    const svg = d3.select("#grafico1");

    // LIMPIAR SVG (Reveal)
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = { top: 40, right: 40, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Rangos de edad
    const ageBins = [
      { label: "18-24", min: 18, max: 24 },
      { label: "25-29", min: 25, max: 29 },
      { label: "30-34", min: 30, max: 34 },
      { label: "35-39", min: 35, max: 39 },
      { label: "40-44", min: 40, max: 44 },
      { label: "45-49", min: 45, max: 49 },
      { label: "50-59", min: 50, max: 59 },
      { label: "60+", min: 60, max: 150 },
    ];

    // Agrupar datos
    const grouped = ageBins.map((bin) => {
      const inBin = data.filter(
        (d) => d.age && d.age >= bin.min && d.age <= bin.max && d.gender
      );

      const male = inBin.filter((d) =>
        d.gender.toLowerCase().includes("male")
      ).length;

      const female = inBin.filter(
        (d) =>
          d.gender.toLowerCase().includes("female") ||
          d.gender.toLowerCase().includes("woman")
      ).length;

      return {
        range: bin.label,
        male: -male,
        female: female,
      };
    });

    const maxValue = d3.max(grouped, (d) =>
      Math.max(Math.abs(d.male), d.female)
    );

    // Escalas
    const x = d3
      .scaleLinear()
      .domain([-maxValue, maxValue])
      .range([0, innerWidth]);

    const y = d3
      .scaleBand()
      .domain(grouped.map((d) => d.range))
      .range([innerHeight, 0])
      .padding(0.1);

    // Ejes
    g.append("g").call(d3.axisLeft(y));

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(3)
          .tickFormat((d) => Math.abs(d))
      );

    const center = x(0);

    g.selectAll(".male")
      .data(grouped)
      .enter()
      .append("rect")
      .attr("class", "male")
      .attr("x", center)
      .attr("y", (d) => y(d.range))
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", "#5A73A8")
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(
          `<b>Hombres</b><br>
              Edad: ${d.range}<br>
              Personas: ${Math.abs(d.male)}`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.clientX + 12 + "px")
          .style("top", event.clientY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition()
      .duration(900)
      .attr("x", (d) => x(d.male))
      .attr("width", (d) => center - x(d.male));

    g.selectAll(".female")
      .data(grouped)
      .enter()
      .append("rect")
      .attr("class", "female")
      .attr("x", center)
      .attr("y", (d) => y(d.range))
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", "#A98FD3")
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(
          `<b>Mujeres</b><br>
           Edad: ${d.range}<br>
           Personas: ${d.female}`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.clientX + 12 + "px")
          .style("top", event.clientY - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition()
      .duration(900)
      .attr("width", (d) => x(d.female) - center);

    // Títulos laterales
    svg
      .append("text")
      .attr("x", margin.left + innerWidth * 0.25)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "small")
      .style("font-weight", "normal")
      .text("Hombres");

    svg
      .append("text")
      .attr("x", margin.left + innerWidth * 0.75)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "small")
      .style("font-weight", "normal")
      .text("Mujeres");
  });
}
