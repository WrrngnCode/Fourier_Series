/// <reference path="./node_modules/@types/p5/global.d.ts" />
let canv;
let container;
let lblInfo;
let time = 0;
let wave = [];
let y = [];
let fourierY;
let ratio = 1; //50*0.07;

function setup() {

    canv = createCanvas(600, 1200);
    container = document.getElementById('sketch-div');
    container.appendChild(canv.elt);
    lblInfo = document.getElementById("lblInfo");

    y = [100, 100, 100, -100, -100, -100, 100, 100, 100, -100, -100, -100, 100, 100, 100, -100, -100, -100]

    fourierY = dft(y);
}

function draw() {

    background(0);
    translate(100, 200);


    let x = 0;
    let y = 0;
    for (let i = 0; i < fourierY.length; i++) {
        let prevx = x;
        let prevy = y;


        x += fourierY[i].amp * cos(fourierY[i].freq * time + fourierY[i].phase + HALF_PI);
        y += fourierY[i].amp * sin(fourierY[i].freq * time + fourierY[i].phase + HALF_PI);

        noFill();
        stroke(255, 100);
        ellipse(prevx, prevy, fourierY[i].amp * 2);

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
    const dt = TWO_PI / fourierY.length;

    time += dt / 1200;
    if (wave.length > 320) {
        wave.pop();
    }
    translate(-180, 500);
    drawFourierGraph(-0, 0, fourierY, "re");
    translate(0, 330);
    drawFourierGraph(-0, 0, fourierY, "im");
    //noLoop();
}

function drawFourierGraph(locx, locy, data, key) {

    const gWidth = 500;
    const gHeight = 300;
    line(locx, locy, locx + gWidth, locy);
    line(locx, locy, locx, locy - gHeight);
    
    let maxValue = data.reduce((max, val) => max < val[key] ? val[key] : max, data[0][key])
    let minValue = data.reduce((min, val) => min > val[key] ? val[key] : min, data[0][key])
    //const maxValue2=Math.max.apply(Math,data.map(p=>p[key]))     
    let normalizedArray=data.map(p=>normalizeBetweenTwoRanges(p[key], minValue, maxValue, 0, gHeight-20));
    
    const step = gWidth / data.length;
    fill(0, 0, 55);
    for (var i = 0; i < normalizedArray.length; i++) {
       
        rect(i * step, 0, step-5, -1*normalizedArray[i])
    }

};

function normalizeBetweenTwoRanges(val, minVal, maxVal, newMin, newMax) {
    return  (val - minVal) * (newMax - newMin) / (maxVal - minVal) + newMin;
    //(n, start1, stop1, start2, stop2)
    // var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};