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
var OrbitResolution = 120;
var speedadjustfactor = 0.05;
let cv;
var sun;
var end;
var arr_radius = [100, 45, 25];
var arr_revs = [1, 4, 3];
var arr_radoffset = [0, 0, -20];
let AnimRes_Input;
var revs_Inputs = [];
var radius_Inputs = [];
var offsets_Inputs = [];
let child1;
let child2;

function setup() {
    cv = createCanvas(600, 600);
    cv.parent('sketch-div');

    // AnimRes_Input = document.getElementById("ResolutionAnim");
    // AnimRes_Input.value = resolution;
    // AnimRes_Input.oninput = function() {
    //     if (isNaN(AnimRes_Input.value) === false && AnimRes_Input.value <= 1300 && AnimRes_Input.value > 5) {
    //         resolution = AnimRes_Input.value;
    //     }
    // };
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
    InitObjects();
    drawMe = true;
}

function CalcPath() {
    let ir;
    //adjust resolution:
    let Child1ResolutionCalc = OrbitResolution / end.getSumOfRevolutions() * sun.child.RevsAroundParent;

    if (Child1ResolutionCalc < 100) {
        console.log("Child1ResolutionCalc " + Child1ResolutionCalc);
        let adjustratio = 100 / Child1ResolutionCalc;
        OrbitResolution = floor(OrbitResolution * adjustratio);
        //console.log("adjusted resolution " + OrbitResolution);
        ir = end.GetMyAngleIncr(OrbitResolution, end.RevsAroundParent);
    }

    let child2incrementsteps = OrbitResolution * end.getSumOfRevolutions();
    //child2.angleIncr = TWO_PI / OrbitResolution;
    //child2.angleIncr = TWO_PI / child2incrementsteps;
    //child1.angleIncr = TWO_PI / OrbitResolution * child2.RevsAroundParent;
    console.log(child1.angleIncr);
    console.log(child2.angleIncr + "______res: " + OrbitResolution);
    console.log(child1.angleIncr / child2.angleIncr + "   Child2.Revs " + child2.RevsAroundParent);
    console.log(child2incrementsteps);
    //console.log("total revs child2: " + child1.RevsAroundParent * child2.RevsAroundParent);

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

function InitObjects() {
    sun = new Orbit(width / 2, height / 2, arr_radius[0], null, 0, arr_revs[0]);
    child1 = sun.addChild(arr_radius[1], arr_radoffset[1], arr_revs[1]);
    child2 = child1.addChild(arr_radius[2], arr_radoffset[2], arr_revs[2]);
    end = child2;
    stepCounterLimit = 152000;
    //console.log("Init: steps planned: " + sun.child.RevsAroundParent * sun.child.child.RevsAroundParent * sun.OrbitResolution);
    path = [];
    drawMe = true;
}

function ReadInputValues() {
    console.log("input");
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



    lblInfo.innerHTML = stepCounter + "------path.length: " + path.length;

    if (path.length > 155000) {
        //path.splice(0, 10000);
        console.log("Path too long: " + path.length + "StepCounter: " + stepCounter);
    }

    if (stepCounter > stepCounterLimit) {
        //noLoop();
        //console.log("2stepCounter: " + stepCounter);
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