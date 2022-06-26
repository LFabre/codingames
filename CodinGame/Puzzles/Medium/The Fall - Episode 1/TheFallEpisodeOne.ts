const ROOMS = {
  '0': {
      'TOP': '',
      'LEFT': '',
      'RIGHT': ''
  },
  '1': {
      'TOP': 'TOP',
      'LEFT': 'TOP',
      'RIGHT': 'TOP'
  },
  '2': {
      'TOP': '',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
  },
  '3': {
      'TOP': 'TOP',
      'LEFT': '',
      'RIGHT': ''
  },
  '4': {
      'TOP': 'LEFT',
      'LEFT': '',
      'RIGHT': 'TOP'
  },
  '5': {
      'TOP': 'RIGHT',
      'LEFT': 'TOP',
      'RIGHT': ''
  },
  '6': {
      'TOP': '',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
  },
  '7': {
      'TOP': 'TOP',
      'LEFT': '',
      'RIGHT': 'TOP'
  },
  '8': {
      'TOP': '',
      'LEFT': 'TOP',
      'RIGHT': 'TOP'
  },
  '9': {
      'TOP': 'TOP',
      'LEFT': 'TOP',
      'RIGHT': ''
  },
  '10': {
      'TOP': 'LEFT',
      'LEFT': '',
      'RIGHT': ''
  },
  '11': {
      'TOP': 'RIGHT',
      'LEFT': '',
      'RIGHT': ''
  },
  '12': {
      'TOP': '',
      'LEFT': '',
      'RIGHT': 'TOP'
  },
  '13': {
      'TOP': '',
      'LEFT': 'TOP',
      'RIGHT': ''
  },
}

const [W, H] = readline().split(' ').map(Number);
const map: string[][] = [];

for (let i = 0; i < H; i++) {
  map.push(readline().split(' '));
}
const _: string = readline();

function move(y: number, x: number, d: string): string {
  if (d === 'LEFT') { return `${x - 1} ${y}` }
  if (d === 'RIGHT') { return `${x + 1} ${y}` }
  if (d === 'TOP') { return `${x} ${y + 1}` }
}

while (true) {
  const [_x, _y, dir] = readline().split(' ');
  const x = Number(_x);
  const y = Number(_y);

  console.log(move(y, x, ROOMS[map[y][x]][dir]));
}
