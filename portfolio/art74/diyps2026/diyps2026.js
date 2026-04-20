var star_gif, nyan_cat, rainbow, star_round, airbrush, alien_gif;
var initials ='hl'; // your initials
var choice = '1'; // starting choice, so it is not empty
var screenbg = 250; // off white background
var lastscreenshot=61; // last screenshot never taken
var currentColor = "black";
var currentStrokeWeight = 2;
var colors = ["#110e63","#320b70", "#0900ff", "#890aff", "#5ddeaf", "#ffee00", "#97fcfc", "#ff33f1", "white", "#20488a", "black" ];

var gifs = [];
var drawLayer;

var undoStack = []; // capped at 100 (for draw layer)

var tools = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'e', 'E', '/', 'x', 'X'];

var screen = false;

function preload() {
  star_gif = loadImage("https://haileyliuu.github.io/portfolio/art74/diyps2026/images/star_loop.gif");
  nyan_cat = loadImage("https://haileyliuu.github.io/portfolio/art74/diyps2026/images/nyan_cat.gif");
  rainbow = loadImage("https://haileyliuu.github.io/portfolio/art74/diyps2026/images/rainbow.png");
  star_round = loadImage("https://haileyliuu.github.io/portfolio/art74/diyps2026/images/star_round.png");
  airbrush = loadImage("https://haileyliuu.github.io/portfolio/art74/diyps2026/images/airbrush.png");
  alien_gif = loadImage("https://haileyliuu.github.io/portfolio/art74/diyps2026/images/alien.gif");
}

function setup() {
  createCanvas(1000, 700);
  drawLayer = createGraphics(1000, 700);
  drawLayer.background(screenbg);
}

function draw() {
  if (keyIsPressed && tools.includes(key)) {
    choice = key; // set choice to the key that was pressed
    print("new choice: " + choice);
  }

  if (mouseIsPressed) {
    newkeyChoice(choice); // if the mouse is pressed call newkeyChoice
  }

  background(screenbg);
  image(drawLayer, 0, 0); 
  animatedStamp();
  colorPick();
}

function newkeyChoice(toolChoice) {
  if (mouseX < 70) return;
  
  drawLayer.push();
  
  if (screen) {
    drawLayer.blendMode(SCREEN);
  } else {
    drawLayer.blendMode(BLEND);
  }

  if (toolChoice == '1') {
    drawLayer.strokeWeight(2);
    currentStrokeWeight = 2;
    drawLayer.stroke(currentColor);
    drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);

  } else if (toolChoice == '2') {
    drawLayer.strokeWeight(20);
    currentStrokeWeight = 20;
    drawLayer.stroke(currentColor);
    drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);

  } else if (toolChoice == '3') {
    drawLayer.strokeWeight(60);
    currentStrokeWeight = 60;
    drawLayer.stroke(currentColor);
    drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);

  } else if (toolChoice == '4') {
    let weight = dist(mouseX, mouseY, pmouseX, pmouseY);
    drawLayer.strokeWeight(weight);
    currentStrokeWeight = weight;
    drawLayer.stroke(currentColor);
    drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);

  } else if (toolChoice == '5') {
    drawLayer.push();
    drawLayer.tint(currentColor);
    drawLayer.image(airbrush, mouseX - 75, mouseY - 75, 180, 180);
    drawLayer.noTint();
    drawLayer.pop();

  } else if (toolChoice == '6') {
    let randomX = mouseX + random(100) - 50;
    let randomY = mouseY + random(100) - 50;
    let c = color(currentColor);

    drawLayer.push();
    drawLayer.tint(c);
    drawLayer.image(star_round, randomX, randomY, 5, 5);
    drawLayer.noTint();
    drawLayer.pop();

  } else if (toolChoice == '7') {
    let randomX = mouseX + random(70) - 35;
    let randomY = mouseY + random(70) - 35;

    drawLayer.push();
    drawLayer.colorMode(HSB);
    drawLayer.blendMode(ADD);
    drawLayer.tint(random(360), random(80, 100), random(50, 100), random(100, 255));
    drawLayer.image(star_round, randomX, randomY, 12, 12);
    drawLayer.noTint();
    drawLayer.blendMode(BLEND);
    drawLayer.pop();
    
  } else if (toolChoice == '0') {
    let dx = mouseX - pmouseX;
    let dy = mouseY - pmouseY;
    let angle = atan2(dy, dx);

    drawLayer.push();
    drawLayer.translate(mouseX, mouseY);
    drawLayer.rotate(angle);
    drawLayer.imageMode(CENTER);
    drawLayer.image(rainbow, 0, 0, 50, 50);
    drawLayer.pop();

  } else if (toolChoice == 'e' || toolChoice == 'E') {
    currentColor = screenbg
    drawLayer.stroke(currentColor);
    drawLayer.strokeWeight(currentStrokeWeight);
    drawLayer.line(mouseX, mouseY, pmouseX, pmouseY);

  } else if (toolChoice == '/') {
    screenbg = currentColor;
    drawLayer.background(screenbg);
    
  } else if (toolChoice == 'x' || toolChoice == 'X') {
    deleteStamp(mouseX, mouseY);
  }
  
  drawLayer.pop();
}

