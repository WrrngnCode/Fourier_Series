/// <reference path="./node_modules/@types/p5/global.d.ts" />
let canv;
let container;
let lblInfo;
let lblX;
let time = 0;
let wave1 = [];
let wave2 = [];
let invFourier_y = [];
let invFourier_x = [];
let invFourier_y2 = [];
let path = [];
let y = [];
let x = [];
let fourierY;
let fourierX;
let ratio = 1; //50*0.07;
let numPoints = 512;
let ActSample = 0;
let sc = 60;

function setup() {

    canv = createCanvas(600, 1100);
    container = document.getElementById('sketch-div');
    container.appendChild(canv.elt);
    lblInfo = document.getElementById("lblInfo");
    lblX = document.getElementById("lblX");
    let angle = 0;

    

    for (let i = 0; i < numPoints; i++) {
        angle = map(i, 0, numPoints, 0, TWO_PI);
        // x[i] = 0;
        //  y[i] = 1.1 * sc * sin(TWO_PI / (numPoints - 0) * i) + 0.6 * sc * sin(TWO_PI / (numPoints - 0) * i * 2) + 0.2 * sc * sin(TWO_PI / (numPoints - 0) * i * 3);
        x[i] = 8 * 16 * Math.pow(sin(angle), 3);
        y[i] = 8 * -1 * (13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle));
    }

    //  var x = radius * 16 * Math.pow(sin(t), 3);
    // var y = radius * -1 * (13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) 

    //console.log(millis());

    fourierY = dft(y);
    fourierX = dft(x);
    //console.log(millis());
    invFourier_y = DiscreteInvFourier(fourierY);
    invFourier_y2 = DiscreteInvFourier(fourierY, true);
    invFourier_x = DiscreteInvFourier(fourierX);
}

function DiscreteInvFourier(F, cosOnly = false) {


    let SampleCount = y.length;
    let InverseDFT = new Array(SampleCount).fill(0);
    let InverseDFT2 = new Array(SampleCount).fill(0);
    for (let i = 0; i < SampleCount; i++) {
        for (let k = 0; k < F.length; k++) {
            InverseDFT[i] += F[k].re * cos(F[k].freq * TWO_PI * i / (SampleCount - 0));
            InverseDFT[i] += -1 * F[k].im * sin(F[k].freq * TWO_PI * i / (SampleCount - 0));
            InverseDFT2[i] += F[k].re * cos(F[k].freq * TWO_PI * i / (SampleCount - 0) + F[k].phase);
        }
    }
    if (cosOnly) {
        return InverseDFT
    };
    return InverseDFT;
}

function PlotArray(ar, startx, starty, w, r, g, b, pointsonly = false) {
    strokeWeight(w);
    noFill();
    stroke(r, g, b);

    if (pointsonly) {
        for (let i = 0; i < ar.length; i++) {
            point(i * TWO_PI / (ar.length) * sc + startx, ar[i] + starty);
        }
    } else {
        beginShape();
        for (let i = 0; i < ar.length; i++) {
            vertex(i * TWO_PI / (ar.length) * sc + startx, ar[i] + starty);
        }
        endShape();
    }
}

function EpiCycles(x, y, rotation, fourier) {

    for (let i = 0; i < fourier.length; i++) {
        let prevx = x;
        let prevy = y;

        x += fourier[i].amp * cos(fourier[i].freq * time + fourier[i].phase + rotation);
        y += fourier[i].amp * sin(fourier[i].freq * time + fourier[i].phase + rotation); //+ fourier[i].phase+rotation
        noFill();
        stroke(255, 100);
        ellipse(prevx, prevy, fourier[i].amp * 2);

        fill(255);
        stroke(255, 0, 0, 155);
        line(prevx, prevy, x, y);
        stroke(255);
        //ellipse(x, y, 2);
    }
    // lblX.innerHTML += ActSample + "   " + time + " </br>";
    return [x, y];
}


