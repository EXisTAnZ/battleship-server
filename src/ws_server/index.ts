import { WebSocketServer } from 'ws';
import AppController from './app/controller';
import { randomUUID } from 'crypto';
import WSConnection from './app/connection';

export default class WSServer {
  private server: WebSocketServer;
  private controller: AppController;

  constructor(port: string | number) {
    if (typeof port === 'string') port = parseInt(port);
    this.server = new WebSocketServer({ port });
    this.controller = new AppController();
  }

  start() {
    this.server.on('connection', (ws) => {
      const connection_id = randomUUID();
      const connection = new WSConnection(ws, connection_id);
      this.controller.addConnection(connection);
      console.log('WebSocket client connected!', connection_id);
      this.controller.addListeners();
    });
    this.server.on('close', () => console.log(`Disconnected!`));
  }
}
