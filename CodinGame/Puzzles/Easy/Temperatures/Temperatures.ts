const n : number = parseInt(readline());
const inputs : number[] = readline().split(' ').map(Number);

let r = Infinity;
for (let i = 0; i < inputs.length; i++) {
    const t : number = inputs[i];

    if (Math.abs(t) < Math.abs(r) || (t > 0 && -t === r))
        r = t;
}

console.log(r);
