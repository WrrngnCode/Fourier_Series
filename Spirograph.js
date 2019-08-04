// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI

var path = [];
var SunTotalRevs = 3;
var angle = 0;
var resolution = 20;
let cv;
var sun;
var end;
var arr_radius = [80, 20, 10];
var arr_radoffset = [10, -10, 15];
var arr_radoffset = [10, -10, 15];

function setup() {
    cv = createCanvas(600, 600);
    cv.parent('sketch-div');

    sun = new Orbit(width / 2, height / 2, arr_radius[0], 0);
    var next = sun;
    sun.child = new Orbit(sun.x, sun.y + arr_radoffset[1], arr_radius[1], 2);

    end = next;
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
    }

    var next = sun;
    while (next != null) {
        next.show();
        next = next.child;
    }

    beginShape();
    stroke(255, 0, 255);
    noFill();
    for (var pos of path) {
        vertex(pos.x, pos.y);
    }
    endShape();

    if (path.length > 45000) {
        path.splice(0, 20);
    }
}



// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI

var k = 2;

function Orbit(x_, y_, r_, n, p, r_offset_, revs_) {
    this.x = x_;
    this.y = y_;
    this.r = r_;
    this.r_offset = r_offset_ || r_;
    this.parent = p;
    this.child = null;
    this.angleincr = SunTotalRevs * TWO_PI * revs_ / resolution; //resultion=resoulution per Frame
    this.speed = (radians(pow(k, n - 1))) / resolution;
    this.angle = -PI / 2;

    this.addChild = function(childradius_, childr_offset_, childrevs_) {
        var newr = childradius_;
        var newx = 0; //this.x //+ this.r + newr;
        var newy = 0; //this.y + newr+66;
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
    }
}