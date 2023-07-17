import Room from '../types/room';
import User from '../types/user';
import WSConnection from './connection';

export default class Game {
  public id: number;
  public players: User[] = [];
  public room: Room;
  public connects: WSConnection[];

  constructor(room: Room, connects: WSConnection[]) {
    this.room = room;
    this.players = room.roomUsers;
    this.id = room.roomId;
    this.connects = connects;
  }
}
