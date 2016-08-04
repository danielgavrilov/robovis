// var _ = require("lodash");
var path = require("path");
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var TCP = require("./tcp");
var Session = require("./session");
var parse = require("./parse");
var storage = require("./storage");

var session; // temporary storage for pending session

// TCP connection

var tcp = new TCP();

tcp.on("connected", function() {
  console.log("connected to " + tcp.getHost());
  session = new Session({ host: tcp.getHost() });
  io.emit("newSession", session.toJSON());
});

tcp.on("message", function(message) {
  message = parse.message(message);
  session.addMessage(message);
  io.emit("newMessage", {
    session: session.id(),
    message: message
  });
});

tcp.on("error", function(error) {
  io.emit("connectionError", error);
});

tcp.on("end", function() {
  session.end();
  storage.save(session.toJSON());
  session = undefined;
});


// Websocket (socket.io)

io.on("connection", function(socket) {

  storage.getAll(function(sessions) {
    if (session) sessions.push(session.toJSON());
    socket.emit("sessions", sessions);
  });

  socket.on("setAddress", function(opts) {
    console.log("client set host to " + opts.host);
    tcp.setAddress(opts);
  });

});


// express.js

app.get("/sessions.json", function(req, res) {
  storage.getAll(function(sessions) {
    if (session) sessions.push(session.toJSON());
    res.json(sessions);
  });
});

app.use(express.static(path.resolve(__dirname, "../public")));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  next(err);
});


tcp.connect();

module.exports = server;
