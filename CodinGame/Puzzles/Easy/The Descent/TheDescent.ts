while (true) {
  let h = 0, idx = 0;

  for (let i = 0; i < 8; i++) {
    const mountainH: number = parseInt(readline());
    if (mountainH > h) {
      idx = i;
      h = mountainH;
    }
  }

  console.log(idx);
}
