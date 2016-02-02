import d3 from "d3";
import simplify from "simplify-js";

export default function({ root, x, y }) {

  let line = d3.svg.line()
      .interpolate("linear")
      .x(d => x(d.x))
      .y(d => y(d.y));

  let trail = root.append("path")
      .attr("class", "trail");

  function update(data) {

    let points = data.map(d => ({ x: d.pos[0], y: d.pos[1] }));
    let simplified = points.length > 0 ? simplify(points, 0.1) : [];

    trail.datum(simplified)
      .attr("d", line);
  }

  return update;
}
