function drawStackedBar(minShare = 1) {
  // d3.json("data/osmi_2022.json").then(data => {

  //   // Filtramos registros válidos
  //   data = data.filter(d =>
  //     d.tech_company !== undefined &&
  //     d.mh_share !== undefined &&
  //     !isNaN(+d.mh_share)
  //   );

  //   // Filtramos por mínimo de interferencia
  //   data = data.filter(d => +d.mh_share >= minShare);

  //   const svg = d3.select("#grafico3");
  //   svg.selectAll("*").remove();

  //   const width = +svg.attr("width");
  //   const height = +svg.attr("height");

  //   // Agrupamos: tech_company x mh_share → conteo
  //   const grouped = d3.rollups(
  //     data,
  //     v => v.length,
  //     d => d.tech_company,
  //     d => +d.mh_share
  //   );

  //   const techValues = [...new Set(data.map(d => d.tech_company))];
  //   const shareValues = [1, 2, 3, 4, 5];

  //   const x = d3.scaleBand()
  //     .domain(techValues)
  //     .range([80, width - 40])
  //     .padding(0.2);

  //   const y = d3.scaleBand()
  //     .domain(shareValues)
  //     .range([20, height - 60])
  //     .padding(0.2);

  //   const maxValue = d3.max(grouped, g => d3.max(g[1], d => d[1])) || 1;

  //   const color = d3.scaleSequential(d3.interpolateOranges)
  //     .domain([0, maxValue]);

  //   // Dibujamos celdas
  //   grouped.forEach(([tech, rows]) => {
  //     rows.forEach(([share, count]) => {
  //       svg.append("rect")
  //         .attr("x", x(tech))
  //         .attr("y", y(share))
  //         .attr("width", x.bandwidth())
  //         .attr("height", y.bandwidth())
  //         .attr("fill", color(count))
  //         .on("mouseover", () => {
  //           tooltip.style("display", "block")
  //             .html(
  //               `Empresa tech: <b>${tech}</b><br>` +
  //               `Interferencia (mh_share): <b>${share}</b><br>` +
  //               `${count} personas`
  //             );
  //         })
  //         .on("mousemove", event => {
  //           tooltip.style("left", event.pageX + 10 + "px")
  //                  .style("top", event.pageY - 20 + "px");
  //         })
  //         .on("mouseout", () => tooltip.style("display", "none"));
  //     });
  //   });

  //   // Ejes
  //   svg.append("g")
  //     .attr("transform", `translate(0,${height - 60})`)
  //     .call(d3.axisBottom(x));

  //   svg.append("g")
  //     .attr("transform", "translate(80,0)")
  //     .call(d3.axisLeft(y).tickFormat(d => d));
  // });

  d3.json("data/osmi_2022.json").then(data => {

    const svg = d3.select("#grafico3");
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const filtered = data.filter(d =>
      d.tech_company &&
      d.mh_share &&
      !isNaN(+d.mh_share)
    );

    const levels = [1, 2, 3, 4, 5];

    const grouped = d3.rollups(
      filtered,
      v => {
        const counts = levels.map(l => ({
          level: l,
          count: v.filter(x => +x.mh_share === l).length
        }));
        const total = d3.sum(counts, d => d.count);
        counts.forEach(d => d.pct = total ? d.count / total : 0);
        return counts;
      },
      d => d.tech_company
    );

    const x = d3.scaleBand()
      .domain(["Yes", "No"])
      .range([150, width - 150])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - 40, 20]);

    const colors = d3.scaleOrdinal()
      .domain(levels)
      .range(["#d4e6f1", "#a9cce3", "#7fb3d5", "#5499c7", "#2980b9"]);

    grouped.forEach(([group, values]) => {
      let yOffset = height - 40;

      values.forEach(d => {
        const barHeight = (height - 60) * d.pct;

        svg.append("rect")
          .attr("x", x(group))
          .attr("y", yOffset - barHeight)
          .attr("width", x.bandwidth())
          .attr("height", barHeight)
          .attr("fill", colors(d.level))
          .on("mouseover", event => {
            tooltip.style("display", "block")
              .html(
                `Empresa tech: <b>${group}</b><br>` +
                `Nivel ${d.level}: ${(d.pct * 100).toFixed(1)}%`
              );
          })
          .on("mousemove", event => {
            tooltip.style("left", event.pageX + 10 + "px")
                  .style("top", event.pageY - 20 + "px");
          })
          .on("mouseout", () => tooltip.style("display", "none"));

        yOffset -= barHeight;
      });
    });

    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${height - 40})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", "translate(150,0)")
      .call(d3.axisLeft(y).tickFormat(d => d * 100 + "%"));
  });
}

// Inicial
drawStackedBar(1);

// Evento del select
document.getElementById("interferenciaSelect")
  .addEventListener("change", e => {
    const val = +e.target.value || 1;
    drawStackedBar(val);
  });
