/// <reference path="./node_modules/@types/p5/global.d.ts" />
let canv;
let container;
let lblInfo;
let lblX;

let path = [];
let Curve = [];
let time = 0;
let numPoints = 1024;
let ActSample = 0;
let sc = 6.0;
let ComplexFourier;

function setup() {

    canv = createCanvas(200, 200);
    container = document.getElementById('sketch-div');
    container.appendChild(canv.elt);
    lblInfo = document.getElementById("lblInfo");
    lblX = document.getElementById("lblX");

    let angle = 0;

    for (let i = 0; i < numPoints; i++) {
        angle = map(i, 0, numPoints, 0, TWO_PI);
        // x[i] = 0;
        //  y[i] = 1.1 * sc * sin(TWO_PI / (numPoints - 0) * i) + 0.6 * sc * sin(TWO_PI / (numPoints - 0) * i * 2) + 0.2 * sc * sin(TWO_PI / (numPoints - 0) * i * 3);
        let x = sc * 16 * Math.pow(sin(angle), 3);
        let y = sc * -1 * (13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle));
        Curve.push(new Complex(x, y));
    }
    ComplexFourier = complexDFT(Curve);
    ComplexFourier.sort((a, b) => b.amp - a.amp)

}

function ComplexEpiCycles(x, y, rotation, fourier) {

    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;

        x += fourier[i].amp * cos(fourier[i].freq * time + fourier[i].phase + rotation);
        y += fourier[i].amp * sin(fourier[i].freq * time + fourier[i].phase + rotation); //+ fourier[i].phase+rotation
        noFill();
        stroke(0, 120, 120, 60);
        ellipse(prevx, prevy, fourier[i].amp * 2);

        fill(255);
        stroke(200, 73, 255, 199);
        line(prevx, prevy, x, y);
        stroke(255);
        //ellipse(x, y, 2);
    }
    // lblX.innerHTML += ActSample + "   " + time + " </br>";
    return createVector(x, y);
}

function RenderMyLoop() {


    background(255);
    strokeWeight(1);

    ActSample += 1; //const dt = TWO_PI / y.length;
    time = ActSample * TWO_PI / numPoints;


    let v = ComplexEpiCycles(width / 2, height / 2, 0, ComplexFourier);
    path.unshift(v);
    stroke(255, 0, 0);
    strokeWeight(3);
    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();


    // if (ActSample > numPoints * 1+1) {
    //     noLoop();
    //     time = 0;
    //     ActSample = 0;
    //     // path = [];
    // }

}

function draw() {

    if (RecorderState === 1 && EnableRecording === true && typeof capturer !== "undefined") {
        capturer.start();
        RecorderState = 2;
        console.log("Recording started...");
    }
    RenderMyLoop();

    if (RecorderState === 2 && EnableRecording === true) {
        capturer.capture(canv.canvas);
    }

    if (EnableRecording === true && ((RecorderState === 3) || (RecorderState == 2 && EnableFixFrameRecording === true &&
            frameCount >= NumOfFramesToCapture))) {
        console.log("Max Number of Frames reached")
        capturer.stop();
        capturer.save();
        RecorderState = 0;
        noLoop();
    }
}