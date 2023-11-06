const [ WIDTH, HEIGHT ] = [120, 176];
const IMAGE = 'W 4090 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 1040 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 58 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 80 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 118 B 2 W 58 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 66 B 10 W 4 B 2 W 103 B 12 W 3 B 2 W 101 B 16 W 1 B 2 W 101 B 16 W 1 B 2 W 100 B 20 W 99 B 21 W 99 B 21 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 98 B 22 W 99 B 20 W 100 B 20 W 101 B 18 W 103 B 16 W 104 B 16 W 106 B 12 W 63 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 2420 B 100 W 20 B 100 W 20 B 100 W 20 B 100 W 5050'
  .split(' ');

const W = 'W';
const B = 'B';

function getColorChar (c) {
    return c === W ? ' ' : '#';
}

function imageMatrixToStr (image) {
  return image.map(r => r.join('')).join('\n');
}

const image = [];
let row = [];

for (let i = 0; i < IMAGE.length - 1; i += 2) {
    const color = IMAGE[i];
    let count = Number(IMAGE[i + 1]);

    while (count > 0) {
        const pixelsToAdd = Math.min(WIDTH, count);
        row.push(...Array(pixelsToAdd).fill(getColorChar(color)))

        if (row.length > WIDTH) {
            image.push(row.splice(0, WIDTH))
        }

        count -= pixelsToAdd;
    }
}

console.log(imageMatrixToStr(image))