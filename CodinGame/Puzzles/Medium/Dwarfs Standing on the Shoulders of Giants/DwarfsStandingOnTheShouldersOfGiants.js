const N = parseInt(readline());

const graph = {};
const visitedNodes = {};
const cache = {};

function graphAddNode(graph, n1) {
    if (graph[n1]) { return; }

    graph[n1] = {
        id: n1,
        isSource: true,
        links: []
    };
}

function graphAddLink(graph, n1, n2) {
    if (!graph[n1] || !graph[n2]) { return; }

    graph[n1].links.push(n2);
    graph[n2].isSource = false;
}

function getSourceNodesIdx(graph) {
    return Object.keys(graph).filter(k => graph[k].isSource);
}

function longestPath(graph, idx, visited, cache) {
    let deepest = 0;

    for (const l of graph[idx].links) {
        let lDeep = visited[l] ? cache[l] : longestPath(graph, l, visited, cache)

        if (lDeep > deepest) {
            deepest = lDeep;
        }
    }

    visited[idx] = true;
    cache[idx] = deepest + 1;
    return deepest + 1;
}

//:: Create Graph
for (let i = 0; i < N; i++) {
    const [ n1, n2 ] = readline().split(' ').map(Number);

    graphAddNode(graph, n1);
    graphAddNode(graph, n2);
    graphAddLink(graph, n1, n2);
}

//:: Get Source Nodes
const sourceNodesIdx = getSourceNodesIdx(graph);

const pathLength = sourceNodesIdx.reduce((r, idx) => {
    return Math.max(r, longestPath(graph, idx, visitedNodes, cache));
}, 0);

console.log(pathLength);
