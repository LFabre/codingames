read -r W H countX countY

cutsX=(0 $W)
_cutsX=($W)
cutsY=(0 $H)
_cutsY=($H)

read -r -a cutsOnX
for (( i=0; i<$countX; i++ )); do
    c=${cutsOnX[$((i))]}

    for x in "${cutsX[@]}"; do
        s=$(($x-$c))
        _cutsX+=("${s#-}")
    done
    
    cutsX+=("$c")
done

read -r -a cutsOnY
for (( i=0; i<$countY; i++ )); do
    c=${cutsOnY[$((i))]}

    for y in "${cutsY[@]}"; do
        s=$(($y-$c))
        _cutsY+=("${s#-}")
    done
    
    cutsY+=("$c")
done

# This is too slow - Use Maps to count
#https://stackoverflow.com/questions/1494178/how-to-define-hash-tables-in-bash
count=0
for _x in ${_cutsX[@]}; do
    for _y in ${_cutsY[@]}; do
        if [ $_x == $_y ]; then
            count=$(($count+1))
        fi
    done    
done

echo $count
