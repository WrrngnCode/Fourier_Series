/// <reference path="./node_modules/@types/p5/global.d.ts" />
let canv;
let container;
let lblInfo;
let time = 0;
let wave = [];

let ratio = 1; //50*0.07;

function setup() {

    canv = createCanvas(600, 400);
    container = document.getElementById('sketch-div');
    container.appendChild(canv.elt);
    lblInfo = document.getElementById("lblInfo");

}

function draw() {

    background(0);
    translate(100, 200);
    
    
    let x = 0;
    let y = 0;
    for (let i = 0; i < 5; i++) {
        let prevx=x;
        let prevy=y;
        let n = i * 2 + 1;
        let radius = 50 * (4 / (n * PI));
        x += radius * cos(n * time);
        y += radius * sin(n * time);
        
        noFill();
        stroke(255,100);
        ellipse(prevx, prevy, radius * 2);

        fill(255);
        stroke(255);
        line(prevx, prevy, x, y);
        //ellipse(x, y, 2);
    }
    wave.unshift(y);
    translate(100, 0);
    line(x - 100, y, 0, wave[0]);
    beginShape();
    noFill();

    for (let i = 0; i < wave.length; i++) {
        vertex(i * (ratio), wave[i]);
    }
    endShape();

    time += 0.01;
    if (wave.length > 320) {
        wave.pop();
    }

}