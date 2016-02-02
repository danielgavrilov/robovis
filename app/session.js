function Session(data) {
  this.data = {
    _id: data._id || Date.now().toString(),
    host: data.host,
    begin: data.begin || new Date(),
    end: data.end,
    messages: data.messages || []
  };
  this.data.begin = new Date();
}

Session.prototype.id = function() {
  return this.data._id;
};

Session.prototype.toJSON = function() {
  return this.data;
};

Session.prototype.addMessage = function(message) {
  this.data.messages.push(message);
  return this;
};

Session.prototype.end = function() {
  this.data.end = new Date();
  return this;
};

module.exports = Session;
