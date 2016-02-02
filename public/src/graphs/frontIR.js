import d3 from "d3";
import simplify from "simplify-js";

export default function({ container, x, width, height, offsetTop }) {

  let sensorThreshold = 60;

  let originalData = [];

  let svg = container.append("g")
      .attr("transform", `translate(0,${offsetTop})`);

  container.append("defs")
    .append("clipPath")
      .attr("id", "clip-ir_front")
    .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);

  let y = d3.scale.linear()
      .domain([-sensorThreshold, sensorThreshold])
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
      .y0(0)
      .y1(d => d.y);

  let areaRightIR = d3.svg.area()
      .interpolate("linear")
      .x(d => d.x)
      .y0(height)
      .y1(d => d.y);

  let yAxisElem = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  yAxisElem.selectAll("line")
      .classed("null-line", (d) => d === 0);

  let frontLeftIR = svg.append("path")
      .style("clip-path", "url(#clip-ir_front)")
      .attr("class", "ir_front");

  let frontRightIR = svg.append("path")
      .style("clip-path", "url(#clip-ir_front)")
      .attr("class", "ir_front");

  svg.append("text")
      .attr("class", "graph-title")
      .attr("transform", `translate(-60,${height/2}) rotate(90)`)
      .text("Front IR")

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

    let leftIR  = originalData.map(d => ({ x: x(d.time), y: y(d.ir_front[0])}));
    let rightIR = originalData.map(d => ({ x: x(d.time), y: y(-d.ir_front[1])}));

    let simplifiedLeft  = leftIR.length  > 0 ? simplify(leftIR, 0.5)  : [];
    let simplifiedRight = rightIR.length > 0 ? simplify(rightIR, 0.5) : [];

    frontLeftIR.datum(simplifiedLeft);
    frontRightIR.datum(simplifiedRight);

    frontLeftIR.attr("d", areaLeftIR);
    frontRightIR.attr("d", areaRightIR);
  }

  return {
    update: updateData,
    redraw
  };
}
