import WebSocket from 'ws';

export default class WSConnection {
  public socket: WebSocket;
  private _playerId = 0;
  private id: string;

  constructor(socket: WebSocket, id: string) {
    this.socket = socket;
    this.id = id;
  }

  public set playerId(id: number) {
    this._playerId = id;
  }
  public get playerId() {
    return this._playerId;
  }
}
