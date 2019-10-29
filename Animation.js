//// <reference path="CCapture.all.min.js" />


//****ADJUST THESE TO CONTROL THE ANIMATION */
//SET EnableRecording = true to allow capturing. Press key C to start */
//SET RecorderState = 1 to start recording automatically */
//SET EnableFixFrameRecording = true to stop capturing after <NumOfFramesToCapture> frames */
//Press key S to stop capturing at any time */
var EnableRecording = false;
var RecorderState = 0;
var EnableFixFrameRecording = true;
var NumOfFramesToCapture = 1024; // at 60 frames per second
//****ADJUST THESE TO CONTROL THE ANIMATION */
var myfps = 60;
//////--- @-ts-ignore
let capturer = new CCapture({
    format: 'png',
    name: 'Fourier',
    frameRate: myfps,
    workersPath: './worker/',
    verbose: true,
    autoSaveTime: 25
});

function keyPressed() {

    if (key == "s" || key == "S") {
        //console.log(capturer);
        if (typeof capturer !== "undefined" && RecorderState == 2) {
            RecorderState = 3; //stop Capture
            console.log("Recording stopped!. Saving file...");
            noLoop();
            return;
        }
        console.log("Animation stopped.");
        noLoop();
    }

    if ((key == "g" || key == "G") && keyCode !== 103) {
        console.log("Animation Started.");
        loop();
    }

    if ((key == "c" || key == "C") && keyCode !== 99 && RecorderState === 0 && EnableRecording === true) {
        if (typeof capturer !== "undefined") {
            RecorderState = 1; //Initialize capture
        }
    }   
    
}
