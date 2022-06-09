const L = parseInt(readline());
const H = parseInt(readline());
const T = readline();

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?'.split('');
const alph = {}

for (let i = 0; i < H; i++) {
  const matches = readline().match(new RegExp(`.{1,${L}}`, 'g'));

  for (let i = 0; i < chars.length; i++) {
    if (alph[chars[i]])
      alph[chars[i]].push(matches[i]);
    else
      alph[chars[i]] = [matches[i]]
  }
}

const textSplit = T.split('').map(c => alph[c.toUpperCase()] || alph['?']);

for (let i = 0; i < H; i++) {
  console.log(textSplit.reduce((r, c) => r += c[i], ''));
}
