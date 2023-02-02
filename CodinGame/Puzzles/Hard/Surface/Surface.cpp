#include <iostream>
#include <iterator>
#include <string>
#include <vector>
#include <queue>
#include <map>
#include <algorithm>

using namespace std;

typedef map<int, int> CacheMap;

int W;
int H;
int SIZE;
const char LAKE = 'O';

int calculateLakeSurface(string terrain, int idx, vector<int> &visited) {
    
    int surface = 0;
    queue<int> openList;

    openList.push(idx);

    while (!openList.empty()) {
        int _i = openList.front();
        openList.pop();

        if (terrain[_i] == LAKE && !visited[_i]) {

            visited[_i] = idx;

            // THIS IS VERY IMPORTANT WHEN USING SINGLE ARRAY
            bool isEdgeRight = _i % W == (W - 1);
            bool isEdgeLeft = _i % W == 0;

            if (!isEdgeRight && _i + 1 >= 0 && _i + 1 < SIZE) { openList.push(_i + 1); }
            if (!isEdgeLeft && _i - 1 >= 0 && _i - 1 < SIZE) { openList.push(_i - 1); }
            if (_i + W >= 0 && _i + W < SIZE) { openList.push(_i + W); }
            if (_i - W >= 0 && _i - W < SIZE) { openList.push(_i - W); }

            surface++;
        }
    }

    return surface;
}

int main() {

    cin >> W; cin.ignore();
    cin >> H; cin.ignore();
    SIZE = W * H;
    
    string terrain;
    vector<int> visitedMap(SIZE);
    CacheMap resultMap;

    // Build Map
    for (int i = 0; i < H; i++) {
        string row;
        getline(cin, row);

        terrain += row;
    }

    int n;
    cin >> n; cin.ignore();

    for (int i = 0; i < n; i++) {
        int x, y, surface;
        cin >> x >> y; cin.ignore();

        int idx = y * W + x;
        if (visitedMap[idx]) {
            surface = resultMap[visitedMap[idx]];
        } else {
            surface = calculateLakeSurface(terrain, idx, visitedMap);
            resultMap.insert_or_assign(idx, surface);
        }

        cout << surface << endl;
    }
}