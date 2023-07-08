import HTTPServer from './http_server/';
import WSServer from './ws_server';
import dotenv from 'dotenv';

dotenv.config();

const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WS_PORT = 3000;

const httpServer = new HTTPServer(HTTP_PORT);
httpServer.start();
console.log(`Start static http server on the ${HTTP_PORT} port!`);

const wss = new WSServer(WS_PORT);
wss.start();
console.log(`Websocket server starting on the ${WS_PORT} port!`);
