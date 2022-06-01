const H = 3000;
const W = 7000;
const MAX_POWER = 4;
const MIN_POWER = 0;

function clampPower(p: number): number {
    return Math.min(Math.max(p, MIN_POWER), MAX_POWER);
}

const surfaceN: number = parseInt(readline()); // the number of points used to draw the surface of Mars.
for (let i = 0; i < surfaceN; i++) {
    var inputs: string[] = readline().split(' '); // This must be read. Do not remove this line; 
}

// game loop
while (true) {
    var inputs: string[] = readline().split(' ');
    const vSpeed: number = parseInt(inputs[3]); // the vertical speed (in m/s), can be negative.    
    const power: number = parseInt(inputs[6]); // the thrust power (0 to 4).

    const p = vSpeed < -39 ? power + 1 : power - 1;
    console.log(`0 ${clampPower(p)}`);
}
