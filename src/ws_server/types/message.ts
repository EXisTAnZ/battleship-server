import Ship from './ship';

export interface Message {
  type: msgType;
  data: string;
  id: number;
}

export interface msgPlayer {
  name: string;
  password: string;
}

export interface msgConnect {
  indexRoom: number;
}

export interface msgAddShips {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface msgAttack {
  gameId: number;
  x?: number;
  y?: number;
  indexPlayer: number;
}

export enum msgType {
  REGISTRATION = 'reg',
  UPD_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  CONNECT_TO_ROOM = 'add_user_to_room',
  CREATE_GAME = 'create_game',
  UPD_ROOM = 'update_room',
  ADD_SHIPS = 'add_ships',
  START = 'start_game',
  ATTACK = 'attack',
  RND_ATTACK = 'randomAttack',
  TURN = 'turn',
  FINISH = 'finish',
}
