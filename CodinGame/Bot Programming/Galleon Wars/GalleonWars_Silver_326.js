const GRID_HEIGHT = 21;
const GRID_WIDTH = 23;

const SHIP_LENGTH = 3;
const SHIP_WIDTH = 1;

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
  SHIP: 'SHIP',
  BARREL: 'BARREL',
  CANNONBALL: 'CANNONBALL'
}

const SHIP_TYPE = {
  ALLY: 1,
  ENEMY: 0
}

//:: Commands
function commandMove(x, y) {
  console.log(`${COMMAND.MOVE} ${x} ${y}`);
}

function commandFire(x, y) {
  console.log(`${COMMAND.FIRE} ${x} ${y}`);
}

function commandWait() {
  console.log(COMMAND.WAIT);
}

function commandMine() {
  console.log(COMMAND.MINE);
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

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function clampWidth(v) {
  return clamp(v, 0, GRID_WIDTH);
}

function clampHeight(v) {
  return clamp(v, 0, GRID_HEIGHT);
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

//:: Ships
class Ship {
  constructor(id, x, y, d, speed, rum) {
    this.id = id;
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
    return nextOnDirection(this.y, this.x, this.d, this.speed);
  }

  futureCoordinate(n) {
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
    this.type = SHIP_TYPE.ALLY;
    this.fireCooldown = 0;
    this.target = null;
  }

  updateStats(x, y, d, speed, rum) {
    super.updateStats(x, y, d, speed, rum);
    this.fireCooldown = Math.max(0, this.fireCooldown - 1);
    return this;
  }

  fire(y, x) {
    commandFire(x, y);
    this.fireCooldown = FIRE_COOLDOWN;
    return this;
  }

  setTarget(t) {
    this.target = t;
    return this;
  }

  getTarget() {
    return this.target;
  }
}

const entityMap = new Map();

while (true) {
  const myShipCount = parseInt(readline());
  const entityCount = parseInt(readline());

  const barrels = [];
  const allyShips = [];
  const enemyShips = [];

  //:: Parse Entities
  for (let i = 0; i < entityCount; i++) {
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
    } else if (isBarrel(entityType)) {
      barrels.push([y, x]);
    }
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
    const [enemyPrevY, enemyPrevX] = target.futureCoordinate(-1 * target.speed);

    if (target.x
      && target.y
      && aShip.isInFireRange(enemyNextY, enemyNextX)
      && !aShip.fireCooldown
      && (aShip.speed || !target.speed)
    ) {
      aShip.fire(enemyNextY, enemyNextX);

      // Try to Move
    } else {
      let moveToX = enemyPrevX, moveToY = enemyPrevY

      if (barrels.length) {
        let d = Number.MAX_VALUE
        for (const [by, bx] of barrels) {
          let _d = distOffset(aShip.y, aShip.x, by, bx);

          if (_d < d) {
            moveToX = bx;
            moveToY = by;
            d = _d;
          }
        }
      }

      if (!aShip.hasMoved()) {
        const myNexts = nextOnDirection(aShip.y, aShip.x, aShip.d, 2);
        moveToY = myNexts[0]
        moveToX = myNexts[1]
      }

      commandMove(moveToX, moveToY);
    }
  }  
}