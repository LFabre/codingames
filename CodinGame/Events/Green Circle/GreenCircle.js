const CARD_TYPE = {
  TRAINING: '0',
  CODING: '1',
  DAILY_ROUTINE: '2',
  TASK_PRIORITIZATION: '3',
  ARCHITECTURE_STUDY: '4',
  CONTINUOUS_INTEGRATION: '5',
  CODE_REVIEW: '6',
  REFACTORING: '7',
  BONUS: '8',
  TECHNICAL_DEBT: '9'
};

const CARD_LOCATION = {
  HAND: 'HAND',
  DRAW: 'DRAW',
  DISCARD: 'DISCARD',
  OPPONENT_CARDS: 'OPPONENT_CARDS'
};

const GAME_PHASE = {
  MOVE: 'MOVE',
  GIVE_CARD: 'GIVE_CARD',
  THROW_CARD: 'THROW_CARD',
  PLAY_CARD: 'PLAY_CARD',
  RELEASE: 'RELEASE'
};

const COMMANDS = {
  RANDOM: 'RANDOM',
  WAIT: 'WAIT',
  MOVE: 'MOVE',
  GIVE: 'GIVE',
  RELEASE: 'RELEASE',
  TRAINING: 'TRAINING',
  ARCHITECTURE_STUDY: 'ARCHITECTURE_STUDY',
  CODE_REVIEW: 'CODE_REVIEW',
  REFACTORING: 'REFACTORING'
};

//:: Parsers
function parseApplications() {
  const applications = [];

  const count = parseInt(readline());
  for (let i = 0; i < count; i++) {
    const inputs = readline().split(' ');
    applications.push({
      objectType: inputs[0],
      id: parseInt(inputs[1]),
      requirements: {
        [CARD_TYPE.TRAINING]: parseInt(inputs[2]),
        [CARD_TYPE.CODING]: parseInt(inputs[3]),
        [CARD_TYPE.DAILY_ROUTINE]: parseInt(inputs[4]),
        [CARD_TYPE.TASK_PRIORITIZATION]: parseInt(inputs[5]),
        [CARD_TYPE.ARCHITECTURE_STUDY]: parseInt(inputs[6]),
        [CARD_TYPE.CONTINUOUS_INTEGRATION]: parseInt(inputs[7]),
        [CARD_TYPE.CODE_REVIEW]: parseInt(inputs[8]),
        [CARD_TYPE.REFACTORING]: parseInt(inputs[9])
      }
    });
  }

  return applications;
}

function mostCommonRequirement(applications) {
  const requirements = {
    [CARD_TYPE.TRAINING]: 0,
    [CARD_TYPE.CODING]: 0,
    [CARD_TYPE.DAILY_ROUTINE]: 0,
    [CARD_TYPE.TASK_PRIORITIZATION]: 0,
    [CARD_TYPE.ARCHITECTURE_STUDY]: 0,
    [CARD_TYPE.CONTINUOUS_INTEGRATION]: 0,
    [CARD_TYPE.CODE_REVIEW]: 0,
    [CARD_TYPE.REFACTORING]: 0
  }

  for (const app of applications) {
    for (const k in app.requirements) {
      requirements[k] += app.requirements[k];
    }
  }

  console.error(requirements)
  return Object.keys(requirements).sort((a, b) => {
    return requirements[b] - requirements[a]
  });
}

function parsePlayers() {
  const players = [];

  for (let i = 0; i < 2; i++) {
    const inputs = readline().split(' ');
    players.push({
      desk: inputs[0], // id of the zone in which the player is located
      score: parseInt(inputs[1]),
      permanentDailyRoutineCards: parseInt(inputs[2]), // number of DAILY_ROUTINE the player has played. It allows them to take cards from the adjacent zones
      permanentArchitectureStudyCards: parseInt(inputs[3]) // number of ARCHITECTURE_STUDY the player has played. It allows them to draw more cards
    });
  }

  return players;
}

function parseLocations() {
  const locations = [];

  const count = parseInt(readline());
  for (let i = 0; i < count; i++) {
    const inputs = readline().split(' ');
    const cards = {
      [CARD_TYPE.TRAINING]: parseInt(inputs[1]),
      [CARD_TYPE.CODING]: parseInt(inputs[2]),
      [CARD_TYPE.DAILY_ROUTINE]: parseInt(inputs[3]),
      [CARD_TYPE.TASK_PRIORITIZATION]: parseInt(inputs[4]),
      [CARD_TYPE.ARCHITECTURE_STUDY]: parseInt(inputs[5]),
      [CARD_TYPE.CONTINUOUS_INTEGRATION]: parseInt(inputs[6]),
      [CARD_TYPE.CODE_REVIEW]: parseInt(inputs[7]),
      [CARD_TYPE.REFACTORING]: parseInt(inputs[8]),
      [CARD_TYPE.BONUS]: parseInt(inputs[9]),
      [CARD_TYPE.TECHNICAL_DEBT]: parseInt(inputs[10])

    }

    locations.push({
      location: inputs[0],
      cards,
      shoodyCount: countShoodyPoints(cards)
    });
  }

  return locations;
}

function countShoodyPoints(cards) {
  return Object.keys(cards).reduce((r, k) => {
    if (k === CARD_TYPE.TECHNICAL_DEBT) { return r; }

    return r + ((k === CARD_TYPE.BONUS ? 1 : 2) * cards[k]);
  }, 0)
}

//:: Releases
function getBestRelease(hand, applications, useShoody = false) {
  let id = null, lessShoody = Infinity;

  for (let app of applications) {
    let ret = isPossibleToRelease(hand, app, useShoody);
    //console.error({ ret, app })

    if (ret.isPossible && lessShoody > ret.shoodyUsed) {
      id = app.id;
    }
  }

  return id;
}

