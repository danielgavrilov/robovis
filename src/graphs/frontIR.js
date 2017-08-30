import dualGraph from "./dual-graph";

export default function({ container, x, width, height, offsetTop }) {
  return dualGraph({
    container,
    x,
    width,
    height,
    offsetTop,
    threshold: 60,
    title: "Front IR",
    className: "ir_front",
    accessorTop:    d => ({ x: d.time, y: d.ir_front[0] }),
    accessorBottom: d => ({ x: d.time, y: -d.ir_front[1] })
  });
}
