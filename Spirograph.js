// Inspirired by
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI
/// <reference path="./node_modules/@types/p5/global.d.ts" />
var path = [];
var SunTotalRevs = 3;
var angle = 0;
var stepCounter = 0;
var stepCounterLimit = 0;
var drawMe = false;
var animation = false;
var OrbitResolution = 50;
var speedadjustfactor = 0.05;
let cv;
var sun;
var end;
var arr_radius = [100, 50, 25, 12, 2, 5, 10];
var arr_revs = [1, -1, 4, -3, -8, 2, 2];
var arr_radoffset = [0, 0, 0, 0, 0, 0, 0];
let AnimSpeedSlider;
let animresolution;
var revs_Inputs = [];
var radius_Inputs = [];
var offsets_Inputs = [];
let child1;
let child2;
let child3;
let lblInfo;

function setup() {
    cv = createCanvas(600, 600);
    cv.parent('sketch-div');
    lblInfo = document.getElementById("lblInfo");
    for (let i = 0; i < 3; i++) {
        revs_Inputs[i] = document.getElementById("rev" + String(i + 1) + "Input");
        offsets_Inputs[i] = document.getElementById("offset" + String(i + 1) + "Input")
        radius_Inputs[i] = document.getElementById("radius" + String(i + 1) + "Input");
    }
    for (let k = 0; k < 2; k++) {
        AddMyOnInputEventHandler(revs_Inputs[k], arr_revs, k + 1, false, null);
        AddMyOnInputEventHandler(offsets_Inputs[k], arr_radoffset, k + 1, false, null);
        AddMyOnInputEventHandler(radius_Inputs[k], arr_radius, k + 1, false, null);
        revs_Inputs[k].value = arr_revs[k + 1];
        offsets_Inputs[k].value = arr_radoffset[k + 1];
        radius_Inputs[k].value = arr_radius[k + 1];
    }
    AnimSpeedSlider = document.getElementById("AnimSpeedSlider");
    InitObjects();

}
function GenerateRandomPattern(e){
    for (let i=1;i<4;i++){
        revs_Inputs[i]=pow(e,i);
        radius_Inputs[i] =random(10,70);
        offsets_Inputs[i]=random(-50,50);
    }
}

function InitObjects() {

    let childx;

    sun = new Orbit(width / 2, height / 2, arr_radius[0], null, 0, arr_revs[0]);
    childx = sun;
    for (let i = 1; i < 4; i++) {
        childx = childx.addChild(arr_radius[i], arr_radoffset[i], arr_revs[i]);
    }
    end = childx;
    path = [];
    stepCounterLimit = AdjustOrbitAngleIncrements();

    drawMe = true;
    animation = false;
    //drawMe = false;
    //animation = true;

}

function AdjustOrbitAngleIncrements() {

    let ir;
    OrbitResolution = 50; //let Child1ResolutionCalc = abs(OrbitResolution / end.getSumOfRevolutions() * sun.child.RevsAroundParent);
    let child2incrementsteps = abs(OrbitResolution * end.getSumOfRevolutions());

    if (child2incrementsteps > 10000) {
        let adjustratio = 10000 / child2incrementsteps;
        OrbitResolution = OrbitResolution * adjustratio;
        if (OrbitResolution < 15) {
            OrbitResolution = 15;
        }
        ir = end.GetMyAngleIncr(OrbitResolution, end.RevsAroundParent);
    }
    child2incrementsteps = abs(OrbitResolution * end.getSumOfRevolutions());
    if (child2incrementsteps > 10000) {
        child2incrementsteps = 10000;
    }
    return child2incrementsteps;
}

function ReadInputValues() {

    for (let k = 0; k < 2; k++) {
        arr_revs[k + 1] = revs_Inputs[k].value;
        arr_radoffset[k + 1] = offsets_Inputs[k].value;
        arr_radius[k + 1] = radius_Inputs[k].value;
    }

    path = [];
    stepCounter = 0;
    InitObjects();

};

function draw() {

    if (drawMe) {
        background(51);
        CalcPath();
        displayVertexShape();
        drawMe = false;
    }
    if (animation) {
        Animate();
    }
    lblInfo.innerHTML = stepCounter + "------path.length: " + path.length;
    if (path.length > 50000) {
        path.splice(0, 2000);
        console.log("Path too long: " + path.length + "StepCounter: " + stepCounter);
    }

    if (stepCounter > stepCounterLimit) {
        //noLoop();
        //console.log("2stepCounter: " + stepCounter);
    }
}

function CalcPath() {
    let child2incrementsteps = stepCounterLimit;
    for (let child1Steps = 0; child1Steps < child2incrementsteps; child1Steps += 1) {
        var next = sun.child
        while (next != null) {
            next.update();
            next = next.child;
        }
        path.push(createVector(end.x, end.y));
        stepCounter++;
    }
}

function Animate() {

    background(51);
    let fastStep = 1 / end.angleIncr;
    let slowStep = 0.01 / end.angleIncr;

    animresolution = map(AnimSpeedSlider.value, 0, 100, slowStep, fastStep);

    for (var i = 0; i < animresolution; i++) {
        var next = sun;
        while (next != null) {
            next.update();
            next = next.child;
        }
        path.push(createVector(end.x, end.y));
    }
    var next = sun;
    while (next != null) {
        next.show();
        next = next.child;
    }

    displayVertexShape();
    if (path.length > stepCounterLimit) {
        animation = false;
    }
}

function displayVertexShape() {
    strokeWeight(1);
    beginShape();
    stroke(255, 0, 255);
    noFill();
    for (var pos of path) {
        vertex(pos.x, pos.y);
    }
    endShape();
}


function AddMyOnInputEventHandler(myHtmlElement, myArray, myIndex, WriteBackValue, displayingelement) {

    myHtmlElement.oninput = function() {
        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value != "") {
            myArray[myIndex] = parseFloat(myHtmlElement.value);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
        }
        ReadInputValues();
    };
}

function AddMyOnWheelEventHandler(myHtmlElement, incr, myArray, myIndex, WriteBackValue, displayingelement) {

    myHtmlElement.onwheel = function(e) {
        e.preventDefault();
        if (isNaN(myHtmlElement.value) === false && myHtmlElement.value != "") {
            if (e.deltaY > 0) {
                myHtmlElement.value = parseFloat(myHtmlElement.value) - parseFloat(incr)
            } else {
                myHtmlElement.value = parseFloat(myHtmlElement.value) + parseFloat(incr);
            }
            myArray[myIndex] = parseFloat(myHtmlElement.value);
            if (WriteBackValue) displayingelement.value = myArray[myIndex];
            //console.log("onwheel " + myHtmlElement.id)
        }
    };
}




function keyPressed() {

   
    if ((key == "f" || key == "F") && keyCode !== 102) {
        GenerateRandomPattern();

    }
}