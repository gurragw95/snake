let currentPositionY;
let currentPositionX;
let secondPosition;
let lastDirection;
let gameOver = false;
let historicalXArr = [];
let historicalYArr = [];
let lengthOfSnake = 1;
const gameContainer = document.querySelector("#gameContainer");
const foodImg = document.createElement("img");
foodImg.src = "fries.png";
foodImg.id = "fries";
const scoreDiv = document.querySelector("#scorePoints");


//#############################################################
//                    GAME LOGIC
//#############################################################

    //Adds event listeners to arrow keys.
    addEventListenersArrowKeys();
    //Add event listeners that listens to the custom event when colliding with walls or snake.
    addEventListenerGameOver();

    //Defines the game array. "e" for empty cells, "F" for food.
    let arr = [
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","F","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],
        ["e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e","e"],

    ];

    //Sets starting coordinates of snake
    currentPositionX = 0;
    currentPositionY = 4;

    //Initializes the game loop.
    alert("Starting");
    const intervalID = setInterval(() => {
        
        //Adds the historical X,Y to the arrays
        historicalXArr.push(currentPositionX);
        historicalYArr.push(currentPositionY);

        //Updates the array with the new positions
        let tempArr = updateArray(arr, lastDirection, historicalXArr, historicalYArr, lengthOfSnake);
        //New array is received
        arr = tempArr[0];
        //New Y,X coordinates are returned, as well as new length of snake.
        currentPositionY = tempArr[1];
        currentPositionX = tempArr[2];
        lengthOfSnake = tempArr[3];
        //New array is printed.
        printArray(arr);
        renderCellContent(arr);    
        scoreDiv.textContent = lengthOfSnake;    

    }, 100);


//######################### GAME FUNCTIONS ##############################

//Adds event listeners to arrow keys
function addEventListenersArrowKeys(){
    document.addEventListener("keydown", (event) => {

        switch(event.code){
            case "ArrowUp": lastDirection = "Up";
            break;
            case "ArrowDown": lastDirection = "Down";
            break;
            case "ArrowRight": lastDirection = "Right";
            break;
            case "ArrowLeft": lastDirection = "Left";
            break;
        }
    })
}

