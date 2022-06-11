const peopleCount = Number(readline());
const giftPrice = Number(readline());

let totalCash = 0;
const cash = [];

for (let i = 0; i < peopleCount; i++) {
    const n = Number(readline());
    totalCash += n;
    cash.push(n);
}
cash.sort((a,b) => a - b);

if (totalCash >= giftPrice) {
    const ret = [];
    let collected = 0;
    let perPerson = Math.floor(giftPrice / peopleCount);

    for (let i = 0; i < peopleCount; i++) {
        if (cash[i] < perPerson) {
            ret.push(cash[i]);
            collected += cash[i];
            perPerson = Math.floor((giftPrice - collected) / (peopleCount - (i + 1)))
        } else {
            ret.push(perPerson);
            collected += perPerson;
        }
    }

    // Acount for rounding
    let i = ret.length - 1;
    while (collected !== giftPrice) {
        ret[i--] += 1;
        collected++
    }

    ret.forEach(e => console.log(e))
} else {
    console.log('IMPOSSIBLE');
}
