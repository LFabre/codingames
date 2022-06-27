const C_TYPE = {
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

const C_LOCATION = {
  MY_DECK: 'MY_DECK',
  DESK: 'DESK',
  HAND: 'HAND',
  DRAW: 'DRAW',
  DISCARD: 'DISCARD',
  AUTOMATED: 'AUTOMATED',
  OPPONENT_CARDS: 'OPPONENT_CARDS',
  OPPONENT_AUTOMATED: 'OPPONENT_AUTOMATED'
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
  THROW: 'THROW',
  RELEASE: 'RELEASE',
  TRAINING: 'TRAINING',
  CODING: 'CODING',
  DAILY_ROUTINE: 'DAILY_ROUTINE',
  TASK_PRIORITIZATION: 'TASK_PRIORITIZATION',
  ARCHITECTURE_STUDY: 'ARCHITECTURE_STUDY',
  CONTINUOUS_INTEGRATION: 'CONTINUOUS_INTEGRATION',
  CODE_REVIEW: 'CODE_REVIEW',
  REFACTORING: 'REFACTORING'
};

//:: Classes
class Player {
  constructor() {
    this.desk = -1;
    this.score = 0;
    this.hand = new Location(C_LOCATION.HAND);
    this.deck = new Location(C_LOCATION.MY_DECK);
    this.automated = new Location(C_LOCATION.AUTOMATED);
    this.dailyRoutine = 0;
    this.architectureStudy = 0;
  }

  parseInput(inputString) {
    const inputs = inputString.split(' ');

    this.desk = parseInt(inputs[0]);
    this.score = parseInt(inputs[1]);
    this.dailyRoutine = parseInt(inputs[2]);
    this.architectureStudy = parseInt(inputs[3]);
  }

  resetSkills() {
    this.dailyRoutine = 0;
    this.architectureStudy = 0;
  }

  setAutomated(automated) {
    this.automated = automated;
  }

  setDeck(deck) {
    this.deck = deck;
  }

  setHand(hand) {
    this.hand = hand;
  }

  clone() {
    const newPlayer = new Player();

    newPlayer.desk = this.desk;
    newPlayer.score = this.score;
    newPlayer.dailyRoutine = this.dailyRoutine;
    newPlayer.architectureStudy = this.architectureStudy;
    newPlayer.setDeck(this.deck);
    newPlayer.setHand(this.hand);
    newPlayer.setAutomated(this.setAutomated);

    return newPlayer;
  }
}

class Location {
  constructor(location) {
    this.location = location;
    this.totalCards = 0;
    this.shoodyCount = 0;
    this.cards = {
      [C_TYPE.TRAINING]: 0,
      [C_TYPE.CODING]: 0,
      [C_TYPE.DAILY_ROUTINE]: 0,
      [C_TYPE.TASK_PRIORITIZATION]: 0,
      [C_TYPE.ARCHITECTURE_STUDY]: 0,
      [C_TYPE.CONTINUOUS_INTEGRATION]: 0,
      [C_TYPE.CODE_REVIEW]: 0,
      [C_TYPE.REFACTORING]: 0,
      [C_TYPE.BONUS]: 0,
      [C_TYPE.TECHNICAL_DEBT]: 0
    }
  }

  setCards(cards) {
    this.cards = cards;
  }

  updateShoodyCount() {
    this.setShoodyCount(countShoodyPoints(this.cards));
  }

  setShoodyCount(sc) {
    this.shoodyCount = sc;
  }

  updateTotalCards() {
    this.totalCards = Object.keys(this.cards).reduce((r, k) => r + this.cards[k], 0)
  }
}

//:: Parsers
function parsePlayers(players = []) {

  for (let i = 0; i < 2; i++) {
    const p = players[i] || new Player();
    p.parseInput(readline());

    players.push(p);
  }

  return players;
}

function parseApplications() {
  const applications = [];

  const count = parseInt(readline());
  for (let i = 0; i < count; i++) {
    const inputs = readline().split(' ');
    applications.push({
      objectType: inputs[0],
      id: parseInt(inputs[1]),
      requirements: {
        [C_TYPE.TRAINING]: parseInt(inputs[2]),
        [C_TYPE.CODING]: parseInt(inputs[3]),
        [C_TYPE.DAILY_ROUTINE]: parseInt(inputs[4]),
        [C_TYPE.TASK_PRIORITIZATION]: parseInt(inputs[5]),
        [C_TYPE.ARCHITECTURE_STUDY]: parseInt(inputs[6]),
        [C_TYPE.CONTINUOUS_INTEGRATION]: parseInt(inputs[7]),
        [C_TYPE.CODE_REVIEW]: parseInt(inputs[8]),
        [C_TYPE.REFACTORING]: parseInt(inputs[9])
      }
    });
  }

  return applications;
}

function mostCommonRequirements(applications) {
  const requirements = {
    [C_TYPE.TRAINING]: 0,
    [C_TYPE.CODING]: 0,
    [C_TYPE.DAILY_ROUTINE]: 0,
    [C_TYPE.TASK_PRIORITIZATION]: 0,
    [C_TYPE.ARCHITECTURE_STUDY]: 0,
    [C_TYPE.CONTINUOUS_INTEGRATION]: 0,
    [C_TYPE.CODE_REVIEW]: 0,
    [C_TYPE.REFACTORING]: 0
  }

  for (const app of applications) {
    for (const k in app.requirements) {
      requirements[k] += app.requirements[k];
    }
  }

  //console.error(requirements)
  return Object.keys(requirements).sort((a, b) => {
    return requirements[b] - requirements[a]
  });
}

function leastCommonRequirements(applications) {
  return mostCommonRequirements(applications).reverse();
}

function parseLocations(oldLocations) {
  const locations = {};
  const myDeck = new Location(C_LOCATION.MY_DECK);

  const count = parseInt(readline());
  for (let i = 0; i < count; i++) {
    const inputs = readline().split(' ');
    const loc = new Location(inputs[0]);

    loc.setCards({
      [C_TYPE.TRAINING]: parseInt(inputs[1]),
      [C_TYPE.CODING]: parseInt(inputs[2]),
      [C_TYPE.DAILY_ROUTINE]: parseInt(inputs[3]),
      [C_TYPE.TASK_PRIORITIZATION]: parseInt(inputs[4]),
      [C_TYPE.ARCHITECTURE_STUDY]: parseInt(inputs[5]),
      [C_TYPE.CONTINUOUS_INTEGRATION]: parseInt(inputs[6]),
      [C_TYPE.CODE_REVIEW]: parseInt(inputs[7]),
      [C_TYPE.REFACTORING]: parseInt(inputs[8]),
      [C_TYPE.BONUS]: parseInt(inputs[9]),
      [C_TYPE.TECHNICAL_DEBT]: parseInt(inputs[10])
    })
    loc.updateShoodyCount();
    loc.updateTotalCards();

    // HAND, DRAW, DISCARD
    if ([C_LOCATION.HAND, C_LOCATION.DRAW, C_LOCATION.DISCARD].includes(inputs[0])) {
      Object.keys(loc.cards).forEach(k => {
        myDeck.cards[k] += loc.cards[k];
      });

      myDeck.shoodyCount += loc.shoodyCount;
    }

    locations[inputs[0]] = loc;
  }

  myDeck.updateTotalCards();

  locations[C_LOCATION.MY_DECK] = myDeck;

  if (locations[C_LOCATION.OPPONENT_CARDS]) {
    locations[C_LOCATION.DESK] = new Location(C_LOCATION.DESK)
    locations[C_LOCATION.DESK].setCards({
      [C_TYPE.TRAINING]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.TRAINING] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.TRAINING]),
      [C_TYPE.CODING]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.CODING] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.CODING]),
      [C_TYPE.DAILY_ROUTINE]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.DAILY_ROUTINE] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.DAILY_ROUTINE]),
      [C_TYPE.TASK_PRIORITIZATION]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.TASK_PRIORITIZATION] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.TASK_PRIORITIZATION]),
      [C_TYPE.ARCHITECTURE_STUDY]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.ARCHITECTURE_STUDY] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.ARCHITECTURE_STUDY]),
      [C_TYPE.CONTINUOUS_INTEGRATION]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.CONTINUOUS_INTEGRATION] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.CONTINUOUS_INTEGRATION]),
      [C_TYPE.CODE_REVIEW]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.CODE_REVIEW] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.CODE_REVIEW]),
      [C_TYPE.REFACTORING]: 5 - (locations[C_LOCATION.MY_DECK].cards[C_TYPE.REFACTORING] + locations[C_LOCATION.OPPONENT_CARDS].cards[C_TYPE.REFACTORING]),
      [C_TYPE.BONUS]: 0,
      [C_TYPE.TECHNICAL_DEBT]: 0,
    });
    locations[C_LOCATION.DESK].updateTotalCards();
  } else if (locations[C_LOCATION.DESK]) {
    locations[C_LOCATION.DESK] = oldLocations[C_LOCATION.DESK];
  }

  return locations;
}

