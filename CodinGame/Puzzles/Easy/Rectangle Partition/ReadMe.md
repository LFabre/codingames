# Rectangle Partition

[Codin Game - Rectangle Partition](https://www.codingame.com/training/easy/rectangle-partition)

## The Goal

There is a rectangle of given width `W` and height `H`,

On the width side, you are given a list of measurements.
On the height side, you are given another list of measurements.

Draw perpendicular lines from the measurements to partition the rectangle into smaller rectangles.

In all sub-rectangles (include the combinations of smaller rectangles), how many of them are squares?

## Game Input

### Input

Line 1: Integers `W` `H` `countX` `countY`, separated by space.

Line 2: list of measurements on the width side, `countX` integers separated by space, sorted in asc order.

Line 3: list of measurements on the height side, `countY` integers separated by space, sorted in asc order.

### Output

Line 1: the number of squares in sub-rectangles created by the added lines.

## Constraints

1 ≤ `W`, `H` ≤ 20,000

1 ≤ number of measurements on each axis ≤ 500

## Example

`W` = 10
`H` = 5
measurements on x-axis: 2, 5 (`countX`)
measurements on y-axis: 3 (`countY`)

   ___2______5__________ 
  |   |      |          |
  |   |      |          |
 3|___|______|__________|
  |   |      |          |
  |___|______|__________|

Number of squares in sub-rectangles = 4 (one 2x2, one 3x3, two 5x5).

### Example - Input

```sh
10 5 2 1
2 5
3
```

### Example - Output

```sh
4
```
