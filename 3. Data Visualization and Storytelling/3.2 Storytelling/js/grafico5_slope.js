// d3.json("data/osmi_2022.json").then(data => {

//   const totalEmployer = data.filter(d => d.mh_employer_discussion !== undefined).length;
//   const totalCoworker = data.filter(d => d.mh_coworker_discussion !== undefined).length;

//   const yesEmployer = data.filter(d => d.mh_employer_discussion === "Yes").length;
//   const yesCoworker = data.filter(d => d.mh_coworker_discussion === "Yes").length;

//   const pctEmployer = totalEmployer ? Math.round((yesEmployer / totalEmployer) * 100) : 0;
//   const pctCoworker = totalCoworker ? Math.round((yesCoworker / totalCoworker) * 100) : 0;

//   const dataSlope = [
//     { categoria: "Con el empleador (jefe)", valor: pctEmployer },
//     { categoria: "Con compañeros de trabajo", valor: pctCoworker }
//   ];

//   const svg = d3.select("#grafico5");
//   svg.selectAll("*").remove();

//   const width = +svg.attr("width");
//   const height = +svg.attr("height");

//   const x = d3.scalePoint()
//     .domain(dataSlope.map(d => d.categoria))
//     .range([120, width - 120]);

//   const y = d3.scaleLinear()
//     .domain([0, 100])
//     .range([height - 50, 40]);

//   svg.append("line")
//     .attr("x1", x(dataSlope[0].categoria))
//     .attr("y1", y(dataSlope[0].valor))
//     .attr("x2", x(dataSlope[1].categoria))
//     .attr("y2", y(dataSlope[1].valor))
//     .attr("stroke", "#e67e22")
//     .attr("stroke-width", 3)
//     .attr("opacity", 0.8);

//   svg.selectAll("circle")
//     .data(dataSlope)
//     .enter()
//     .append("circle")
//       .attr("cx", d => x(d.categoria))
//       .attr("cy", d => y(d.valor))
//       .attr("r", 7)
//       .attr("fill", "#e67e22")
//       .on("mouseover", (event, d) => {
//         tooltip.style("display", "block")
//           .html(`${d.categoria}: <b>${d.valor}%</b> responden "Yes"`);
//       })
//       .on("mousemove", event => {
//         tooltip.style("left", event.pageX + 10 + "px")
//                .style("top", event.pageY - 20 + "px");
//       })
//       .on("mouseout", () => tooltip.style("display", "none"));

//   // Etiquetas de texto
//   svg.selectAll("text.label")
//     .data(dataSlope)
//     .enter()
//     .append("text")
//       .attr("class", "label")
//       .attr("x", d => x(d.categoria))
//       .attr("y", d => y(d.valor) - 10)
//       .attr("text-anchor", "middle")
//       .text(d => d.valor + "%");
// });

// d3.json("data/osmi_2022.json").then(data => {

//   // Normalizar respuestas
//   function yesNo(value) {
//     if (!value) return null;
//     value = value.trim().toLowerCase();
//     return value === "yes" ? "Yes"
//          : value === "no" ? "No"
//          : null;
//   }

//   const slopeData = [
//     {
//       category: "Problema físico",
//       value: data.filter(d => yesNo(d.mh_employer_discussion) === "Yes").length
//     },
//     {
//       category: "Salud mental",
//       value: data.filter(d => yesNo(d.mental_health) === "Yes").length
//     }
//   ];

//   const total = data.length;
//   slopeData.forEach(d => d.percent = (d.value / total) * 100);

//   const svg = d3.select("#grafico5")
//     .append("svg")
//     .attr("width", 400)
//     .attr("height", 300);

//   const margin = { top: 40, right: 100, bottom: 40, left: 100 };
//   const width = 400 - margin.left - margin.right;
//   const height = 300 - margin.top - margin.bottom;

//   const g = svg.append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

//   const x = d3.scalePoint()
//     .domain(["Físico", "Mental"])
//     .range([0, width])
//     .padding(0.5);

