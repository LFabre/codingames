const POINTS = {
  'e': 1,
  'a': 1,
  'i': 1,
  'o': 1,
  'n': 1,
  'r': 1,
  't': 1,
  'l': 1,
  's': 1,
  'u': 1,
  'd': 2,
  'g': 2,
  'b': 3,
  'c': 3,
  'm': 3,
  'p': 3,
  'f': 4,
  'h': 4,
  'v': 4,
  'w': 4,
  'y': 4,
  'k': 5,
  'j': 6,
  'x': 6,
  'q': 10,
  'z': 10,
}

const words = [];
const N = parseInt(readline());

for (let i = 0; i < N; i++) {
  words.push(readline().split(''));
}

const letterMap = readline().split('').reduce((r, l) => {
  r[l] ? r[l]++ : r[l] = 1;
  return r;
}, {});

let maxPoits = Number.MIN_VALUE;
let winner = '';

for (let w of words) {
  let points = 0;
  let letterCount = JSON.parse(JSON.stringify(letterMap));

  for (let c of w) {
      if (!letterCount[c] || !letterCount[c]--) {
          points = 0;
          break;
      }

      points += POINTS[c];
  }

  if (points > maxPoits) {
      maxPoits = points;
      winner = w;
  }
}

console.log(winner.join(''));
