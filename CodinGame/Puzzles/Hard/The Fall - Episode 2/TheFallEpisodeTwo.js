//:: Constants
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const TOP = 'TOP';
const WAIT = 'WAIT';

const PATHS = {
  '0': {
    [TOP]: '',
    [LEFT]: '',
    [RIGHT]: ''
  },
  '1': {
    [TOP]: TOP,
    [LEFT]: TOP,
    [RIGHT]: TOP
  },
  '2': {
    [TOP]: '',
    [LEFT]: LEFT,
    [RIGHT]: RIGHT
  },
  '3': {
    [TOP]: TOP,
    [LEFT]: '',
    [RIGHT]: ''
  },
  '4': {
    [TOP]: RIGHT,
    [LEFT]: '',
    [RIGHT]: TOP
  },
  '5': {
    [TOP]: LEFT,
    [LEFT]: TOP,
    [RIGHT]: ''
  },
  '6': {
    [TOP]: '',
    [LEFT]: LEFT,
    [RIGHT]: RIGHT
  },
  '7': {
    [TOP]: TOP,
    [LEFT]: '',
    [RIGHT]: TOP
  },
  '8': {
    [TOP]: '',
    [LEFT]: TOP,
    [RIGHT]: TOP
  },
  '9': {
    [TOP]: TOP,
    [LEFT]: TOP,
    [RIGHT]: ''
  },
  '10': {
    [TOP]: RIGHT,
    [LEFT]: '',
    [RIGHT]: ''
  },
  '11': {
    [TOP]: LEFT,
    [LEFT]: '',
    [RIGHT]: ''
  },
  '12': {
    [TOP]: '',
    [LEFT]: '',
    [RIGHT]: TOP
  },
  '13': {
    [TOP]: '',
    [LEFT]: TOP,
    [RIGHT]: ''
  },
}

const ROTATIONS = {
  '0': {
    isWorthIt: false,
    isSingle: true,
    [LEFT]: '0',
    [RIGHT]: '0'
  },
  '1': {
    isWorthIt: false,
    isSingle: true,
    [LEFT]: '1',
    [RIGHT]: '1'
  },
  '2': {
    isWorthIt: true,
    isSingle: true,
    [LEFT]: '3',
    [RIGHT]: '3'
  },
  '3': {
    isWorthIt: true,
    isSingle: true,
    [LEFT]: '2',
    [RIGHT]: '2'
  },
  '4': {
    isWorthIt: true,
    isSingle: true,
    [LEFT]: '5',
    [RIGHT]: '5'
  },
  '5': {
    isWorthIt: true,
    isSingle: true,
    [LEFT]: '4',
    [RIGHT]: '4'
  },
  '6': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '9',
    [RIGHT]: '7'
  },
  '7': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '6',
    [RIGHT]: '8'
  },
  '8': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '7',
    [RIGHT]: '9'
  },
  '9': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '8',
    [RIGHT]: '6'
  },
  '10': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '13',
    [RIGHT]: '11'
  },
  '11': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '10',
    [RIGHT]: '12'
  },
  '12': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '11',
    [RIGHT]: '13'
  },
  '13': {
    isWorthIt: true,
    isSingle: false,
    [LEFT]: '12',
    [RIGHT]: '10'
  },
}

//:: Debug
const lines = ["13 10",
 //"-3 12  8  6 3  2  7  2  7            ",
 //"11  5 13          3     3            ",
 //"   11  2  2 3  3  8  2 -9  2  3 13   ",
 //"              12  8  3  1  3  2  7   ",
 //"      11  2 3  1  5  2 10       11 13",
 //"       3       6  8                 2",
 //"      11  3 3 10 11  2  3  2  3  2  8",
 //"   12  6  3 2  3  3  6  3  3  2  3 12",
 //"   11  4  2 3  2  2 11 12 13 13 13   ",
 //"      -3 12 7  8 13 13  4  5  4 10   ",
 //                     |
 "-3 12 8 6 3 2 7 2 7 0 0 0 0",
 "11 5 13 0 0 0 3 0 3 0 0 0 0",
 "0 11 2 2 3 3 8 2 -9 2 3 13 0",
 "0 0 0 0 0 12 8 3 1 3 2 7 0",
 "0 0 11 2 3 1 5 2 10 0 0 11 13",
 "0 0 3 0 0 6 8 0 0 0 0 0 2",
 "0 0 11 3 3 10 11 2 3 2  3 2 8",
 "0 12 6 3 2 3 3 6 3 3 2 3 12",
 "0 11 4 2 3 2 2 11 12 13 13 13 0",
 "0 0 -3 12 7 8 13 13 4 5 4 10 0",
 "2",
 "0 0 TOP"
];
let _r = 0;
function readline() {
  return lines[_r++] || '';
}

