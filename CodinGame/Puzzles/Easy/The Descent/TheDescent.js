while (true) {
  let h = 0, idx = 0;

  for (let i = 0; i < 8; i++) {
      const mountainH = parseInt(readline());
      if (mountainH > h) {
          idx = i;
          h = mountainH;
      }
  }

  console.log(idx);
}
