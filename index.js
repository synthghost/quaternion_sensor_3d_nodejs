/**************************************************************************
 Serves static content in Public folder to browser
**************************************************************************/
const SERIAL_PORT = '/dev/cu.usbserial-110'
const SERIAL_BAUD = 115200

var express = require('express')
var app = express();
const server_port = 3000

app.use(express.static(__dirname + '/public'));
app.listen(server_port, () => console.log(`App listening on port ${server_port}!`))

/**************************************************************************
 Reads quaternion data from serial port and sends it over the websocket
**************************************************************************/
const { SerialPort } = require('serialport')
const port = new SerialPort({
  path: SERIAL_PORT,
  baudRate: SERIAL_BAUD,
}, console.error)

const { ReadlineParser } = require('@serialport/parser-readline')
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

parser.on('data', function(data) {
  if (ws != null) {
    console.log(data);
    ws.send(data);
  }
})

/**************************************************************************
 Websocket server that communicates with browser
**************************************************************************/
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
var ws = null;

wss.on('connection', function connection(_ws) {
  ws = _ws;
});
