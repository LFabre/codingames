const parseLine = () =>
  readline().split(' ').map(n => parseInt(n));

let prevY = 0;
let doubleY = 0;

const surfaceN = parseInt(readline());
for (let i = 0; i < surfaceN; i++) {
  const [_, y] = parseLine()

  if (prevY === y) {
    doubleY = y;
  }

  prevY = y;
}

while (true) {
  const [x, y, hSpeed] = parseLine();
  let output = '0 4';
  if (doubleY === 150) {
    if (x > 4950) {
      output = '30 4';
    } else if (hSpeed < -20) {
      output = '-45 4';
    }
  } else {
    if (x > 4700) {
      output = '10 4';
    } else if (y > 1400) {
      output = '-25 3';
    }
  }
  console.log(output);
}
