# Galleon Wars

[Codin Game - Galleon Wars](https://www.codingame.com/multiplayer/bot-programming/galleon-wars)

## Recorded Positions

- Wood League 1 - 125th - 2022-10-22
- Silver League - 326th - 2022-10-23

## Files

- GalleonWars_Current
  - Script used on the current position
- GalleonWars_Test
  - File to be used as a testing ground for specific functions
- GalleonWars_Wood2_109.js
  - Save state while on Wood League 2 at 109th position
- GalleonWars_Wood2_109.js
  - Save state while on Wood League 2 at 2th position
- GalleonWars_Wood1_125.js
  - Save state while on Wood League 1 at 125th position
- GalleonWars_Bronze_347.js
  - Save state while on Bronze League at 347th position
  - Improvement which promoted to Wood 1 to Bronze League
- GalleonWars_Silver_326.js
  - Save state while on Silver League at 326th position
  - Improvement which promoted to Bronze to Silver League

## Future Improvements

- Some ships are getting stuck on the edges.
  - Improve unstuck logic.
- Improve navigation of the ships
  - This is a good puzzle to test an AStart path finding
    - [HEXAGONAL MAZE](https://www.codingame.com/training/medium/hexagonal-maze)
- Change distance calculation?
  - Code:

    ```text
        dx = B.x - A.x;
        dy = B.y - A.y;
        if (sign(dx) == sign(dy)) {    // this is (1); see first paragraph
          dist = max(abs(dx),abs(dy));
        } else {
          dist = abs(dx) + abs(dy);
        }
        I think the simpler (=faster) method is:

        dx = B.x - A.x;
        dy = B.y - A.y;
        dist = (abs (dx) + abs (dy) + abs (dx-dy)) / 2
    ```

## References

[Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/)
