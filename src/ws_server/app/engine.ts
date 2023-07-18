import Game from './game';

export default class GameEngine {
  private games: Game[];

  constructor() {
    this.games = [];
  }

  public addGame(game: Game) {
    this.games.push(game);
  }

  public removeGame(gameId: number) {
    this.games.filter((game) => game.id !== gameId);
  }

  public getGame(gameId: number) {
    return this.games.find((game) => game.id == gameId);
  }
}
