
let boostUsed = false;
let cps = [];
let currentCp = 0;
let lastX = 0, lastY = 0;

function findCpIndex(cps, x, y) {
    return cps.findIndex ( ([_x, _y]) => x === _x && _y === y);    
}

function travelDistance(x, y, x1, y1) {
    return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
}

function getAngle(x, y, x1, y1) {
    return Math.atan2(y - y1, x - x1) * 180 / Math.PI
}

while (true) {
    var inputs = readline().split(' ');
    const posX = parseInt(inputs[0]);
    const posY = parseInt(inputs[1]);
    const nextCheckpointX = parseInt(inputs[2]); // x position of the next check point
    const nextCheckpointY = parseInt(inputs[3]); // y position of the next check point
    const nextCheckpointDist = parseInt(inputs[4]); // distance to the next checkpoint
    let nextCheckpointAngle = parseInt(inputs[5]); // angle between your pod orientation and the direction of the next checkpoint
    var inputs = readline().split(' ');
    const opponentX = parseInt(inputs[0]);
    const opponentY = parseInt(inputs[1]);

    let t = 100, x = nextCheckpointX, y = nextCheckpointY;
    let momentumAngle = Math.abs(getAngle(posX, posY, lastX, lastY));
    let a2 = Math.abs(getAngle(posX, posY, nextCheckpointX, nextCheckpointY));
    let diff = Math.abs(momentumAngle - a2)
    nextCheckpointAngle = Math.abs(nextCheckpointAngle);

    //let attackAngle = 
;
    console.error({ d: travelDistance(posX, posY, lastX, lastY), momentumAngle, a2, diff, nextCheckpointAngle });

    let cpIdx = findCpIndex(cps, x, y);
    if (cpIdx !== -1 && cps.length >= 2) {
        let nextCpIdx = cpIdx === cps.length - 1 ? 0 : cpIdx + 1;
        
        // Drift
        if (nextCheckpointDist < 1200 && travelDistance(posX, posY, lastX, lastY) > 450) {
           console.error('DRIFT')
           x = cps[nextCpIdx][0]
           y = cps[nextCpIdx][1]
           t = 75;
        }
    } else {
        cps.push([x, y]);
    }

    if (nextCheckpointAngle > 80) {
        t = 15;
    }

    if (nextCheckpointAngle > 90) {
        t = 10;
    }

    if (nextCheckpointAngle > 100) {
        t = 7;
    }

    if (nextCheckpointAngle > 110) {
        t = 5;
    }

    if (!boostUsed && nextCheckpointDist > 4000) {
        t = 'BOOST'
        boostUsed = true;
    }

    if (nextCheckpointDist < 1200 && diff > 40)
       t = t > 70 ? 70 : t;

    lastX = posX;
    lastY = posY;
    console.log(`${x} ${y} ${t}`);
}