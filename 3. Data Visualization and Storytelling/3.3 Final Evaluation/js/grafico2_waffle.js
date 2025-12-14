function drawWaffle() {

  d3.json("data/osmi_2022.json").then(data => {

    const container = d3.select("#grafico2");
    container.selectAll("*").remove();

    const total = data.length;
    const yesCount = data.filter(d => d.mental_health.trim().toLowerCase() === "yes").length;
    const noCount  = total - yesCount;
    const yesPct = +(yesCount / total * 100).toFixed(1);
    const noPct  = +(100 - yesPct).toFixed(1);
    const COLOR_POSITIVE = "#E89B93";
    const COLOR_NEGATIVE = "#78C2AD";
    const size = 26;
    const gap  = 8;
    const cols = 10;
    const wrapper = container
      .append("div")
      .style("display", "grid")
      .style("grid-template-columns", "auto 1fr")
      .style("align-items", "center")
      .style("gap", "48px");

    const waffleSize = cols * (size + gap);

    const waffle = wrapper.append("svg")
      .attr("width", waffleSize)
      .attr("height", waffleSize);

    const cells = d3.range(100).map(i => ({
      index: i,
      type: i < Math.round(yesPct) ? "yes" : "no"
    }));

    waffle.selectAll("rect")
      .data(cells)
      .enter()
      .append("rect")
        .attr("x", d => (d.index % cols) * (size + gap))
        .attr("y", d => Math.floor(d.index / cols) * (size + gap))
        .attr("width", size)
        .attr("height", size)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", d =>
          d.type === "yes" ? COLOR_NEGATIVE : COLOR_POSITIVE
        )
        .attr("opacity", 0)
      .transition()
        .delay((d, i) => i * 15)
        .duration(300)
        .attr("opacity", 1);

    const stats = wrapper.append("div")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("gap", "28px");

    const yesBox = stats.append("div");

    const yesNumber = yesBox.append("div")
      .style("font-size", "2.1em")
      .style("font-weight", "bold")
      .style("color", COLOR_NEGATIVE)
      .text("0 %");

    yesBox.append("div")
      .style("font-size", "0.45em")
      .style("line-height", "1.3")
      .text("No ha reportado problemas de salud mental");

    const noBox = stats.append("div");

    const noNumber = noBox.append("div")
      .style("font-size", "2.1em")
      .style("font-weight", "bold")
      .style("color", COLOR_POSITIVE)
      .text("0 %");

    noBox.append("div")
      .style("font-size", "0.45em")
      .style("line-height", "1.3")
      .text("Ha experimentado problemas de salud mental");

    animateCounter(yesNumber, yesPct);
    animateCounter(noNumber, noPct);

  });
}

function animateCounter(selection, target) {
  selection.transition()
    .duration(1200)
    .tween("text", () => {
      const i = d3.interpolateNumber(0, target);
      return t => {
        selection.text(i(t).toFixed(1) + " %");
      };
    });
}
