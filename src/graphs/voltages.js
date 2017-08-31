import dualGraph from "./dual-graph";

export default function({ container, x, width, height, offsetTop }) {
  return dualGraph({
    container,
    x,
    width,
    height,
    offsetTop,
    threshold: 127,
    title: "Voltages",
    className: "voltages",
    accessorTop:    d => ({ x: d.time, y: d.voltage[0] }),
    accessorBottom: d => ({ x: d.time, y: -d.voltage[1] })
  });
}
