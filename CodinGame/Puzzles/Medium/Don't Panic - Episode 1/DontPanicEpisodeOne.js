
var inputs = readline().split(' ').map(Number);

const W = inputs[1]; // width of the area
const exitFloor = inputs[3]; // floor on which the exit is found
const exitPos = inputs[4]; // position of the exit on its floor
const nbElevators = inputs[7]; // number of elevators

const elevators = { [exitFloor]: exitPos };
for (let i = 0; i < nbElevators; i++) {
    const [y,x] = readline().split(' ').map(Number);
    elevators[y] = x;
}

while (true) {
    const [y, x, d] = readline().split(' ');

    if (d === 'LEFT' && elevators[y] > +x || d === 'RIGHT' && elevators[y] < +x)
        console.log('BLOCK');
    else
        console.log('WAIT');
}
