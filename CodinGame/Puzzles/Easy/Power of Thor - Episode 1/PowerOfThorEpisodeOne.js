let [lx, ly, x, y] = readline().split(' ').map(Number)

while (true) {
  readline();

  let m = '';

  y !== ly ? (y < ly ? (y++, m += 'S') : (y--, m += 'N')) : '';
  x !== lx ? (x < lx ? (x++, m += 'E') : (x--, m += 'W')) : '';

  console.log(m);
}