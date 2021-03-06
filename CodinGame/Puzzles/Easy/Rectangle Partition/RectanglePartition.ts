const [W, H, countX, countY] = readline().split(' ').map(Number);

const cutsX: number[] = [0, W];
const _cutsX: number[] = [W];
const cutsY: number[] = [0, H];
const _cutsY: number[] = [H];

// X
for (const c of readline().split(' ').map(Number)) {
    cutsX.forEach(x => _cutsX.push(Math.abs(x - c)));
    cutsX.push(c);
}

// Y
for (const c of readline().split(' ').map(Number)) {
    cutsY.forEach(y => _cutsY.push(Math.abs(y - c)));
    cutsY.push(c);
}

const count = _cutsX.reduce((r, x) => {
    _cutsY.forEach(y => y === x ? r++ : r, 0);
    return r;
}, 0);

console.log(count);
