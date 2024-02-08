r=readline
print(+r()?r().split(' ').reduce((a,b)=>b*b-b<a*a?b:a):0)
