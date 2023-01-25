//speak

let t = 0;
let slices = 12;
let shape, boundary, img;
let vol = 0;

let lovol = 0;
let hivol = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  shape = calcStuff(width, height, slices);
  mask = createMask(shape.a, shape.o);

  mic = new p5.AudioIn();
  mic.start();

  colorMode(HSB, 360);
  //frameRate(5);
}

function draw() {
  background(0, 10);
  vol = mic.getLevel();
  design();
  mirror();
}

function design() {
  //these are random looping circles to create an interesting design
  //duplicated this from another design i did while playing around
  //console.log(vol*1000)

  for (let x = 0; x <= width; x = x + 100) {
    for (let y = 0; y <= height; y = y + 100) {
      //   fill(
      //   map(vol * 10000, 40, 80, 0, 255),
      //   0,
      //   map(vol * 10000, 0, 60, 0, 255)
      // );

      //console.log (vol*1000)
      fill(map(vol * 1000, lovol, hivol, 80, 0, true), 360, 360);

      let myX = x + vol * 5000 * cos(2 * PI * t);
      let myY = y + vol * 5000 * sin(2 * PI * t);

      circle(myX, myY, map(vol * 1000, lovol, hivol, 0, 40, true));
    }
  }
  t = t + 0.005;
}

function mirror() {
  // this helps me select a segment of the canvas
  img = get(0, 0, shape.a, shape.o);
  // cut it into a triangular shape
  img.mask(mask);

  push();
  translate(width / 2, height / 2);
  //rotate(radians(frameCount / 15));

  for (let i = 0; i < slices; i++) {
    if (i % 2 == 0) {
      push();
      scale(1, -1); // mirror
      image(img, 0, 0); // draw slice
      pop();
    } else {
      rotate(radians(360 / slices) * 2); // rotate
      image(img, 0, 0); // draw slice
    }
  }
  pop();
}

function calcStuff(width, height, s) {
  //SOHCAHTOA o=opposite a=adjacent h=hypotenuse

  let theta = radians(360 / s); //this is to calculate the angle of a sector

  let a = sqrt(sq(width / 2) + sq(height / 2)); //pythagorean theorem ^.^
  let o = tan(theta) * a;
  let h = a / cos(theta);

  return { a: round(a), o: round(o), h: round(h) };
}

function createMask(w, h) {
  boundary = createImage(w, h);
  boundary.loadPixels();
  for (i = 0; i < boundary.width; i++) {
    for (j = 0; j < boundary.height; j++) {
      if (i >= map(j, 0, h, 0, w) - 1) boundary.set(i, j, color(1255));
    }
  }
  boundary.updatePixels();
  return boundary;
}
