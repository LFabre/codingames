type CodePair = [number, number];

const code: CodePair[] = [];
const binMsg = readline().split('').map(c => c.charCodeAt(0).toString(2).padStart(7, '0')).join('');

let marker = binMsg[0], counter = 0;
for (let i = 0; i <= binMsg.length; i++) {
    if (binMsg[i] === marker)
        counter++;
    else {
        code.push([Number(marker), counter]);
        marker = binMsg[i];
        counter = 1;
    }
}

function codeToStr(c: number, n: number): string {
    return `${'0'.repeat(2 - c)} ${'0'.repeat(n)} `;
}

console.log(
    code.reduce((r, [c, n]) => r += codeToStr(c, n), '').trim()
);
