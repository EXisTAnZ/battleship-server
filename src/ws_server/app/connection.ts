import WebSocket from 'ws';

export default class WSConnection {
  public socket: WebSocket;
  private _player_id = 0;
  private id: string;

  constructor(socket: WebSocket, id: string) {
    this.socket = socket;
    this.id = id;
  }

  public set player_id(id: number) {
    this._player_id = id;
  }
  public get player_id() {
    return this._player_id;
  }
}
