// inspirired by
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI
/// <reference path="./node_modules/@types/p5/global.d.ts" />
var path = [];
var SunTotalRevs = 3;
var angle = 0;
var resolution = 5; //animation resolution
var stepCounter = 0;
var stepCounterLimit = 0;
//var PointsPerCircle = 100; //speed effect
var speedadjustfactor = 0.05;
let cv;
var sun;
var end;
var arr_radius = [100, 45, 25];
var arr_revs = [1, 2, 7.11242523454];
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

    AnimRes_Input = document.getElementById("ResolutionAnim");
    AnimRes_Input.value = resolution;
    AnimRes_Input.oninput = function() {
        if (isNaN(AnimRes_Input.value) === false && AnimRes_Input.value <= 1300 && AnimRes_Input.value > 5) {
            resolution = AnimRes_Input.value;
        }
    };
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
    //console.log(TWO_PI / child2.angleincr);
    //console.log(child2.RevsAroundParent);   
    //console.log(child2.angleincr);
    //stepCounterLimit = (TWO_PI / child2.angleincr / speedadjustfactor) * child2.RevsAroundParent;
}

function InitObjects() {

    sun = new Orbit(width / 2, height / 2, arr_radius[0], 1, null, 0, arr_revs[0]);
    
    child1 = sun.addChild(arr_radius[1], arr_radoffset[1], arr_revs[1]);
    child2 = child1.addChild(arr_radius[2], arr_radoffset[2], arr_revs[2]);
    end = child2;
    stepCounterLimit = 360;
    console.log("INitobjects: steps"+sun.child.RevsAroundParent * stepCounterLimit);
    path = [];
    

}

function resetSketch() {

    for (let k = 0; k < 2; k++) {
        arr_revs[k + 1] = revs_Inputs[k].value;
        arr_radoffset[k + 1] = offsets_Inputs[k].value;
        arr_radius[k + 1] = radius_Inputs[k].value;
    }

    console.log("resetSketch");
    path = [];
    stepCounter = 0;
    InitObjects();

};

function draw() {
    background(51);


    let child1step = TWO_PI / stepCounterLimit / sun.child.RevsAroundParent;
    let child1anglemax = TWO_PI * sun.child.RevsAroundParent;

    for (let child1Angle = 0; child1Angle < child1anglemax; child1Angle += child1step) {
        var next = child1;
        let a = child1Angle;
        while (next != null) {
            a = a * next.RevsAroundParent;
            next.update(a);
            next = next.child;
        }
        path.push(createVector(end.x, end.y));
        stepCounter++;
    }

    // for (var i = 0; i < resolution; i++) {
    //     var next = sun;
    //     while (next != null) {
    //         next.update();
    //         next = next.child;
    //     }
    //     path.push(createVector(end.x, end.y));
    //     stepCounter++;
    // }

    // var next = sun;
    // while (next != null) {
    //     next.show();
    //     next = next.child;
    // }
    strokeWeight(1);
    beginShape();
    stroke(255, 0, 255);
    noFill();
    for (var pos of path) {
        vertex(pos.x, pos.y);
    }
    endShape();
    lblInfo.innerHTML = stepCounter + "------path.length: " + path.length;
    path = [];
    if (path.length > 55000) {
        path.splice(0, 10000);
        console.log("PAth too long: " + path.length + "StepCounter: " + stepCounter);
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
        resetSketch();
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