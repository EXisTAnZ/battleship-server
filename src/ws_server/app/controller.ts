import { WebSocketServer } from 'ws';
import WSConnection from './connection';
import { msgParser } from '../utils';

export default class AppController {
  private wss: WebSocketServer;
  private connections: WSConnection[] = [];

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    console.log('created controller');
  }

  public exec(msg: string) {
    const message = msgParser(msg);
    console.log('need implement', message);
  }

  public addListeners() {
    this.connections.forEach((connection) => {
      connection.socket.on('message', (msg) => this.exec(msg.toString()));
      connection.socket.on('error', console.error);
    });
  }

  public addConnection(connection: WSConnection) {
    this.connections.push(connection);
  }
}
