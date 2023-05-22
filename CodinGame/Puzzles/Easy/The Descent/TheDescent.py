import sys
import math

# game loop
while True:
  highest = 0
  idx = 0
  for i in range(8):
    mountainH = int(input())
    if highest < mountainH:
      highest = mountainH
      idx = i

  print(idx)
