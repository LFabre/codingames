const S = 'RIGHT';
const H = 1;
const O = 1;

const pos = O - 1;

if (S === "LEFT") {
  for (let i = 0; i < H; i++) {
    console.log(' '.repeat(i) + (i === pos ? '\\O' : '\\'));
  }
} else {
  for (let i = 0; i < H; i++) {
    const spaces = H - i;
    const accountForOlaf = Math.max(i === pos ? spaces - 2 : spaces - 1, 0);

    console.log(' '.repeat(accountForOlaf) + (i === pos ? 'O/' : '/'));
  }
}
