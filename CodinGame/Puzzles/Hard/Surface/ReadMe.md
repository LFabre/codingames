# Surface

[Codin Game - Surface](https://www.codingame.com/training/hard/surface)

## Goal

"The wars of the 21st century will be fought over water."
Although freshwater is available in limited quantity, it’s not actually scarce. There’s more than enough to satisfy the current needs of the global population, but only if it were possible to locate and measure the bodies of water available in a geographical area!

Your mission is to pinpoint the surface areas of water. You have a map which describes the contents of each square meter of a geographical zone. One square meter is composed of either land or water. One map can contain several bodies of water.

## Rules

Your program receives as input a list of coordinates. For each one you must determine the surface area of the lake which is located there. If there is no lake, then the surface area equals 0.

Here's an example of a map. The green squares represent land, and the blue squares represent water. A lake is made up of a set of water squares which are horizontally or vertically adjacent. Two squares which are only diagonally adjacent are not part of the same lake.

![example](imgs/img1.png)

In this example, the lake which is located in coordinates (1, 2) has a surface area of 3 square meters.

A map in ASCII format is provided as input. The character # represents land and the letter O (uppercase) represents water. In this format, the map shown above will be represented as follows:

```text
####
##O#
#OO#
####
```

## Game Input

### Input

Line 1: the width `L` of the map

Line 2: the height `H` of the map

`H` following lines: `L` characters # or O

Following line: the number `N` of coordinates to be tested

`N` following lines: the coordinates `X` `Y` to be tested, separated by a space

### Output

`N` lines: each displaying the surface area of the lake located at the coordinates given in input.

### Constraints

0 < `L` < 10000
0 < `H` < 10000
0 ≤ `X` < `L`
0 ≤ `Y` < `H`
0 < `N` < 1000

## Example

### Example - Input

```text
4
4
####
##O#
#OO#
####
3
0 0
1 2
2 1
```

### Example - Output

```text
0
3
3
```
