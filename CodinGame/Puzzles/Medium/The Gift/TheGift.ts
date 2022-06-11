const peopleCount: number = parseInt(readline());
const giftPrice: number = parseInt(readline());

let totalCash = 0;
const cash = [];

for (let i = 0; i < peopleCount; i++) {
    const n: number = Number(readline());
    totalCash += n;
    cash.push(n);
}
cash.sort((a,b) => a - b);

if (totalCash >= giftPrice) {
    let collected = 0;

    for (let i = 0; i < peopleCount; i++) {
        let contribution = Math.min(
            cash[i],
            Math.floor((giftPrice - collected) / (peopleCount - i))
        );
        collected += contribution;

        console.log(contribution);
    }
} else {
    console.log('IMPOSSIBLE');
}
