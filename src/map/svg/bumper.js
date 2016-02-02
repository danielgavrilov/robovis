export default function(x, y, width, height, notch) {
  return `
    M ${x + notch}, ${y}
    h ${width - notch}
    v 1
    h ${-(width - notch - 1)}
    l ${-(notch)}, ${notch}
    v ${height - notch}
    h -1
    v ${-(height - notch + 1)}
    l ${notch} ${-notch}
    z
  `.replace(/\s+/g, "");
}
