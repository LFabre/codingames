const LAND = '#';
const LAKE = 'O';

const W = parseInt(readline());
const H = parseInt(readline());
const SIZE = H * W;

const indexesToTest = [];
let map = [];

//:: Simple
function calculateLakeSurfaceSimple(map, idx, visited = []) {

  let surface = 0;
  const openList = [idx];

  while (openList.length) {
    const _i = openList.pop();

    if (map[_i] === LAKE && !visited[_i]) {

      visited[_i] = String(idx);

      // THIS IS VERY IMPORTANT WHEN USING SINGLE ARRAY
      let isEdgeRight = _i % W === (W - 1);
      let isEdgeLeft = _i % W === 0;

      if (!isEdgeRight && _i + 1 >= 0 && _i + 1 < SIZE) { openList.push(_i + 1); }
      if (!isEdgeLeft && _i - 1 >= 0 && _i - 1 < SIZE) { openList.push(_i - 1); }
      if (_i + W >= 0 && _i + W < SIZE) { openList.push(_i + W); }
      if (_i - W >= 0 && _i - W < SIZE) { openList.push(_i - W); }

      surface++;
    }
  }

  return surface;
}

for (let i = 0; i < H; i++) {
  map.push(...(readline().split('')));
}

const visitedCache = new Array(SIZE);
const surfaceCache = {};

const N = parseInt(readline());
for (let i = 0; i < N; i++) {
  const [x, y] = readline().split(' ').map(Number);
  let i = y * W + x;
  let surface;

  if (visitedCache[i]) {
    surface = surfaceCache[String(visitedCache[i])];
  } else {
    surface = calculateLakeSurfaceSimple(map, i, visitedCache);
    surfaceCache[String(i)] = surface;
  }

  console.log(surface);
}
