read -r n
read -r -a myArray

max=0
loss=0
for (( i=0; i<$n; i++ )); do
    v=${myArray[$((i))]}

    if (( $v > $max )); then
        max=$v
    elif (( $v-$max < $loss )); then
        loss=$(($v-$max))
    fi    
done

echo $loss