function countShoodyPoints(cards) {
  return Object.keys(cards).reduce((r, k) => {
    if (k === C_TYPE.TECHNICAL_DEBT) { return r; }

    return r + ((k === C_TYPE.BONUS ? 1 : 2) * cards[k]);
  }, 0)
}

//:: Releases
function getBestRelease(player, applications, useShoody = false) {
  let application = null, lessShoody = Infinity;

  for (let app of applications) {
    const { isPossible, shoodyUsed } = isPossibleToRelease(player, app, useShoody);
    if (!isPossible) { continue; }

    if (lessShoody > shoodyUsed) {
      application = app;
      lessShoody = shoodyUsed;
    }
  }

  return { isPossible: true, shoodyUsed: lessShoody, application };
}

function getPossibleReleases(player, applications, useShoody = false) {
  const releases = [];

  for (let app of applications) {
    const { isPossible, shoodyUsed } = isPossibleToRelease(player, app, useShoody);
    if (!isPossible) { continue; }

    releases.push({ isPossible, shoodyUsed, application });
  }

  return releases;
}

function isPossibleToRelease(player, application, useShoody = false) {
  let isPossible = true;
  const missingCards = [];

  const bonusCount = player.hand.cards[C_TYPE.BONUS] + player.automated.cards[C_TYPE.BONUS];
  const shoodyCount = !useShoody ? 0 : player.hand.shoodyCount + player.automated.shoodyCount;

  let extraPoints = bonusCount + shoodyCount;
  const extraPointsInit = extraPoints;

  for (let k in application.requirements) {
    let reqPoints = application.requirements[k] - (player.hand.cards[k] * 2) - (player.automated.cards[k] * 2);
    if (reqPoints <= 0) { continue; }

    if (extraPoints && extraPoints >= reqPoints) {
      extraPoints -= reqPoints;
      continue;
    }

    isPossible = false;
    while (reqPoints > 0) {
      missingCards.push(k);
      reqPoints -= 2;
    }
  }

  return {
    isPossible,
    shoodyUsed: extraPointsInit - extraPoints - bonusCount,
    application,
    missingCards,
  };
}

