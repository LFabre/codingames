const W = 23;
const H = 21;

const SHIP_LENGTH = 3;
const SHIP_WIDTH = 1;

const MINE_COOLDOWN = 4;
const SHOT_COOLDOWN = 4;

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
  console.log(COMMAND.WAIT);
}

//:: Helpers
function isAllyShip(entityType, arg4) {
    return entityType === ENTITY_TYPE.SHIP && SHIP_TYPE.ALLY === arg4;
}

function isEnemyShip(entityType, arg4) {
  return entityType === ENTITY_TYPE.SHIP && SHIP_TYPE.ENEMY === arg4;
}

function isBarrel(entityType) {
    return entityType === ENTITY_TYPE.BARREL;
}

//:: Path
function getNeighborhood (x, y) {
  if (y % 2 === 0) {
    return [
      [x - 1, y - 1], [x, y - 1],
      [x - 1, y], [x + 1, y],
      [x - 1, y + 1], [x, y + 1]
    ]
  }

  return [
    [x, y - 1], [x + 1, y - 1],
    [x - 1, y], [x + 1, y],
    [x, y + 1], [x + 1, y + 1]
  ]
}

function dist(x,y, x1, y1) {
  return Math.sqrt(Math.pow(x - x1, 2) * Math.pow(y - y1, 2));
}

function debug(...a) {
    console.error(...a);
}

while (true) {
    let sx, sy, bx, by, d = Number.MAX_VALUE, commandUsed = false, shotCoolDown = 0;
    let enemyX, enemyY, mySpeed

    shotCoolDown = shotCoolDown === 0 ? 0 : shotCoolDown - 1;

    const myShipCount = parseInt(readline());
    const entityCount = parseInt(readline());

    for (let i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        const entityId = parseInt(inputs[0]);
        const entityType = inputs[1];
        const x = parseInt(inputs[2]);
        const y = parseInt(inputs[3]);
        const arg1 = parseInt(inputs[4]);
        const arg2 = parseInt(inputs[5]);
        const arg3 = parseInt(inputs[6]);
        const arg4 = parseInt(inputs[7]);

        if (isAllyShip(entityType, arg4)) {
            sx = x;
            sy = y;
            mySpeed = arg2;
        }

        if (isEnemyShip(entityType, arg4)) {
          enemyX = x;
          enemyY = y;
        }

        if (isBarrel(entityType)) {
           let _d = dist(sx, sy, x, y);
            if (_d < d) {
                bx = x;
                by = y;
                d = _d;
            }
        }
    }

    if (!commandUsed) {      
      for (let i = 0; i < myShipCount; i++) {
        if (enemyX && enemyY && !shotCoolDown && mySpeed) {
          commandFire(enemyX, enemyY);
          shotCoolDown = SHOT_COOLDOWN;
        } else if (bx && by) {
          commandMove(bx, by);
        } else {
          commandWait();
        }
      }
    }
}
