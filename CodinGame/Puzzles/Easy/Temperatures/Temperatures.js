const n = parseInt(readline());
const inputs = readline().split(' ').map(Number);

let r = Infinity;
for (let i = 0; i < inputs.length; i++) {
    const t = inputs[i];

    if (Math.abs(t) < Math.abs(r) || (t > 0 && -t === r))
        r = t;
}

console.log(r);
