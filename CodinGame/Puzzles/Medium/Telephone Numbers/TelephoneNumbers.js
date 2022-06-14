const TREE = {
  roots: [],
  leafCount: 0
};

function findRoot(tree, n) {
  return tree.roots.find(r => r.n === n);
}

function pushNumberToTree(tree, telNumber) {
  const root = { n: telNumber[0], leafs: [] };
  tree.roots.push(root);
  tree.leafCount++;

  const node = root;
  pushNumber(tree, node, telNumber.substr(1));
}

function pushNumber(tree, node, telNumber) {
  let currentNode = node;

  for (let i = 0; i < telNumber.length; i++) {
      const node = { n: telNumber[i], leafs: [] };

      currentNode.leafs.push(node);
      currentNode = node;
      tree.leafCount++;
  }
}

const N = parseInt(readline());

for (let i = 0; i < N; i++) {
  const telephone = readline();

  const root = findRoot(TREE, telephone[0]);
  if (!root) {
      pushNumberToTree(TREE, telephone);
  } else {

      let curNode = root, previousNode = null;
      for (let j = 1; j < telephone.length; j++) {
          previousNode = curNode;
          curNode = curNode.leafs.find(n => n.n === telephone[j]);

          if (!curNode) {
              pushNumber(TREE, previousNode, telephone.substring(j))
              break;
          }
      }
  }
}

console.log(TREE.leafCount);
