//stored variables
const testCoords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
const testLines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];

let winHeight = 0;
let winWidth = 0;


let perspectiveEnabled = false; //This will decide whether or not to use perspective during rendering






//Add two vectors
function vecAdd(vec1, vec2){
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] + vec2[i]);
    }
    return hold;
}

//returns vector magnitude
function vecMag(vec){
    let hold = 0;
    for (let i = 0; i < vec.length; i++){
        hold += vec[i]**2;
    }
    return (hold)**0.5;
}

//scalar multiply a vector
function vecScale(scale, vec){
    hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(scale*vec1[i]);
    }
    return hold;
}

//returns array with [innerHeight, innerWidth]
function getViewSizes(){
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
}


//creates canvas and scales to the best 16:9 fit
function createCanvas(){
    const scale = 0.95;
    const innerWidth = scale*window.innerWidth;
    const innerHeight = scale*window.innerHeight;
    let canvasWidth = ((9/16)*innerWidth < innerHeight) ? innerWidth:(16/9)*innerHeight;
    let canvasHeight = ((9/16)*innerWidth < innerHeight) ? (9/16)*innerWidth:innerHeight;
    if (innerWidth > 840 && innerHeight > 525) {
        canvasWidth = 840;
        canvasHeight = 525;
    }
    const hold = '<canvas id="mainCanvas" height='+canvasHeight+' width='+canvasWidth+'></canvas>';
    document.getElementById("canvasHolder").innerHTML = hold;
}

//function that does everything that needs to be done after a window resize
function windowResize(){
    createCanvas()
}
//windowResize()
//window.addEventListener('resize', windowResize);

