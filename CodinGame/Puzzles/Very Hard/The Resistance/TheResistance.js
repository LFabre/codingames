const CODES = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
};

// To reduce memory the morse sequence will be stored as a global variable
// this way it won't be copied on every function call.
let SEQUENCE = ''

function wordToCode(word) {
  let code = ''
  for (const c of word)
      code += CODES[c];

  return code;
}

function wordsToCode(words) {
  const codeMap = {};
  let longestCode = 0;

  for (const w of words) {
      const code = wordToCode(w);
      codeMap[code] ? codeMap[code]++ : codeMap[code] = 1;

      if (longestCode < code.length)
          longestCode = code.length;
  }

  return { codeMap, longestCode };
}

function solve(codeMap, longestCode, startIdx, cache = {}) {
  if (startIdx === SEQUENCE.length) {
      return 1;
  }

  if (cache[startIdx] !== undefined) {
      return cache[startIdx];
  }

  let ret = 0;
  for (let i = 1; i <= longestCode && startIdx + i <= SEQUENCE.length; i++) {
      const sub = SEQUENCE.substring(startIdx, startIdx + i);

      if (codeMap[sub]) {
          ret += codeMap[sub] * solve(codeMap, longestCode, startIdx + i, cache);
      }
  }

  return cache[startIdx] = ret;
}

//:: Core
SEQUENCE = readline();
const words = [];
const codeWords = [];

const N = parseInt(readline());
for (let i = 0; i < N; i++) {
  words.push(readline().toUpperCase());
}

const { codeMap, longestCode } = wordsToCode(words);

console.log(solve(codeMap, longestCode, 0));
