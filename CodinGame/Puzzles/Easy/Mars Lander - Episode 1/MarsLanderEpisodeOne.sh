read -r surfaceN
for (( i=0; i<$surfaceN; i++ )); do
    read -r landX landY
done

while true; do
    read -r X Y hSpeed vSpeed fuel rotate power

    if (( $vSpeed < -2 )) && (( $power < 4 )); then
        power=$((power+1))
    elif (( $power > 0 )); then
        power=$((power-1))
    fi

    echo "0" $power
done