//   const y = d3.scaleLinear()
//     .domain([0, d3.max(slopeData, d => d.percent)])
//     .range([height, 0])
//     .nice();

//   // Línea
//   g.append("line")
//     .attr("x1", x("Físico"))
//     .attr("y1", y(slopeData[0].percent))
//     .attr("x2", x("Mental"))
//     .attr("y2", y(slopeData[1].percent))
//     .attr("stroke", "#E8A09A")
//     .attr("stroke-width", 4);

//   // Puntos
//   g.selectAll(".point")
//     .data(slopeData)
//     .enter()
//     .append("circle")
//       .attr("cx", d => x(d.category === "Problema físico" ? "Físico" : "Mental"))
//       .attr("cy", d => y(d.percent))
//       .attr("r", 6)
//       .attr("fill", d =>
//         d.category === "Problema físico" ? "#4F81BD" : "#E8A09A"
//       );

//   // Etiquetas de texto
//   g.selectAll(".label")
//     .data(slopeData)
//     .enter()
//     .append("text")
//       .attr("x", d => x(d.category === "Problema físico" ? "Físico" : "Mental") - 10)
//       .attr("y", d => y(d.percent) - 10)
//       .attr("text-anchor", "end")
//       .style("font-size", "14px")
//       .style("font-weight", "bold")
//       .text(d => `${d.category}: ${d.percent.toFixed(1)}%`);

//   // Título narrativo
//   svg.append("text")
//     .attr("x", 200)
//     .attr("y", 25)
//     .attr("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("font-weight", "bold")
//     .text("Estigma: ¿Hablarías con tu jefe?");
// });
d3.json("data/osmi_2022.json").then(data => {

  function yesNo(val) {
    if (!val) return null;
    val = val.trim().toLowerCase();
    if (val === "yes") return "Yes";
    if (val === "no") return "No";
    return null;
  }

  const talkCoworker = data.filter(d =>
    yesNo(d.mh_coworker_discussion) === "Yes"
  ).length;

  const talkEmployer = data.filter(d =>
    yesNo(d.mh_employer_discussion) === "Yes"
  ).length;

  const total = data.length;

  const slopeData = [
    { id: "Coworker", label: "Con compañero", value: (talkCoworker / total) * 100, color: "#7BC6B0" },
    { id: "Employer", label: "Con jefe",      value: (talkEmployer   / total) * 100, color: "#D99889" }
  ];

  const svg = d3.select("#grafico5")
    .append("svg")
    .attr("width", 650)
    .attr("height", 380);

  const margin = { top: 40, right: 80, bottom: 70, left: 80 };
  const width = 650 - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scalePoint()
    .domain(["Coworker", "Employer"])
    .range([0, width])
    .padding(0.6);

  const y = d3.scaleLinear()
    .domain([0, d3.max(slopeData, d => d.value)])
    .range([height - 90, 40])
    .nice();

  // Línea
  g.append("line")
    .attr("x1", x("Coworker"))
    .attr("y1", y(slopeData[0].value))
    .attr("x2", x("Employer"))
    .attr("y2", y(slopeData[1].value))
    .attr("stroke", "#D99889")
    .attr("stroke-width", 5)      // ligeramente más gruesa
    .attr("stroke-linecap", "round");

  // Puntos
  g.selectAll(".point")
    .data(slopeData)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.id))
      .attr("cy", d => y(d.value))
      .attr("r", 10)              // puntos más grandes
      .attr("fill", d => d.color);

  // Valores arriba
  g.selectAll(".valueLabel")
    .data(slopeData)
    .enter()
    .append("text")
      .attr("x", d => x(d.id))
      .attr("y", d => y(d.value) - 18)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")   // más grande
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text(d => `${d.value.toFixed(1)}%`);

  // Categorías abajo
  g.selectAll(".categoryLabel")
    .data(slopeData)
    .enter()
    .append("text")
      .attr("x", d => x(d.id))
      .attr("y", height - 40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")   // más visible
      .style("fill", "#333")
      .text(d => d.label);

});
