const GRID_HEIGHT = 21;
const GRID_WIDTH = 23;

const MINE_COOLDOWN = 4;
const FIRE_COOLDOWN = 3;

const CANNON_RANGE = 13;

const COMMAND = {
  WAIT: 'WAIT',
  MOVE: 'MOVE',
  SLOWER: 'SLOWER',
  FASTER: 'FASTER',
  LEFT: 'PORT',
  RIGHT: 'STARBOARD',
  MINE: 'MINE',
  FIRE: 'FIRE',
}

const ENTITY_TYPE = {
  MINE: 'MINE',
  SHIP: 'SHIP',
  BARREL: 'BARREL',
  CANNONBALL: 'CANNONBALL',
}

const SHIP_TYPE = {
  ALLY: 1,
  ENEMY: 0
}

//:: Helpers
function isShip(entityType) {
  return entityType === ENTITY_TYPE.SHIP;
}

function isAlly(arg4) {
  return arg4 === SHIP_TYPE.ALLY;
}

function isAllyShip(entityType, shipType) {
  return entityType === ENTITY_TYPE.SHIP && SHIP_TYPE.ALLY === shipType;
}

function isEnemyShip(entityType, shipType) {
  return entityType === ENTITY_TYPE.SHIP && SHIP_TYPE.ENEMY === shipType;
}

function isBarrel(entityType) {
  return entityType === ENTITY_TYPE.BARREL;
}

function isMine(entityType) {
  return entityType === ENTITY_TYPE.MINE;
}

function isCannonBall(entityType) {
  return entityType === ENTITY_TYPE.CANNONBALL;
}

function clamp(v, min, max) {
  return Math.min(Math.max(v || 0, min), max);
}

function clampWidth(v, offset = 0) {
  return clamp(v, 0 + offset, GRID_WIDTH - 1 - offset);
}

function clampHeight(v, offset = 0) {
  return clamp(v, 0 + offset, GRID_HEIGHT - 1 - offset);
}

function clampCoords(y, x) {
  return [clampHeight(y), clampWidth(x)];
}

function debug(...a) {
  console.error(...a);
}

//:: Coordinates
function offsetToCube(y, x) {
  let cubeX = x - (y - (y & 1) / 2);
  let cubeZ = y;
  let cubeY = -cubeX - cubeZ;

  if (cubeX + cubeY + cubeZ !== 0) {
    throw `Incorrect cube coords - ${y} ${x}`
  }

  return [cubeY, cubeX, cubeZ];
}

function cubeToOffset(cubeX, cubeZ) {
  let x = cubeX + (cubeZ - (cubeZ & 1)) / 2;
  let y = cubeZ;

  return [y, x];
}

function distOffset(y, x, y1, x1) {
  return dist(...offsetToCube(y, x), ...offsetToCube(y1, x1));
}

function dist(y, x, z, y1, x1, z1) {
  return Math.sqrt(
    Math.pow(x - x1, 2)
    + Math.pow(y - y1, 2)
    + Math.pow(z - z1, 2)
  );
}

function nextOnDirection(y, x, d, speed) {
  if (!speed) {
    return [y, x];
  }

  const floorSpeed = Math.floor(speed / 2);
  const isOdd = y & 1;

  switch (d) {
    case 0: return [y, x + speed];
    case 3: return [y, x - speed];

    case 1: return [y - speed, x + (floorSpeed || isOdd)];
    case 4: return [y + speed, x - (floorSpeed || (isOdd ? 0 : 1))];

    case 5: return [y + speed, x + (floorSpeed || isOdd)];
    case 2: return [y - speed, x - (floorSpeed || (isOdd ? 0 : 1))];
    default:
      throw `Unknown direction ${d}`;
  }
}

function getNeighbors(aStarGrid, y, x) {
  let coords;

  if (y % 2 === 0) {
    coords = [[y, x + 1], [y - 1, x], [y - 1, x - 1], [y, x - 1], [y + 1, x - 1], [y + 1, x]]
  } else {
    coords = [[y, x + 1], [y - 1, x + 1], [y - 1, x], [y, x - 1], [y + 1, x], [y + 1, x + 1]]
  }

  return coords
    .filter(([y, x]) => y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH)
    .map(([y, x]) => aStarGrid[y][x])
}

function heuristic(aStarGrid, endX, endY) {
  return Math.abs(aStarGrid.x - endX) + Math.abs(aStarGrid.y - endY);
}
class PathFinder {
  constructor(grid) {
    this.grid = grid;
  }

