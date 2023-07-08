import { WebSocketServer } from 'ws';

export default class WSServer {
  private server: WebSocketServer;

  constructor(port: string | number) {
    if (typeof port === 'string') port = parseInt(port);
    this.server = new WebSocketServer({ port });
  }

  start() {
    this.server.on('connection', (ws) => {
      ws.on('error', console.error);

      ws.on('message', function message(data) {
        console.log('received: %s', data);
      });

      ws.send(
        JSON.stringify({
          type: 'create_room',
          data: '',
          id: 0,
        }),
      );
    });
  }
}
