import d3 from "d3";
import simplify from "simplify-js";

function randomId() {
  return Math.floor((Math.random() * 0x1000000)).toString(16);
}

export default function dualGraph({
    container,
    x,
    width,
    height,
    offsetTop,
    threshold,
    title,
    className,
    accessorTop,
    accessorBottom
  }) {

  let originalData = [];

  let svg = container.append("g")
      .attr("transform", `translate(0,${offsetTop})`)
      .attr("class", className);

  let clipId = "clip-" + randomId();

  svg.append("defs")
    .append("clipPath")
      .attr("id", clipId)
    .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);

  svg.append("rect")
    .attr("class", "background")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

  let y = d3.scale.linear()
      .domain([-threshold, threshold])
      .range([height, 0]);

  let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickSize(-width)
      .tickPadding(7)
      .tickFormat(Math.abs);

  let areaLeftIR = d3.svg.area()
      .interpolate("linear")
      .x(d => d.x)
      .y0(height / 2)
      .y1(d => d.y);

  let areaRightIR = d3.svg.area()
      .interpolate("linear")
      .x(d => d.x)
      .y0(height / 2)
      .y1(d => d.y);

  let yAxisElem = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  yAxisElem.selectAll("line")
      .classed("null-line", (d) => d === 0);

  let topGraph = svg.append("path")
      .style("clip-path", `url(#${clipId})`)
      .attr("class", "area");

  let bottomGraph = svg.append("path")
      .style("clip-path", `url(#${clipId})`)
      .attr("class", "area");

  svg.append("text")
      .attr("class", "graph-title")
      .attr("transform", `translate(-60,${height/2}) rotate(90)`)
      .text(title)

  svg.append("text")
      .attr("class", "side-label")
      .attr("transform", `translate(-35,-5) rotate(90)`)
      .attr("x", 0)
      .attr("y", 0)
      .style("text-anchor", "start")
      .text("Left")

  svg.append("text")
      .attr("class", "side-label")
      .attr("transform", `translate(-35,${height+5}) rotate(90)`)
      .attr("x", 0)
      .attr("y", 0)
      .style("text-anchor", "end")
      .text("Right")

  function updateData(data) {
    originalData = data;
    redraw();
  }

  function redraw() {

    let leftIR  = originalData
      .map(accessorTop)
      .map(d => ({ x: x(d.x), y: y(d.y) }));

    let rightIR = originalData
      .map(accessorBottom)
      .map(d => ({ x: x(d.x), y: y(d.y) }));

    let simplifiedLeft  = leftIR.length  > 0 ? simplify(leftIR, 0.5)  : [];
    let simplifiedRight = rightIR.length > 0 ? simplify(rightIR, 0.5) : [];

    topGraph.datum(simplifiedLeft);
    bottomGraph.datum(simplifiedRight);

    topGraph.attr("d", areaLeftIR);
    bottomGraph.attr("d", areaRightIR);
  }

  return {
    update: updateData,
    redraw
  };
}
