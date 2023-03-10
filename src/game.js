const rows = 40;
const cols = 90;
const frequency = 500;

var isGame = false;
var timer;
var grid = new Array(rows);
var next = new Array(rows);

window.onload = init;

function init() {
    createTable();
    initializeField();
    buttonSetup();
}


// setting up table and initial grid section
function createTable() {
    var fieldElement = document.getElementById('field');
    var table = document.createElement("table");
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "-" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = changeCellState;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    fieldElement.appendChild(table);
}

function changeCellState() {
    var coords = this.id.split("-");
    var x = coords[0];
    var y = coords[1];
        
    var classes = this.getAttribute("class");
    if(classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[x][y] = 0;
    } else {
        this.setAttribute("class", "alive");
        grid[x][y] = 1;
    }
}
// end of setting up table and initial grid section


// field handler section
function initializeField() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        next[i] = new Array(cols);
    }
    for (i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            next[i][j] = 0;
        }
    }
}

function passFieldState() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = next[i][j];
            next[i][j] = 0;
        }
    }
}

function updateField() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "-" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "alive");
            }
        }
    }
}
// end of field handler section


// button handler section
function buttonSetup() {
    var startButton = document.getElementById('startBtn');
    startButton.onclick = startButtonHandler;
    
    var clearButton = document.getElementById('clearBtn');
    clearButton.onclick = clearButtonHandler;
    
    var randomButton = document.getElementById("randomBtn");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (isGame) return;
    clearButtonHandler();

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var randomLife = Math.round(Math.random());
            if (randomLife == 1) {
                var cell = document.getElementById(i + "-" + j);
                cell.setAttribute("class", "alive");
                grid[i][j] = 1;
            }
        }
    }
}

function clearButtonHandler() {
    isGame = false;
    var startBtn = document.getElementById('startBtn');
    startBtn.innerHTML = "<b>Start</b>";    
    clearTimeout(timer);
    
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "-" + j);
            cell.setAttribute("class", "dead");
            grid[i][j] = 0;
            next[i][j] = 0;
        }
    }
}

function startButtonHandler() {
    if (isGame) {
        isGame = false;
        this.innerHTML = "<b>Continue</b>";
        clearTimeout(timer);
    } else {
        isGame = true;
        this.innerHTML = "<b>Pause</b>";
        run();
    }
}
// end of button handler section


// game logic section
function run() {
    nextGeneration();
    if (isGame) {
        timer = setTimeout(run, frequency);
    }
}

function nextGeneration() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            cellNextState(i, j);
        }
    }
    passFieldState();
    updateField();
}

function cellNextState(x, y) {
    var alive = getAliveNeighbors(x, y);
    if (grid[x][y] == 1) {
        if (alive <= 3 && alive >= 2) {
            next[x][y] = 1;
        } 
        else {
            next[x][y] = 0;
        }
    } else {
        if(alive == 3){
            next[x][y] = 1;
        }
        else {
            next[x][y] = 0;
        }
    }
}
    
function getAliveNeighbors(x, y) {
    var count = 0;
    for(var i = x; i <= x+2; i++){
        for(var j = y; j <= y+2; j++){
            if(grid[(i - 1 + rows) % rows][(j - 1 + cols) % cols] == 1){
                if(!((i - 1 + rows) % rows == x && (j - 1 + cols) % cols == y)){
                    count++;
                }
            }
        }
    }
    return count;
}
// end of game logic section