const BASE = 20;
const [W, H] = readline().split(' ').map(Number);

const numbers = new Array(BASE).fill('');
let mayanNumber = [], mayanNumber1 = [];

function readMayanNumber(numberSize) {
  let n = '', mayanNumber = [];

  for (let i = 0; i < numberSize; i++) {
    n += readline();

    if (i % H === (H - 1)) {
      mayanNumber.push(n);
      n = '';
    }
  }

  return mayanNumber;
}

function mayanToInt(mayanNumber, numbers) {
  const _int = mayanNumber.map(e => numbers.indexOf(e)).reverse();
  return _int.reduce((r, e, i) => r + (e * Math.pow(BASE, i)), 0);
}

function calculator(op, mn1, mn2, numbers) {
  const n1 = mayanToInt(mn1, numbers);
  const n2 = mayanToInt(mn2, numbers);

  switch (op) {
    case '+': return n1 + n2;
    case '-': return n1 - n2;
    case '*': return n1 * n2;
    case '/': return n1 / n2;
  }
}

function intToMayan(_int, numbers) {
  const chars = Number(_int).toString(BASE).split('');
  const n = chars.map(c => isNaN(Number(c)) ? c.charCodeAt(0) - 87 : Number(c));

  return n.reduce((r, e) => {
    r += numbers[e];
    return r;
  }, '');
}

function printMayanString(str, w) {
  for (let i = 0; i < str.length; i += w) {
    console.log(str.substring(i, i + w));
  }
}

// Parse All numbers
for (let i = 0; i < H; i++) {
  const matches = readline().match(new RegExp(`.{1,${W}}`, 'g'));
  matches.forEach((m, i) => { numbers[i] += m });
}

mayanNumber = readMayanNumber(parseInt(readline()));
mayanNumber1 = readMayanNumber(parseInt(readline()));

const result = calculator(readline(), mayanNumber, mayanNumber1, numbers);
const mayanResult = intToMayan(result, numbers);

printMayanString(mayanResult, W);
