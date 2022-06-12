const N: number = parseInt(readline());
const coords: number [][] = [];
let minX: number = Number.MAX_VALUE;
let maxX: number = Number.MIN_VALUE;

for (let i = 0; i < N; i++) {
    const [ x, y ] = readline().split(' ').map(Number);
    coords.push([y, x]);

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
}

// Sort by Y
coords.sort((a,b) => a[0] - b[0]);

const mid = coords[Math.floor(coords.length / 2)];
let sum = maxX - minX;

for (let c of coords) {
    sum += Math.abs(mid[0] - c[0])
}

console.log(sum);