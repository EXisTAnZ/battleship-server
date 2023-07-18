import User from './user';
import WebSocket from 'ws';

export default interface Player {
  user: User;
  socket: WebSocket;
}
