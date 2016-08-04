import d3 from "d3";
import notchedRect from "./notchedRect";
import roundRect from "./roundRect";
import sensorRange from "./sensorRange";
import sensorReading from "./sensorReading";
import bumper from "./bumper";
import {degToRad} from "../../common";
import dimensions from "../../dimensions";

// sensor settings

let irWidth = dimensions.ir.width;

let frontIRRange = dimensions.ir.front.range;
let frontIRAngle = dimensions.ir.front.angle;

let sideIRRange = dimensions.ir.side.range;
let sideIRAngle = dimensions.ir.side.angle;

let usWidth = dimensions.us.width;
let usRange = dimensions.us.range;
let usAngle = dimensions.us.angle;

// robot settings

let width = dimensions.base.width;
let height = dimensions.base.height;

let halfWidth = width / 2;
let halfHeight = height / 2;

let topBaseNotch = dimensions.base.top.notch;
let bottomBaseNotch = dimensions.base.bottom.notch;

let topBaseWidth = dimensions.base.top.width;
let baseDiff = (width - topBaseWidth) / 2;

let wheelRadius = dimensions.wheel.radius;
let wheelWidth = dimensions.wheel.width;

let rasPiWidth = dimensions.raspi.width;
let rasPiHeight = dimensions.raspi.height;

let bumperOffset = dimensions.bumper.offset;

export default function appendRobot(selection) {
  selection.each(function() {

    let root = d3.select(this)
        .classed("robot", true);

    // SENSORS

    let sensors = root.append("g")
        .classed("sensors", true);

    // left bumper
    let leftBumper = sensors.append("path")
        .attr("class", "bumper left-bumper")
        .attr("d", bumper(-width/2-bumperOffset, -width/2-bumperOffset, width/2, height/2-wheelRadius, bottomBaseNotch));

    // right bumper
    let rightBumper = sensors.append("path")
        .attr("class", "bumper right-bumper")
        .attr("transform", "scale(-1,1)")
        .attr("d", bumper(-width/2-bumperOffset, -width/2-bumperOffset, width/2, height/2-wheelRadius, bottomBaseNotch));

    // left IR sensor
    let leftFrontIR = sensors.append("g")
        .attr("transform", "translate(-9,-9)")
      .append("g")
        .attr("class", "left-ir-sensor")

    leftFrontIR.append("path")
        .attr("class", "sensor-range")
        .attr("d", sensorRange(irWidth, frontIRRange, frontIRAngle));

    leftFrontIR.append("path")
        .attr("class", "left-ir-reading");

    // right IR sensor
    let rightFrontIR = sensors.append("g")
        .attr("transform", "translate(9,-9)")
      .append("g")
        .attr("class", "right-ir-sensor")

    rightFrontIR.append("path")
        .attr("class", "sensor-range")
        .attr("d", sensorRange(irWidth, frontIRRange, frontIRAngle));

    rightFrontIR.append("path")
        .attr("class", "right-ir-reading");

    // left side IR sensor
    let leftSideIR = sensors.append("g")
        .attr("transform", "translate(-10,6) rotate(-90)");

    leftSideIR.append("path")
        .attr("class", "left-side-ir-sensor sensor-range")
        .attr("d", sensorRange(irWidth, sideIRRange, sideIRAngle));

    leftSideIR.append("path")
        .attr("class", "left-side-ir-reading");

    // right side IR sensor
    let rightSideIR = sensors.append("g")
        .attr("transform", "translate(10,6) rotate(90)");

    rightSideIR.append("path")
        .attr("class", "right-side-ir-sensor sensor-range")
        .attr("d", sensorRange(irWidth, sideIRRange, sideIRAngle));

    rightSideIR.append("path")
        .attr("class", "right-side-ir-reading");

    // ulstrasound sensor
    let ultrasound = sensors.append("g")
        .attr("transform", "translate(0,-4)");

    ultrasound.append("path")
        .attr("class", "us-sensor sensor-range")
        .attr("d", sensorRange(usWidth, usRange, usAngle));

    ultrasound.append("path")
        .attr("class", "us-reading");


    // ROBOT

    let robot = root.append("g")
        .attr("transform", `translate(${-width/2}, ${-height/2})`);

    // the bottom base
    robot.append("path")
        .attr("class", "base bottom")
        .attr("d", notchedRect(0, 0, width, height, bottomBaseNotch));

    // left wheel
    robot.append("rect")
        .attr("class", "wheel")
        .attr("x", 0)
        .attr("y", halfHeight - wheelRadius)
        .attr("width", wheelWidth)
        .attr("height", 2 * wheelRadius);

    // right wheel
    robot.append("rect")
        .attr("class", "wheel")
        .attr("x", width - wheelWidth)
        .attr("y", halfHeight - wheelRadius)
        .attr("width", wheelWidth)
        .attr("height", 2 * wheelRadius);

    // the top base
    robot.append("path")
        .attr("class", "base top")
        .attr("d", notchedRect(baseDiff, 0, topBaseWidth, height, topBaseNotch));

    // the red button
    robot.append("circle")
        .attr("class", "stop-button")
        .attr("cx", halfWidth)
        .attr("cy", height - 4)
        .attr("r", 1.25);

    // the raspberry pi
    robot.append("path")
        .attr("class", "raspberry-pi")
        .attr("d", roundRect(halfWidth - rasPiWidth/2, 1, rasPiWidth, rasPiHeight, 0.35));

  });
}
