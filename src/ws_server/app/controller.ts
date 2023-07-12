import { WebSocket } from 'ws';
import WSConnection from './connection';
import { msgParser, prepResponse } from '../utils';
import { msgType } from '../types/message';
import DBEngine from '../db/dbengine';
import User from '../types/user';

export default class AppController {
  private connections: WSConnection[];
  private dbEngine: DBEngine;

  constructor() {
    this.connections = [];
    this.dbEngine = new DBEngine();
  }

  public async exec(msg: string, socket: WebSocket) {
    console.log('<--', msg);
    const message = msgParser(msg);
    if (message.type === msgType.REGISTRATION) {
      const user = await this.dbEngine.addUser(message.data as User);
      const { password, ...resData } = user;
      const response = prepResponse(msgType.REGISTRATION, resData);
      socket.send(response);
      console.log('-->', response);
    }
  }

  public addListeners() {
    this.connections.forEach((connection) => {
      connection.socket.on('message', (msg) => this.exec(msg.toString(), connection.socket));
      connection.socket.on('error', console.error);
    });
  }

  public addConnection(connection: WSConnection) {
    this.connections.push(connection);
  }
}