function cardsInHandNotInclduedOnRelease (player, application) {
  const notIncluded = [];
  let bonusCount = player.hand.cards[C_TYPE.BONUS] + player.automated.cards[C_TYPE.BONUS];

  for (let k in application.requirements) {
    let reqPoints = application.requirements[k] - (player.automated.cards[k] * 2);

    if (reqPoints && bonusCount && bonusCount >= reqPoints) {
      bonusCount -= reqPoints;
      reqPoints -= reqPoints;
    }

    if (reqPoints === 0 && player.hand.cards[k]) { 
      notIncluded.push(k);
    }
  }

  return notIncluded;
}

//:: Movement
function isNextToOpponent(desk, opponent) {
  const _desk = Number(desk), _oppDesk = Number(opponent.desk);
  if (_desk === -1 || _oppDesk === -1) { return false; }

  const isZeroSeven = (_desk === 0 && _oppDesk === 7) || (_desk === 7 && _oppDesk === 0);
  return isZeroSeven || _desk === _oppDesk || _desk + 1 === _oppDesk || _desk - 1 === _oppDesk;
}

//:: Game State
let releasesWithShoody = 4;
const MAX_SHOODY = 4;
const players = [];
let locations = {};

const PRIORITY_CARDS = [
  C_TYPE.CONTINUOUS_INTEGRATION,
  C_TYPE.DAILY_ROUTINE,
  C_TYPE.CODING,
  C_TYPE.CODE_REVIEW,
  C_TYPE.REFACTORING,
  C_TYPE.TASK_PRIORITIZATION,
  C_TYPE.TRAINING,
  C_TYPE.ARCHITECTURE_STUDY,
]

