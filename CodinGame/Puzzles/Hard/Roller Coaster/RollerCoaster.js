let [ places, rides, groupsCount ] = readline().split(' ').map(Number);
let groups = [], earnings = 0, idx = 0, totalPeople = 0;

for (let i = 0; i < groupsCount; i++) {
    const people = parseInt(readline());
    totalPeople += people;
    groups.push(people);
}

if (totalPeople <= places) {
    return console.log(totalPeople * rides);
}

while (rides--) {
    let availablePlaces = places;

    while (availablePlaces >= groups[idx]) {        
        earnings += groups[idx];
        availablePlaces -= groups[idx];
        idx = idx === groupsCount - 1 ? 0 : idx + 1;
    }

}

console.log(earnings);
