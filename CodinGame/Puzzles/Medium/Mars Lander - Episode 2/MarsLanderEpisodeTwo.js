//:: Consts
const WIDTH = 7000;
const HEIGHT = 3000;
const MAX_FLAT_WIDTH = 1000;

const MAX_ANGLE = 90;
const MIN_ANGLE = -90;
const ANGLE_INC = 15;

const MAX_THRUST = 4;
const MIN_THRUST = 0;
const THRUST_INC = 1;

const MAX_VERTICAL_SPEED = 40;
const MAX_HORIZONTAL_SPEED = 20;

const G = 3.711;

//:: Surface
function parseSurface () {
    const surface = [];
    const flatSurface = [];
    const pointsCount = parseInt(readline());

    let previousY = null, previousX = null;
    for (let i = 0; i < pointsCount; i++) {
        const [x, y] = readline().split(' ').map(Number);

        surface.push([y, x]);

        if (previousY === y)
            flatSurface.push([y, previousX], [y, x]);
        
        previousX = x;
        previousY = y;
    }

    return { surface, flatSurface };
}

function distanceToFlatSurface(y, x, flatSurface) {
    const verticalDistance = flatSurface[0][0] - y;
    let horizontalDistance

    if (x >= flatSurface[0][1] - 400 && x <= flatSurface[1][1] - 400)
        horizontalDistance = 0;
    else if (x < flatSurface[0][1])
        horizontalDistance = flatSurface[0][1] - x - 400;
    else
        horizontalDistance = x - flatSurface[1][1] - 400;

    return { horizontalDistance, verticalDistance };
}

//:: Physics
function getAcelarations(previousState, currentHS, currentVS) {
    return {
        ha: currentHS - previousState.hs || previousState.ha,
        va: currentVS - previousState.vs || previousState.va,
    }
}

function getDesiredAcelartion(v, v0, d) {
    return (Math.pow(v, 2) - Math.pow(v0, 2)) / (2 * d);
}

function getHorizontalThrustForce(t, ang) {    
    return Math.round(t * Math.cos(ang * (Math.PI / 180)) * 100) / 100;
}

function getVerticalThrustForce(t, ang) {
    return Math.round(t * Math.sin(ang * (Math.PI / 180)) * 100) / 100;
}

function decomposeThrustForce(t, ang) {
    return {
        hf: getHorizontalThrustForce(t, ang),
        vf: getVerticalThrustForce(t, ang)
    }
}

//:: Controller
function incAngle(a) { return a + ANGLE_INC; }
function decAngle(a) { return a - ANGLE_INC; }
function incThrust(t) { return t + THRUST_INC; }
function decThrust(t) { return t - THRUST_INC; }

function getNewTrhust(t, t1) {
    return t1 === t ? t : t1 > t ? incThrust(t) : decThrust(t);
}

function getNewAngle(a, a1) {
    return a1 === a ? a : a1 > a ? incAngle(a) : decAngle(a);
}

function setState(state, x, y, hs, vs, ha, va, ang, t) {
    state.x = x;
    state.y = y;
    state.hs = hs;
    state.vs = vs;
    state.ha = ha;
    state.va = va;
    state.ang = ang;
    state.t = t;

    return state;
}

function setThrustAngle(currentState, t, ang) {
    currentState.t = getNewTrhust(currentState.t, t);
    currentState.ang = getNewAngle(currentState.ang, ang);

    return currentState;
}

function findBestThrustAngle(state, desiredHa, desiredVa) {
    let bestT = -Infinity, bestAng = -Infinity;
    let bestHa = Infinity, bestVa = Infinity

    for (let ang = MIN_ANGLE; ang <= MAX_ANGLE; ang += ANGLE_INC) {
        for (let t = MIN_THRUST; t <= MAX_THRUST; t += THRUST_INC) {
            const { hf, vf } = decomposeThrustForce(t, ang);

            let newHa = state.ha + hf;
            let newVa = state.va + vf;

            if (Math.abs(desiredHa - newHa) < bestHa) {
                bestHa = Math.abs(desiredHa - newHa);
                bestT = t;
                bestAng = ang;
            }

            // if (bestVa < Math.abs(desiredVa - newVa)) {
            //     bestVa = Math.abs(desiredVa - newVa);
            //     bestT = t;
            //     bestAng = ang;
            // }
        }
    }

    return { t: bestT, ang: bestAng };
}

//:: States
const { surface, flatSurface } = parseSurface();
const currentState = { 
    ang: null, t: null,
    hs: null, vs: null,
    ha: null, va: null,
    x: null, y: null
};
const desiredState = { 
    ang: 0, t: 0,
    hs: null, vs: null,
    ha: null, va: null,
    x: null, y: null
};

//:: Game Loop
while (true) {
    const [x, y, hs, vs, f, ang, t] = readline().split(' ').map(Number);

    const { ha, va } = getAcelarations(currentState, hs, vs);
    setState(currentState, x, y, hs, vs, ha, va, ang, t);

    const {
        horizontalDistance,
        verticalDistance
    } = distanceToFlatSurface(y, x, flatSurface);

    const desiredHa = getDesiredAcelartion(MAX_HORIZONTAL_SPEED, hs, horizontalDistance);
    const desiredVa = getDesiredAcelartion(MAX_VERTICAL_SPEED, vs, verticalDistance);

    const {
        t: newT,
        ang: newAng
    } = findBestThrustAngle(currentState,  Math.ceil(desiredHa), Math.ceil(desiredVa))
    
    setThrustAngle(currentState, newT, newAng);

    // Panel
    console.error(currentState);
    console.error({ horizontalDistance, verticalDistance });
    console.error({ desiredHa, desiredVa });
    console.error({ newT, newAng });

    console.log(`${currentState.ang} ${currentState.t}`);
    //console.log(`0 0`);
}
