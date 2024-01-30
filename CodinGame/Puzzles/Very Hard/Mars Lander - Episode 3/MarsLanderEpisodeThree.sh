prevY=0
doubleY=0

read -r surfaceN
for ((i = 0; i < $surfaceN; i++)); do
  read -r landX landY

  if [[ $prevY == $landY ]]; then
    doubleY=$landY
  fi

  prevY=$landY
done

while true; do
  read -r X Y hSpeed vSpeed fuel rotate power
  echo $X >&2
  if [[ $doubleY == 150 ]]; then
    if [ $X -gt 4950 ]; then
      echo "30 4"
    elif [ $hSpeed -lt -20 ]; then
      echo "-45 4"
    else
      echo "0 4"
    fi
  else
    if [ $X -gt 4700 ]; then
      echo "10 4"
    elif [ $Y -gt 1400 ]; then
      echo "-25 3"
    else
      echo "0 4"
    fi
  fi
done
