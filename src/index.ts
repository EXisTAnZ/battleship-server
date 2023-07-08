import { httpServer } from './http_server/';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });
console.log(`Websocket server starting on ${WS_PORT} port!`);

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send(JSON.stringify({
    type: "create_room",
    data: "",
    id: 0,
  }));
});
