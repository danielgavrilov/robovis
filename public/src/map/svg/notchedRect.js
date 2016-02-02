export default function notchedRect(x, y, width, height, notch) {
  let innerWidth = width - 2*notch;
  let innerHeight = height - 2*notch;
  return `
    M ${x + notch}, ${y}
    h ${innerWidth}
    l ${notch}, ${notch}
    v ${innerHeight}
    l ${-notch}, ${notch}
    h ${-innerWidth}
    l ${-notch}, ${-notch}
    v ${-innerHeight}
    l ${notch}, ${-notch}
    z
  `.replace(/\s+/g, "");
}
