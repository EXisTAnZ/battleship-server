import User from './user';

export default interface Room {
  roomId: number;
  roomUsers: User[];
}
