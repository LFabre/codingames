// :: Types
type NodeType = 'GATEWAY' | 'STANDARD';

interface Node {
    id: string;
    type: NodeType;
    links: string[];
}

type Graph = Record<string, Node>;

const graph: Graph = {};

// :: Graph Methods
const addNode = (graph: Graph, id: string, type: NodeType = 'STANDARD') => {
    if (graph[id]) return;

    graph[id] = { id, type, links: [] };
}

const addLink = (graph: Graph, n1: string, n2: string) => {
    if (!graph[n1] || !graph[n2]) return;

    graph[n1].links.push(n2);
    graph[n2].links.push(n1);
}

const removeLinks = (graph: Graph, n1: string, n2: string) => {
    removeLink(graph, n1, n2);
    removeLink(graph, n2, n1);
}

const removeLink = (graph: Graph, n1: string, n2: string) => {
    if (!graph[n1] || !graph[n2]) return;
    graph[n1].links = graph[n1].links.splice(graph[n1].links.indexOf(n2), 1);
}

// :: Solution
const bfs = (graph: Graph, start: string) => {
    if (!graph[start]) return [];

    const pathMap = {};
    const queue = [start];
    const visited = [start];

    while (queue.length) {
        const id = queue.pop();
        const node = graph[id]

        if (node.type === 'GATEWAY') {
            return createPathArray(pathMap, start, node.id);
        }

        for (const l of node.links) {
            if (visited.includes(l)) continue;

            pathMap[l] = node.id;
            queue.unshift(l);
            visited.unshift(l);
        }
    }
}

const createPathArray = (pathMap: Record<string, string>, start: string, end: string) => {
    let cur = end;
    const path = [end];

    while (cur !== start) {
        cur = pathMap[cur];
        path.unshift(cur);
    }

    return path;
}

// :: Build Grapph
const [N, L, E] = readline().split(' ').map(Number);

for (let i = 0; i < L; i++) {
    const [N1, N2] = readline().split(' ');

    addNode(graph, N1);
    addNode(graph, N2);
    addLink(graph, N1, N2);
}

for (let i = 0; i < E; i++) {
    const id = readline();
    if (!graph[id]) continue;

    graph[id].type = 'GATEWAY';
}

// :: Core
while (true) {
    const SI = readline();

    const path = bfs(graph, SI);

    const c1 = path.at(-2);
    const c2 = path.at(-1);

    removeLinks(graph, c1, c2);
    console.log(`${c1} ${c2}`);
}
