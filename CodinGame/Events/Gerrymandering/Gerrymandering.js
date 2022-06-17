const [W, H] = readline().split(' ').map(Number);

const voters = [];
for (let i = 0; i < H; i++) {
  voters.push(readline().split(' ').map(Number));
}

function gerry(voters, w, h, cache = {}) {
  const id = `${w}-${h}`;
  if (cache[id] !== undefined) { return cache[id]; }

  let v = voters[h - 1][w - 1];

  // Horizontal Cut
  for (let x = 1; x < w; x++) {
    v = Math.max(
      v,
      gerry(voters, x, h, cache) + gerry(voters, w - x, h, cache)
    );
  }

  // Vertical Cut
  for (let y = 1; y < h; y++) {
    v = Math.max(
      v,
      gerry(voters, w, y, cache) + gerry(voters, w, h - y, cache)
    );
  }

  return cache[id] = v;
}

console.log(gerry(voters, W, H));
