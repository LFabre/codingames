import sys
import math

UNKNOWN = 'UNKNOWN'
N = int(input())
Q = int(input())

mimeMap = {}

for i in range(N):
  ext, mt = input().split()
  mimeMap[ext.lower()] = mt

for i in range(Q):
  fname = input().split('.')

  if len(fname) < 2:
    print(UNKNOWN)
  else:
    print(mimeMap.get(fname[-1].lower(), UNKNOWN))
