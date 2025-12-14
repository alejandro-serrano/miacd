function drawSlope() {
  d3.json("data/osmi_2022.json").then((data) => {
    function yesNo(val) {
      if (!val) return null;
      val = val.trim().toLowerCase();
      if (val === "yes") return "Yes";
      if (val === "no") return "No";
      return null;
    }

    const talkCoworker = data.filter(
      (d) => yesNo(d.mh_coworker_discussion) === "Yes"
    ).length;

    const talkEmployer = data.filter(
      (d) => yesNo(d.mh_employer_discussion) === "Yes"
    ).length;

    const total = data.length;

    const slopeData = [
      {
        id: "Coworker",
        label: "Con compañero",
        value: (talkCoworker / total) * 100,
        color: "#7BC6B0",
      },
      {
        id: "Employer",
        label: "Con superior",
        value: (talkEmployer / total) * 100,
        color: "#D99889",
      },
    ];

    const svg = d3.select("#grafico5");
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 70, left: 80 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scalePoint()
      .domain(["Coworker", "Employer"])
      .range([0, width])
      .padding(0.6);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(slopeData, (d) => d.value)])
      .range([height - 60, 20])
      .nice();

    const points = g
      .selectAll(".point")
      .data(slopeData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.id))
      .attr("cy", height)
      .attr("r", 0)
      .attr("fill", (d) => d.color);

    points
      .transition()
      .delay((d, i) => i * 400)
      .duration(800)
      .attr("cy", (d) => y(d.value))
      .attr("r", 10);

    const startX = x("Coworker");
    const startY = y(slopeData[0].value);
    const endX = x("Employer");
    const endY = y(slopeData[1].value);

    const line = g
      .append("line")
      .attr("x1", startX)
      .attr("y1", startY)
      .attr("x2", startX)
      .attr("y2", startY)
      .attr("stroke", "#D99889")
      .attr("stroke-width", 5)
      .attr("stroke-linecap", "round");

    line
      .transition()
      .delay(900)
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr("x2", endX)
      .attr("y2", endY);

    const values = g
      .selectAll(".valueLabel")
      .data(slopeData)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.id))
      .attr("y", (d) => y(d.value) - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .attr("opacity", 0)
      .text((d) => `${d.value.toFixed(1)}%`);

    values.transition().delay(2200).duration(600).attr("opacity", 1);

    g.selectAll(".categoryLabel")
      .data(slopeData)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.id))
      .attr("y", height + 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("fill", "#333")
      .text((d) => d.label);
  });
}

Reveal.on("slidechanged", (event) => {
  if (event.currentSlide.querySelector("#grafico5")) {
    drawSlope();
  }
});
