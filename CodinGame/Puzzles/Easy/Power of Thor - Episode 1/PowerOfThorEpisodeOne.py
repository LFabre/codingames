import sys
import math

lx, ly, x, y = [int(i) for i in input().split()]

# game loop
while True:
  input()

  m = ''

  if y != ly:
    if y < ly:
      y = y + 1
      m = m + 'S'
    else:
      y = y - 1
      m = m + 'N'

  if x != lx:
    if x < lx:
      x = x + 1
      m = m + 'E'
    else:
      x = x - 1
      m = m + 'W'
  
  print(m)
