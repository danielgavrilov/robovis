import eventEmitter from "eventEmitter";
import _ from "lodash";

export default class Session extends eventEmitter {

  constructor(data) {
    super();
    this.data = data;
  }

  update(data) {
    this.data = data;
    this.emit("update", this);
  }

  addMessage(message) {
    this.data.messages.push(message);
    this.emit("message", message);
  }

  id() {
    return this.data._id;
  }

  metadata() {
    let { _id, host, begin, end } = this.data;
    return { _id, host, begin, end };
  }

  messages() {
    return this.data.messages;
  }

}
