// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI
/// <reference path="./node_modules/@types/p5/global.d.ts" />
var path = [];
var SunTotalRevs = 3;
var angle = 0;
var resolution = 55;
var stepCounter = 0;
var stepCounterLimit = 0;
//var PointsPerCircle = 100; //speed effect
var speedadjustfactor = 50;
let cv;
var sun;
var end;
var arr_radius = [100, 40, 15];
var arr_revs = [1, 6, 9];
var arr_radoffset = [0, 0, 0];
let AnimRes_Input;
var revs_Inputs = [];
var radius_Inputs = [];
var offsets_Inputs = [];
let child1;
let child2;
function setup() {
    cv = createCanvas(600, 600);
    cv.parent('sketch-div');

    for (let i = 0; i < 2; i++) {
        revs_Inputs[i] = document.getElementById("rev" + String(i + 1) + "Input");
        offsets_Inputs[i] = document.getElementById("offset" + String(i + 1) + "Input")
        radius_Inputs[i] = document.getElementById("radius" + String(i + 1) + "Input");
    }
    AnimRes_Input = document.getElementById("ResolutionAnim");
    AnimRes_Input.value = resolution;
    AnimRes_Input.oninput = function() {
        if (isNaN(AnimRes_Input.value) === false && AnimRes_Input.value <= 1300 && AnimRes_Input.value > 5) {
            resolution = AnimRes_Input.value;
        }
        resetSketch();
    };

    for (let k = 0; k < 2; k++) {
        AddMyOnInputEventHandler(revs_Inputs[k], arr_revs, k + 1, false, null);
        AddMyOnInputEventHandler(offsets_Inputs[k], arr_radoffset, k + 1, false, null);
        AddMyOnInputEventHandler(radius_Inputs[k], arr_radius, k + 1, false, null);
        revs_Inputs[k].value = arr_revs[k + 1];
        offsets_Inputs[k].value = arr_radoffset[k + 1];
        radius_Inputs[k].value = arr_radius[k + 1];
    }

    sun = new Orbit(width / 2, height / 2, arr_radius[0], 1, null, 0, arr_revs[0]);
    var next = sun;
    child1 = sun.addChild(arr_radius[1], arr_radoffset[1], arr_revs[1]);
    child2 = child1.addChild(arr_radius[2], arr_radoffset[2], child1.RevsAroundParent * arr_revs[2]);
    end = child2;
    //console.log(TWO_PI / child2.angleincr);
    //console.log(child2.RevsAroundParent);   
    //console.log(child2.angleincr);
    stepCounterLimit = (TWO_PI / child2.angleincr) * child2.RevsAroundParent;

}

function draw() {
    background(51);

    
    for (var i = 0; i < resolution; i++) {
        var next = sun;
        while (next != null) {
            next.update();
            next = next.child;
        }
        path.push(createVector(end.x, end.y));
        stepCounter++;
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

    if (path.length > 55000) {
        path.splice(0, resolution);
        console.log("stepCounter: " + stepCounter);
    }

    if (stepCounter > stepCounterLimit) {
        noLoop();
        console.log("stepCounter: "+stepCounter);
    }

}
var k = 2;

function Orbit(x_, y_, r_, n, p, r_offset_, revs_) {
    this.x = x_;
    this.y = y_;
    this.r = r_;
    this.r_offset = r_offset_;
    this.parent = p;
    this.child = null;
    this.RevsAroundParent = revs_ || 1;
    //setting the speed of each object
    this.angleincr = (TWO_PI / 360) * revs_ / speedadjustfactor;

    this.speed = 0; // (radians(pow(k, n - 1))) / resolution;
    this.angle = -PI / 2;

    this.addChild = function(childradius_, childr_offset_, childrevs_) {
        var newr = childradius_;
        var newx = this.x; //+ this.r + newr;
        var newy = this.y + this.r;
        this.child = new Orbit(newx, newy, newr, n + 1, this, childr_offset_, childrevs_);
        return this.child;
    }

    this.update = function() {
        var parent = this.parent;
        if (parent != null) {            
            this.angle += this.angleincr;
            var rsum = this.r + parent.r + this.r_offset;
            this.x = parent.x + rsum * cos(this.angle);
            this.y = parent.y + rsum * sin(this.angle);
        }
    }

    this.show = function() {
        stroke(255, 100);
        strokeWeight(1);
        noFill();
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
        var posx = this.x + this.r * cos(this.angle);
        var posy = this.y + this.r * sin(this.angle);
        strokeWeight(5);
        point(posx, posy);

    }
}
function resetSketch(){

   console.log(this._loop);
   console.log("update");
   path = [];
   stepCounter=0;
   loop();
};


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