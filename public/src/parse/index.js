import _ from "lodash";
import eventEmitter from "eventEmitter";
import parsers from "./parsers";
import { generateId } from "../common";

// specifies the order in which the props should be processed
let orderedProps = [
  "pos",
  "angle", // angle ALWAYS needs to be supplied with `pos`
  "encoder",
  "ir_angle",
  "voltage",
  "bumper",
  "us",
  "ir_front",
  "ir_side"
];

function injectId(obj) {
  obj.id = generateId();
  return obj;
}

export default class Parser extends eventEmitter {

  constructor(messages) {
    super();
    this.state = {
      pos: [0,0],
      angle: 0,
      ir_angle: [45,45],
      voltage: [0,0],
      bumper: [false,false],
      us: 0,
      ir_front: [0,0],
      ir_side: [0,0],
      encoder: [0,0],
      wheelspeed: [0,0]
    };
    this.logs = {
      trail: [],
      ir_angles: [],
      ir_front: [],
      ir_side: [],
      us: [],
      bumpers: [],
      voltages: [],
      obstructions: []
    };
    messages.forEach(this.parseMessage.bind(this));
  }

  getState() {
    return this.state;
  }

  get(collection) {
    return this.logs[collection];
  }

  add(message) {
    let { changed } = this.parseMessage(message);
    changed.forEach((collection) =>
      this.emit(collection, this.get(collection)));
  }

  parseMessage(message) {
    let changed = [];
    orderedProps.filter(prop => prop in message).forEach(prop => {
      let result = parsers[prop](this.state, message);
      for (let collection in result) {
        let items = result[collection];
        if (collection === "obstructions") {
          items = items.map(injectId);
        }
        this.logs[collection] = this.logs[collection].concat(items);
        changed.push(collection);
      }
    });
    return { changed };
  }

}
