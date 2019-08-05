
function Orbit(x_, y_, r_, n, p, r_offset_, revs_) {
    this.x = x_;
    this.y = y_;
    this.r = r_;
    this.r_offset = r_offset_;
    this.parent = p;
    this.child = null;
    this.RevsAroundParent = revs_ || 1;
    this.angleincr = (TWO_PI / 360) * revs_;
    this.speed = 0; // (radians(pow(k, n - 1))) / resolution;
    this.angle = -PI / 2;

    this.addChild = function(childradius_, childr_offset_, childrevs_) {
        var newr = childradius_;
        var newx = this.x; //+ this.r + newr;
        var newy = this.y + this.r;
        this.child = new Orbit(newx, newy, newr, n + 1, this, childr_offset_, childrevs_);
        return this.child;
    }

    this.update = function(incr) {
        var parent = this.parent;
        if (parent != null) {
            this.angle = incr;
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