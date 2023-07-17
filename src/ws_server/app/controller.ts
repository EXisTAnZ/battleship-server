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

  public async exec(msg: string, connection: WSConnection) {
    const curSocket = connection.socket;
    console.log('\x1b[34m<--\x1b[0m', msg);
    const message = msgParser(msg);
    if (message.type === msgType.REGISTRATION) {
      const user = await this.dbEngine.addUser(message.data as User);
      connection.player_id = user.index || 0;
      const { password, ...resData } = user;
      const response = prepResponse(msgType.REGISTRATION, resData);
      curSocket.send(response);
      console.log('-->', response);
    }
    if (message.type === msgType.CREATE_ROOM) {
      await this.dbEngine.addRoom(connection.player_id);
    }
    await this.sendInfoAll();
  }

  public addListeners() {
    this.connections.forEach((connection) => {
      connection.socket.on('message', (msg) => this.exec(msg.toString(), connection));
      connection.socket.on('close', (msg) => console.log(`Exit whith code: ${msg}!`));
      connection.socket.on('error', (err) => console.error(err));
    });
  }

  public addConnection(connection: WSConnection) {
    this.connections.push(connection);
  }

  private async sendInfoAll() {
    const rooms = await this.dbEngine.getReadyRooms();
    const resRooms = prepResponse(msgType.UPD_ROOM, rooms);
    this.connections.forEach((con) => {
      con.socket.send(resRooms);
    });
    console.log('\x1b[32m--> toAll:\x1b[0m', resRooms);
  }
}
