import fs from 'fs';
import path from 'path';
import http from 'http';

export default class HTTPServer {
  private server: http.Server;
  private port: number;

  constructor(port: string | number) {
    this.port = typeof port === 'string' ? parseInt(port) : port;
    this.server = http.createServer((req, res) => {
      const __dirname = path.resolve(path.dirname(''));
      const file_path =
        __dirname +
        (req.url === '/' ? '/front/index.html' : '/front' + req.url);
      fs.readFile(file_path, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    });
  }

  public start() {
    this.server.listen(this.port);
  }
}
