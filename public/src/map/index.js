import d3 from "d3";

import robot from "./robot";
import trail from "./trail";
import obstructions from "./obstructions";

export default function(element) {

  let selection = d3.select(element);

  let margin = { bottom: 20, left: 40 },
      width = 960,
      height = 500;

  let x = d3.scale.linear()
      .domain([-width/2, width/2])
      .range([0, width]);

  let y = d3.scale.linear()
      .domain([-height/2, height/2])
      .range([height, 0]);

  let xAxisScale = x.copy(),
      yAxisScale = y.copy();

  let xAxis = d3.svg.axis()
      .scale(xAxisScale)
      .orient("bottom")
      .tickSize(-height)
      .tickPadding(8)
      .tickFormat(formatLength);

  let yAxis = d3.svg.axis()
      .scale(yAxisScale)
      .orient("left")
      .tickSize(-width)
      .tickPadding(8);

  let zoom = d3.behavior.zoom()
      .x(xAxisScale)
      .y(yAxisScale)
      .size([width, height])
      .scale(1)
      .scaleExtent([1, 6])
      .on("zoom", zoomed);

  let svg = selection.select("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

  let root = svg.append("g");

  function zoomed() {
    root.attr("transform", `translate(${d3.event.translate}) scale(${d3.event.scale})`);
    root.attr("stroke-width", 1 / d3.event.scale + "px");
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
  }

  function formatLength(d) {
    let ticks = xAxisScale.ticks();
    return d === ticks[ticks.length-1]
        ? d + " cm"
        : d;
  }

  return {
    trail: trail({ root, x, y }),
    obstructions: obstructions({ root, x, y }),
    robot: robot({ root, x, y })
  };
}
