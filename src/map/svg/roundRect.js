export default function roundRect(x, y, width, height, r) {
  let innerWidth = width - 2*r;
  let innerHeight = height - 2*r;
  return `
    M ${x + r}, ${y}
    h ${innerWidth}
    a ${r} ${r} 0 0 1 ${r} ${r}
    v ${innerHeight}
    a ${r} ${r} 0 0 1 ${-r} ${r}
    h ${-innerWidth}
    a ${r} ${r} 0 0 1 ${-r} ${-r}
    v ${-innerHeight}
    a ${r} ${r} 0 0 1 ${r} ${-r}
    z
  `;
}
