//stored variables
const pi = Math.PI;
const gR = (1 + 5**0.5)/2; //golden ratio
const gRR = 1/gR; //golden ratio reciprocal

//storage for the dodecahedron and line data
const dodeCoords = [[1, 1, 1], [1, -1, 1], [-1, 1, 1], [-1, -1, 1], [1, 1, -1], [1, -1, -1], [-1, 1, -1], [-1, -1,- 1],
    [0, (1 + gRR), (1 - gRR**2)],[0, -(1 + gRR), (1 - gRR**2)],[0, (1 + gRR), -(1 - gRR**2)],[0, -(1 + gRR), -(1 - gRR**2)],
    [(1 + gRR), (1 - gRR**2), 0],[-(1 + gRR), (1 - gRR**2), 0],[(1 + gRR), -(1 - gRR**2), 0],[-(1 + gRR), -(1 - gRR**2), 0],
    [(1 - gRR**2), 0, (1 + gRR)],[-(1 - gRR**2), 0, (1 + gRR)],[(1 - gRR**2), 0, -(1 + gRR)],[-(1 - gRR**2), 0, -(1 + gRR)]];
const dodeLines = [[0, 8], [0, 12], [0, 16], [1, 9], [1, 14], [1, 16], [2, 8], [2, 13], [2, 17], [3, 9], [3, 15], [3, 17], [4, 10], [4, 12], [4, 18], [5, 11], [5, 14], [5, 18], [6, 10], [6, 13], [6, 19], [7, 11], [7, 15], [7, 19], [8, 10], [9, 11], [12, 14], [13, 15], [16, 17], [18, 19]];

//storage for the cube coord and line data
const cubeCoords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
const cubeLines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];

//storage for the tetrahedron coord and line data
const tetraCoords = [[1,0,-1/(2**0.5)],[-1,0,-1/(2**0.5)],[0,1,1/(2**0.5)],[0,-1,1/(2**0.5)]];
const tetraLines = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

//storage for the octahedron coord and line data
const octaCoords = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const octaLines = [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]];

//storage for the icosahedron coord and line data
const icosaCoords = [[gR, 1, 0], [-gR, 1, 0], [gR, -1, 0], [-gR, -1, 0], [1, 0, gR], [-1, 0, gR], [1, 0, -gR], [-1, 0, -gR], [0, gR, 1], [0, -gR, 1], [0, gR, -1], [0, -gR, -1]];
const icosaLines = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [1, 3], [1, 5], [1, 7], [1, 8], [1, 10], [2, 4], [2, 6], [2, 9], [2, 11], [3, 5], [3, 7], [3, 9], [3, 11], [4, 5], [4, 8], [4, 9], [5, 8], [5, 9], [6, 7], [6, 10], [6, 11], [7, 10], [7, 11], [8, 10], [9, 11]];

//storage for the hypercube coord and line data
//const hypCubeCoords = [[1,-1,1,1], [1,1,1,1], [-1,1,1,1], [-1,-1,1,1], [1,-1,-1,1], [1,1,-1,1], [-1,1,-1,1], [-1,-1,-1,1], [1,-1,1,-1], [1,1,1,-1], [-1,1,1,-1], [-1,-1,1,-1], [1,-1,-1,-1], [1,1,-1,-1], [-1,1,-1,-1], [-1,-1,-1,-1]];
const hypCubeCoords = [[2,-2,2,2], [2,2,2,2], [-2,2,2,2], [-2,-2,2,2], [2,-2,-2,2], [2,2,-2,2], [-2,2,-2,2], [-2,-2,-2,2], [2,-2,2,-2], [2,2,2,-2], [-2,2,2,-2], [-2,-2,2,-2], [2,-2,-2,-2], [2,2,-2,-2], [-2,2,-2,-2], [-2,-2,-2,-2]];
const hypCubeLines = [[0, 1], [0, 3], [0, 4], [0, 8], [1, 2], [1, 5], [1, 9], [2, 3], [2, 6], [2, 10], [3, 7], [3, 11], [4, 5], [4, 7], [4, 12], [5, 6], [5, 13], [6, 7], [6, 14], [7, 15], [8, 9], [8, 11], [8, 12], [9, 10], [9, 13], [10, 11], [10, 14], [11, 15], [12, 13], [12, 15], [13, 14], [14, 15]];


//returns a copy of an array
function arrCopy(arr){
    let hold = [];
    for (let i = 0; i < arr.length; i++){
        hold.push(arr[i]);
    }
    return hold;
}

//Add two vectors
function vecAdd(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] + vec2[i]);
    }
    return hold;
}

//Returns dot product of two vectors
function vecDot(vec1, vec2) {
    let hold = 0;
    for (let i = 0; i < vec1.length; i++){
        hold += vec1[i]*vec2[i];
    }
    return hold;
}

//returns vector magnitude
function vecMag(vec) {
    let hold = 0;
    for (let i = 0; i < vec.length; i++){
        hold += vec[i]**2;
    }
    return (hold)**0.5;
}

//finds the difference between two vectors vec1 - vec2
function vecDiff(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] - vec2[i]);
    }
    return hold;
}

//finds the distance between two vectors
function vecDist(vec1, vec2) {
    return vecMag(vecDiff(vec1, vec2));
}

//scalar multiply a vector
function vecScale(scale, vec) {
    let hold = [];
    for (let i = 0; i < vec.length; i++){
        hold.push(scale*vec[i]);
    }
    return hold;
}

//returns the cross product of two vectors
function vecCross(vec1, vec2) {
    return [vec1[1]*vec2[2]-vec1[2]*vec2[1], vec1[2]*vec2[0]-vec1[0]*vec2[2], vec1[0]*vec2[1]-vec1[1]*vec2[0]];
}


//Takes coorda and rotates them in the yz-plane
function rotYZ(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let y = coords[i][1];
        let z = coords[i][2];
        coords[i][1] = y*Math.cos(theta) - z*Math.sin(theta);
        coords[i][2] = y*Math.sin(theta) + z*Math.cos(theta);
    }
}


//Takes coorda and rotates them in the xz-plane
function rotXZ(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let z = coords[i][2];
        coords[i][0] = x*Math.cos(theta) - z*Math.sin(theta);
        coords[i][2] = x*Math.sin(theta) + z*Math.cos(theta);
    }
}


//Takes coorda and rotates them in the xz-plane
function rotXY(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let y = coords[i][1];
        coords[i][0] = x*Math.cos(theta) - y*Math.sin(theta);
        coords[i][1] = x*Math.sin(theta) + y*Math.cos(theta);
    }
}


//Takes coords and rotates them in the xw-plane
function rotXW(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let w = coords[i][3];
        coords[i][0] = x*Math.cos(theta) - w*Math.sin(theta);
        coords[i][3] = x*Math.sin(theta) + w*Math.cos(theta);
    }
}


//Takes coords and rotates them in the yw-plane
function rotYW(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let y = coords[i][1];
        let w = coords[i][3];
        coords[i][1] = y*Math.cos(theta) - w*Math.sin(theta);
        coords[i][3] = y*Math.sin(theta) + w*Math.cos(theta);
    }
}


//Takes coords and rotates them in the yw-plane
function rotZW(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let z = coords[i][2];
        let w = coords[i][3];
        coords[i][2] = z*Math.cos(theta) - w*Math.sin(theta);
        coords[i][3] = z*Math.sin(theta) + w*Math.cos(theta);
    }
}


export const shapeData = {
    "cubeCoords": arrCopy(cubeCoords),
    "cubeLines": arrCopy(cubeLines)
};
