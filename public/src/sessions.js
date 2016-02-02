import eventEmitter from "eventEmitter";
import _ from "lodash";
import Session from "./session";

export default class Sessions extends eventEmitter {

  constructor(socket) {
    super();
    this.sessions = [];
    socket.on("sessions", this.load.bind(this));
    socket.on("newSession", this.add.bind(this));
    socket.on("newMessage", this.handleMessage.bind(this));
  }

  all() {
    return this.sessions;
  }

  allMetadata() {
    return this.sessions.map(session => session.metadata());
  }

  get(id) {
    return _.find(this.sessions, session => session.id() === id);
  }

  upsert(sessionData) {
    let session = this.get(sessionData._id);
    if (session) {
      session.update(sessionData);
    } else {
      session = new Session(sessionData);
      this.sessions.push(session);
    }
    return session;
  }

  add(sessionData) {
    this.emit("add", this.upsert(sessionData));
  }

  load(sessions) {
    sessions.forEach(this.upsert.bind(this));
    this.emit("load", this.sessions);
  }

  handleMessage({ session, message }) {
    let s = this.get(session);
    if (s) s.addMessage(message);
  }

}