//Main game logic that creates the new array each interval.
function updateArray(gameBoardArr, lastDirection, xArray, yArray, length){

    let privateGameArray = gameBoardArr;
    let direction = lastDirection;
    let arrayY = yArray;
    let arrayX = xArray;
    let currentY = arrayY[arrayY.length -1];
    let currentX = arrayX[arrayX.length -1];
    let snakeLength = length;
    
   

    switch(direction){
        case "Up":
            //Replaces the "S" behind the snake with an "e". For example, if the snake is 2 cells long, replaces
            //the cell ar Y, X where the snake was two iterations ago (which is stored in the arrayX/Y arrays).            
            try{
                privateGameArray[arrayY[arrayY.length - snakeLength]][arrayX[arrayX.length - snakeLength]] = "e";                
            }
            catch{
                console.log("Can't");
            };            

            //Moves up one level if there is room.
            console.log("Current Y is: " + currentY);
            if(currentY > 0){
                console.log("CurrentY is " + currentY + " but still running");
                currentY = currentY - 1;

                //Checks for food in the new cell. If it hits food, places food at a new location and increases snake length.
                if(checkFoodCollision(privateGameArray, currentY, currentX) === true){
                    snakeLength++;
                    placeFood(privateGameArray);
                    console.log("Food hit!");
                }

                //If colliding with the snake, dispatches event to stop interval.
                if(checkSnakeCollision(privateGameArray, currentY, currentX) === true){
                    alert("You've hit yourself! Game over!");
                    document.dispatchEvent(gameOverEvent);
                    break;                    
                }

                //Sets the new active Y to "S"
                privateGameArray[currentY][currentX] = "S";
                break;
            } else if(currentY === 0) {
                alert("You hit the top!");
                gameOver = true;
                document.dispatchEvent(gameOverEvent);
                break;
            };
            
            
        case "Down":
            //Replaces the "S" behind the snake with an "e". For example, if the snake is 2 cells long, replaces
            //the cell ar Y, X where the snake was two iterations ago (which is stored in the arrayX/Y arrays).  
            try{
                privateGameArray[arrayY[arrayY.length - snakeLength]][arrayX[arrayX.length - snakeLength]] = "e";
            }
            catch{
                console.log("Can't");
            };

            //Moves down one level if there is room.
            console.log("Current Y is: " + currentY);
            if(currentY < privateGameArray[0].length-1){
                console.log("CurrentY is " + currentY + " but still running");
                currentY = currentY + 1;
                //Checks for food in the new cell. If it hits food, places food at a new location and increases snake length.
                if(checkFoodCollision(privateGameArray, currentY, currentX) === true){
                    snakeLength++;
                    placeFood(privateGameArray);
                    console.log("Food hit!");
                }
                //If colliding with the snake, dispatches event to stop interval.
                if(checkSnakeCollision(privateGameArray, currentY, currentX) === true){
                    alert("You've hit yourself! Game over!");
                    document.dispatchEvent(gameOverEvent);
                    break;                    
                }
                //Sets the new active Y to "S"
                privateGameArray[currentY][currentX] = "S";
                break;
            } else if(currentY === privateGameArray[0].length-1) {
                alert("You hit the bottom!");
                gameOver = true;
                document.dispatchEvent(gameOverEvent);
                break;
            };
            case "Right":
            //Replaces the "S" behind the snake with an "e". For example, if the snake is 2 cells long, replaces
            //the cell ar Y, X where the snake was two iterations ago (which is stored in the arrayX/Y arrays).  
            try{
                privateGameArray[arrayY[arrayY.length - snakeLength]][arrayX[arrayX.length - snakeLength]] = "e";
            }
            catch{
                console.log("Can't");
            };

            //Moves down one level if there is room.
            console.log("Current X is: " + currentX);
            if(currentX < privateGameArray[1].length -1){
                console.log("CurrentX is " + currentX + " but still running");
                currentX = currentX + 1;
                //Checks for food in the new cell. If it hits food, places food at a new location and increases snake length.
                if(checkFoodCollision(privateGameArray, currentY, currentX) === true){
                    snakeLength++;
                    placeFood(privateGameArray);
                    console.log("Food hit!");
                }
                //If colliding with the snake, dispatches event to stop interval.
                if(checkSnakeCollision(privateGameArray, currentY, currentX) === true){
                    alert("You've hit yourself! Game over!");
                    document.dispatchEvent(gameOverEvent);
                    break;                    
                }
                //Sets the new active Y to "S"
                privateGameArray[currentY][currentX] = "S";
                break;
            } else if(currentX === privateGameArray[1].length -1) {
                alert("You hit the right!");
                document.dispatchEvent(gameOverEvent);
                gameOver = true;
                break;
            };
            case "Left":
            //Replaces the "S" behind the snake with an "e". For example, if the snake is 2 cells long, replaces
            //the cell ar Y, X where the snake was two iterations ago (which is stored in the arrayX/Y arrays).  
            try{
                privateGameArray[arrayY[arrayY.length - snakeLength]][arrayX[arrayX.length - snakeLength]] = "e";
            }
            catch{
                console.log("Can't");
            };
            //Moves down one level if there is room.
            console.log("Current X is: " + currentX);
            if(currentX > 0){
                console.log("CurrentX is " + currentX + " but still running");
                currentX = currentX - 1;
                //Checks for food in the new cell. If it hits food, places food at a new location and increases snake length.
                if(checkFoodCollision(privateGameArray, currentY, currentX) === true){
                    snakeLength++;
                    placeFood(privateGameArray);
                    console.log("Food hit!");
                }
                //If colliding with the snake, dispatches event to stop interval.
                if(checkSnakeCollision(privateGameArray, currentY, currentX) === true){
                    alert("You've hit yourself! Game over!");
                    document.dispatchEvent(gameOverEvent);
                    break;                    
                }
                //Sets the new active Y to "S"
                privateGameArray[currentY][currentX] = "S";
                break
            } else if(currentX === 0) {
                alert("You hit the Left!");
                gameOver = true;
                document.dispatchEvent(gameOverEvent);
                break;
            };
    }

    //Returns an array of the information to the ouer scope.
    const returnArray = [privateGameArray, currentY, currentX, snakeLength];

    return returnArray;

}