  initAStarGrid() {
    const aStarGrid = [];
    for (let y = 0; y < this.grid.length; y++) {
      const row = [];

      for (let x = 0; x < this.grid[y].length; x++) {
        row.push({
          y: y,
          x: x,
          value: this.grid[y][x],
          H: null,
          G: Infinity,
          F: Infinity,
          closed: false,
          visited: false,
          parent: null
        });
      }

      aStarGrid.push(row);
    }

    return aStarGrid;
  }

  findPath(startY, startX, endY, endX) {
    const aStarGrid = this.initAStarGrid();
    const openList = [];

    openList.push(aStarGrid[startY][startX]);

    while (openList.length) {

      let bestNodeIdx = 0;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i].F < openList[bestNodeIdx].F) {
          bestNodeIdx = i;
        }
      }

      const currentNode = openList.splice(bestNodeIdx, 1)[0];

      if (currentNode.y === endY && currentNode.x === endX) {
        let curr = currentNode, path = [];

        while (curr) {
          path.unshift(curr);
          curr = curr.parent;
        }
        return path;
      }

      currentNode.closed = true;

      for (const neighbor of getNeighbors(aStarGrid, currentNode.y, currentNode.x)) {
        if (neighbor.closed || (neighbor.value && (neighbor.value.type === ENTITY_TYPE.MINE || neighbor.value.type === ENTITY_TYPE.CANNONBALL))) {
          continue;
        }

        const beenVisited = neighbor.visited;

        const distanceFromCurrentToNeighbor = 1;
        const gScore = currentNode.G + distanceFromCurrentToNeighbor;

        if (!beenVisited) {
          neighbor.H = heuristic(neighbor, endX, endY);
          neighbor.visited = true;
          openList.push(neighbor);
        }

        if (!beenVisited || gScore < neighbor.G) {
          neighbor.parent = currentNode;
          neighbor.G = gScore;
          neighbor.F = neighbor.G + neighbor.H;
        }
      }
    }

    return [];
  }
}

//:: Entities
class Entity {
  constructor(id, x, y, type) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.t = type[0];
    this.type = type;
  }
}

class Mine extends Entity {
  constructor(id, x, y) {
    super(id, x, y, ENTITY_TYPE.MINE);
  }
}

class Barrel extends Entity {
  constructor(id, x, y, rum) {
    super(id, x, y, ENTITY_TYPE.BARREL);
    this.rum = rum;
  }
}

class CannonBall extends Entity {
  constructor(id, x, y, entityId, turnsToImpact) {
    super(id, x, y, ENTITY_TYPE.CANNONBALL);
    this.entityId = entityId;
    this.turnsToImpact = turnsToImpact;
  }
}

class Ship extends Entity {
  constructor(id, x, y, d, speed, rum) {
    super(id, x, y, ENTITY_TYPE.SHIP);
    this.updateStats(x, y, d, speed, rum);
  }

  updateStats(x, y, d, speed, rum) {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x = x;
    this.y = y;
    this.d = d;
    this.speed = speed;
    this.rum = rum;
    return this;
  }

  hasMoved() {
    return this.prevY !== this.y || this.prevX !== this.x;
  }

  nextCoordinate() {
    return this._nextOnDirection(this.speed);
  }

  futureCoordinate(n) {
    return this._nextOnDirection(n);
  }

  getBowCoords() {
    return clampCoords(...this._nextOnDirection(1));
  }

  getSternCoords() {
    return clampCoords(...this._nextOnDirection(-1));
  }

  _nextOnDirection(n) {
    return nextOnDirection(this.y, this.x, this.d, n);
  }

  isInFireRange(y, x) {
    return this.isInFireRangeCube(...offsetToCube(y, x));
  }

  isInFireRangeCube(y, x, z) {
    return Math.floor(dist(...offsetToCube(this.y, this.x), y, x, z)) <= CANNON_RANGE;
  }
}

class AllyShip extends Ship {
  constructor(id, x, y, d, speed, rum) {
    super(id, x, y, d, speed, rum);
    this.fireCooldown = 0;
    this.target = null;
    this.t = 'A';
  }

  updateStats(x, y, d, speed, rum) {
    super.updateStats(x, y, d, speed, rum);
    this.fireCooldown = Math.max(0, this.fireCooldown - 1);
    return this;
  }

  setTarget(t) {
    this.target = t;
    return this;
  }

  getTarget() {
    return this.target;
  }

  fire(y, x) {
    console.log(`${COMMAND.FIRE} ${x} ${y}`);
    this.fireCooldown = FIRE_COOLDOWN;
  }

  move(y, x) {
    console.log(`${COMMAND.MOVE} ${x} ${y}`);
  }

  wait() {
    console.log(COMMAND.WAIT);
  }

  mine() {
    console.log(COMMAND.MINE);
  }

