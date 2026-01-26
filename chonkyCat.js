// AUTHOR - Kiara Jenkins

// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// cat
let catWidth = 59.5;
let catHeight = 42;
let catX = boardWidth/8;
let catY = boardHeight/2;
let catImg;
let cat = {
    x : catX,
    y : catY,
    width : catWidth,
    height : catHeight,
}

// towers
let towerArray = [];
let towerWidth = 64;
let towerHeight = 512;
let towerX = boardWidth;
let towerY = 0;
let topTowerImg;
let bottomTowerImg;

// physics
let velocityX = -2; // tower move speed
let velocityY = 0; // cat jump speed
let gravity = 0.4;

// game over
let gameOver = false;

// score
let score = 0;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    catImg = new Image();
    catImg.src = "./assets/mochi.png";
    catImg.onload = function() {
        context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
    }

    topTowerImg = new Image();
    topTowerImg.src = "./assets/toppipe.png";

    bottomTowerImg = new Image();
    bottomTowerImg.src = "./assets/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placeTowers, 1500);
    this.document.addEventListener("keydown", moveCat);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    // clear board
    context.clearRect(0, 0, board.width, board.height);

    // cat
    velocityY += gravity;
    cat.y = Math.max(cat.y + velocityY, 0);
    context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);

    if (cat.y > board.height) {
        gameOver = true;
    }

    // towers
    for(let i = 0; i < towerArray.length; i++) {
        let tower = towerArray[i];
        tower.x += velocityX;
        context.drawImage(tower.img, tower.x, tower.y, tower.width, tower.height);

        if (!tower.passed && cat.x > tower.x + tower.width) {
            score += 0.5;
            tower.passed = true;
        }

        if (detectCollision(cat, tower)) {
            gameOver = true;
        }
    }

    // clear towers
    while (towerArray.length > 0 && towerArray[0].x < -towerWidth) {
        towerArray.shift();
    }

    // score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // game over
    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }

}

function placeTowers() {
    if (gameOver) {
        return;
    }
    let randomTowerY = towerY - towerHeight/4 - Math.random()*(towerHeight/2);
    let openingSpace = board.height/4;
    let topTower = {
    img : topTowerImg,
    x : towerX,
    y : randomTowerY,
    width : towerWidth,
    height : towerHeight,
    passed : false
    }
    towerArray.push(topTower);

    let bottomTower = {
        img : bottomTowerImg,
        x : towerX,
        y : randomTowerY + towerHeight + openingSpace,
        width : towerWidth,
        height : towerHeight,
        passed : false
    }
    towerArray.push(bottomTower);
}

function moveCat(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "ArrowRight") {
        // jump
        velocityY = -6;
    }

    // reset game
    if (gameOver) {
        cat.y = catY;
        towerArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}