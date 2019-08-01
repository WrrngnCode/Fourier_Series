/// <reference path="./node_modules/@types/p5/global.d.ts" />
let canv;
let container;
let lblInfo;
let time = 0;
let wave = [];

function setup() {

    canv = createCanvas(600, 400);
    container = document.getElementById('sketch-div');
    container.appendChild(canv.elt);
    lblInfo = document.getElementById("lblInfo");

}

function draw() {

    background(0);
    translate(100, 200);
    stroke(255);
    noFill();
    let radius = 50;
    ellipse(0, 0, radius * 2);

    let x = radius * cos(time);
    let y = radius * sin(time);
    wave.unshift(y);
    fill(255);
    line(0, 0, x, y);
    ellipse(x, y, 8);

    translate(100, 0);
    line(x-100,y,0,wave[0]);
    beginShape();
    noFill();

    for (let i = 0; i < wave.length; i++) {
        vertex(i,wave[i]);  
    }
    endShape();

    time += 0.08;
    if (wave.length>350){
        wave.pop();
    }


}