var inputs: string[] = readline().split(' ');
const lx: number = parseInt(inputs[0]); // the X position of the light of power
const ly: number = parseInt(inputs[1]); // the Y position of the light of power
let x: number = parseInt(inputs[2]); // Thor's starting X position
let y: number = parseInt(inputs[3]); // Thor's starting Y position

while (true) {    
    const remainingTurns: number = parseInt(readline()); // The remaining amount of turns Thor can move. Do not remove this line.

    let m = '';

    y !== ly ? (y < ly ? (y++, m += 'S') : (y--, m += 'N')) : '';
    x !== lx ? (x < lx ? (x++, m += 'E') : (x--, m += 'W')) : '';
  
    console.log(m);
}
