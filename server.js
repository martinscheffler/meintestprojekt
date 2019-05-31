const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const moment = require('moment');
const path = require('path');
const iotHubClient = require('./IoThub/iot-hub.js');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res/*, next*/) {
  res.redirect('/');
});

const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

// Broadcast to all.
wssbroadcast = function(data) {
  io.emit("data", data);
};
var cs = process.env['Azure.IoT.IoTHub.ConnectionString'];
var cg = process.env['Azure.IoT.IoTHub.ConsumerGroup'];
console.log("Connecting to azure iothub. Connection string: " + cs + " Consumer group: " + cg);
var iotHubReader = new iotHubClient(cs, cg);
iotHubReader.startReadMessage(function (obj, date) {
  try {
    console.log(date);
    date = date || Date.now()
    wssbroadcast(JSON.stringify(Object.assign(obj, { time: moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') })));
  } catch (err) {
    console.log(obj);
    console.error(err);
  }
});

var port = normalizePort(process.env.PORT || '3000');
server.listen(port, function listening() {
  console.log('Listening on %d', server.address().port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
