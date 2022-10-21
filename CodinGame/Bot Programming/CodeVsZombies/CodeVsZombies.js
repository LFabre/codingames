// Consts
BOARD_WIDTH = 16000;
BOARD_HEIGHT = 9000;

ASH_SPEED = 1000;
ASH_RANGE = 2000;
ASH_RANGE_SPEED = ASH_RANGE + ASH_SPEED;

ZOMBIE_SPEED = 400;

// Ash Move
function dispatchMovement(x, y) {
  console.log(`${x} ${y}`)
}

// Math
function distance(x, y, x1, y1) {
  return Math.round(Math.sqrt(Math.pow(x - x1, 2), Math.pow(y - y1, 2)));
}

function getClosestElement(x, y, elements) {
  let idx = -1, d = Infinity;
  for (let i = 0; i < elements.length; i++) {
    let _d = distance(x, y, elements[i].x, elements[i].y)
    if (_d < d) {
      idx = i;
      d = _d;
    }
  }

  return { element: elements[idx], distance: d };
}

function turnsToReachCoordinate(x, y, x1, y1, speed) {
  return distance(x, y, x1, y1) / speed;
}

function turnsToInteractCoordinate(x, y, x1, y1, speed, range) {
  return (distance(x, y, x1, y1) - range) / speed;
}

function zombieTurnsToReachCoordinate(zombie, x, y) {
  return turnsToReachCoordinate(zombie.x1, zombie.y1, x, y, ZOMBIE_SPEED);
}

function ashTurnsToReachCoordinate(ash, x, y) {
  return turnsToReachCoordinate(ash.x, ash.y, x, y, ASH_SPEED);
}

function ashTurnsToInteractCoordinate(ash, x, y) {
  return turnsToInteractCoordinate(ash.x, ash.y, x, y, ASH_SPEED, ASH_RANGE);
}

function canAshReachBeforeZombie(ash, zombie, x, y) {  
  return ashTurnsToReachCoordinate(ash, x, y) < zombieTurnsToReachCoordinate(zombie, x, y);
}

function canAshInteractBeforeZombie(ash, zombie, x, y) {
  return ashTurnsToInteractCoordinate(ash, x, y) < zombieTurnsToReachCoordinate(zombie, x, y);
}

// Strategies
// Hunt for zoombies - Going for the closest one to Ash
function hunter(ash, zombies) {
  if (!zombies.length) { return; }

  const { element: closestZombie } = getClosestElement(ash.x, ash.y, zombies);
  return { x: closestZombie.x1, y: closestZombie.y1 };
}

// Hunt for zombies - Going for the closest one to a human
function hunterDefender(zombies, humans) {
  if (!zombies.length || !humans.length) { return; }

  let closestZombie = null, _d = Infinity;
  for (let h of humans) {
    let { element, distance } = getClosestElement(h.x, h.y, zombies);
    if (distance < _d) {
      closestZombie = element;
      _d = distance;
    }
  }

  if (!closestZombie) { return; }
  
  return { x: closestZombie.x1, y: closestZombie.y1 }
}

// Hunt for zoombies - Going for the closest one to a human, ignores the ones whoc can't be saved
function hunterDefenderColdBlood(ash, zombies, humans) {
  if (!zombies.length || !humans.length) { return; }

  let closestZombie = null, _d = Infinity;
  for (let h of humans) {
    let { element, distance } = getClosestElement(h.x, h.y, zombies);
    
    if (distance < _d && canAshInteractBeforeZombie(ash, element, h.x, h.y)) {
      closestZombie = element;
      _d = distance;
    }
  }

  if (!closestZombie) { return; }

  return { x: closestZombie.x1, y: closestZombie.y1 };
}

// Input Parser
function parseHumanInput() {
  let inputs = readline().split(' ');
  return {
    id: parseInt(inputs[0]),
    x: parseInt(inputs[1]),
    y: parseInt(inputs[2])
  };
}

function parseZombieInput() {
  let [ id, x, y, x1, y1 ] = readline().split(' ');
  return {
    id: parseInt(id),
    x: parseInt(x),
    y: parseInt(y),
    x1: parseInt(x1),
    y1: parseInt(y1)
  };
}

const ash = { x: 0, y: 0 };

while (true) {
  let zombies = [], humans = []

  var inputs = readline().split(' ');
  ash.x = parseInt(inputs[0]);
  ash.y = parseInt(inputs[1]);

  const humanCount = parseInt(readline());
  for (let i = 0; i < humanCount; i++) {
    humans.push(parseHumanInput());
  }

  const zombieCount = parseInt(readline());
  for (let i = 0; i < zombieCount; i++) {
    zombies.push(parseZombieInput());
  }

  const c = hunterDefenderColdBlood(ash, zombies, humans) || hunterDefender(zombies, humans);
  dispatchMovement(c.x, c.y);
}
