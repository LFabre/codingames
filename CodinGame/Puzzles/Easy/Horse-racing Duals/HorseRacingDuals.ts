const horses: number[] = [];

const N: number = parseInt(readline());
for (let i = 0; i < N; i++) {
    horses.push(parseInt(readline()));
}

horses.sort((a,b) => a - b);
let minDist = Infinity;

for (let i = 0; i < horses.length - 1; i++) {
    const d = horses[i + 1] - horses[i];

    if (d < minDist) {
        minDist = d;
    }
}

console.log(minDist);
