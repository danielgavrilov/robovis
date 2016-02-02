var _ = require("lodash");

var parsers = {
  "TIME": function(val) {
    return { time: Number(val) };
  },
  "POS": function(val) {
    var pos = val.split(" ").map(Number);
    return { pos: pos };
  },
  "ANGLE": function(val) {
    return { angle: Number(val) };
  },
  "IR_ANGLE": function(val) {
    var ir_angle = val.split(" ").map(Number);
    return { ir_angle: ir_angle };
  },
  "VOLTAGE": function(val) {
    var voltage = val.split(" ").map(Number);
    return { voltage: voltage };
  },
  "SENSORS": function(val) {
    var array = val.split(" ").map(Number);
    return {
      bumper:   [Boolean(array[0]), Boolean(array[1])],
      us:       array[2],
      ir_front: [array[3], array[4]],
      ir_side:  [array[5], array[6]],
      encoder:  [array[7], array[8]]
    };
  }
};

function parseValue(key, value) {
  var obj = {};
  if (key in parsers) return parsers[key](value);
  else obj[key] = value;
  return obj;
}

exports.message = function(message) {
  var accumulator = {};
  var lines = message.split("\n");
  lines = _.compact(lines);
  lines.forEach(function(line) {
    var separator = line.indexOf(" ");
    var key = line.substring(0, separator);
    var value = line.substring(separator+1);
    _.extend(accumulator, parseValue(key, value));
  });
  return accumulator;
};
