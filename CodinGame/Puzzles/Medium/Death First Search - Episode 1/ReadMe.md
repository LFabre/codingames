# Death First Search - Episode 1

[Codin Game - Death First Search - Episode 1](https://www.codingame.com/training/medium/death-first-search-episode-1)

## Goal

Your virus has caused a backdoor to open on the Bobnet network enabling you to send new instructions in real time.

You decide to take action __by stopping Bobnet from communicating on its own internal network.__

Bobnet's network is divided into several smaller networks, in each sub-network is a Bobnet agent tasked with transferring information by moving from node to node along links and __accessing gateways leading to other sub-networks.__

Your mission is to reprogram the virus so it will __sever links__ in such a way that the Bobnet Agent is unable to access another sub-network thus preventing information concerning the presence of our virus to reach Bobnet's central hub.

## Rules

For each test you are given:

- A map of the network.
- The position of the exit gateways.
- The starting position of the Bobnet agent.

Nodes can only be connected to up to a single gateway.

Each game turn:

- First off, you sever one of the given links in the network.
- Then the Bobnet agent moves from one Node to another accessible Node.

### Victory Conditions

The Bobnet agent cannot reach an exit gateway

### Lose Conditions

The Bobnet agent has reached a gateway

## Game Input

The program must first read the initialization data from standard input. Then, within an infinite loop, read the data from the standard input related to the current state of the Bobnet agent and provide to the standard output the next instruction.

### Initialization input

- Line 1: 3 integers `N` `L` `E`
- `N`, the total number of nodes in the level, including the gateways.
- `L`, the number of links in the level.
- `E`, the number of exit gateways in the level.

Next `L` lines: 2 integers per line (`N1`, `N2`), indicating a link between the nodes indexed `N1` and `N2` in the network.

Next `E` lines: 1 integer EI representing the index of a gateway node.

### Input for one game turn

Line 1: 1 integer SI, which is the index of the node on which the Bobnet agent is positioned this turn.

### Output for one game turn

A single line comprised of two integers C1 and C2 separated by a space. C1 and C2 are the indices of the nodes you wish to sever the link between.

### Constraints

- 2 ≤ `N` ≤ 500
- 1 ≤ `L` ≤ 1000
- 1 ≤ `E` ≤ 20
- 0 ≤ `N1`, `N2` < N
- 0 ≤ `SI` < N
- 0 ≤ `C1`, C2 < N
- Response time per turn ≤ 150ms
