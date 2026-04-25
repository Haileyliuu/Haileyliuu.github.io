var hiddenMap, map, hiddenItems, items, lightOnItems, bird, birdGlasses, obtGlasses, 
    obtAcorn, obtChips, obtFish, introPage, winPage, beak, beakHover;
var pangolinFont;
var gameState= "intro";
var collectedItems = 0;

var character;
var playerX = 1650;
var playerY = 1450;
let playerW = 50;
let playerH = 50;
var speed = 5;
var angle = 0;

var camX = 0;
var camY = 0;

var mapWidth = 2160;
var mapHeight = 1620;

var lightOn = false;
var cursorHover = false;
// [trash, nut, picnic, fish]
var itemsFound = [false, false, false, false];
var showingItem = false;
var currentItem = 0;


var collisions = [
  { x: 275, y: 325, w: 75, h: 75 }, // trash
  { x: 1400, y: 50, w: 325, h: 75 }, // upper bench
  { x: 300, y: 1100, w: 50, h: 50 }, // bush
  { x: 1775, y: 850, w: 50, h: 75 }, // basket
  { x: 1575, y: 775, w: 50, h: 50 }, // girl
  { x: 1600, y: 950, w: 50, h: 50 }, // boy
  { x: 900, y: 1400, w: 75, h: 100 }, // lower bench
  { x: 960, y: 1300, w: 75, h: 100 },
  { x: 1025, y: 1200, w: 75, h: 100 },
  { x: 1250, y: 1550, w: 910, h: 100 }, // water
  { x: 2000, y: 1400, w: 200, h: 150 }
];

function preload(){
  hiddenMap = loadImage("assets/hidden_map.png");
  map = loadImage("assets/map.png");
  hiddenItems = loadImage("assets/hidden_items.png");
  items = loadImage("assets/items.png");
  lightOnItems = loadImage("assets/light_on_items.png");
  bird = loadImage("assets/bird.png");
  birdGlasses = loadImage("assets/bird_glasses.png");
  obtGlasses = loadImage("assets/obtained_glasses.png");
  obtAcorn = loadImage("assets/obtained_acorn.png");
  obtChips = loadImage("assets/obtained_chips.png");
  obtFish = loadImage("assets/obtained_fish.png");
  introPage = loadImage("assets/intro_page.png");
  winPage = loadImage("assets/win_page.png");
  beak = loadImage("assets/beak.png");
  beakHover = loadImage("assets/beak_hover.png");
  pangolinFont = loadFont("assets/Pangolin/Pangolin-Regular.ttf");
}

function setup() {
  createCanvas(900, 600);
  textAlign(CENTER);
  textFont(pangolinFont);
  textSize(25);
} // end setup


function draw() {
  
  if (gameState=="intro"){
    levelIntro();
  }
  
  if (gameState == "main") {
    mainGame();
  }
  
  if (gameState == "win") {
    win();
  }
  
  beakCursor();

} // end draw


function levelIntro() {
  collectedItems = 0;
  lightOn = false;
  itemsFound = [false, false, false, false];
  character = bird;
  playerX = 1650;
  playerY = 1450;
  
  background(introPage);
  
  if (isColliding(mouseX, mouseY, 1, 1, width/2-50, height/2+150, 100, 50)) {
    stroke("#e1da60");
    strokeWeight(3);
    cursorHover = true;
    if (mouseIsPressed) {
      gameState = "main";
    }
  }
  else {
    noStroke();
    cursorHover = false;
  }
  fill("#edf7f7");
  rect(width/2-50, height/2+147, 100, 50, 5);
  fill("#476563");
  noStroke();
  text("Play", width/2, height/2+180);
}

function mainGame(){
  move();
  checkHover();
  textAlign(LEFT);
  fill("#4d493f");
  text("Collected items: " + collectedItems + "/4", 20, 580);
  showObtainedItem();
    
  
  if (collectedItems >= 5) {
    gameState = "win";
  }
}

function win() {
  textAlign(CENTER);
  background(winPage);
  
  // replay button
  if (isColliding(mouseX, mouseY, 1, 1, 750, 500, 100, 50)) {
    stroke("#e1da60");
    strokeWeight(3);
    cursorHover = true;
    if (mouseIsPressed) {
      gameState = "intro";
    }
  }
  else {
    noStroke();
    cursorHover = false;
  }
  fill("#edf7f7");
  rect(750, 500, 100, 50, 5);
  fill("#476563");
  noStroke();
  text("Replay", 798, 532);
}

