//stored variables
const pi = Math.PI;

let coords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
let lines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];
let biggestMag = 0;

let winHeight = 0;
let winWidth = 0;


let perspectiveEnabled = false; //This will decide whether or not to use perspective during rendering

function perspectiveChange() {
    if (perspectiveEnabled == false) {
        perspectiveEnabled = true;
    }
    else if (perspectiveEnabled == true) {
        perspectiveEnabled = false;
    }
    renderLines();
}

let followEnabled = true; //This will let the shape keep facing the mouse curser

function followChange() {
    if (followEnabled == false) {
        followEnabled = true;
    }
    else if (followEnabled == true) {
        followEnabled = false;
    }
    renderLines();
}





//Add two vectors
function vecAdd(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] + vec2[i]);
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
    hold = [];
    for (let i = 0; i < vec.length; i++){
        hold.push(scale*vec[i]);
    }
    return hold;
}

//returns array with [innerHeight, innerWidth]
function getViewSizes() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
}


//creates canvas and scales to the best fit
function createCanvas() {
    const scale = 0.96;
    const canvasWidth = scale*window.innerWidth;
    const canvasHeight = scale*window.innerHeight;
    const hold = '<center><canvas id="mainCanvas" height='+canvasHeight+' width='+canvasWidth+'></canvas></center>';
    document.getElementById("canvasHolder").innerHTML = hold;
}

//creates canvas and scales to the best 16:9 fit
function OLDcreateCanvas() {
    const scale = 0.95;
    const innerWidth = scale*window.innerWidth;
    const innerHeight = scale*window.innerHeight;
    let canvasWidth = ((9/16)*innerWidth < innerHeight) ? innerWidth:(16/9)*innerHeight;
    let canvasHeight = ((9/16)*innerWidth < innerHeight) ? (9/16)*innerWidth:innerHeight;
    //if (innerWidth > 840 && innerHeight > 525) {
    //    canvasWidth = 840;
    //    canvasHeight = 525;
    //}
    const hold = '<canvas id="mainCanvas" height='+canvasHeight+' width='+canvasWidth+'></canvas>';
    document.getElementById("canvasHolder").innerHTML = hold;
}

//function that does everything that needs to be done after a window resize
function windowResize() {
    createCanvas()
    renderLines()
}
window.addEventListener('resize', windowResize);

//sets biggestMag to current value
function setBiggestMag() {
    hold = 0;
    for (let i = 0; i < coords.length; i++) {
        if (vecMag(coords[i]) > biggestMag) {
            biggestMag = vecMag(coords[i]);
        }
    }
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
function doRotYZ() {
    rotYZ(coords, pi/12);
    renderLines();
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
function doRotXZ() {
    rotXZ(coords, pi/12);
    renderLines();
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
function doRotXY() {
    rotXY(coords, pi/12);
    renderLines();
}


//executes the wheel up
function doWheelUp() {
    if (perspectiveEnabled == false) {
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(0.95, coords[i]);
        }
    }
    renderLines();
}

//executes the wheel down
function doWheelDown() {
    if (perspectiveEnabled == false) {
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(1.05, coords[i]);
        }
    }
    renderLines();
}

//Takes the coords and scales it to fit the canvas
function scaleCoords(coords) {
    setBiggestMag(coords);
    const canHeight = document.getElementById("mainCanvas").height;
    if (biggestMag > 0.95*canHeight/2) {
        const scale = biggestMag/(0.95*canHeight/2);
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(0.95*scale, coords[i]);
        }
    }
    else if (biggestMag < 0.95*canHeight/2) {
        const scale = (0.95*canHeight/2)/biggestMag;
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(0.95*scale, coords[i]);
        }
    }
}


//Takes the coords and scales it to fit the canvas
function OLDscaleCoords(coords) {
    setBiggestMag(coords)
    const canHeight = document.getElementById("mainCanvas").height;
    if (biggestMag > canHeight/2) {
        const scale = biggestMag/(canHeight/2);
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(0.95*scale, coords[i]);
        }
    }
    else if (biggestMag < canHeight/10) {
        const scale = (canHeight/2)/biggestMag;
        for (let i = 0; i < coords.length; i++){
            coords[i] = vecScale(0.95*scale, coords[i]);
        }
    }
}

//checks for perspective and returns new scaled coordinates
function setPersp(canCenVec) {
    let hold = [];
    if (perspectiveEnabled == false) {
        for (let i = 0; i < coords.length; i++){
            hold.push(coords[i]);
        }
    }
    else if (perspectiveEnabled == true) {
        for (let i = 0; i < coords.length; i++){
            let dist = vecDist(canCenVec, coords[i])
            console.log(dist);
            let scale = 1/dist;
            console.log(scale);
            hold.push(vecScale(scale,coords[i]));
        }
    }
    return hold;
}

//returns object with mouse position
function getMousePos(canvas) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: window.innerWidth - rect.left,
      y: window.innerHeight - rect.top
    };
}

//if follow is on, returns new coords that are shifted to face the mouse
function doFollow(canvas) {
    const pos = getMousePos(canvas);
}

//Takes the coord and line data and renders them to the canvas
function renderLines(){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    setBiggestMag();
    scaleCoords(coords); //resizes coords so that they will fit the canvas nicely
    setBiggestMag();
    const canCenZ = 10*biggestMag;
    const canCenVec = [canCenX, canCenY, canCenZ];
    const eyeVec = [canCenX, canCenY, 0];
    finCoords = setPersp(eyeVec); //returns coords with possible perspective altering
    scaleCoords(finCoords);
    createCanvas();
    const canvas = document.getElementById("mainCanvas");
    let ctx = canvas.getContext("2d");
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < lines.length; i++){
        ctx.moveTo(canCenX + finCoords[lines[i][0]][0], canCenY + finCoords[lines[i][0]][1]);
        ctx.lineTo(canCenX + finCoords[lines[i][1]][0], canCenY + finCoords[lines[i][1]][1]);
        ctx.stroke();
    }
    let pos = getMousePos(canvas);
    let tx = pos.x;
    let ty = pos.y;
    ctx.font = "30px Arial";
    ctx.fillText("Hello World", tx, ty);
}


