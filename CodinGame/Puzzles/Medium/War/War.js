const WAR_CARDS = 3;
const specialCardValues = { J: 11, Q: 12, K: 13, A: 14 };
const p1Deck = mapCards(parseInt(readline()));
const p2Deck = mapCards(parseInt(readline()));

function mapCards(n) {
    const deck = [];
    for (let i = 0; i < n; i++) {
        const card = readline().slice(0, -1);

        if (specialCardValues[card])
            deck.push(specialCardValues[card]);
        else
            deck.push(Number(card));
    }

    return deck;
}

let rounds = 0, p1Cards = [], p2Cards = [];
while (true) {
    p1Cards.push(p1Deck.shift())
    p2Cards.push(p2Deck.shift())

    if (p1Cards.at(-1) > p2Cards.at(-1)) {
        p1Deck.push(...p1Cards, ...p2Cards)
    } else if (p1Cards.at(-1) < p2Cards.at(-1))
        p2Deck.push(...p1Cards, ...p2Cards)
    else {
        if (p1Deck.length < WAR_CARDS || p2Deck.length < WAR_CARDS) {
            return console.log('PAT')
        }

        p1Cards = p1Cards.concat(p1Deck.splice(0, WAR_CARDS));
        p2Cards = p2Cards.concat(p2Deck.splice(0, WAR_CARDS));
        continue;
    }

    rounds++;
    p1Cards = [];
    p2Cards = [];

    if (!p2Deck.length) {
        return console.log(`1 ${rounds}`)
    }
    
    if (!p1Deck.length) {
        return console.log(`2 ${rounds}`)
    }
}
