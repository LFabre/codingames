//:: Consts
const MOVEMENTS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  INVALID: 'INVALID_MOVEMENT'
}

const ELEMENTS = {
  WALL: '#',
  SPACE: '.',
  START_POINT: 'T',
  CONTROL_POINT: 'C',
  PLAYER: '0',
  UNKNOWN: '?'
}

const STATE = {
  EXPLORE: 'EXPLORE',
  FOLLOW_PATH: 'FOLLOW_PATH',
}

//:: Movement
// From and to - [y,x] [y,x]
function getMovementToNode(from, to) {
  if (from[0] < to[0] && from[1] === to[1]) { return MOVEMENTS.DOWN; }
  if (from[0] > to[0] && from[1] === to[1]) { return MOVEMENTS.UP; }
  if (from[0] === to[0] && from[1] < to[1]) { return MOVEMENTS.RIGHT; }
  if (from[0] === to[0] && from[1] > to[1]) { return MOVEMENTS.LEFT; }

  return MOVEMENTS.INVALID;
}

//:: Path
function getNeighborhoodCoords(y, x) {
  return [[y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]]
    .filter(([_y, _x]) => _y >= 0 && _y < H && _x >= 0 && _x < W);
}

// Start and End - [y,x] [y,x]
// Start and End - [y,x] Char
function astar(map, start, end, allowUnknown = false) {
  const astarMap = [];
  for (let y = 0; y < map.length; y++) {

    const row = []
    for (let x = 0; x < map[y].length; x++) {
      row.push({
        x,
        y,
        c: map[y][x],
        g: 0,
        h: 1,
        parent: null
      });
    }

    astarMap.push(row);
  }

  const _start = astarMap[start[0]][start[1]];
  const _end = Array.isArray(end) ? astarMap[end[0]][end[1]] : end;
  const successCondition = Array.isArray(end) ? (cn, e) => cn === e : (cn, e) => cn.c === e;

  const openList = [_start];
  const closedList = [];

  while (openList.length) {

    let currentNode = openList[0];
    for (const node of openList) {
      if (node.f < currentNode.f) {
        currentNode = node;
      }
    }

    // End
    if (successCondition(currentNode, _end)) {
      const path = [], movementPath = [];
      let node = currentNode;

      while (node.parent) {
        path.unshift(node);
        movementPath.unshift(getMovementToNode([node.parent.y, node.parent.x], [node.y, node.x]));

        node = node.parent;
      }

      return { path, movementPath };
    }

    // Remove from openlist add to closed list
    openList.splice(openList.findIndex(n => n === currentNode), 1);
    closedList.push(currentNode);

    // Process Neighbors
    const neighbors = getNeighborhoodCoords(currentNode.y, currentNode.x)
      .map(([y, x]) => astarMap[y][x]);

    for (const neighbor of neighbors) {

      if (closedList.find(n => n === neighbor) || neighbor.c === ELEMENTS.WALL || (!allowUnknown && neighbor.c === ELEMENTS.UNKNOWN)) {
        continue;
      }

      const gScore = currentNode.g + 1;
      let gScoreIsBest = false;

      if (!openList.find(n => n === neighbor)) {
        gScoreIsBest = true;
        openList.push(neighbor);

        neighbor.h = 1;
      }

      if (gScoreIsBest || gScore < neighbor.g) {
        neighbor.g = gScore;
        neighbor.f = gScore + neighbor.f;
        neighbor.parent = currentNode;
      }
    }
  }

  return {};
}

//:: Labyrinth
function initLabyrinth() {
  return {
    map: null,
    startPointFound: false,
    startPointCoords: null,
    controlPointFound: false,
    controlPointCoords: null,
  }
}

