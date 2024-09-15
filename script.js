const resetButton = document.querySelector("#resetButton");
const scoreTxt = document.querySelector("#scoreTxt");
const board = document.querySelector("#board"); //const declaired and linked with html id for use below
const context = board.getContext("2d"); //game board given context value of 2d
const boardHeight = board.height;
const boardWidth = board.width;
const backgroundCol = "yellow";
const snakeCol = "blue";
const snakeBrdr = "white";
const foodCol = "green"; //elements given colour value
const unitSize = 20; //value in px

let onrun = false;
let score = 0;
let xVelocity = unitSize; //how far snake moves right in relation to every below gameTick
let yVelocity = 0; //not moving up or down at start
let foodX;
let foodY; //coordinates calculated randomly below
let snake = [
    {x:unitSize * 2, y:0}, //each starting body parts coordinates
    {x:unitSize, y:0},
    {x:0, y:0} //snake is formed with objects in an array
];

let level = 1; // default level
let speed = 100; // Initial speed (milliseconds)
let actionTaken = false; // actionTaken declared as false for use in checkLevel function to help control level change

window.addEventListener("keydown", changeDirection); //window object will listen for keydown and changeDirection function bellow
resetButton.addEventListener("click", rstGame); //below resetGame function invoked when resetbtn clicked

start(); //function invoked

function start(){
    onrun= true;
    scoreTxt.textContent = score; // score starts at 0
    createFood();
    drawFood();
    update();
};
function update(){
    if(onrun){
        setTimeout(()=>{ //arrow function expression to invoke below functions
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            checkHighScore();
            checkLevel();
            displayLevel();

            update();
    }, speed) // function updates every 100 milliseconds using setTimeout.
} 
    else {
        displayGameOver();
        displayHighScore();
    }
};
function clearBoard(){
    context.fillStyle = backgroundCol;
    context.fillRect(0, 0, boardWidth, boardHeight); //repaints board
};
function createFood() {
    let emptyUnit = false;
    while (!emptyUnit) { // emptyUnit remains false
        // Generate random coordinates for the food
        const newFoodX = Math.floor(Math.random() * (boardWidth / unitSize)) * unitSize; // ((Math.random returns number between 0-1) * bW or bH(400) / uS(20)) * uS ->(becomes) (399.9999) Math.floor rounds down so ->(becomes) (99)
        const newFoodY = Math.floor(Math.random() * (boardHeight / unitSize)) * unitSize; //allows food to appear in random coordinate on board, and after eaten.

        // Check if the new food coordinates overlap with any part of the snake or obstacles
        const snakeOverlap = snake.some(snakePart => snakePart.x === newFoodX && snakePart.y === newFoodY);  // some method iterates through each segment of the arrays [snakePart], [obstacle], using their x and y coordinates to locate them and check them against the newFood coordinates.

        if (!snakeOverlap) {
            // if food coordinates are valid, exit the loop.
            foodX = newFoodX;
            foodY = newFoodY;
            emptyUnit = true; // food will only regenerate in an empty unity.
        }
    }
}
function drawFood(){
    context.fillStyle = foodCol;  //color is assigned to food
    context.fillRect(foodX, foodY, unitSize, unitSize); //coordinates, width and height also assigned
    //when drawFood is invoked after createFood, foods coordinates are randomly generated after every refresh.

};
function moveSnake(){
    const newHead = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity}; // newHead is created in relation to position of current head and direction of travel
                
    snake.unshift(newHead);
    //checking if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){ //new head takes position of eaten food using unshift method.
        score+=1;
        scoreTxt.textContent = score;
        createFood(); //score increases by 1 and new food is randomly generated
    }
    else{
        snake.pop(); //tail is removed using pop method.
    }
};
function drawSnake(){
    context.fillStyle = snakeCol;
    context.strokeStyle = snakeBrdr; // filled with colours stored above as constants.
    snake.forEach(snakePart => { //arrow function expression after forEach method
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize); //each snake part is fills a uS and is given a colour and border
    })
};
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40; //numerical values of each key stored
    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize); //direction of key = travel direction
    switch(true){
        case(keyPressed == LEFT && !goingRight):
        xVelocity = -unitSize;
        yVelocity = 0;
        break;
        case(keyPressed == UP && !goingDown):
        xVelocity = 0;
        yVelocity = -unitSize;
        break;
        case(keyPressed == RIGHT && !goingLeft):
        xVelocity = unitSize;
        yVelocity = 0;
        break;
        case(keyPressed == DOWN && !goingUp): //cant move in opposite direction imediately
        xVelocity = 0;
        yVelocity = unitSize; //x & y velocity given unique value so that actual direction corresponds to key pressed
        break;
    }
};
function checkLevel() {
    if (score % 7 === 0 && score > 1 && !actionTaken) {
        level++; // Increase level by 1
        speed -= 7; // Decrease speed by 7 milliseconds (increasing speed of snake)
        actionTaken = true; // Action has been taken
    }
    else if (score % 7 !== 0) {
        actionTaken = false; // reset actionTaken to false after each level up
    }
    if (level > 7) {
        level = 7; // levels max out at 7.
    }
}
function displayLevel() {
    context.textAlign = "center";
    context.font = "20px Segoe UI"; // Adjust font size as needed
    context.fillStyle = "darkred"; // Choose a color for the level display
    context.fillText(`Level: ${level}`, boardWidth / 2, 30); // Display level at the top
}
function checkGameOver(){
    if (snake[0].x < 0 || snake[0].x >= boardWidth || snake[0].y < 0 || snake[0].y >= boardHeight) {
        onrun = false; //out of bounds game over condition set
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            onrun = false; //snake will die if it collides with its body
        }
    }
};
function displayGameOver(){
    context.textAlign = "center";
    context.font = "50px Segoe UI";
    context.fillStyle = "red";
    context.fillText("GAME OVER!!!", boardWidth / 2, boardHeight / 2);
    onrun = false; //game over message displayed given css and snake will stop moving
};
function rstGame(){
    score = 0;
    level = 1;
    speed = 100;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    start(); //game will reset with these above properties and start(); function reinvoked
};
function checkHighScore() {
    const highScore = localStorage.getItem("Highest Score"); //current high score retrieved from local storage
    if (highScore === null || score > parseInt(highScore)) { //checking if a previous high score has been set. if it has, checking if new score is bigger.
        localStorage.setItem("Highest Score", score.toString()); // if the new score is higher, it replaces previous one(stored as string).
    } // if old high score is biggest, nothing is changed.
}
function displayHighScore() {
    const highScore = localStorage.getItem("Highest Score"); //current high score retrieved from local storage
    if (highScore !== null) { // checking if a previous high score has been set.
        context.textAlign = "center";
        context.font = "30px Segoe UI";
        context.fillStyle = "darkred";
        context.fillText(`High Score: ${highScore}`, boardWidth / 2, boardHeight - 10);
    } // new high score will be displayed with the above css when this function is invoked.
}