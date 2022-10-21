const W = 23;
const H = 21;

const SHIP_LENGTH = 3;
const SHIP_WIDTH = 1;

const COMMAND = {
    MOVE: 'MOVE', 
    WAIT: 'WAIT',
    SLOWER: 'SLOWER',
}

const ENTITY_TYPE = {
    SHIP: 'SHIP',
    BARREL: 'BARREL'
}

const SHIP_TYPE = {
    ALLY: 1,
    ENEMY: 0
}

function dist(x,y, x1, y1) {
    return Math.sqrt(Math.pow(x - x1, 2) * Math.pow(y - y1, 2));
}

function isAllyShip(entityType, arg4) {
    return entityType === ENTITY_TYPE.SHIP && SHIP_TYPE.ALLY === arg4;
}

function isBarrel(entityType) {
    return entityType === ENTITY_TYPE.BARREL;
}

//:: Commands
function commandMove(x, y) {
    console.log(`${COMMAND.MOVE} ${x} ${y}`);
}

function commandWait() {
    console.log(COMMAND.WAIT);
}

function debug(...a) {
    console.error(...a);
}

while (true) {
    let sx, sy, bx, by, d = Number.MAX_VALUE;

    const myShipCount = parseInt(readline());
    const entityCount = parseInt(readline());
    
    for (let i = 0; i < entityCount; i++) {
        const [ entityId, entityType, ...params ] = readline().split(' ');
        const [ x, y, arg1, arg2, arg3, arg4] = params.map(Number);

        if (isAllyShip(entityType, arg4)) {
            sx = x;
            sy = y;
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

    for (let i = 0; i < myShipCount; i++) {
        if (bx && by) {
            commandMove(bx, by);
        } else {
            commandWait();
        }
    }
}
