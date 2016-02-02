var server = require("./app/server");
var port = 8000;

server.listen(port, function() {
  console.log("listening on port " + port);
});