function isPossibleToRelease(hand, app, useShoody = false) {
  let isPossible = true;    
  const bonusCount = hand.cards[CARD_TYPE.BONUS];
  const shoodyCount = !useShoody ? 0 : hand.shoodyCount;

  let extraPoints = bonusCount + shoodyCount;
  const extraPointsInit = extraPoints;

  for (let k in app.requirements) {
    if (app.requirements[k] <= hand.cards[k] * 2) { continue; }

    if (extraPoints && extraPoints >= app.requirements[k]) {
      extraPoints -= app.requirements[k];
      continue;
    }

    isPossible = false;
  }

  return { 
      isPossible,
      shoodyUsed: extraPointsInit - extraPoints - bonusCount,
  };
}

function missingCardsToRelease(hand, app) {
  let bonusCount = hand.cards[CARD_TYPE.BONUS];
  const missingCards = {
    count: 0,
    cards: []
  };

  for (let k in app.requirements) {
    if (!app.requirements[k]) { continue; }

    if (hand.cards[k] * 2 < app.requirements[k]) {
      if (bonusCount >= app.requirements[k]) {
        bonusCount -= app.requirements[k];
      } else {
        missingCards.count++;
        missingCards.cards.push(k);
      }
    }
  }

  return missingCards;
}

//:: Movement
function isNextToOpponent(desk, oppDesk) {
  const _desk = Number(desk), _oppDesk = Number(oppDesk);
  return _desk === _oppDesk || _desk + 1 === _oppDesk || _desk - 1 === _oppDesk;
}

//:: Game State
const DESKS = {
  [CARD_TYPE.TRAINING]: 5,
  [CARD_TYPE.CODING]: 5,
  [CARD_TYPE.DAILY_ROUTINE]: 5,
  [CARD_TYPE.TASK_PRIORITIZATION]: 5,
  [CARD_TYPE.ARCHITECTURE_STUDY]: 5,
  [CARD_TYPE.CONTINUOUS_INTEGRATION]: 5,
  [CARD_TYPE.CODE_REVIEW]: 5,
  [CARD_TYPE.REFACTORING]: 5,
}

const DECK = {
  [CARD_TYPE.TRAINING]: 0,
  [CARD_TYPE.CODING]: 0,
  [CARD_TYPE.DAILY_ROUTINE]: 0,
  [CARD_TYPE.TASK_PRIORITIZATION]: 0,
  [CARD_TYPE.ARCHITECTURE_STUDY]: 0,
  [CARD_TYPE.CONTINUOUS_INTEGRATION]: 0,
  [CARD_TYPE.CODE_REVIEW]: 0,
  [CARD_TYPE.REFACTORING]: 0,
  [CARD_TYPE.BONUS]: 4,
  [CARD_TYPE.TECHNICAL_DEBT]: 4
}

let releasesWithShoody = 4;

while (true) {
  const gamePhase = readline();
  const applications = parseApplications();
  const players = parsePlayers();
  const [hand, draw, discard] = parseLocations();
  
  const possibleMovesCount = parseInt(readline());
  for (let i = 0; i < possibleMovesCount; i++) {
    const possibleMove = readline();
    console.error(possibleMove)
  }
  switch (gamePhase) {
    case GAME_PHASE.MOVE: {

      //:: Update Desks
      for (let p = 0; p < players.length; p++) {
        if (players[p].desk >= 0) {
          DESKS[players[p].desk]--;
          
          if (p === 0) {
            DECK[players[p].desk]++;
          }
        }
      }

      let moveTo = null

      //:: Get Next Card to Complete Release
      for (let app of applications) {
        const missing = missingCardsToRelease(hand, app);
        if (missing.count === 1 && missing.cards[0] !== players[0].desk
            && !isNextToOpponent(missing.cards[0], players[1].desk)) {
          moveTo = missing.cards[0];
          break;
        }
      }

      // Get most commom requirement - Not Closed
      if (!moveTo) {
        moveTo = mostCommonRequirement(applications).find(e => {
          return !isNextToOpponent(e, players[1].desk)
            && e !== players[0].desk && DESKS[e] > 0 && DECK[e] <= 3;
        });
      }

      // Get Bonus Card
      if (!moveTo) {
        moveTo = mostCommonRequirement(applications).find(e => {
          return !isNextToOpponent(e, players[1].desk) && e !== players[0].desk && DESKS[e] === 0;
        });
      }

      // Get First not close to opponent
      if (!moveTo) {
        moveTo = mostCommonRequirement(applications).find(e => {
          return !isNextToOpponent(e, players[1].desk) && e !== players[0].desk;
        });
      }

      console.log(moveTo ? `${COMMANDS.MOVE} ${moveTo}` : COMMANDS.RANDOM);
      break;
    }
    case GAME_PHASE.RELEASE: {
      const id = getBestRelease(hand, applications, releasesWithShoody > 0);
      if (id) { releasesWithShoody--; }

      console.error({ releasesWithShoody })
      console.log(id ? `${COMMANDS.RELEASE} ${id}` : COMMANDS.WAIT);
      break;
    }
    case GAME_PHASE.GIVE_CARD: {
      console.log(COMMANDS.RANDOM);
      break;
    }
    case GAME_PHASE.THROW_CARD: {
      console.log(COMMANDS.RANDOM);
      break;
    }
    case GAME_PHASE.PLAY_CARD: {
      console.log(COMMANDS.RANDOM);
      break;
    }
  }
}
