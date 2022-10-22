r=readline
i=r().split(' ');
e={[i[3]]:+i[4]};
while(i[7]--){[y,x]=r().split(' ');e[y]=+x}
while(1){[y,x,d]=r().split(' ')
print(d=='LEFT'&&e[y]>+x||d=='RIGHT'&&e[y]<+x?'BLOCK':'WAIT')}