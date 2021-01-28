let sscale = 7.5e8;
let zoom=1;

let r, v;

let E, h, a, e, T, b, phi=0;
let c, f;

const G = 6.6743e-11;
let sm = 1.989e30, m = 5.972e24;
let mu = G*sm;

let time, stime, theta, stheta, M, sM, u;
const tscale = 1e5;
const vscale = sscale/tscale;

let play = false, playButton;

function setup() {
    createCanvas(1150, 600);
    r = createVector(-1.471e11, 0);
    v = createVector(0, -3.429e4);
    //[c, f] = [createVector(0, 0), createVector(0, 0)];
    //[a, b] = [r.x/sscale, r.x/sscale];
    calo();

    playButton = createButton('play', 'play/pause');
    playButton.position(0, 0);
    playButton.mouseClicked(() => {
        play = !play;
        playButton.html(play ? 'pause' : 'play');
    });
}

function draw() {
    background(0);
    //stars();
    translate(400, 300);
    planetAndOrbit();
    star();
    if (play) {
        move(tscale);
    }
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
        stheta = acos(acs);
        if (p5.Vector.dot(r, v) < 0) {
            stheta = TAU - stheta;
        }
        let apparentTheta = createVector(-100, 0).angleBetween(r);
        if (h.z>0) {
            phi = apparentTheta-stheta;
        } else {
            phi = apparentTheta+stheta;
        }
        c = createVector(-1, 0);
        c.rotate(phi);
        c.mult(-a*e);
        f = c.copy();
        f.mult(2);
        time = 0;
        theta = stheta+0;
        acs = (e+cos(stheta)) / (1 + (e*cos(stheta)))
        if (acs > 1) {
            acs = 1;
        } else if (acs < -1) {
            acs = -1;
        }
        u = acos(acs);
        if (p5.Vector.dot(r,v) < 0) {
            u = TAU - u;
        }
        time=0;
        sM = u - (e*sin(u));
        
        stime = -(T*sM/TAU);
    }
}

function move(delt) {
    time += delt;
    M = (2*Math.PI*time/T) + sM;
    for (let i = 0; i < 100000; i++) {
        u = M + (e*sin(u));
    }
    theta=acos((cos(u)-e)/(1-(e*cos(u))));
    if ((time-stime)%T > T/2) {
        theta = TAU - theta;
    }
    if (h.z > 0) {
        theta += phi;
    } else {
        theta = -theta+phi;
    }
    r = createVector(-(sq(h.mag())/mu)/(1+(e*cos(theta-phi))));
    
    r.rotate(theta);
    let speed = sqrt(2*(E+(mu/r.mag())));
    let asn = h.mag()/(r.mag()*speed);
    if (asn > 1) {
        asn = 1;
    } else if (asn < -1) {
        asn = -1;
    }
    let rvtheta = asin(asn);
    if ((time-stime)%T > T/2) {
        rvtheta = PI - rvtheta;
    }
    v = r.copy();
    if (h.z > 0) {
        v.rotate(rvtheta);
    } else {
        v.rotate(-rvtheta);
    }
    v.normalize();
    v.mult(speed);
    
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
    translate(x, y);
    //if (resetting && (selected == 1 || selected == 0)) {
        stroke(50, 50, 200);
        line(0, 0, 10 * v.x / vscale, 10 * v.y / vscale);
    //}
    translate(-x, -y);
    
}