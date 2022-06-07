while true; do
    _i=0
    h=0
    for (( i=0; i<8; i++ )); do
        read -r mountainH
        if [[ $mountainH > $h ]]; then
            _i=$i
            h=$mountainH
        fi
    done

    echo $_i
done