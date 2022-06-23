const width = parseInt(readline()); // the number of cells on the X axis
const height = parseInt(readline()); // the number of cells on the Y axis

const grid = [];

for (let i = 0; i < height; i++) {
    grid.push(readline().split(''));
}

function checkRight (grid, x, y) {
    for (let i = x + 1; i < width; i++) {
        if (grid[y][i] === '0')
            return i;
    }
    
    return -1;
}

function checkDown (grid, x, y) {
    for (let i = y + 1; i < height; i++) {
        if (grid[i][x] === '0')
            return i;
    }
    
    return -1;
}

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        let x2 = -1, y2 = -1, x3 = -1, y3 = -1;

        if (grid[y][x] === '0') {
            const d = checkDown(grid, x, y);
            const r = checkRight(grid, x, y);

            if (d !== -1) {
                x3 = x;
                y3 = d;
            }

            if (r !== -1) {
                x2 = r;
                y2 = y;
            }

            console.log(`${x} ${y} ${x2} ${y2} ${x3} ${y3}`);
        }
    }
}
