import dualGraph from "./dual-graph";

export default function({ container, x, width, height, offsetTop }) {
  return dualGraph({
    container,
    x,
    width,
    height,
    offsetTop,
    threshold: 40,
    title: "Side IR",
    className: "ir_side",
    accessorTop:    d => ({ x: d.time, y: d.ir_side[0] }),
    accessorBottom: d => ({ x: d.time, y: -d.ir_side[1] })
  });
}
