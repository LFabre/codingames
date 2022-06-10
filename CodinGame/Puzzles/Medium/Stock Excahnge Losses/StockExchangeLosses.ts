const n: number = parseInt(readline());
var inputs: number[] = readline().split(' ').map(Number);

let max = 0, loss = 0;
for (let i = 0; i < n; i++) {
    if (inputs[i] >= max) {
        max = inputs[i];
    } else if (inputs[i] - max < loss) {
        loss = inputs[i] - max;
    }
}

console.log(loss);