function parseLabyrinth(oldLab) {
  const map = [];
  const spCoord = [];
  let spFound = oldLab.startPointFound;
  const cpCoord = [];
  let cpFound = oldLab.controlPointFound;

  // Update Map
  for (let i = 0; i < H; i++) {
    const row = readline();
    map.push(row.split(''));

    if (!spFound && !oldLab.startPointCoords) {
      const spIdx = row.indexOf(ELEMENTS.START_POINT);
      if (spIdx !== -1) {
        spCoord.push(i, spIdx);
        spFound = true;
      }
    }

    if (!cpFound && !oldLab.controlPointCoords) {
      const cpIdx = row.indexOf(ELEMENTS.CONTROL_POINT);
      if (cpIdx !== -1) {
        cpCoord.push(i, cpIdx);
        cpFound = true;
      }
    }
  }

  return {
    map,
    startPointFound: spFound,
    startPointCoords: spFound && !oldLab.startPointCoords ? spCoord : oldLab.startPointCoords,
    controlPointFound: cpFound,
    controlPointCoords: cpFound && !oldLab.controlPointCoords ? cpCoord : oldLab.controlPointCoord,
  }
}

//:: State
function initState() {
  return {
    x: null,
    y: null,
    currentState: STATE.EXPLORE,
    pathToFollow: null,
    pathIdx: null,
    hasReachedControlPoint: false,
    visitedCoords: []
  }
}

function performAction(state, labyrinth) {
  const { y, x } = state;
  const { map, startPointCoords, controlPointFound, controlPointCoords  } = labyrinth;

  // When path is set
  if (state.currentState === STATE.FOLLOW_PATH) {
    _stateMoveOnPath(state);

    // Path is over
    if (state.pathIdx >= state.pathToFollow.length) {
      state.pathIdx = null;
      state.pathToFollow = null;
      state.currentState = STATE.EXPLORE;
    }

    return { state, labyrinth };
  }

  // When Control Point is Reached
  if (_stateIsAt(state, controlPointCoords)) {
    const { path, movementPath } = astar(map, [y, x], startPointCoords);
    if (!path || !movementPath) {
      throw new Error('Impossible to return to Start Point');
    }

    state.hasReachedControlPoint = true;

    _stateSetToFollowPath(state, movementPath);
    _stateMoveOnPath(state);

    return { state, labyrinth };
  }

  // When Control Point is Found
  if (controlPointFound && !state.hasReachedControlPoint) {
    const { path, movementPath } = astar(map, [y, x], controlPointCoords);
    if (path && movementPath) {

      _stateSetToFollowPath(state, movementPath);
      _stateMoveOnPath(state);
      
      return { state, labyrinth };
    }
  }

  // Exploration
  const explorationPath = astar(map, [y, x], ELEMENTS.UNKNOWN, true);
  if (!explorationPath.path || !explorationPath.movementPath) {
    throw new Error('Impossible to Explore.');
  }
  
  console.log(explorationPath.movementPath[0]);

  return { state, labyrinth };
}

function _stateIsAt(state, coords) {
  return coords && state.y === coords[0] && state.x === coords[1];
}

function _stateSetToFollowPath(state, movementPath) {
  state.currentState = STATE.FOLLOW_PATH;
  state.pathToFollow = movementPath;
  state.pathIdx = 0;

  return state;
}

function _stateMoveOnPath(state) {
  if (!state.pathToFollow || (state.pathToFollow && state.pathIdx >= state.pathToFollow.length)) {
    throw new Error(`Impossible to move on Path. State: ${JSON.stringify(state)}`);
  }

  const movement = state.pathToFollow[state.pathIdx];
  state.pathIdx += 1;

  console.log(movement);

  return state;
}

//:: Control Variables
const [H, W, TIME] = readline().split(' ');

const initLab = initLabyrinth();
const state = initState();

function debugMap(state, labyrinth) {
  const _map = JSON.parse(JSON.stringify(labyrinth.map));

  _map[state.y][state.x] = ELEMENTS.PLAYER;

  for (let r of _map) {
    console.error(r.join(''));
  }
}

while (true) {
  const [y, x] = readline().split(' ').map(Number);
  const labyrinth = parseLabyrinth(initLab);

  state.x = x;
  state.y = y;
  state.visitedCoords.push[[y, x]];

  performAction(state, labyrinth);

  // --------------- Debug
  // console.error('Stat Panel');

  // const { startPointFound, startPointCoords, controlPointFound, controlPointCoords } = labyrinth;
  // console.error({ y, x });
  // console.error({ startPointFound, startPointCoords, controlPointFound, controlPointCoords });
  // debugMap(state, labyrinth)
}
