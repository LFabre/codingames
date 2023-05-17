//:: Consts

// Total Nodes / Links / Gateways
const [N, L, G] = readline().split(' ');

const graph = {};
let gateways = [];

//:: Functions

// Add Link to graph
function addLink(graph, n1, n2) {
  const link = { to: n2, isClosed: false };

  if (graph[n1]) {
    graph[n1].links.push(link);
  } else {
    graph[n1] = {
      id: n1,
      links: [link],
      isGateway: false,
    }
  }
}

// Set Node as Gateway
function setGateway(graph, id, s = true) {
  if (!graph[id]) { return false; }

  graph[id].isGateway = s;
  return true;
}

function getPriorityLinks(graph) {
  const priorityNodes = [];

  for (const k in graph) {
    let connectedGateways = 0;

    for (let l of graph[k].links) {
      if (graph[l.to].isGateway) {
        connectedGateways++;
      }
    }
    
    if (connectedGateways >= 2) {
      priorityNodes.push(graph[k]);
    }
  }

  const priorityLinks = []
  for (const n of priorityNodes) {
    for (const l of n.links) {
      if (graph[l.to].isGateway) {
        priorityLinks.push({
          from: n.id,
          gateway: l.to
        });
      }
    }
  }

  priorityLinks.sort((a, b) => Number(a.gateway) - Number(b.gateway))

  return { 
    priorityLinks,
    priorityNodes,
    priorityNodesIds: priorityNodes.map(n => n.id)
  };
}

// Sets Link to Closed
function closeLink(graph, n1, n2) {
  if (!graph[n1] || !graph[n2]) {
    throw new Error(`Grpah does not have Node ${n1} or ${n2}`)
  }

  _closeLink(graph, n1, n2);
  _closeLink(graph, n2, n1);
}

function _closeLink(graph, n1, n2) {
  graph[n1].links.find(l => l.to === n2).isClosed = true;
}

function isNodeClosed(graph, nodeId) {
  return graph[nodeId].links.every(l => l.isClosed);
}

//:: BFS
function bfs(graph, start, end) {
  const pathMap = {}
  const queue = [graph[start]];
  const visited = [start];

  while (queue.length) {
    const node = queue.pop();
    
    if (node.id === end) {
      let nodePath = node;
      const path = [nodePath];

      while (nodePath.id != start) {
        nodePath = pathMap[nodePath.id];
        path.unshift(nodePath);
      }

      return path.reverse();
    }
   
    for (const l of node.links) {

      if (visited.includes(l.to)
        || l.isClosed
        || (graph[l.to].isGateway && l.to !== end)) {
        continue;
      }

      visited.push(l.to);
      pathMap[l.to] = node;
      queue.push(graph[l.to]);
    }
  }

  return [];
}

function getShortestPathToNodes(graph, start, nodes, earlyReturn = true) {
  let shortestDistance = Infinity, shortestPath;
  for (const n of nodes) {
    const path = bfs(graph, start, n);

    // Early Exit - Virus is right next to a Gateway
    if (path.length === 2 && earlyReturn) {
      shortestPath = path;
      break;
    }

    if (path.length && path.length < shortestDistance) {
        shortestDistance = path.length;
        shortestPath = path;
    }
  }

  return shortestPath;
}

function getPathsToNodes(graph, start, nodes) {
  const paths = []
  for (const n of nodes) {
    paths.push(bfs(graph, start, n));
  }

  return paths;
}

function getMostInsecurePath(graph, paths) {
  let mostInsecurePath = paths[0];
  let safetyRating = Infinity;
  
  for (let i = 0; i < paths.length; i++) {
    const sr = getPathSafetyRating(graph, paths[i]);
    
    if (sr < safetyRating) {
      mostInsecurePath = paths[i];
      safetyRating = sr;
    }
  }

  return mostInsecurePath;
}

function getPathSafetyRating(graph, path) {
  let safeNodes = 0, multipleEntryNodes = 0;

  for (const n of path) {
    let gatewayLinks = 0;

    for (const l of n.links) {
      if (graph[l.to].isGateway) {
        gatewayLinks++;
      }
    }

    if (gatewayLinks === 0 && !n.isGateway) {
      safeNodes++;
    }

    if (gatewayLinks > 1) {
      multipleEntryNodes++;
    }
  }

  return safeNodes - multipleEntryNodes;
}

//:: Build Graph
for (let i = 0; i < L; i++) {
  const [n1, n2] = readline().split(' ');
  addLink(graph, n1, n2);
  addLink(graph, n2, n1);
}

//:: Set Gateways
for (let i = 0; i < G; i++) {
  const gatewayId = parseInt(readline());
  gateways.push(gatewayId);
  setGateway(graph, gatewayId);
}

// Order Gateways
gateways.sort((a, b) => a - b);
gateways = gateways.map(String);

// Priority Links and Nodes
let { priorityLinks, priorityNodesIds } = getPriorityLinks(graph);

while (true) {
  const virusIdx = parseInt(readline());

  let nodeToClose, gatewayToClose
  const pathToClose = getShortestPathToNodes(graph, virusIdx, gateways);

  // Close from Priority Links
  if (pathToClose.length !== 2 && priorityLinks.length) {

    let priorityGateways = priorityLinks.map(l => l.gateway);
    priorityGateways = priorityGateways.filter((g, i) => i === priorityGateways.indexOf(g));

    const paths = getPathsToNodes(graph, virusIdx, priorityGateways);
    const mostInsecurePath = getMostInsecurePath(graph, paths);

    gatewayToClose = mostInsecurePath[0].id;
    
    // Get a link which is on the shortest path to gateway
    const possibleLinks = priorityLinks.filter(l => l.gateway === gatewayToClose);
    const linkOnPath =  possibleLinks.length === 1 ? null : possibleLinks.find(l => mostInsecurePath.find(n => n.id === l.from));
    
    nodeToClose = linkOnPath ? linkOnPath.from : possibleLinks[0].from;
    priorityLinks = priorityLinks.filter(l => l.from !== nodeToClose);
  } else {
    gatewayToClose = pathToClose[0].id;
    nodeToClose = pathToClose[1].id;
  }
  
  if (gatewayToClose && nodeToClose) {
    closeLink(graph, gatewayToClose, nodeToClose);
    
    if (isNodeClosed(graph, gatewayToClose)) {
      gateways.splice(gateways.indexOf(gatewayToClose), 1);
    }

    console.log(`${gatewayToClose} ${nodeToClose}`);
  }
}
