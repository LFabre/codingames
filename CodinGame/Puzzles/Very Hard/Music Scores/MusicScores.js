//:: DEBUG
const paint = (char, startY, startX) => {
  for (let y = 0; y < WINDOW.length; y++) {
    for (let x = 0; x < WINDOW[y].length; x++) {
      imageMatrix[y + startY][x + startX] = char;
    }
  }
};

function imageMatrixToStr() {
  return imageMatrix
    .map((r, idx) => String(idx).padStart(3, '0') + r.join(''))
    .join('\n');
}

const imageString =
  'W 4090 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 1020 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 26 B 10 W 82 B 2 W 25 B 12 W 81 B 2 W 23 B 4 W 8 B 4 W 79 B 2 W 23 B 2 W 12 B 2 W 79 B 2 W 22 B 2 W 14 B 2 W 78 B 2 W 21 B 3 W 14 B 3 W 77 B 2 W 21 B 2 W 16 B 2 W 77 B 2 W 20 B 3 W 16 B 3 W 36 B 64 W 18 B 18 W 20 B 64 W 18 B 18 W 20 B 64 W 18 B 18 W 20 B 64 W 18 B 18 W 60 B 2 W 20 B 2 W 18 B 2 W 76 B 2 W 20 B 3 W 16 B 3 W 76 B 2 W 20 B 3 W 16 B 2 W 77 B 2 W 20 B 4 W 14 B 3 W 77 B 2 W 20 B 4 W 14 B 2 W 78 B 2 W 20 B 2 W 1 B 2 W 12 B 2 W 79 B 2 W 20 B 2 W 1 B 4 W 8 B 4 W 79 B 2 W 20 B 2 W 3 B 12 W 81 B 2 W 20 B 2 W 4 B 10 W 82 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 96 B 2 W 20 B 2 W 56 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 46 B 10 W 4 B 2 W 20 B 2 W 81 B 12 W 3 B 2 W 20 B 2 W 79 B 16 W 1 B 2 W 20 B 2 W 79 B 16 W 1 B 2 W 20 B 2 W 78 B 20 W 20 B 2 W 77 B 21 W 20 B 2 W 77 B 21 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 76 B 22 W 20 B 2 W 77 B 20 W 21 B 2 W 77 B 20 W 21 B 2 W 78 B 18 W 22 B 2 W 79 B 16 W 23 B 2 W 79 B 16 W 23 B 2 W 81 B 12 W 25 B 2 W 56 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 2420 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 5050';

let i = 0;
const readline = () => {
  return i++ === 0 ? '120 176' : imageString;
};

// :: Constants
const Q = 'Q';
const H = 'H';
const CHAR = {
  B: '#',
  W: ' ',
};

const NOTE_REGIONS = [
  [86, 106, 'A'],
  [74, 94, 'B'],
  [62, 82, 'C'],
  [146, 166, 'C'],
  [50, 70, 'D'],
  [134, 154, 'D'],
  [38, 58, 'E'],
  [122, 142, 'E'],
  [26, 46, 'F'],
  [110, 130, 'F'],
  [14, 34, 'G'],
  [98, 118, 'G'],
];

const WINDOW_MID = [3, 11];
const WINDOW = [
  '###                ###',
  '##                  ##',
  '##                  ##',
  '##                  ##',
  '##                  ##',
  '##                  ##',
  '###                ###',
].map(line => line.split(''));

const imageMatrix = [];
const response = [];

// :: Build Image Matrix
const [width, height] = readline().split(' ').map(Number);
const imageArray = readline().split(' ');

let row = [];
for (let i = 0; i < imageArray.length - 1; i += 2) {
  const color = imageArray[i];
  let count = Number(imageArray[i + 1]);

  while (count > 0) {
    const pixelsToAdd = Math.min(width, count);
    row.push(...Array(pixelsToAdd).fill(CHAR[color]));

    if (row.length > width) {
      imageMatrix.push(row.splice(0, width));
    }

    count -= pixelsToAdd;
  }
}

// :: Core
const compareWindow = (startY, startX) => {
  for (let y = 0; y < WINDOW.length; y++) {
    for (let x = 0; x < WINDOW[y].length; x++) {
      if (WINDOW[y][x] === ' ') continue;

      if (WINDOW[y][x] !== imageMatrix[y + startY][x + startX]) {
        return false;
      }
    }
  }

  return true;
};

const findNote = (top, bottom) => {
  const region = NOTE_REGIONS.find(r => r[0] <= top && bottom <= r[1]);
  if (!region) {
    console.error(top, bottom);
  }
  return region[2];
};

const identifyNoteType = (y, x) => {
  return imageMatrix[y + WINDOW_MID[0]][x + WINDOW_MID[1]] === CHAR.B ? Q : H;
};

for (let x = 0; x < imageMatrix[0].length - WINDOW[0].length; x++) {
  for (let y = 0; y < imageMatrix.length - WINDOW.length; y++) {
    if (compareWindow(y, x)) {
      console.error({ y, x });
      response.push(findNote(y, y + WINDOW.length) + identifyNoteType(y, x));
    }
  }
}

console.log(response.join(' '));
console.log(imageMatrixToStr());
