import {degToRad} from "../../common";

let {sin, cos} = Math;

export default function sensorRange(sourceWidth, range, propagationAngle) {
  let angle = degToRad(propagationAngle / 2);
  return `
    M ${-sourceWidth/2}, 0
    h ${sourceWidth}
    l ${ range * sin(angle) }, ${ -range * cos(angle) }
    a ${range} ${range} 0 0 0 ${ -(sourceWidth + 2 * range * sin(angle)) } 0
    l ${ range * sin(angle) }, ${ range * cos(angle) }
    z
  `;
}
