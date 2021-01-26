let sscale = 7.5e8;
let zoom=1;

let r, v;

let E, h, a, e, T, b, phi=0;
let c, f;

const G = 6.6743e-11;
let sm = 1.989e30, m = 5.972e24;
let mu = G*sm;

function setup() {
    createCanvas(1150, 600);
    r = createVector(-1.471e11, 0);
    v = createVector(0, -3.029e4);
    //[c, f] = [createVector(0, 0), createVector(0, 0)];
    //[a, b] = [r.x/sscale, r.x/sscale];
    calo();
}

function draw() {
    background(0);
    //stars();
    translate(400, 300);
    planetAndOrbit();
    star();
}

let sx, sy;
function mousePressed() {
    sx = mouseX;
    sy = mouseY;
}

function mouseDragged() {
    if ((mouseX-pmouseX) * (mouseX-sx) < 0) {
        sx = pmouseX;
    }
    if ((mouseY-pmouseY) * (mouseY-sy) < 0) {
        sy = pmouseY;
    }
    r = createVector(r.x+((mouseX-sx)*sscale*0.01), r.y+((mouseY-sy)*sscale*0.01));
    calo();
}

function calo() {
    let Ek = 0.5*v.mag()*v.mag();
    let Eg = -mu/r.mag();
    E = Ek+Eg;
    h = p5.Vector.cross(r, v);
    if (E < 0) {
        a = -0.5 * mu / E;
        e = sqrt(1-(sq(h.mag())/(a*mu)));
        b = sqrt(sq(a) * (1-sq(e)));
        T = sqrt( 4 * sq(Math.PI) * (a*a*a) / mu );
        let acs = (   (    (h.mag()*h.mag())  / mu) - r.mag()   ) / (r.mag()*e);
        if (acs > 1) {
            acs = 1;
        } else if (acs < -1) {
            acs = -1;
        }
        let theta = acos(acs);
        if (p5.Vector.dot(r, v) < 0) {
            theta = TAU - theta;
        }
        let apparentTheta = createVector(-100, 0).angleBetween(r);
        if (h.z>0) {
            phi = apparentTheta-theta;
        } else {
            phi = apparentTheta+theta;
        }
        c = createVector(-1, 0);
        c.rotate(phi);
        c.mult(-a*e);
        f = c.copy();
        f.mult(2);
    }
}

function star() {
    let sw = 20 * 1.3927e9/sscale;
    let wr = sw / 2;
    for (let ww = sw; ww >= wr; ww -= 2 / zoom) {
        let ratio = (sw - ww) / wr;
        noStroke();
        fill(255 * ratio, 255 * ratio, 255 * ratio);
        ellipse(0, 0, ww, ww);
    }
}

function planetAndOrbit() {

    let [x, y] = [r.x/sscale, r.y/sscale];
    translate(c.x/sscale, c.y/sscale);
    rotate(phi);
    noFill();
    stroke(150);
    ellipse(0, 0, a*2/sscale, b*2/sscale);
    rotate(-phi);
    translate(-c.x/sscale, -c.y/sscale);
    stroke(75);
    line(f.x/sscale, f.y/sscale, x, y);
    line(0, 0, x, y);


    fill('#1EF54E');
    noStroke();
    let ed = 200 * 1.2742e7 / sscale;
    ellipse(x, y, ed, ed);
    // if (resetting && (selected == 1 || selected == 0)) {
    //     stroke(50, 50, 200);
    //     line(0, 0, 10 * v.x / vscale, 10 * v.y / vscale);
    // }
    
}