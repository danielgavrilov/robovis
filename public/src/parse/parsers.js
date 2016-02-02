import dimensions from "../dimensions";
import { calcCoords } from "../common";

function nothing() { return {}; }

function ir_front_to_cm(val) {
  if (val < 35) return 200;
  return (6787 / (val - 3.0)) - 4;
}

function ir_side_to_cm(val) {
  if (val < 80) return 40;
  return (2914 / (val + 5.0)) - 1;
}

function fastMoving(state) {
  let s = state.wheelspeed;
  return Math.abs(s[0] - s[1]) > 20
      || ((s[0]+s[1]) / 2) > 300;
}

export default {

  "pos": function(state, { time, pos, angle }) {
    state.pos = pos;
    state.angle = angle;
    return { trail: [{ time, pos, angle }] };
  },

  "angle": nothing, // angle ALWAYS needs to be supplied with `pos`

  "encoder": function(state, { encoder }) {
    for (let i = 0; i < 2; i++) {
      state.wheelspeed[i] = encoder[i] - state.encoder[i];
    }
    state.encoder = encoder;
    return nothing();
  },

  "ir_angle": function(state, { time, ir_angle }) {
    state.ir_angle = ir_angle;
    return { ir_angles: [{ time, ir_angle }] };
  },

  "voltage": function(state, { time, voltage }) {
    state.voltage = voltage;
    return { voltages: [{ time, voltage }] };
  },

  "bumper": function(state, { time, bumper }) {
    state.bumper = bumper;
    let obstructions = [];
    for (let i = 0; i < 2; i++) {
      if (bumper[i]) obstructions.push({
        time,
        type: "bumper",
        coords: calcCoords({
          position: state.pos,
          angle: state.angle,
          offset: [-11 + i*22, 11]
        })
      });
    }
    return { obstructions, bumpers: { time, bumper } };
  },

  "us": function(state, { time, us }) {
    if (fastMoving(state)) return nothing();
    let obstructions = [];
    if (us < dimensions.us.range) obstructions.push({
      time,
      type: "us",
      coords: calcCoords({
        position: state.pos,
        angle: state.angle,
        offset: [0,5],
        distance: us
      })
    });
    return { obstructions, us: { time, us } };
  },

  "ir_front": function(state, { time, ir_front }) {
    if (fastMoving(state)) return nothing();
    let obstructions = [];
    for (let i = 0; i < 2; i++) {
      let distance = ir_front_to_cm(ir_front[i]);
      if (distance < dimensions.ir.front.range) obstructions.push({
        time,
        type: "ir_front",
        coords: calcCoords({
          position: state.pos,
          angle: state.angle,
          offset: [-8 + i*16, 8],
          direction: ((i === 0) ? -1 : 1) * state.ir_angle[i],
          distance: distance
        })
      });
    }
    return { obstructions, ir_front: { time, ir_front: ir_front.map(ir_front_to_cm) } };
  },

  "ir_side": function(state, { time, ir_side }) {
    if (fastMoving(state)) return nothing();
    let obstructions = [];
    for (let i = 0; i < 2; i++) {
      let distance = ir_side_to_cm(ir_side[i]);
      if (distance < dimensions.ir.side.range) obstructions.push({
        time,
        type: "ir_side",
        coords: calcCoords({
          position: state.pos,
          angle: state.angle,
          offset: [-11 + i*22, -6.5],
          direction: -90 + i*180,
          distance: distance
        })
      });
    }
    return { obstructions, ir_side: { time, ir_side: ir_side.map(ir_side_to_cm) } };
  }

};
