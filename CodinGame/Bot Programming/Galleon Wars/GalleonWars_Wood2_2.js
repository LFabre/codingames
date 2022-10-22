const GRID_HEIGHT = 21;
const GRID_WIDTH = 23;

const SHIP_LENGTH = 3;
const SHIP_WIDTH = 1;

const MINE_COOLDOWN = 4;
const SHOT_COOLDOWN = 4;

const CANNON_RANGE = 13;

const COMMAND = {
  MOVE: 'MOVE',
  WAIT: 'WAIT',
  SLOWER: 'SLOWER',
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

//:: Fire
function isInFireRange(y, x, y1, x1) {
  return isInFireRangeCube(
    ...offsetToCube(y, x),
    ...offsetToCube(y1, x1)
  );
}

function isInFireRangeCube(y, x, z, y1, x1, z1) {
  // debug(dist(y, x, z, y1, x1, z1))
  return Math.floor(dist(y, x, z, y1, x1, z1)) <= CANNON_RANGE;
}

function debug(...a) {
  console.error(...a);
}

let shotCoolDown = 0;
while (true) {
  let sx, sy, mySpeed, myRum, bx, by;
  let enemyX, enemyY, enemyD, enemySpeed;

  shotCoolDown = Math.max(0, shotCoolDown - 1);

  const myShipCount = parseInt(readline());
  const entityCount = parseInt(readline());
  const barrels = [];

  for (let i = 0; i < entityCount; i++) {
    const [entityId, entityType, ...params] = readline().split(' ');
    const [x, y, arg1, arg2, arg3, arg4] = params.map(Number);

    if (isAllyShip(entityType, arg4)) {
      sx = x;
      sy = y;
      mySpeed = arg2;
      myRum = arg3;
    } else if (isEnemyShip(entityType, arg4)) {
      enemyX = x;
      enemyY = y;
      enemyD = arg1;
      enemySpeed = arg2;
    } else if (isBarrel(entityType) && myRum < 60) {
      barrels.push([y, x]);
    }
  }

  for (let i = 0; i < myShipCount; i++) {

    //:: Fire at Enemy
    //debug({ r: isInFireRange(sy, sx, enemyY, enemyX) })
    const [nextY, nextX] = nextOnDirection(enemyY, enemyX, enemyD, 2 * enemySpeed);
    debug({
        nextY,
        nextX,
        enemyY, enemyX, enemyD, enemySpeed
    })

    if (nextX
      && nextY
      && isInFireRange(sy, sx, nextY, nextX)
      && !shotCoolDown
      && mySpeed
      && (
        myRum > 30
        || barrels.length === 0
      )
    ) {
      commandFire(nextX, nextY);
      shotCoolDown = SHOT_COOLDOWN;
    } else {

      if (barrels.length) {
        let d = Number.MAX_VALUE
        for (const [y, x] of barrels) {
          let _d = distOffset(sy, sx, y, x);

          if (_d < d) {
            bx = x;
            by = y;
            d = _d;
          }
        }
        commandMove(bx, by);
      } else {
        debug('Move to Enemy')
        commandMove(enemyX, enemyY);
      }
    }
  }
}