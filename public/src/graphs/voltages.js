import d3 from "d3";

export default function({ root, x, width }) {

  let height = 70;

  let y = d3.scale.linear()
      .domain([-127, 127])
      .range([height, 0]);

  let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickSize(-width)
      .tickPadding(7);

  let line = d3.svg.line()
      .interpolate("linear")
      .x(d => x(d.time))
      .y(d => y(d.voltage[0]));

  let yAxisElem = root.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  yAxisElem.selectAll("line")
      .classed("null-line", (d) => d === 0);

  let voltages = root.append("path")
      .attr("class", "voltages");

  function update(data) {

    voltages.datum(data)
      .attr("d", line(data));

  }

  return update;
}
