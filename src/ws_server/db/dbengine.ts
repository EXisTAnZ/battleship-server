import userDB from './db';
import User from '../types/user';
import { ERROR_MSG } from '../types/constants';
import { pbkdf2Sync } from 'crypto';

export default class DBEngine {
  private db: User[];

  constructor() {
    this.db = userDB;
  }

  public async getUsers(): Promise<User[]> {
    return this.db;
  }

  public async addUser(user: User) {
    try {
      this.userValidator(user);
      const existedUser = this.existedUser(user.name);
      if (existedUser) return this.auth(existedUser, user.password);
      else {
        const newId = this.getMaxID() + 1;
        const newUser: User = {
          id: newId,
          name: user.name,
          password: this.hashPass(user.password),
          error: false,
          errorMessage: '',
        };
        this.db.push(newUser);
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
    return this.db.find((user) => user.name === login);
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
    return Math.max(...this.db.map((item) => item.id || 0), 0);
  }
}
