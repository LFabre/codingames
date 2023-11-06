const readlineOfNumbers = (): number[] =>
  readline()
    .split(' ')
    .map(n => Number(n));

const [WIDTH, HEIGHT, PLAYER_COUNT, MY_ID] = readlineOfNumbers();

const WALL_ORIENTATION = {
  H: 'H',
  V: 'V',
};

type Position = [number, number];

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
const DIRECTIONS: Record<string, Direction> = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

class Player {
  private id: number;
  private x: number;
  private startX: number;
  private y: number;
  private startY: number;
  private walls: number;
  private score: number;
  private destiny: Direction;
  private movementMap: Record<string, Function>;

  constructor(id: number, y: number, x: number, initialWalls: number) {
    this.id = id;
    this.x = x;
    this.startX = x;
    this.y = y;
    this.startY = y;
    this.walls = initialWalls;
    this.score = 0;

    if (x === 0) {
      this.destiny = DIRECTIONS.RIGHT;
    } else if (x === WIDTH - 1) {
      this.destiny = DIRECTIONS.LEFT;
    } else if (y === 0) {
      this.destiny = DIRECTIONS.DOWN;
    } else {
      this.destiny = DIRECTIONS.UP;
    }

    this.movementMap = {
      [DIRECTIONS.UP]: this.moveUp,
      [DIRECTIONS.DOWN]: this.moveDown,
      [DIRECTIONS.LEFT]: this.moveLeft,
      [DIRECTIONS.RIGHT]: this.moveRight,
    };
  }

  public setTurnInfo(y: number, x: number, walls: number) {
    this.y = y;
    this.x = x;
    this.walls = walls;
  }

  public isMe(): boolean {
    return this.id === MY_ID;
  }

  public getId(): number {
    return this.id;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getPos(): number[] {
    return [this.y, this.x];
  }

  public getDestiny(): Direction {
    return this.destiny;
  }

  public getWalls(): number {
    return this.walls;
  }

  public useWall() {
    this.walls--;
  }

  public move(direction: string) {
    this.movementMap[direction]();
  }

  public moveToDestiny() {
    this.move(this.destiny);
  }

  private moveUp() {
    this.y--;
  }

  private moveDown() {
    this.y++;
  }

  private moveLeft() {
    this.x--;
  }

  private moveRight() {
    this.x++;
  }
}

class GameBoard {
  private width: number;
  private height: number;
  public board: any[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.board = [];
    for (let i = 0; i < this.height; i++) {
      this.board.push(new Array(this.width).fill(null));
    }
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }
}

class DestinyFinder {
  private board: GameBoard;
  private visited: boolean[][];

  constructor(board: GameBoard) {
    this.board = board;
    this.init();
  }

  private init() {
    this.visited = [];
    for (let i = 0; i < this.board.getHeight(); i++) {
      this.visited.push(new Array<boolean>(this.board.getWidth()).fill(false));
    }
  }

  public findPath() {}
}

const gameBoard = new GameBoard(WIDTH, HEIGHT);

let p: Player | null = null;

while (true) {
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const [x, y, wallsLeft] = readlineOfNumbers();
    if (!p && i === MY_ID) {
      p = new Player(i, y, x, wallsLeft);
    }
  }

  const wallCount: number = parseInt(readline()); // number of walls on the board
  for (let i = 0; i < wallCount; i++) {
    const [wallX, wallY, wallOrientation] = readline().split(' ');
  }

  console.log(p?.getDestiny() || 'RIGHT');
}
