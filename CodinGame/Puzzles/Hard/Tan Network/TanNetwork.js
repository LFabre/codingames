const startPoint = readline();
const endPoint = readline();
const graph = {}

const N = parseInt(readline());
for (let i = 0; i < N; i++) {
    const info = readline().split(',');

    graph[info[0]] = {
        id: info[0],
        name: info[1].replaceAll('"', ''),
        lat: Number(info[3]) * (Math.PI/180),
        lon: Number(info[4]) * (Math.PI/180),
        type: Number(info[7]),
        links: []
    };
}

const M = parseInt(readline());
for (let i = 0; i < M; i++) {
    const [ p1, p2 ] = readline().split(' ');
    graph[p1].links.push(p2);
}


function distance(lat, lon, lat1, lon1) {
    const x = (lon1 - lon) * Math.cos((lat + lat1)/ 2);
    const y = (lat1 - lat);
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) * 6371;
}

function nodeDistance(node, node1) {    
    return distance(node.lat, node.lon, node1.lat, node1.lon);
}

// Start and End are Node Ids - String  String
function astart(graph, start, end) {
    const astartGraph = JSON.parse(JSON.stringify(graph));
    Object.keys(astartGraph).forEach(k => {
        astartGraph[k].f = null;
        astartGraph[k].g = null;
        astartGraph[k].h = null;
        astartGraph[k].parent = null;
        astartGraph[k].closed = false;
        astartGraph[k].visited = false;
    });

    const endNode = astartGraph[end];
    const openList = [astartGraph[start]];

    astartGraph[start].g = 0;
    astartGraph[start].h = 0;
    astartGraph[start].f = 0;

    while (openList.length) {

        // Get lowest distant node
        let currentNode = openList[0];
        openList.forEach(n => {
            if (n.f < currentNode.f) {
                currentNode = n;
            }
        });

        // End
        if (currentNode === endNode) {
            const path = [];
            let pathNode = endNode

            do {
              path.unshift(pathNode)
              pathNode = pathNode.parent;
            } while (pathNode)

            return path;
        }

        // Remove from open List
        openList.splice(openList.findIndex(n => n === currentNode), 1);
        currentNode.closed = true;

        for (const link of currentNode.links) {
            const neighbor = astartGraph[link];
            if (neighbor.closed) {
                continue;
            }

            // Cost from Start to neighbor
            const gScore = currentNode.g + nodeDistance(currentNode, neighbor);

            if (!neighbor.visited) {
                openList.push(neighbor);
            }

            if (!neighbor.visited || gScore < neighbor.g) {
                neighbor.visited = true;
                neighbor.parent = currentNode;
                neighbor.h = neighbor.h || nodeDistance(neighbor, endNode);
                neighbor.g = gScore;
                neighbor.f = gScore + neighbor.h;
            }
        }
    }

    return [];
}

const path = astart(graph, startPoint, endPoint);
if (pathLength.length) {
    pathLength.forEach(n => console.log(n.name));
} else {
    console.log('IMPOSSIBLE');
}
