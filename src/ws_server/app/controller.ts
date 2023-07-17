import WSConnection from './connection';
import { msgParser, prepResponse } from '../utils';
import { msgConnect, msgType } from '../types/message';
import DBEngine from '../db/dbengine';
import User from '../types/user';
import Game from './game';
import { ERROR_MSG } from '../types/constants';
import GameEngine from './engine';

export default class AppController {
  private connections: WSConnection[];
  private dbEngine: DBEngine;
  private gameEngine: GameEngine;

  constructor() {
    this.connections = [];
    this.dbEngine = new DBEngine();
    this.gameEngine = new GameEngine();
  }

  public async exec(msg: string, connection: WSConnection) {
    const curSocket = connection.socket;
    console.log('\x1b[34m<--\x1b[0m', msg);
    const message = msgParser(msg);
    if (message.type === msgType.REGISTRATION) {
      const user = await this.dbEngine.addUser(message.data as User);
      connection.playerId = user.index || 0;
      const { password, ...resData } = user;
      const response = prepResponse(msgType.REGISTRATION, resData);
      curSocket.send(response);
      console.log('-->', response);
    }
    if (message.type === msgType.CREATE_ROOM) {
      await this.dbEngine.addRoom(connection.playerId);
    }
    if (message.type === msgType.CONNECT_TO_ROOM) {
      const playerId = connection.playerId;
      const roomId = (message.data as msgConnect).indexRoom;

      await this.dbEngine.addUserToRoom(playerId, roomId);
      await this.createGame(roomId);
    }
    await this.sendInfoAll();
  }

  public addListeners() {
    this.connections.forEach((connection) => {
      connection.socket.on('message', (msg) =>
        this.exec(msg.toString(), connection).catch((err) =>
          console.log('\x1b[31mError:\x1b[0m', err.message),
        ),
      );
      connection.socket.on('close', (msg) => console.log(`Exit whith code: ${msg}!`));
      connection.socket.on('error', (err) => console.error(err));
    });
  }

  public addConnection(connection: WSConnection) {
    this.connections.push(connection);
  }

  private getUserConnect(userId: number) {
    return this.connections.find((con) => con.playerId === userId);
  }

  private async createGame(roomId: number) {
    const connects: WSConnection[] = [];
    const room = await this.dbEngine.getRoom(roomId);
    if (!room) throw new Error(ERROR_MSG.NOT_FIND_ROOM);
    room.roomUsers.forEach((user) => {
      const connect = this.getUserConnect(user.index || 0);
      if (connect) connects.push(connect);
    });
    const game = new Game(room, connects);
    this.gameEngine.addGame(game);
    game.connects.forEach((con) => {
      const gameData = { idGame: roomId, idPlayer: con.playerId };
      const resGame = prepResponse(msgType.CREATE_GAME, gameData);
      con.socket.send(resGame);
    });
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