function draw() {

    background(0);
    strokeWeight(1);

    let endPoint1 = EpiCycles(100, 650, HALF_PI, fourierY);
    let endPoint2 = EpiCycles(350, 400, 0, fourierX);

    wave1.unshift(endPoint1[1]);
    wave2.unshift(endPoint2[0]);
    let pathVector = createVector(endPoint2[0], endPoint1[1]);

    path.unshift(pathVector);
    stroke(35, 155, 25);
    line(endPoint1[0], endPoint1[1], pathVector.x, pathVector.y)
    line(endPoint2[0], endPoint2[1], pathVector.x, pathVector.y)

    //line(endPoint1[0], endPoint1[1], 180, endPoint1[1])
    stroke(0, 155, 25);
    

    beginShape();
    noFill();
    stroke(255, 150);
    for (let i = 0; i < wave1.length; i++) {
        vertex(i * (ratio) * TWO_PI / y.length * sc + 180, wave1[i]);
    }
    endShape();

    stroke(0,155,25);
    //line(endPoint2[0],endPoint2[1],endPoint2[0],550)
    beginShape();
    noFill();
    stroke(255,150);
    for (let i = 0; i < wave2.length; i++) {
        vertex( wave2[i],i * (ratio) + 550);
    }
    endShape();

    stroke(0, 155, 25);
    line(20, 150, 550, 150);

    PlotArray(y, 50, 150, 1, 255, 255, 255, false);
    PlotArray(invFourier_y, 50, 150, 2, 255, 0, 0, true);
    PlotArray(x, 50, 150, 1, 144, 33, 188, false)
    PlotArray(invFourier_x, 50, 150, 1, 0, 255, 0, true)
    //PlotArray(invFourier_y2, 50, 145, 2, 0, 255, 55, true)

    beginShape();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(3);
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].x, path[i].y);
    }
    endShape();

    ActSample += 1; //const dt = TWO_PI / y.length;
    time = ActSample * TWO_PI / y.length;


    if (wave1.length > 350) {
        wave1.pop();
    }
    if (wave2.length > 250) {
        wave2.pop();
    }
    if (path.length > numPoints) {
        path.pop();
    }

    if (ActSample > numPoints * 2) {

        let max = Math.max(...path.map(p => p.y)) - 350;
        let min = Math.min(...path.map(p => p.y)) - 350;
        lblInfo.innerHTML = "Max Value of path: " + max + "</br>" + "Min Value of path: " + min + "</br>"
        //console.log(invFourier_y);

        let maxOriginal = Math.max(...y);
        lblInfo.innerHTML += "maxOriginal: " + maxOriginal + "</br>";
        let minOriginal = Math.min(...y);
        lblInfo.innerHTML += "minOriginal: " + minOriginal + "</br>";

        lblInfo.innerHTML += "InvFourierMax: " + Math.max(...invFourier_y) + "</br>";
        lblInfo.innerHTML += "InvFourierMin: " + Math.min(...invFourier_y) + "</br>";

        noLoop();
        time = 0;
        ActSample = 0;
        //path = [];
        //invFourier_y = [];

    }
    //drawGraphs();
    //noLoop();
}

function drawGraphs() {
    translate(10, 830);
    strokeWeight(0);
    fill(0, 255, 153)
    textSize(16);
    textStyle(NORMAL);
    text("real component of Fourier Transform", 0, -310);
    drawFourierGraph(-0, 0, fourierY, "re");

    translate(0, 330);
    fill(0, 255, 153)
    text("imaginary component of Fourier Transform", 0, -310);
    drawFourierGraph(-0, 0, fourierY, "im");

    translate(0, 330);
    fill(0, 255, 153)
    text("Phase of Fourier Transform", 0, -310);
    drawFourierGraph(-0, 0, fourierY, "phase");

    translate(0, 330);
    fill(0, 255, 153)
    text("Amplitude of Fourier Transform", 0, -310);
    drawFourierGraph(-0, 0, fourierY, "amp");


}

function drawFourierGraph(locx, locy, data, key) {

    const gWidth = 500;
    const gHeight = 300;
    stroke(255);
    strokeWeight(3);
    line(locx, locy, locx + gWidth, locy);
    line(locx, locy, locx, locy - gHeight);

    let maxValue = data.reduce((max, val) => max < val[key] ? val[key] : max, data[0][key])
    let minValue = data.reduce((min, val) => min > val[key] ? val[key] : min, data[0][key])
    //const maxValue2=Math.max.apply(Math,data.map(p=>p[key]))     
    strokeWeight(0);
    fill(44, 180, 153)
    textSize(11);
    textStyle(NORMAL);
    text(minValue, 10, -10);
    text(maxValue, 10, -gHeight + 20);
    let normalizedArray = data.map(p => normalizeBetweenTwoRanges(p[key], minValue, maxValue, 0, gHeight - 30));

    const step = (gWidth - 20) / data.length;
    strokeWeight(3);
    stroke(255, 0, 0);
    fill(0, 0, 0);
    for (var i = 0; i < normalizedArray.length; i++) {
        point(i * step + 10, -1 * normalizedArray[i])
        //rect(i * step + 10, 0, step - 5, -1 * normalizedArray[i])
    }
    strokeWeight(0);

};

function normalizeBetweenTwoRanges(val, minVal, maxVal, newMin, newMax) {
    return (val - minVal) * (newMax - newMin) / (maxVal - minVal) + newMin;
    //(n, start1, stop1, start2, stop2)
    // var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

function keyPressed() {

    if (keyCode === LEFT_ARROW) {
        ActSample += 1;
    } else if (keyCode === RIGHT_ARROW) {
        ActSample -= 1;;
    }
    return false;
}