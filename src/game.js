const rows = 38;
const cols = 100;
const frequency = 500;

var isGame = false;
var timer;
var grid = new Array(rows);
var next = new Array(rows);

function initializeField() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        next[i] = new Array(cols);
    }
    for (var i = 0; i < rows; i++) {
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

function init() {
    createTable();
    initializeField();
    buttonSetup();
}


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
        this.setAttribute("class", "live");
        grid[x][y] = 1;
    }
}

function updateField() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "-" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function buttonSetup() {
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    var randomButton = document.getElementById("random");
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
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

function clearButtonHandler() {
    isGame = false;
    var btnStart = document.getElementById('start');
    btnStart.innerHTML = "<b>Start</b>";    
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

window.onload = init;