function mousePressed() {
  if (mouseX < 70) return;
  
  saveUndoState();
  
  print("stack: " + undoStack);

  if (choice == '8') {
    gifs.push({
      img: star_gif,
      x: mouseX - 25,
      y: mouseY - 25,
      w: 50,
      h: 50
    });
  }

  if (choice == '9') {
    gifs.push({
      img: alien_gif,
      x: mouseX - 40,
      y: mouseY - 40,
      w: 80,
      h: 80
    });
  }
}

function mouseReleased() {
  if (mouseX < 70) return;

  if (choice == '0') {
    gifs.push({
      img: nyan_cat,
      x: mouseX - 25,
      y: mouseY - 25,
      w: 70,
      h: 70
    });
  }
}

function keyPressed() {
  if (key == '.') {
    drawLayer.background(screenbg);
    gifs = [];
    undoStack = [];
  } else if (key == 'p' || key == 'P') {
    saveme();
  } else if (key == "z" || key == 'Z') {
    undo();
  } else if (key == "a" || key == 'A') {
    toggleScreen();
  }
}

function saveme() {
  let filename = initials + day() + hour() + minute() + second();

  if (second() != lastscreenshot) {
    let drawing = get(70, 0, 930, 700);
    save(drawing, filename + '.jpg');
    key = "";
  }

  lastscreenshot = second();
}

function colorPick() {
  noStroke();
  fill("white");
  rect(0, 0, 70, 700);

  for (let i = 0; i < colors.length; i++) {
    if (currentColor == colors[i]) {
      strokeWeight(3);
    } else {
      strokeWeight(1);
    }

    stroke(138, 138, 138);
    fill(colors[i]);
    rect(10, 10 + (i * 60), 50, 50);

    if (mouseIsPressed && mouseX>10 && mouseX<60 && 
                mouseY>10+(i*60) && mouseY<60+(i*60)) 
    {
      currentColor = colors[i];
    }
  }
}

function animatedStamp() {
  for (let i = 0; i < gifs.length; i++) {
    image(gifs[i].img, gifs[i].x, gifs[i].y, gifs[i].w, gifs[i].h);
  }
}

function undo() {
  if (undoStack.length > 0) {
    let last = undoStack.pop();
    drawLayer.drawingContext.putImageData(last, 0, 0);
  }
}

function saveUndoState() {
  let pd = drawLayer.pixelDensity();
  let w = drawLayer.width * pd;
  let h = drawLayer.height * pd;

  let snapshot = drawLayer.drawingContext.getImageData(0, 0, w, h);
  undoStack.push(snapshot);

  while (undoStack.length > 100) {
    undoStack.shift();
  }
}

function deleteStamp(x, y) {
  for (let i=0; i<gifs.length; i++) {
    let g = gifs[i];
    if(x > g.x && x < g.x + g.w && y > g.y && y < g.y + g.h)
    {
      gifs.splice(i, 1);
    }
  }
}

function toggleScreen() {
  screen = !screen;
}
