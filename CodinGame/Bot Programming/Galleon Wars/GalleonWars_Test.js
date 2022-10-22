function nextOnDirection(y, x, d, speed) {
  if (!speed) {
    return [y, x];
  }

  const floorSpeed = Math.floor(speed / 2);
  const isOdd = y & 1;

  switch (d) {
      case 0: return [y, x + speed];
      case 3: return [y, x - speed];

      case 1: return [y - speed, x + (floorSpeed || isOdd)];
      case 4: return [y + speed, x - (floorSpeed || (isOdd ? 0 : 1))];

      case 5: return [y + speed, x + (floorSpeed || isOdd)];
      case 2: return [y - speed, x - (floorSpeed || (isOdd ? 0 : 1))];
      default:
          throw `Unknown direction ${d}`;
  }
}

function test(inputs, r) {
  const [y, x] = nextOnDirection(...inputs)
  const result = y === r[0] && x === r[1];

  console.log(`${inputs.join(' ')} | ${r[0]} ${r[1]} - ${y} ${x} - ${result}`);
}


// test([0, 0, 0, 0], [0, 0]);

// test([3, 3, 0, 1], [3, 4])
// test([3, 3, 3, 1], [3, 2])

//test([3, 3, 1, 1], [0, 0])
//test([3, 3, 4, 1], [0, 0])

//test([3, 3, 2, 1], [0, 0])

//:: 1
console.log('\n1')
test([3, 3, 1, 1], [2, 4])
test([3, 3, 1, 2], [1, 4])
test([2, 4, 1, 1], [1, 4])
test([2, 4, 1, 2], [0, 5])
test([6, 0, 1, 6], [0, 3])

//:: 4
console.log('\n4')
test([3, 3, 4, 1], [4, 3])
test([3, 3, 4, 2], [5, 2])
test([4, 3, 4, 1], [5, 2])
test([4, 3, 4, 2], [6, 2])
test([0, 6, 4, 6], [6, 3])

//:: 2
console.log('\n2')
test([3, 3, 2, 1], [2, 3])
test([3, 3, 2, 2], [1, 2])
test([2, 3, 2, 1], [1, 2])
test([2, 3, 2, 2], [0, 2])
test([6, 3, 2, 6], [0, 0])

//:: 5
console.log('\n5')
test([3, 3, 5, 1], [4, 4])
test([3, 3, 5, 2], [5, 4])
test([2, 3, 5, 1], [3, 3])
test([2, 3, 5, 2], [4, 4])
test([0, 0, 5, 6], [6, 3])