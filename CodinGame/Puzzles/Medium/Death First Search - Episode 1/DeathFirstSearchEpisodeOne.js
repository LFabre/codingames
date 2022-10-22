const graph = {}, gateways = [];
const [N, L, E] = readline().split(' ').map(Number);

function addLinks(graph, n1, n2) {
  addLink(graph, n1, n2);
  addLink(graph, n2, n1);
}

function addLink(graph, n1, n2) {
  if (graph[n1])
    graph[n1].links.push(n2);
  else
    graph[n1] = {
      id: n1,
      isGateway: false,
      links: [n2]
    };
}

function removeLinks(graph, n1, n2) {
  removeLink(graph, n1, n2);
  removeLink(graph, n2, n1);
}

function removeLink(graph, n1, n2) {
  graph[n1].links.splice(graph[n1].links.indexOf(n2), 1);
}

function bfs(graph, start) {
  const path = {};
  const queue = [start];
  const visited = [start];

  while (queue.length) {
    const node = queue.pop();

    if (graph[node].isGateway) {
      return buiildBfsPath(start, node, path);
    }

    for (const l of graph[node].links) {
      if (visited.indexOf(l) === -1) {
        visited.push(l);
        path[l] = node;
        queue.unshift(l);
      }
    }
  }

  return [];
}

function buiildBfsPath(start, end, parentsMap) {
  let node = end;
  const path = [node];

  while (node != start) {
    node = parentsMap[node];
    path.unshift(node);
  }

  return path;
}

for (let i = 0; i < L; i++) {
  const [N1, N2] = readline().split(' ').map(Number);
  addLinks(graph, N1, N2);
}

for (let i = 0; i < E; i++) {
  const EI = Number(readline());

  gateways.push(EI);
  graph[EI].isGateway = true;
}

while (true) {
  const SI = Number(readline());

  const path = bfs(graph, SI);
  removeLinks(graph, path.at(-2), path.at(-1));

  console.log(`${path.at(-2)} ${path.at(-1)}`);
}
