read -r lightX lightY x y

while true; do    
    read -r remainingTurns
    c=""

    if (( $y != $lightY )); then
        if (( $y < $lightY )); then
            y=$(($y+1))
            c="${c}S"
        else
            y=$(($y-1))
            c="${c}N"
        fi
    fi

    if (( $x != $lightX )); then
        if (( $x < $lightX )); then
            x=$(($x+1)) 
            c="${c}E"
        else
            x=$(($x-1))
            c="${c}W"
        fi
    fi

    echo $c
done