function move() {
  let dx = 0;
  let dy = 0;

  if (keyIsDown(87)) { // W
    dy -= speed;
  }
  if (keyIsDown(65)) { // A
    dx -= speed;
  }
  if (keyIsDown(83)) { // S
    dy += speed;
  }
  if (keyIsDown(68)) { //D
    dx += speed;
  }
  
  // normalize diagonals
  let mag = sqrt(dx * dx + dy * dy);
  if (mag > 0) {
    dx = (dx / mag) * speed;
    dy = (dy / mag) * speed;
  
    // update angle based on actual direction
    angle = atan2(dy, dx)-HALF_PI;
  }


  // move X first
  playerX += dx;
  if (hitsCollision(playerX, playerY, playerW, playerH)) {
    playerX -= dx;
  }

  // move Y second
  playerY += dy;
  if (hitsCollision(playerX, playerY, playerW, playerH)) {
    playerY -= dy;
  }

  // keep player on map
  playerX = constrain(playerX, 0, mapWidth - playerW);
  playerY = constrain(playerY, 0, mapHeight - playerH);

  camX = constrain(playerX - width / 2 + 25, 0, mapWidth - width);
  camY = constrain(playerY - height / 2 + 25, 0, mapHeight - height);

  image(map, -camX, -camY, mapWidth, mapHeight);
  if (lightOn) {
    light(hiddenMap, camX, camY);
  }

  // draw walls for testing
  //for (let collision of collisions) {
  //  rect(collision.x - camX, collision.y - camY, collision.w, collision.h);
  //}

  push();
  translate(playerX - camX + 25, playerY - camY + 25); // center of image
  rotate(angle);
  imageMode(CENTER);
  image(character, 0, 0, 70, 70);
  pop();
  
  image(items, -camX, -camY, mapWidth, mapHeight);
  
  if (lightOn) {
    light(hiddenItems, camX, camY);
  }
  
  if (!lightOn) {
    image(lightOnItems, -camX, -camY, mapWidth, mapHeight);
  }
}

function light(img, camX, camY) {
  // clip lighter map onto circle
  let ctx = drawingContext;

  ctx.save();
  ctx.beginPath();
  ctx.arc(playerX - camX + 25, playerY - camY + 25, 75, 0, TWO_PI);
  ctx.clip();

  image(img, -camX, -camY, mapWidth, mapHeight);

  ctx.restore();
}

function isColliding(px, py, pw, ph, rx, ry, rw, rh) {
  return px < rx + rw &&
         px + pw > rx &&
         py < ry + rh &&
         py + ph > ry;
}

function hitsCollision(x, y, w, h) {
  for (let collision of collisions) {
    if (isColliding(x, y, w, h, collision.x, collision.y, collision.w, collision.h)) {
      return true;
    }
  }
  return false;
}

function mousePressed() {
  if (showingItem) {
    showingItem = false;
    if(collectedItems == 4) {
      collectedItems++;
    }
    return;
  }
  
  let worldMouseX = mouseX + camX;
  let worldMouseY = mouseY + camY;

  // trash can
  if (!itemsFound[0] && isColliding(worldMouseX, worldMouseY, 1, 1, 275, 325, 75, 75)) {
    lightOn = true;
    itemsFound[0] = true;
    character = birdGlasses;
    collectedItems++;
    
    showingItem = true;
    currentItem = 0;

  }
  
  // squirrel nut
  if (lightOn && !itemsFound[1] && isColliding(worldMouseX, worldMouseY, 1, 1, 275, 1100, 75, 75)) {
    itemsFound[1] = true;
    collectedItems++;
    
    showingItem = true;
    currentItem = 1;
  }

  // picnic basket
  if (lightOn && !itemsFound[2] && isColliding(worldMouseX, worldMouseY, 1, 1, 1775, 850, 50, 75)) {
    itemsFound[2] = true;
    collectedItems++;
    
    showingItem = true;
    currentItem = 2;
  }
  
  // fish
  if (lightOn && !itemsFound[3] && isColliding(worldMouseX, worldMouseY, 1, 1, 1675, 300, 75, 50)) {
    itemsFound[3] = true;
    collectedItems++;
    
    showingItem = true;
    currentItem = 3;
  }
  
}

function showObtainedItem(){
  if (showingItem) {
    if (currentItem === 0) image(obtGlasses, 0, 0, width, height);
    if (currentItem === 1) image(obtAcorn, 0, 0, width, height);
    if (currentItem === 2) image(obtChips, 0, 0, width, height);
    if (currentItem === 3) image(obtFish, 0, 0, width, height);
  }
}

function beakCursor() {
  if (cursorHover){
    image(beakHover, mouseX-20, mouseY-20, 50, 50);
  }
  else {
    image(beak, mouseX-20, mouseY-20, 50, 50);
  }
}

function checkHover(){
  let worldMouseX = mouseX + camX;
  let worldMouseY = mouseY + camY;

  // trash can
  if (!itemsFound[0] && isColliding(worldMouseX, worldMouseY, 1, 1, 275, 325, 75, 75)) {
    cursorHover = true;
  }
  
  // squirrel nut
  else if (lightOn && !itemsFound[1] && isColliding(worldMouseX, worldMouseY, 1, 1, 275, 1100, 75, 75)) {
    cursorHover = true;
  }

  // picnic basket
  else if (lightOn && !itemsFound[2] && isColliding(worldMouseX, worldMouseY, 1, 1, 1775, 850, 50, 75)) {
    cursorHover = true;
  }
  
  // fish
  else if (lightOn && !itemsFound[3] && isColliding(worldMouseX, worldMouseY, 1, 1, 1675, 300, 75, 50)) {
    cursorHover = true;
  }
  
  else {
    cursorHover = false;
  }
}
