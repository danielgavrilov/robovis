import appendRobot from "./svg/appendRobot";
import dimensions from "../dimensions";
import sensorReading from "./svg/sensorReading";

export default function({ root, x, y }) {

  let commands = {};

  let robot = root.append("g").call(appendRobot);
  let state = { x:0, y:0, angle:0 };

  let robotLeftIR = robot.select(".left-ir-sensor");
  let robotRightIR = robot.select(".right-ir-sensor");

  let robotLeftBumper = robot.select(".left-bumper");
  let robotRightBumper = robot.select(".right-bumper");

  let leftIRReading = robot.select(".left-ir-reading");
  let rightIRReading = robot.select(".right-ir-reading");
  let leftSideIRReading = robot.select(".left-side-ir-reading");
  let rightSideIRReading = robot.select(".right-side-ir-reading");
  let usReading = robot.select(".us-reading");

  function updatePosition() {
    robot.attr("transform", `translate(${x(state.x)}, ${y(state.y)}) rotate(${state.angle})`);
  }

  commands.position = function([newX, newY]) {
    state.x = newX;
    state.y = newY;
    updatePosition();
  };

  commands.angle = function(angle) {
    state.angle = angle;
    updatePosition();
  };

  commands.irAngles = function([left, right]) {
    robotLeftIR.attr("transform", `rotate(${-left})`);
    robotRightIR.attr("transform", `rotate(${right})`);
  };

  commands.bumpers = function([left, right]) {
    robotLeftBumper.classed("active", left);
    robotRightBumper.classed("active", right);
  };

  commands.irFront = function([left, right]) {
    let leftReading = left < dimensions.ir.front.range ? sensorReading(dimensions.ir.width, left, dimensions.ir.front.angle) : null;
    let rightReading = right < dimensions.ir.front.range ? sensorReading(dimensions.ir.width, right, dimensions.ir.front.angle) : null;
    leftIRReading.attr("d", leftReading);
    rightIRReading.attr("d", rightReading);
  };

  commands.irSide = function([left, right]) {
    let leftReading = left < dimensions.ir.side.range ? sensorReading(dimensions.ir.width, left, dimensions.ir.side.angle) : null;
    let rightReading = right < dimensions.ir.side.range ? sensorReading(dimensions.ir.width, right, dimensions.ir.side.angle) : null;
    leftSideIRReading.attr("d", leftReading);
    rightSideIRReading.attr("d", rightReading);
  };

  commands.ultrasound = function(reading) {
    let d = reading < dimensions.us.range ? sensorReading(dimensions.us.width, reading, dimensions.us.angle) : null;
    usReading.attr("d", d);
  };

  commands.position([0,0]);
  commands.angle(0);
  commands.irAngles([45,45]);

  return commands;

}
