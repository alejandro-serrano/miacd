d3.json("data/osmi_2022.json").then(data => {

  const svg = d3.select("#grafico1");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  // MÁRGENES
  const topMargin = 20;
  const bottomMargin = 40;
  const leftMargin = 120;
  const rightMargin = 40;

  // ----------------------------------------------------
  // NORMALIZAR GÉNERO
  // ----------------------------------------------------
  function normGender(g) {
    if (!g) return "Other";

    g = g.trim().toLowerCase();

    const femaleTerms = ["female", "woman", "cis female", "f", "trans female", "fem"];
    const maleTerms = ["male", "man", "cis male", "m", "trans male", "masculine"];

    if (femaleTerms.some(t => g.includes(t))) return "Female";
    if (maleTerms.some(t => g.includes(t))) return "Male";

    return "Other";
  }

  // LIMPIEZA
  data = data
    .filter(d => d.age && !isNaN(+d.age))
    .map(d => ({
      age: +d.age,
      gender: normGender(d.gender)
    }));

  // ----------------------------------------------------
  // BINS DE EDAD
  // ----------------------------------------------------
  const ageBins = [
    { range: "18-24", min: 18, max: 24 },
    { range: "25-29", min: 25, max: 29 },
    { range: "30-34", min: 30, max: 34 },
    { range: "35-39", min: 35, max: 39 },
    { range: "40-44", min: 40, max: 44 },
    { range: "45-49", min: 45, max: 49 },
    { range: "50-59", min: 50, max: 59 },
    { range: "60+",   min: 60, max: 100 }
  ];

  // AGRUPACIÓN
  const grouped = ageBins.map(bin => {
    const males = data.filter(d => d.gender === "Male" && d.age >= bin.min && d.age <= bin.max).length;
    const females = data.filter(d => d.gender === "Female" && d.age >= bin.min && d.age <= bin.max).length;

    return {
      range: bin.range,
      male: -males,     // lado izquierdo
      female: females   // lado derecho
    };
  });

  // ----------------------------------------------------
  // ESCALAS
  // ----------------------------------------------------
  const maxValue = d3.max(grouped, d => Math.max(Math.abs(d.male), d.female));

  const x = d3.scaleLinear()
    .domain([-maxValue, maxValue])
    .range([leftMargin, width - rightMargin]);

  const y = d3.scaleBand()
    .domain(grouped.map(d => d.range).reverse())
    .range([topMargin, height - bottomMargin])
    .padding(0.25);

  // ----------------------------------------------------
  // HOMBRES – LADO IZQUIERDO
  // ----------------------------------------------------
  svg.selectAll(".male")
    .data(grouped)
    .enter()
    .append("rect")
      .attr("x", d => x(d.male))
      .attr("y", d => y(d.range))
      .attr("width", d => x(0) - x(d.male))
      .attr("height", y.bandwidth())
      .attr("fill", "#4F81BD")
      .attr("stroke", "#3A5A85");

  // ----------------------------------------------------
  // MUJERES – LADO DERECHO
  // ----------------------------------------------------
  svg.selectAll(".female")
    .data(grouped)
    .enter()
    .append("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.range))
      .attr("width", d => x(d.female) - x(0))
      .attr("height", y.bandwidth())
      .attr("fill", "#A98FD3")
      .attr("stroke", "#7F6EA8");

  // ----------------------------------------------------
  // EJES
  // ----------------------------------------------------

  // EJE Y A LA IZQUIERDA
  svg.append("g")
    .attr("transform", `translate(${leftMargin}, 0)`)
    .call(d3.axisLeft(y));

  // ✔ EJE X alineado
  svg.append("g")
    .attr("transform", `translate(0, ${height - bottomMargin})`)
    .call(
      d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d => Math.abs(d))
    );

  // ----------------------------------------------------
  // TÍTULOS HOMBRES – MUJERES
  // ----------------------------------------------------
  svg.append("text")
    .attr("x", x(-maxValue / 2))
    .attr("y", topMargin - 5)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Hombres");

  svg.append("text")
    .attr("x", x(maxValue / 2))
    .attr("y", topMargin - 5)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Mujeres");

});
