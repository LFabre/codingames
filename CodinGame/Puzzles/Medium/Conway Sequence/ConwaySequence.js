const R = readline();
let L = parseInt(readline()) - 1;

function nextLine(previousLine)  {
    let line = '', marker = previousLine[0], count = 0;

    for (let c of previousLine) {
        if (marker !== c) {
            line += `${count} ${marker} `;

            marker = c;
            count = 1;
        } else {
            count++;
        }
    }

    line += `${count} ${marker}`;

    return line;
}

let line = R;
while (L--) {
    line = nextLine(line.split(' '));
}

console.log(line.trim());