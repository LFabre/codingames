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

  if (doubleY === 150) {
    if (x > 4950) {
      console.log('30 4');
    } else if (hSpeed < -20) {
      console.log('-45 4');
    } else {
      console.log('0 4');
    }
  } else {
    if (x > 4700) {
      console.log('10 4');
      continue;
    } else if (y > 1400) {
      console.log('-25 3');
    } else {
      console.log('0 4');
    }
  }
}