function printArray(arrToPrint){

    for(let y = 0; y < arrToPrint[0].length; y++){
        let tempStr = "";
        for(let x = 0; x < arrToPrint[1].length; x++){
            tempStr = tempStr + arr[y][x] + " ";
            
        };
        console.log(JSON.stringify(tempStr) );
        console.log("");
        
    };

}

//Returns an array with a "F" placed at a random empty cell.
function placeFood(arr){

    let placeFoodArray = arr;
    let isFinished = false;
    let randX;
    let randY;

    while(isFinished === false){
        randX = getRandomInt(placeFoodArray[1].length);
        randY = getRandomInt(placeFoodArray[0].length);

        if(placeFoodArray[randY][randX] === "e"){
            placeFoodArray[randY][randX] = "F";
            isFinished = true;
            break;
        }

    }

    return arr;


}

//Returns a boolean true if the cell position contains an "F"
function checkFoodCollision(array, positionY, positionX){
    let foodCheckArray = array;
    let foodCheckY = positionY;
    let foodCheckX = positionX;
    let collisionBool = false;

    if(foodCheckArray[foodCheckY][foodCheckX] === "F"){
        collisionBool = true;
    };

    return collisionBool;
}

//Checks for collision of snake
function checkSnakeCollision(array, positionY, positionX){
    let snakeCheckArray = array;
    let snakeCheckY = positionY;
    let snakeCheckX = positionX;
    let collisionBool = false;

    if(snakeCheckArray[snakeCheckY][snakeCheckX] === "S"){
        collisionBool = true;
    };

    return collisionBool;
}

//Generates a random number from zero to max
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//Defines a custom event for collision that clears the interval timer.
const gameOverEvent = new Event("collision");

function addEventListenerGameOver(){
    document.addEventListener("collision", ()=>{
        clearInterval(intervalID);
    })
}

//####################################################################
//                     RENDERING LOGIC
//####################################################################

//Renders the main grids and creates game cells.
for(let y = 0; y < arr[0].length; y++){
    let tempDivY = document.createElement("div");
    tempDivY.classList.add("horizontalDiv");
    gameContainer.appendChild(tempDivY);

    for(let z = 0; z < arr[1].length;z++){
        let tempDivX = document.createElement("div");
        tempDivX.classList.add("gameCell");
        tempDivX.id = "cell" + y + "." + z;
        tempDivY.appendChild(tempDivX);
    }
}

function renderCellContent(array){
    let renderArray = array;
    let tempCellStr;
    let tempCell;

    for(let a = 0; a < renderArray[0].length; a++){
        for(let b = 0; b < renderArray[1].length; b++){
            tempCellStr = "cell" + a + "." + b;
            if(renderArray[a][b] === "S"){
                tempCell = document.getElementById(tempCellStr);
                tempCell.style.backgroundColor = "black";
            } else if (renderArray[a][b] === "e"){
                tempCell = document.getElementById(tempCellStr);
                tempCell.style.backgroundColor = "white";
            } else if (renderArray[a][b] === "F"){
                tempCell = document.getElementById(tempCellStr);
                tempCell.appendChild(foodImg);
            }
            
        }
    }
}


