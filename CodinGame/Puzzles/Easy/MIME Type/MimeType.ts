const N: number = parseInt(readline());
const Q: number = parseInt(readline());

const UNKNOWN = 'UNKNOWN';
const mimeMap = {};

for (let i = 0; i < N; i++) {
  const [ext, mt] = readline().split(' ');
  mimeMap[ext.toLowerCase()] = mt;
}

for (let i = 0; i < Q; i++) {
  const nameSplit = readline().split('.');

  if (nameSplit.length < 2)
    console.log(UNKNOWN);
  else
    console.log(mimeMap[nameSplit.pop().toLowerCase()] || UNKNOWN)
}
