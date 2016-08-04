import $ from "jquery";
import _ from "lodash";
import io from "socket.io-client";
import initMap from "./map/index";
import initGraphs from "./graphs/index";
import initMenu from "./menu";
import Sessions from "./sessions";
import Parser from "./parse/index";

let socket = io();
let map = initMap($("#map")[0]);
let graphs = initGraphs($("#graphs")[0]);
let menu = initMenu($("#sessions")[0]);
let sessions = new Sessions(socket);

window.graphs = graphs;
window.map = map;

function renderMenu() {
  menu.render(sessions.allMetadata());
}

function renderMap(parser) {
  let state = parser.getState();
  map.robot.position(state.pos);
  map.robot.angle(state.angle);
  map.robot.irAngles(state.ir_angle);
  map.robot.bumpers(state.bumper);
  map.robot.irFront(state.ir_front);
  map.robot.irSide(state.ir_side);
  map.trail(parser.get("trail"));
  map.obstructions(parser.get("obstructions"));
}

function renderMapAt(parser, time) {
  let filterTime = (d) => d.time < time;
  let trail         = parser.get("trail").filter(filterTime);
  let obstructions  = parser.get("obstructions").filter(filterTime);
  let irAngles      = parser.get("ir_angles").filter(filterTime);
  let irFront       = parser.get("ir_front").filter(filterTime);
  let irSide        = parser.get("ir_side").filter(filterTime);
  let ultrasound    = parser.get("us").filter(filterTime);
  let bumpers       = parser.get("bumpers").filter(filterTime);
  map.trail(trail);
  map.obstructions(obstructions);
  if (trail.length) {
    let last = _.last(trail);
    map.robot.position(last.pos);
    map.robot.angle(last.angle);
  }
  if (irAngles.length) {
    map.robot.irAngles(_.last(irAngles).ir_angle);
  }
  if (irFront.length) {
    map.robot.irFront(_.last(irFront).ir_front);
  }
  if (irSide.length) {
    map.robot.irSide(_.last(irSide).ir_side);
  }
  if (ultrasound.length) {
    map.robot.ultrasound(_.last(ultrasound).us);
  }
  if (bumpers.length) {
    map.robot.bumpers(_.last(bumpers).bumper)
  }
}

function renderGraphs(parser) {
  // graphs.voltages(parser.get("voltages"));
  console.log(parser.get("ir_side"))
  graphs.frontIR.update(parser.get("ir_front"));
  graphs.sideIR.update(parser.get("ir_side"));
}

let throttledRenderMap = _.throttle(renderMap, 1000/25);
let throttledRenderGraphs = _.throttle(renderGraphs, 1000/5);

sessions.on("load", renderMenu);
sessions.on("add", renderMenu);

let animFrame;

menu.on("select", function(id) {
  let session = sessions.get(id);
  let messages = session.messages();
  let parser = new Parser(messages);
  map.obstructions([]);
  renderMap(parser);
  renderGraphs(parser);
  session.on("message", function(message) {
    parser.add(message);
    throttledRenderMap(parser);
    throttledRenderGraphs(parser);
  });
  graphs.onTimeChange(function(time) {
    renderMapAt(parser, time);
  });

  // if (animFrame) window.cancelAnimationFrame(animFrame);
  // play();
  // let start = Date.now();
  // function play() {
  //   renderMapAt(parser, Date.now() - start);
  //   animFrame = window.requestAnimationFrame(play);
  // }
});


$("#address").on("submit", function() {
  let host = $("#host").val();
  socket.emit("setAddress", { host });
  return false;
});

// load static JSON data from race.
$.getJSON("extracts/race-sessions.json", function(data) {
  sessions.load(data);
});
