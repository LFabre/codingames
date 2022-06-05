declare -a horses

read -r N
for (( i=0; i<$N; i++ )); do
    read -r Pi    
    horses[Pi]=1
done

dist=10000000; last=-1

if [[ ${#horses[@]} -ne N ]]; 
    then 
        dist=0;
else
    for k in ${!horses[@]}; do
        if [[ $last -ne -1 && $(($k-$last)) -lt $dist ]]; then 
            dist=$(($k-$last)); fi
        last=$k
    done
fi

echo $dist
