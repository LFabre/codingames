//:: Globals
const AVAILABLE = '.';
const NODE = '@';
const WALL = '#';
const BOMB = 'X';
const MARK = 'M';
const BOMB_RANGE = 3;
const BOMB_COOLDOWN = 4;
const [W, H] = readline().split(' ').map(Number);

//:: Grid Walks
function walkOnRow(grid, startY, startX, range, inc, callback) {
  for (let i = 1; i <= range; i++) {
    let _i = startX + (i * inc);

    if (_i >= 0 && _i < W) {

      if (grid[startY][_i] === WALL)
        break;

      callback(grid[startY][_i], startY, _i);
    }
  }
}

function walkOnColumn(grid, startY, startX, range, inc, callback) {
  for (let i = 1; i <= range; i++) {
    let _i = startY + (i * inc);

    if (_i >= 0 && _i < H) {

      if (grid[_i][startX] === WALL)
        break;

      callback(grid[_i][startX], _i, startX);
    }
  }
}

function forCross(grid, y, x, range, callback) {
  walkOnColumn(grid, y, x, range, 1, callback);
  walkOnColumn(grid, y, x, range, -1, callback);
  walkOnRow(grid, y, x, range, 1, callback);
  walkOnRow(grid, y, x, range, -1, callback);
}

//:: Count Bombs
function countTargetsAtRange(grid, y, x) {
  let count = 0;

  if (grid[y][x] === BOMB)
    return count;

  forCross(grid, y, x, BOMB_RANGE, cell => {
    if (cell === NODE)
      count++;
  });

  return count;
}

//:: Grid Modification
function removeNodesAtRange(grid, y, x) {
  let count = 0;
  forCross(grid, y, x, BOMB_RANGE, (_, y, x) => {
    if (grid[y][x] === NODE || grid[y][x] === MARK) {
      setGridCell(grid, y, x, AVAILABLE);
      count++;
    }
  });
  return count;
}

function setNodesAtRangeAsMarked(grid, y, x) {
  forCross(grid, y, x, BOMB_RANGE, (_, y, x) => {
    if (grid[y][x] === NODE)
      setGridCell(grid, y, x, MARK);
  });
}

function setGridCell(grid, y, x, c) {
  grid[y][x] = c;
}

//:: Find best bomb position
function findBestBombPosition(grid, nodesLeft) {
  let bestCount = 0, _x, _y;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {

      if (grid[y][x] === NODE || grid[y][x] === WALL)
        continue;

      let count = countTargetsAtRange(grid, y, x);
      if (count > bestCount) {
        _x = x;
        _y = y;
        bestCount = count;

        // Speed up for last bomb
        if (bestCount === nodesLeft)
          return { y: _y, x: _x, count: bestCount };
      }
    }
  }

  return { y: _y, x: _x, count: bestCount };
}

function findWorseBombPosition(grid, nodesLeft, bestCount) {
  let worseCount = 0, _x, _y;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {

      if (grid[y][x] === NODE || grid[y][x] === WALL)
        continue;

      let count = countTargetsAtRange(grid, y, x);
      if (count > worseCount && count < bestCount) {
        _x = x;
        _y = y;
        worseCount = count;

        // Speed up for last bomb
        if (worseCount === nodesLeft)
          return { y: _y, x: _x, count: worseCount };
      }
    }
  }

  return { y: _y, x: _x, count: worseCount };
}

//:: Clear grid
function clearNodes(grid, placedBombs, currentTurn) {
  let count = 0;
  for (const bomb of placedBombs) {
    const [coords, turn] = bomb;

    if (turn - currentTurn > BOMB_COOLDOWN) {
      count += removeNodesAtRange(grid, coords[0], coords[1]);
      setGridCell(grid, coords[0], coords[1], AVAILABLE);
    }
  }
  return count;
}

//:: Simulation
class Simulation {
  constructor(initialGrid, roundsLeft, bombsLeft, totalNodes) {
    this._grid = initialGrid;
    this._roundsLeft = roundsLeft;
    this._bombsLeft = bombsLeft;
    this._totalNodes = totalNodes;

    this.grid = JSON.parse(JSON.stringify(this._grid));
    this.roundsLeft = this._roundsLeft;
    this.bombsLeft = this._bombsLeft;
    this.totalNodes = this._totalNodes;
    this.placedBombs = []
    this.actions = [];
  }

  reset() {
    this.grid = JSON.parse(JSON.stringify(this._grid));
    this.roundsLeft = this._roundsLeft;
    this.bombsLeft = this._bombsLeft;
    this.totalNodes = this._totalNodes;
    this.placedBombs = [];
    this.actions = [];
  }

  simulate(getWorseCount = 0) {
    let removedNodes = 0
    while (this.roundsLeft--) {
      let bombPosition;
      removedNodes += clearNodes(this.grid, this.placedBombs, this.roundsLeft);
      
      bombPosition = findBestBombPosition(this.grid, this.totalNodes);

      // By getting the second best bomb placement we can avoid the last test case.
      // This is not the optimal solution but it yields the same result as changing
      // the first nodes of a decision tree.
      if (getWorseCount > 0) {
        bombPosition = findWorseBombPosition(this.grid, this.totalNodes, bombPosition.count);
        getWorseCount--;
      }

      const { x, y } = bombPosition;

      if (this.bombsLeft && x !== undefined && y !== undefined && this.grid[y][x] === AVAILABLE) {
        this.placedBombs.push([[y, x], this.roundsLeft]);
        setNodesAtRangeAsMarked(this.grid, y, x);
        setGridCell(this.grid, y, x, BOMB);
    
        this.actions.push(`${x} ${y}`);
        this.bombsLeft--;
      } else {
        this.actions.push('WAIT');
      }
    }

    removedNodes += clearNodes(this.grid, this.placedBombs, -BOMB_COOLDOWN);
    return removedNodes === this.totalNodes;
  }
}

//:: Grid Build
const grid = [];
let totalNodes = 0

for (let i = 0; i < H; i++) {
  for (const c of readline().split('')) {
    if (c === NODE)
      totalNodes++;

    grid[i] ? grid[i].push(c) : grid[i] = [c];
  }
}

//:: Game Loop
let simulation = null;
let actionIdx = 0;
while (true) {
  const [roundsLeft, bombsLeft] = readline().split(' ').map(Number);
  
  if (!simulation) {
    let worseCount = 0;
    simulation = new Simulation(grid, roundsLeft, bombsLeft, totalNodes);

    while (!simulation.simulate(worseCount)) {
      worseCount++;
      simulation.reset();
    }
  }

  console.log(simulation.actions[actionIdx++]);
}