  faster() {
    console.log(COMMAND.FASTER);
  }

  slower() {
    console.log(COMMAND.SLOWER);
  }
}

class Ocean {
  constructor() {
    this.grid = [];
  }

  resetGrid() {
    this.grid = [];
    for (let r = 0; r < GRID_HEIGHT; r++) {
      this.grid.push(Array(GRID_WIDTH).fill(null));
    }
  }

  setCell(y, x, v) {
    this.grid[y][x] = v;
  }

  setPath(pathFinderPath) {
    for (const p of pathFinderPath) {
      this.setCell(p.y, p.x, 'X');
    }
  }

  print() {
    for (let i = 0; i < this.grid.length; i++) {
      debug(this._printRow(i));
    }
  }

  printOffset() {
    for (let i = 0; i < this.grid.length; i++) {
      let offset = i & 1 ? ' ' : ''
      debug(offset + this._printRow(i));
    }
  }

  _printRow(i) {
    return this.grid[i].map(e => e ? (e.t || e) : ' ').join()
  }
}

const entityMap = new Map();
const ocean = new Ocean();

while (true) {
  const myShipCount = parseInt(readline());
  const entityCount = parseInt(readline());

  const barrels = [];
  const allyShips = [];
  const enemyShips = [];

  ocean.resetGrid();

  //:: Parse Entities
  for (let i = 0; i < entityCount; i++) {
    let entityToAddToOcean
    const [entityId, entityType, ...params] = readline().split(' ');
    const [x, y, arg1, arg2, arg3, arg4] = params.map(Number);

    if (isShip(entityType)) {
      let ship = entityMap.get(entityId);
      const sClass = isAlly(arg4) ? AllyShip : Ship;
      const shipArr = isAlly(arg4) ? allyShips : enemyShips;

      if (!ship) {
        ship = new sClass(entityId, x, y, arg1, arg2, arg3);
        entityMap.set(entityId, ship);
      } else {
        ship.updateStats(x, y, arg1, arg2, arg3);
      }

      shipArr.push(ship);
      entityToAddToOcean = ship;
    } else if (isBarrel(entityType)) {
      entityToAddToOcean = new Barrel(entityId, x, y, arg1);
      barrels.push(entityToAddToOcean);
    } else if (isCannonBall(entityType)) {
      entityToAddToOcean = new CannonBall(entityId, x, y, arg1, arg2);
    } else if (isMine(entityType)) {
      entityToAddToOcean = new Mine(entityId, x, y);
    }

    if (entityToAddToOcean instanceof Ship) {
      const bow = entityToAddToOcean.getBowCoords();
      const stern = entityToAddToOcean.getSternCoords();

      ocean.setCell(bow[0], bow[1], entityToAddToOcean);
      ocean.setCell(stern[0], stern[1], entityToAddToOcean);
    }

    ocean.setCell(y, x, entityToAddToOcean);
  }

  //:: Set ship target
  for (let j = 0; j < allyShips.length; j++) {
    allyShips[j].setTarget(enemyShips[j] || enemyShips[0]);
  }

  //:: Ships Commands
  for (const aShip of allyShips) {
    const target = aShip.getTarget();

    const extraDistance = target.speed ? 1 : 0;
    const [enemyNextY, enemyNextX] = target.futureCoordinate(extraDistance + 2 * target.speed);
    const [enemyPrevY, enemyPrevX] = target.futureCoordinate(Math.min(-1, -1 * target.speed));

    if (target
      && aShip.isInFireRange(enemyNextY, enemyNextX)
      && !aShip.fireCooldown
      && (aShip.speed || !target.speed)
    ) {
      aShip.fire(enemyNextY, enemyNextX);

    } else {
      const m = target.futureCoordinate(4)
      let moveToY = m[0], moveToX = m[1];

      if (barrels.length && aShip.rum < 80) {
        let d = Number.MAX_VALUE
        for (const b of barrels) {
          let _d = distOffset(aShip.y, aShip.x, b.y, b.x);

          if (_d < d) {
            moveToX = b.x;
            moveToY = b.y;
            d = _d;
          }
        }
      }

      if (!aShip.hasMoved()) {
        const myNexts = nextOnDirection(aShip.y, aShip.x, aShip.d, 2);
        moveToY = myNexts[0];
        moveToX = myNexts[1];
      }
      
      moveToY = clampHeight(moveToY, 1);
      moveToX = clampWidth(moveToX, 1);

      finder = new PathFinder(ocean.grid);
      const path = finder.findPath(aShip.y, aShip.x, moveToY, moveToX);
      ocean.setPath(path);
      ocean.printOffset();

      aShip.move(moveToY, moveToX);
    }
  }
}
