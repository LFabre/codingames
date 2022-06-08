read -r n
read -r -a myArray

r=5526
for (( i=0; i<$n; i++ )); do   
    t=${myArray[$((i))]}

    if (( $(($t*$t)) < $(($r*$r)) || ($t > 0 && $(($t*-1)) == r) )); then
        r=$t
    fi
done

if (( $n == 0)); then
    echo $n
else
    echo $r
fi