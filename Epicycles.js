/// <reference path="./node_modules/@types/p5/global.d.ts" />
let canv;
let container;
let lblInfo;
let lblX;

let path = [];
let Curve=[];
let time=0;
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
    let x,y=0;
    for (let i = 0; i < numPoints; i++) {
        angle = map(i, 0, numPoints, 0, TWO_PI);
        // x[i] = 0;
        //  y[i] = 1.1 * sc * sin(TWO_PI / (numPoints - 0) * i) + 0.6 * sc * sin(TWO_PI / (numPoints - 0) * i * 2) + 0.2 * sc * sin(TWO_PI / (numPoints - 0) * i * 3);
        x = 8 * 16 * Math.pow(sin(angle), 3);
        y = 8 * -1 * (13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle));
        Curve.push(new Complex(x,y));
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

   



}