//:: Control Variables
const map = [];
const isLocked = [];
let solutionTree = null;

//:: Initial Input
const [W, H] = readline().split(' ').map(Number);
for (let i = 0; i < H; i++) {
  const rooms = readline().split(' ').map(Number);

  map.push(rooms.map(r => String(Math.abs(r))));
  isLocked.push(rooms.map(s => s < 0))
}
const EX = parseInt(readline());
//console.error(map);
console.error({ EX, W, H });

//:: Paths
function move(y, x, d) {
  if (d === RIGHT) { return [y, x - 1]; }
  if (d === LEFT) { return [y, x + 1]; }
  if (d === TOP) { return [y + 1, x]; }
}

function moveOnRoom(map, room, y, x, d) {
  const nextD = PATHS[room][d];
  console.log(nextD)
  if (!nextD) { return {}; }
  const [nextY, nextX] = move(y, x, nextD);
  if (!isInsideMap(nextY, nextX)) { return {}; }

  const nextRoom = map[nextY][nextX];

  return { nextRoom, nextY, nextX, nextD };
}

function isExit(y, x) {
  return y === H - 1 && x === EX;
}

function isInsideMap(y, x) {
  return y >= 0 && x >= 0 && y < H && x < W;
}

//:: Solution Tree
function createSolutionTree(map, y, x, d) {
  const root = createNewNode(map[y][x], y, x, d, null);
  const queue = [root];
  const visited = {};

  while (queue.length) {
    const curNode = queue.pop();
    //console.error('-');
    //console.error(curNode);

    const { nextRoom, nextY, nextX, nextD } = moveOnRoom(map, curNode.room, curNode.y, curNode.x, curNode.d);
    
    if (curNode.id === '8-7-12') {
      console.error(curNode);
      console.error({ nextY, nextX, nextD, nextRoom });
      console.error(getRoomVariations(nextRoom, nextY, nextX, nextD));
    }

    if (!nextRoom) { continue; }
    //console.log(nextRoom)
    for (const [rotation, newRoom] of getRoomVariations(nextRoom, nextY, nextX, nextD)) {
      if (visited[newRoom.id]) { continue; }

      const newNode = createNewNode(newRoom, nextY, nextX, nextD, rotation);
      curNode.nextRooms.push(newNode);
      queue.unshift(newNode);
      visited[newRoom.id] = true;
    }
  }

  return root;
}

function getRoomVariations(room, y, x, d) {
  const nextRooms = [];

  if (!isInsideMap(y, x)) { return nextRooms; }

  if (PATHS[room][d] || isExit(y, x)) {
    nextRooms.push([null, room]);
  }

  if (isLocked[y][x] || !ROTATIONS[room].isWorthIt) { return nextRooms; }

  nextRooms.push([LEFT, ROTATIONS[room][LEFT]]);

  if (!ROTATIONS[room].isSingle) {
    nextRooms.push([RIGHT, ROTATIONS[room][RIGHT]]);
  }

  return nextRooms;
}

function createNewNode(room, y, x, d, rotation) {
  return { id: `${y}-${x}-${room}-${d}-${rotation}`, room, y, x, d, rotation, nextRooms: [] };
}

function findPath(solutionTree) {
  const path = {};
  const queue = [solutionTree];
  const visited = { [solutionTree.id]: true };

  while (queue.length) {
    const curNode = queue.pop();

    if (isNodeExit(curNode)) {
      return convertPath(curNode.id, path, solutionTree);
    }

    for (const nextRoom of curNode.nextRooms) {
      if (visited[nextRoom.id]) { continue; }

      queue.unshift(nextRoom);
      path[nextRoom.id] = curNode;
      visited[nextRoom.id] = true;
    }
  }

  return {};
}

function isNodeExit(node) {
  return isExit(node.y, node.x);
}

function convertPath(endId, path, startNode) {
  let node = path[endId];
  const convertedPath = [startNode];

  while(node) {
    convertedPath.unshift(node);
    node = path[node.id];
  }

  return convertedPath;
}

//:: Game Loop
let nodeIdx = 1;
let path = null;

while (true) {
  const [_x, _y, dir] = readline().split(' ');
  const x = Number(_x);
  const y = Number(_y);

  if (!solutionTree) {
    solutionTree = createSolutionTree(map, y, x, dir);
    path = findPath(solutionTree);
    console.error({ path })
    console.error(JSON.stringify(solutionTree));
  }

  //:: Rocks
  const R = parseInt(readline());
  for (let i = 0; i < R; i++) {
    const [xR, yR, dirR] = readline().split(' ');
  }

  const node = path[nodeIdx++];
  console.error({ node })
  if (node) {
    if (node.rotation)
      console.log(`${node.x} ${node.y} ${node.rotation}`);
    else
      console.log(WAIT);
  } else
    break;
}

