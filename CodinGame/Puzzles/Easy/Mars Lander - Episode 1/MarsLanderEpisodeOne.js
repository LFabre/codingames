const H = 3000;
const W = 7000;
const MAX_POWER = 4;
const MIN_POWER = 0;

const surfaceN = parseInt(readline()); // the number of points used to draw the surface of Mars.
for (let i = 0; i < surfaceN; i++) {
  var inputs = readline().split(' '); // This must be read. Do not remove this line;  
}

function clampPower(p) {
  return Math.min(Math.max(p, MIN_POWER), MAX_POWER);
}

while (true) {
  var inputs = readline().split(' ');  
  const vSpeed = parseInt(inputs[3]); // the vertical speed (in m/s), can be negative. 
  const power = parseInt(inputs[6]); // the thrust power (0 to 4).

  const p = vSpeed < -39 ? power + 1 : power - 1;
  console.log(`0 ${clampPower(p)}`);
}
