import _ from "lodash";

let {sin, cos} = Math;

export function degToRad(deg) {
  return deg * Math.PI / 180;
}

export function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

export function groupEvery(n, array) {
  if (array.length <= n) return [array];
  let accumulator = [];
  for (let i = 0; i <= array.length - n; i++) {
    accumulator.push(array.slice(i, i+n));
  }
  return accumulator;
}

export function removeDuplicates(isDuplicate, array) {
  let accumulator = [];
  array.forEach(x => {
    if (!_.some(_.takeRight(accumulator, 20), y => isDuplicate(x, y))) {
      accumulator.push(x);
    }
  });
  return accumulator;
}

export var generateId = (function() {
  let i = 0;
  return () => i++;
})();

export function calcCoords({
  position=[0,0],
  angle=0,
  offset=[0,0],
  direction=0,
  distance=0
}) {

  let [x,y] = position;
  let [dx,dy] = offset;

  angle = degToRad(angle);
  direction = degToRad(direction);

  x +=  dx * cos(angle) + dy * sin(angle);
  y += -dx * sin(angle) + dy * cos(angle);

  x += distance * sin(angle + direction);
  y += distance * cos(angle + direction);

  return [x,y];
}
