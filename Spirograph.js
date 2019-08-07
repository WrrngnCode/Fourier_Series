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
var OrbitResolution = 120;
var speedadjustfactor = 0.05;
let cv;
var sun;
var end;
var arr_radius = [100, 45, 25, 1];
var arr_revs = [1, 4, 3, 1];
var arr_radoffset = [0, 0, -20, 0];
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
    for (let i = 0; i < 2; i++) {
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


function InitObjects() {
    sun = new Orbit(width / 2, height / 2, arr_radius[0], null, 0, arr_revs[0]);
    child1 = sun.addChild(arr_radius[1], arr_radoffset[1], arr_revs[1]);
    child2 = child1.addChild(arr_radius[2], arr_radoffset[2], arr_revs[2]);
    child3 = child2.addChild(arr_radius[3], arr_radoffset[3], arr_revs[3]);
    end = child3;
    path = [];
    stepCounterLimit = AdjustOrbitAngleIncrements();
    drawMe = false;
    animation = true;

}

function AdjustOrbitAngleIncrements() {

    let ir;
    let Child1ResolutionCalc = OrbitResolution / end.getSumOfRevolutions() * sun.child.RevsAroundParent;
    if (Child1ResolutionCalc < 40) {
        // console.log("Child1ResolutionCalc " + Child1ResolutionCalc);
        let adjustratio = 40 / Child1ResolutionCalc;
        OrbitResolution = floor(OrbitResolution * adjustratio);
        //console.log("adjusted resolution " + OrbitResolution);
        ir = end.GetMyAngleIncr(OrbitResolution, end.RevsAroundParent);
    }
    let child2incrementsteps = OrbitResolution * end.getSumOfRevolutions();
    // console.log(child1.angleIncr);
    console.log(end.angleIncr + "______res: " + OrbitResolution);
    //console.log(child2.angleIncr / child1.angleIncr + "   Child2.Revs " + child2.RevsAroundParent);
    console.log("Stepcount: " + child2incrementsteps);
    //console.log("total revs child2: " + child1.RevsAroundParent * child2.RevsAroundParent);

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
        strokeWeight(1);
        beginShape();
        stroke(255, 0, 255);
        noFill();
        for (var pos of path) {
            vertex(pos.x, pos.y);
        }
        endShape();
        drawMe = false;
    }
    if (animation) {
        Animate();
    }
    lblInfo.innerHTML = stepCounter + "------path.length: " + path.length;
    if (path.length > 100000) {
        path.splice(0, 10000);
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
        var next = child1;
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
    strokeWeight(1);
    beginShape();
    stroke(255, 0, 255);
    noFill();
    for (var pos of path) {
        vertex(pos.x, pos.y);
    }
    endShape();

    if (path.length > stepCounterLimit) {
        //path = [];
        animation = false;
    }
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