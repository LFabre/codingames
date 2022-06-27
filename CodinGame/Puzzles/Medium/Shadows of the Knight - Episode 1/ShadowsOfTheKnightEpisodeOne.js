const [W, H ] = readline().split(' ').map(Number);
const N = Number(readline());

const [X0, Y0] = readline().split(' ').map(Number);

let x = X0, xHigh = W, xLow = 0;
let y = Y0, yHigh = H, yLow = 0;

while (true) {
  const bombDir = readline();

  for (let d of bombDir.split('')) {
    if (d === 'R' || d === 'L') {
      d === 'R' ? xLow = x : xHigh = x;
      x = (xHigh + xLow) >> 1;
    }

    if (d === 'D' || d === 'U') {
      d === 'D' ? yLow = y : yHigh = y;
      y = (yHigh + yLow) >> 1;
    }
  }

  console.log(`${x} ${y}`);
}
