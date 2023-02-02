const LOOP = 'LOOP';

const END = '$';
const BEER = 'B';
const START = '@';
const INVERTER = 'I';
const TELEPORT = 'T';
const FREE_SPACE = ' ';

const WALL = '#'
const OBSTACLE = 'X';

const PATH_MODIFIER = {
    S: 'SOUTH',
    E: 'EAST',
    N: 'NORTH',
    W: 'WEST',
};

const DIRECTIONS = {
    SOUTH: 'SOUTH',
    EAST: 'EAST',
    NORTH: 'NORTH',
    WEST: 'WEST',
};

const defaultPriorities = [
    DIRECTIONS.SOUTH,
    DIRECTIONS.EAST,
    DIRECTIONS.NORTH,
    DIRECTIONS.WEST
];

const City = {
    tiles: [],
    t1: null,
    t2: null,
    start: null,
    end: null,
    W: 0,
    H: 0
};

const Blunder = {
    x: 0,
    y: 0,
    looped: false,
    moves: [],
    breakerMode: false,
    breakerCount: 0,
    direction: 0,
    priorities: defaultPriorities,
    states: new Map()
};

const dimentions = readline().split(' ');
City.H = dimentions[0];
City.W = dimentions[1];

for (let y = 0; y < City.H; y++) {
    const row = readline().split('');

    for (let x = 0; x < row.length; x++) {
        City.tiles[y] ? City.tiles[y].push(row[x]) : City.tiles[y] = [row[x]];
        
        if (row[x] === TELEPORT) {
            City.t1 ? City.t2 = [y,x] : City.t1 = [y,x];
        } else if (row[x] === START) {
            City.start = [y,x];
            Blunder.y = y;
            Blunder.x = x;
        } else if (row[x] === END) {
            City.end = [y,x];
        }
    }
}

function isValidMove(blunder, city, y, x) {    
    if (y >= city.H || y < 0 || x >= city.W || x < 0)
        return false;

    const tile = city.tiles[y][x];
    return (tile === OBSTACLE && blunder.breakerMode) || (tile !== WALL && tile !== OBSTACLE);
}

function onBeer(blunder) {
    blunder.breakerMode = !blunder.breakerMode;
}

function onInverter(blunder) {
    let oldDirection = blunder.priorities[blunder.direction];

    blunder.priorities = blunder.priorities.reverse();
    blunder.direction = blunder.priorities.indexOf(oldDirection);
}

function onPathModifier(blunder, modifier) {
    setBlunderDirection(blunder, PATH_MODIFIER[modifier]);
}

function onTeleport(city, blunder) {
    const teleport = blunder.y === city.t1[0] && blunder.x === city.t1[1] ? city.t2 : city.t1;
    blunder.y = teleport[0];
    blunder.x = teleport[1];
}

function onObstacle(city, blunder) {
    if (!blunder.breakerMode) { return; }

    blunder.breakerCount++;
    city.tiles[blunder.y][blunder.x] = FREE_SPACE;
}

function setBlunderDirection(blunder, direction) {
    blunder.direction = blunder.priorities.indexOf(direction);
}

function applyEffect(city, blunder) {
    const tile = city.tiles[Blunder.y][Blunder.x];

    if (PATH_MODIFIER[tile]) {
        return onPathModifier(blunder, tile);
    }

    switch (tile) {
        case BEER: return onBeer(blunder);
        case INVERTER: return onInverter(blunder);
        case TELEPORT: return onTeleport(city, blunder);
        case OBSTACLE: return onObstacle(city, blunder);
    }
}

function directionToCoord(y, x, d) {
    switch (d) {
        case DIRECTIONS.SOUTH: return [y + 1, x];
        case DIRECTIONS.EAST: return [y, x + 1];
        case DIRECTIONS.WEST: return [y, x - 1];
        case DIRECTIONS.NORTH: return [y - 1, x];
    }
}

function isGameOver(city, blunder) {
    return city.end[0] === blunder.y && city.end[1] === blunder.x || blunder.looped;
}

function verifyLoop(blunder) {
    const id = `${blunder.y}-${blunder.x}`;
    const state = blunder.states.get(id);

    if (state
        && state.breakerMode === blunder.breakerMode
        && state.breakerCount === blunder.breakerCount
        && state.direction === blunder.direction
        && state.priorities.every((e, i) => e === blunder.priorities[i])) {
        return true;
    }

    blunder.states.set(id, {
        breakerMode: blunder.breakerMode,
        breakerCount: blunder.breakerCount,
        direction: blunder.direction,
        priorities: blunder.priorities
    });

    return false;
}

function debugCity(city) {
    city.tiles.forEach(r => console.error(r.join('')));
}

// Game Loop
while (!isGameOver(City, Blunder)) {

    let nextDirection = null, ny = null, nx = null, ndIdx = Blunder.direction, first = true;
    do {
        const coords = directionToCoord(Blunder.y, Blunder.x, Blunder.priorities[ndIdx]);
        ny = coords[0]
        nx = coords[1]
        
        if (isValidMove(Blunder, City, ny, nx)) {
            nextDirection = Blunder.priorities[ndIdx];
        } else {
            ndIdx = first ? 0 : ndIdx === Blunder.priorities.length - 1 ? 0 : ndIdx + 1;
            first = false;
        }
    } while(!nextDirection);

    Blunder.y = ny;
    Blunder.x = nx;
    Blunder.direction = ndIdx;
    Blunder.moves.push(Blunder.priorities[Blunder.direction]);

    applyEffect(City, Blunder);

    Blunder.looped = verifyLoop(Blunder);
}

Blunder.looped ? console.log(LOOP) : Blunder.moves.forEach(m => console.log(m));
