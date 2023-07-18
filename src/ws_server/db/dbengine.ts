import { userDB, roomDB } from './db';
import User from '../types/user';
import { ERROR_MSG } from '../types/constants';
import { pbkdf2Sync } from 'crypto';
import Room from '../types/room';

export default class DBEngine {
  public async getUsers(): Promise<User[]> {
    return userDB;
  }

  public async getUser(userId: number) {
    const initUser: User = { name: 'RS Bot' };
    return userDB.find((item) => item.index === userId) || initUser;
  }

  public async addUser(user: User) {
    try {
      this.userValidator(user);
      const existedUser = this.existedUser(user.name);
      if (existedUser) return this.auth(existedUser, user.password || '');
      else {
        const newId = this.getMaxID() + 1;
        const newUser: User = {
          index: newId,
          name: user.name,
          password: this.hashPass(user.password || ''),
          error: false,
          errorMessage: '',
        };
        userDB.push(newUser);
        return newUser;
      }
    } catch (err) {
      return {
        ...user,
        error: true,
        errorMessage: (err as Error).message,
      } as User;
    }
  }

  private existedUser(login: string) {
    return userDB.find((user) => user.name === login);
  }

  private auth(user: User, password: string) {
    if (user.password !== this.hashPass(password)) throw new Error(ERROR_MSG.WRONG_PASSWORD);
    return user;
  }

  private hashPass(password: string) {
    return pbkdf2Sync(password, 'secret', 5, 64, 'sha256').toString();
  }

  private userValidator(user: User) {
    const { name, password } = user;
    const regexp = /^[a-zA-Z0-9@.а-яА-Я_-]+$/;
    if (!name || name.length < 5) throw new Error(ERROR_MSG.SHORT_USERNAME);
    if (!name.match(regexp)) throw new Error(ERROR_MSG.INVALID_USERNAME);
    if (!password || password.length < 5) throw new Error(ERROR_MSG.SHORT_PASSWORD);
  }

  private getMaxID() {
    return Math.max(...userDB.map((item) => item.index || 0), 0);
  }

  public async getRoom(roomId: number) {
    return roomDB.find((item) => item.roomId === roomId);
  }
  public async isUserInRoom(userId: number) {
    return roomDB
      .map((item) => item.roomUsers)
      .flat()
      .includes(await this.getUser(userId));
  }

  public async getReadyRooms() {
    return [...roomDB].filter((item) => item.roomUsers.length === 1);
  }

  public async addRoom(userId: number) {
    if (await this.isUserInRoom(userId)) throw new Error(ERROR_MSG.ALREADY_IN_ROOM);
    const nextRoomId = Math.max(...roomDB.map((item) => item.roomId || 0), 0) + 1;
    const user = await this.getUser(userId);
    const newRoom: Room = {
      roomId: nextRoomId,
      roomUsers: [user],
    };
    roomDB.push(newRoom);
    return newRoom;
  }

  public async addUserToRoom(userId: number, roomId: number) {
    const user = await this.getUser(userId);
    const room = await this.getRoom(roomId);
    if (!room) throw new Error(ERROR_MSG.NOT_FIND_ROOM);
    if (room.roomUsers.length > 1) throw new Error(ERROR_MSG.FULL_ROOM);
    if (room.roomUsers.includes(user)) throw new Error(ERROR_MSG.ALREADY_IN_ROOM);
    room.roomUsers.push(user);
  }
}
