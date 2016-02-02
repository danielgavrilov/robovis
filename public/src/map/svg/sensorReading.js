import {degToRad} from "../../common";

let {sin, cos} = Math;

export default function sensorReading(sourceWidth, reading, propagationAngle) {
  let angle = degToRad(propagationAngle / 2);
  return `
    M ${ sourceWidth/2 + reading * sin(angle) }, ${ -reading * cos(angle) }
    a ${reading} ${reading} 0 0 0 ${ -(sourceWidth + 2 * reading * sin(angle)) } 0
  `;
}
