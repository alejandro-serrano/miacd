// Tooltip básico para gráficos D3
const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("padding", "6px 12px")
  .style("background", "white")
  .style("border", "1px solid #ccc")
  .style("border-radius", "4px")
  .style("display", "none")
  .style("pointer-events", "none")
  .style("font-size", "13px");