while (true) {
  const gamePhase = readline();
  const applications = parseApplications();
  const [me, opponent] = parsePlayers(players);
  const _locations = parseLocations(locations);
  const {
    [C_LOCATION.MY_DECK]: myDeck,
    [C_LOCATION.HAND]: hand,
    [C_LOCATION.AUTOMATED]: automated,
    [C_LOCATION.DESK]: desk,
  } = _locations;
  const possibleMovesCount = parseInt(readline());

  if (myDeck) { me.setDeck(myDeck); }
  if (hand) { me.setHand(hand); }
  if (automated) { me.setAutomated(automated); }

  const canRelease = me.automated.totalCards > 2;
  let cardToGive = null;

  for (let i = 0; i < possibleMovesCount; i++) {
    const possibleMove = readline();
  }

  switch (gamePhase) {
    case GAME_PHASE.MOVE: {
      let moveTo = null

      // On Last Release
      if (releasesWithShoody === 0) {
        for (let app of applications) {
          const r = isPossibleToRelease(me, app);
          const notIncluded = cardsInHandNotInclduedOnRelease(me, app);

          if (
            r.missingCards.length <= 1
            && me.desk < Number(r.missingCards[0])
            && (!isNextToOpponent(r.missingCards[0], opponent) || notIncluded.length)) {
              moveTo = r.missingCards[0];
              cardToGive = notIncluded[0];
              break;
          }
        }
      }

      if (moveTo === null) {
        const pCards = PRIORITY_CARDS.filter(c => {
          if (c === C_TYPE.DAILY_ROUTINE)
          return !me.dailyRoutine;

          return true;
        }).map(Number);
        
        const shouldStartOver = 
           me.desk === 7 
           || (opponent.desk === 7 && me.desk === 5)
           || (opponent.desk === 6 && me.desk >= 4)
           || (opponent.desk === 0 && me.desk == 6);
        const first = shouldStartOver ? pCards : pCards.filter(c => me.desk < c);
        const filteredCards = desk ? first.filter(c => desk.cards[c]) : first;

        if (opponent.desk > me.desk && me.desk < Number(C_TYPE.TASK_PRIORITIZATION)) {
          filteredCards.unshift(C_TYPE.TASK_PRIORITIZATION);
        }

        for (let card of filteredCards) {
          if (me.dailyRoutine) {
            for (let i = card - me.dailyRoutine; i <= card + me.dailyRoutine; i++) {
              console.error({ i, card, d: me.desk })
              if (i > 7 || i < 0 || isNextToOpponent(i, opponent) || me.desk === i) { continue; }
              
              moveTo = `${i} ${card}`;
              break;
            }
          } else if (card !== me.desk && !isNextToOpponent(card, opponent)) {
            moveTo = card;
          }
          
          if (moveTo) { break; }
        }

        console.error({ moveTo, filteredCards })
      }

      console.log(moveTo !== null ? `${COMMANDS.MOVE} ${moveTo}` : COMMANDS.RANDOM);
      break;
    }
    case GAME_PHASE.RELEASE: {
      const { application, shoodyUsed } = getBestRelease(me, applications, releasesWithShoody > 0);
      console.error({ application, shoodyUsed, releasesWithShoody })

      if (canRelease && application && shoodyUsed <= MAX_SHOODY) {
        releasesWithShoody--;
        console.log(`${COMMANDS.RELEASE} ${application.id}`);
      } else {
        console.log(COMMANDS.WAIT);
      }

      break;
    }
    case GAME_PHASE.GIVE_CARD: {
      let card

      if (cardToGive) {
        card = cardToGive;
        cardToGive = null;        
      } else {
        card = [...leastCommonRequirements(applications), C_TYPE.BONUS]
          .find(c => me.hand.cards[c]);
      }

      console.log(card ? `${COMMANDS.GIVE} ${card}` : COMMANDS.RANDOM);
      break;
    }
    case GAME_PHASE.THROW_CARD: {
      const card = [...leastCommonRequirements(applications), C_TYPE.BONUS]
        .find(c => me.hand.cards[c]);

      console.log(card ? `${COMMANDS.THROW} ${card}` : COMMANDS.RANDOM);
      break;
    }
    case GAME_PHASE.PLAY_CARD: {
      const { application, shoodyUsed } = getBestRelease(me, applications, releasesWithShoody > 0);

      if (canRelease && application && shoodyUsed <= MAX_SHOODY) {
        console.log(COMMANDS.WAIT + ' WILL RELEASE');
        break;
      }

      if (me.hand.cards[C_TYPE.TRAINING]) {
        console.log(COMMANDS.TRAINING);
        break;
      }

      if (me.hand.cards[C_TYPE.CODING]) {
        console.log(COMMANDS.CODING);
        break;
      }

      if (me.hand.cards[C_TYPE.CONTINUOUS_INTEGRATION]) {
        const req = mostCommonRequirements(applications);
        const card = [C_TYPE.BONUS, ...req].find(c => {
          const count = c === C_TYPE.CONTINUOUS_INTEGRATION ? 2 : 1;
          return me.hand.cards[c] >= count;
        });

        console.error({ card, req });
        if (card) {
          console.log(COMMANDS.CONTINUOUS_INTEGRATION + ' ' + card);
          break;
        }
      }

      if (me.hand.cards[C_TYPE.TASK_PRIORITIZATION]) {
        const req = leastCommonRequirements(applications);
        const card = [C_TYPE.BONUS, ...req].find(c => {
          const count = c === C_TYPE.TASK_PRIORITIZATION ? 2 : 1;
          return me.hand.cards[c] >= count;
        });

        if (card) {
          console.log(`${COMMANDS.TASK_PRIORITIZATION} ${card} ${C_TYPE.CONTINUOUS_INTEGRATION}`)
          break;
        }
      }

      if (me.hand.cards[C_TYPE.ARCHITECTURE_STUDY]) {
        console.log(COMMANDS.ARCHITECTURE_STUDY);
      } else if (me.hand.cards[C_TYPE.DAILY_ROUTINE]) {
        console.log(COMMANDS.DAILY_ROUTINE);
      } else if (me.hand.cards[C_TYPE.CODE_REVIEW]) {
        console.log(COMMANDS.CODE_REVIEW);
      } else if (me.hand.cards[C_TYPE.REFACTORING]) {
        console.log(COMMANDS.REFACTORING);
      } else {
        console.log(COMMANDS.RANDOM);
      }

      break;
    }
  }
}
