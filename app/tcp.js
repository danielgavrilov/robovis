var net = require("net");
var util = require("util");
var events = require("events");

function TCPConnection() {
  this.socket = new net.Socket();
  this.host = "127.0.0.1";
  this.port = 55444;
  this.buffer = "";
  this.message = "";
  this.on("line", this._online.bind(this));
  this.socket
    .on("connect", this._onconnect.bind(this))
    .on("data", this._ondata.bind(this))
    .on("error", this._onerror.bind(this))
    .on("timeout", this._ontimeout.bind(this))
    .on("end", this._onend.bind(this))
    .on("close", this._onclose.bind(this))
    .setTimeout(3000);
}

util.inherits(TCPConnection, events.EventEmitter);

TCPConnection.prototype.setAddress = function(opts) {
  this.host = opts.host || this.host;
  this.port = opts.port || this.port;
  return this;
};

TCPConnection.prototype.connect = function() {
  this.disconnect();
  this.socket.connect(this.port, this.host);
  return this;
};

TCPConnection.prototype.disconnect = function() {
  if (!this.socket.destroyed) {
    this.socket.end();
  }
};

TCPConnection.prototype.send = function(message) {
  this.socket.write(message);
};

TCPConnection.prototype.getHost = function() {
  return this.socket.remoteAddress;
};

TCPConnection.prototype.getPort = function() {
  return this.socket.remotePort;
};

TCPConnection.prototype._onconnect = function() {
  this.emit("connected", this.getHost());
};

TCPConnection.prototype._ondata = function(data) {
  this.emit("data", data);
  this.buffer += data;
  var lines = this.buffer.split("\n");
  lines.slice(0, lines.length-1)
    .forEach(function(line) {
      this.emit("line", line);
    }.bind(this));
  this.buffer = lines[lines.length-1];
};

TCPConnection.prototype._online = function(line) {
  if (line === "END") {
    this.emit("message", this.message);
    this.message = "";
  } else if (this.message !== "" || line.slice(0,4) === "TIME") {
    this.message += line + "\n";
  }
};

TCPConnection.prototype._onerror = function(error) {
  this.emit("error", error);
};

TCPConnection.prototype._ontimeout = function() {
};

TCPConnection.prototype._onend = function() {
  this.emit("end");
};

TCPConnection.prototype._onclose = function() {
  setTimeout(this.connect.bind(this), 2000);
};


module.exports = TCPConnection;
