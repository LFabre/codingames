const LON = Number(readline().replace(',', '.'));
const LAT = Number(readline().replace(',', '.'));

function getX(lonA, latA, lonB, latB) {
    return Math.abs((lonB - lonA) * Math.cos((latB + latA) / 2));
}

function getY(latA, latB) {
    return Math.abs(latB - latA);
}

function dist(lonA, latA, lonB, latB) {
    const x = getX(lonA, latA, lonB, latB);
    const y = getY(latA, latB);

    return Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 6371;
}

let selectedDefib = '', d = Infinity;
const N = parseInt(readline());
for (let i = 0; i < N; i++) {
    const [_, name, __, ___, lon, lat] = readline().split(';');
    const _lon = Number(lon.replace(',', '.'));
    const _lat = Number(lat.replace(',', '.'));    
    const _d = dist(LON, LAT, _lon, _lat);

    if (_d < d) {
        selectedDefib = name;
        d = _d;
    }
}

console.log(selectedDefib);
