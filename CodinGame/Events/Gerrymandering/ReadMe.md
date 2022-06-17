# Gerrymandering

This is a Puzzle Event release on 2022-06-06.

[Puzzle Event - GERRYMANDERING - Hard](https://www.codingame.com/training/hard/gerrymandering)

## Goal

You're in charge of redefining electoral districts in your county, in order to win the next elections.

The county starts as a single rectangular district. A single district can be split vertically or horizontally in two new districts. This ensures that all districts remain rectangular. Your objective is to find the optimal cuts to maximize the number of voters granted by your districts.

Each district will grant you a certain amount of voters, __depending solely on its dimensions__. The input is a table of number of voters for each possible shape. The dimensions are not symmetrical, i.e. a 5x3 area may not have the same value as a 3x5 one.

Example: in the first testcase, a `1x1` rectangle is worth __7__ voters, a `2x1` is worth __8__, a `1x2` is worth __10__, a `2x2` is worth __41__, etc.

The optimal solution in that case is to split the initial `5x4` district __vertically__ into a `4x4` and a `1x4` district. Then, the resulting `4x4` district is split __horizontally__ in two districts of size `4x2`. The resulting score is then `39 + 96 + 96 = 231`, which is the highest possible amount of voters in that case.

## Puzzle Input and Output

### Input

__Line 1__: Two integers `W` and `H`, the width and height of your county.

__Next `H` lines__: `W` integers representing the amount of voters given by a district of shape `h` x `w`

### Output

__Line 1__: A single integer representing the maximum amount of voters you can get by redefining electoral districts.

### Constraints

* 1 ≤ `W` ≤ 40
* 1 ≤ `H` ≤ 40
* 0 ≤ `voters` ≤ 10000

## Example

### Example - Input

```sh
5 4
7 8 18 39 40
10 41 60 96 81
24 54 114 87 154
39 56 140 135 162
```

### Example - Output

```sh
231
```
