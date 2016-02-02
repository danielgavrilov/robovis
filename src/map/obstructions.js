import d3 from "d3";
import { removeDuplicates } from "../common";

export default function({ root, x, y }) {

  let originalData = [];

  let obstructions = root.append("g")
      .attr("class", "obstructions");

  let opacityScale = d3.scale.linear()
      .domain([0, 20e3])
      .range([1, 0.15])
      .clamp(true);

  function update(data) {

    originalData = data;

    function isDuplicate(a, b) {
      return Math.round(a.coords[0] / 2) == Math.round(b.coords[0] / 2)
          && Math.round(a.coords[1] / 2) == Math.round(b.coords[1] / 2);
    }

    let simplified = removeDuplicates(isDuplicate, data);

    let updated = obstructions.selectAll("rect").data(simplified, d => d.id);
    let now = data.length ? data[data.length-1].time : 0;

    updated.exit().remove();

    let size = 1;

    updated.enter().append("rect")
      .attr("class", d => `obstruction obs--${d.type}`)
      .attr("x", d => x(d.coords[0]) - size/2)
      .attr("y", d => y(d.coords[1]) - size/2)
      .attr("width", size)
      .attr("height", size);

    updated.style("opacity", d => opacityScale(now - d.time));
  }

  return update;
}
