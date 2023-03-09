const gridContainer = document.querySelector('.grid-container');
let iterationCount = 0;
iterationDisplay = document.querySelector('.iteration-count');
let gridComputedStyle = window.getComputedStyle(gridContainer);
let numCols = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
let numRows = gridComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;
let cells = []; // cells[i] is an array [node, value] where node is the dom node for the cell and value is either 0 or 1 for alive or dead

// build initial grid with event listeners on each cell
buildGrid(numRows, numCols);
toggleCellOnClick();

// rebuild grid with new row and column sizes whenever window is resized
window.addEventListener('resize', () => {
    // remove all current grid elements from dom and cells array
    cells = [];
    while(gridContainer.firstChild) {
        gridContainer.lastChild.remove();
    }  

    let currentComputedStyle = window.getComputedStyle(gridContainer);
    numCols = currentComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
    numRows = currentComputedStyle.getPropertyValue("grid-template-rows").split(" ").length;
    buildGrid(numRows, numCols);
    toggleCellOnClick();
});

function buildGrid(rows, cols) {
    for(let i = 0; i < rows * cols; i++) {
        let newCell = document.createElement('div');
        newCell.classList.add('cell');
        newCell.id = i;
        newCell.style.backgroundColor = '#4059ad';
        newCell.style.opacity = 0.1;
        gridContainer.appendChild(newCell);
        cells.push([newCell, 0]);
    }
}

function toggleCellOnClick() {
    for(let i = 0; i < cells.length; i++) {
        cells[i][0].addEventListener('click', () => {
            if(cells[i][0].style.opacity === '0.1') {
                cells[i][0].style.opacity = 1;
                cells[i][1] = 1;
            } else {
                cells[i][0].style.opacity = 0.1;
                cells[i][1] = 0;
            }
        });
    }
}

function countLivingNeighbors(cellAndData) {
    let count = 0;
    let index = Number(cellAndData[0].id);
    let top;
    let topRight;
    let topLeft;
    let left;
    let right;
    let bottom;
    let bottomRight;
    let bottomLeft;

    // get all the neighbors of the cell
    if(index === 0) {
        top = numRows * numCols - numCols;
        topRight = numRows * numCols - numCols + 1;
        topLeft = numRows * numCols - 1;
        left = numCols - 1;
        right = 1;
        bottom = numCols;
        bottomRight = numCols + 1;
        bottomLeft = numCols * 2 - 1;
    } else if(index === numCols - 1) {
        top = numRows * numCols - 1;
        topRight = numRows * numCols - numCols;
        topLeft = numRows * numCols - 2;
        right = 0;
        left = numCols - 2;
        bottom = 2 * numCols - 1;
        bottomRight = numCols;
        bottomLeft = 2 * numCols - 2;
    } else if(index === numRows * numCols - numCols) {
        top = numRows * numCols - 2 * numCols;
        topRight = numRows * numCols - 2 * numCols + 1;
        topLeft = numRows * numCols - numCols - 1;
        left = numRows * numCols - 1;
        right = numRows * numCols - numCols + 1;
        bottom = 0;
        bottomRight = 1;
        bottomLeft = numCols - 1;
    } else if(index === numRows * numCols - 1) {
        top = numRows * numCols - numCols - 1;
        topRight = numRows * numCols - 2 * numCols;
        topLeft = numRows * numCols - numCols - 2;
        right = numRows * numCols - numCols;
        left = numRows * numCols - 2;
        bottom  = numCols - 1;
        bottomRight = 0;
        bottomLeft = numCols - 2;
    } else if(index % numCols === 0) {
        top = index - numCols;
        topLeft = index - 1;
        topRight = index - numCols + 1;
        left = index + numCols - 1;
        right = index + 1;
        bottom = index + numCols;
        bottomLeft = index + 2 * numCols - 1;
        bottomRight = index + numCols + 1;
    } else if(index % numCols === numCols - 1) {
        top = index - numCols;
        topLeft = index - numCols - 1;
        topRight = index - 2 * numCols + 1;
        left = index - 1;
        right = index - numCols + 1;
        bottom = index + numCols;
        bottomLeft = index + numCols - 1;
        bottomRight = index + 1;
    } else if(index < numCols - 1 && index > 0) {
        top = index + numRows * numCols - numCols;
        topLeft = index + numRows * numCols - numCols - 1;
        topRight = index + numRows * numCols - numCols + 1;
        left = index - 1;
        right = index + 1;
        bottom = index + numCols;
        bottomLeft = index + numCols - 1;
        bottomRight = index + numCols + 1;
    } else if(index > numRows * numCols - numCols && index < numRows * numCols - 1) {
        top = index - numCols;
        topLeft = index - numCols - 1;
        topRight = index - numCols + 1;
        left = index - 1;
        right = index + 1;
        bottom = index - (numRows * numCols - numCols);
        bottomLeft = index - (numRows * numCols - numCols + 1);
        bottomRight = index - (numRows * numCols - numCols - 1);
    } else {
        top = index - numCols;
        topLeft = index - numCols - 1;
        topRight = index - numCols + 1;
        left = index - 1;
        right = index + 1;
        bottom = index + numCols;
        bottomLeft = index + numCols - 1;
        bottomRight = index + numCols + 1;
    }

    count = cells[top][1] + cells[topLeft][1] + cells[topRight][1] + cells[left][1] + cells[right][1] + cells[bottom][1] + cells[bottomLeft][1] + cells[bottomRight][1];
    return count;
}

function playOneRound() {
    let toBeColored = [];
    let toBeUncolored = [];
    for(let i = 0; i < cells.length; i++) {
        let numNeighbors = countLivingNeighbors(cells[i]);
        if(cells[i][1] === 1 && numNeighbors < 2) {
            toBeUncolored.push(cells[i]);
        }

        if(cells[i][1] === 1 && numNeighbors > 3) {
            toBeUncolored.push(cells[i]);
        }

        if(cells[i][1] === 0 && numNeighbors === 3) {
            toBeColored.push(cells[i]);
        }
    }

    for(let i = 0; i < toBeColored.length; i++) {
        toBeColored[i][0].style.opacity = 1;
        toBeColored[i][1] = 1;
    }

    for(let i = 0; i < toBeUncolored.length; i++) {
        toBeUncolored[i][0].style.opacity = 0.1;
        toBeUncolored[i][1] = 0;
    }

    iterationCount++;
    iterationDisplay.textContent = `Iteration Count: ${iterationCount}`;
}

// buttons
const playBtn = document.getElementById('play-button');
const pauseBtn = document.getElementById('pause-button');
const resetBtn = document.getElementById('reset-button');
const presetOne = document.getElementById('preset-one');
const presetTwo = document.getElementById('preset-two');
const presetThree = document.getElementById('preset-three');
let intervalId;

// button event listeners
playBtn.addEventListener('click', () => {
    if(!intervalId) {
        intervalId = setInterval(playOneRound, 200);
    }
});

pauseBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
});

resetBtn.addEventListener('click', () => {
    if(intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    for(let i = 0; i < cells.length; i++) {
        cells[i][0].style.opacity = 0.1;
        cells[i][1] = 0;
    }

    iterationCount = 0;
    iterationDisplay.textContent = `Iteration Count: ${iterationCount}`;
});

presetOne.addEventListener('click', () => {
    if(numCols === 50 && numRows === 30) {
        cells[623][0].style.opacity = 1;
        cells[623][1] = 1;
        cells[673][0].style.opacity = 1
        cells[673][1] = 1;
        cells[723][0].style.opacity = 1
        cells[723][1] = 1;
        cells[722][0].style.opacity = 1;
        cells[722][1] = 1;
        cells[671][0].style.opacity = 1;
        cells[671][1] = 1;

    }

    if(numCols === 40 && numRows === 30) {
        cells[539][0].style.opacity = 1;
        cells[539][1] = 1;
        cells[579][0].style.opacity = 1;
        cells[579][1] = 1;
        cells[619][0].style.opacity = 1;
        cells[619][1] = 1;
        cells[618][0].style.opacity = 1;
        cells[618][1] = 1;
        cells[577][0].style.opacity = 1;
        cells[577][1] = 1;
    }

    if(numCols === 30 && numRows == 30) {
        cells[436][0].style.opacity = 1;
        cells[436][1] = 1;
        cells[466][0].style.opacity = 1
        cells[466][1] = 1;
        cells[496][0].style.opacity = 1;
        cells[496][1] = 1;
        cells[495][0].style.opacity = 1;
        cells[495][1] = 1;
        cells[464][0].style.opacity = 1;
        cells[464][1] = 1;
    }

    if(numCols === 20 && numRows === 30) {
        cells[230][0].style.opacity = 1;
        cells[230][1] = 1;
        cells[250][0].style.opacity = 1;
        cells[250][1] = 1;
        cells[270][0].style.opacity = 1;
        cells[270][1] = 1;
        cells[269][0].style.opacity = 1;
        cells[269][1] = 1;
        cells[248][0].style.opacity = 1;
        cells[248][1] = 1;
    }

    if(numCols === 15 && numRows === 20) {
        cells[111][0].style.opacity = 1;
        cells[111][1] = 1;
        cells[126][0].style.opacity = 1
        cells[126][1] = 1;
        cells[141][0].style.opacity = 1;
        cells[141][1] = 1;
        cells[140][0].style.opacity = 1;
        cells[140][1] = 1;
        cells[124][0].style.opacity = 1;
        cells[124][1] = 1;
    }
});

presetTwo.addEventListener('click', () => {
    if(numCols === 50 && numRows === 30) {
        cells[573][0].style.opacity = 1;
        cells[573][1] = 1;
        cells[576][0].style.opacity = 1;
        cells[576][1] = 1;
        cells[627][0].style.opacity = 1;
        cells[627][1] = 1;
        cells[673][0].style.opacity = 1;
        cells[673][1] = 1;
        cells[677][0].style.opacity = 1;
        cells[677][1] = 1;
        cells[724][0].style.opacity = 1;
        cells[724][1] = 1;
        cells[725][0].style.opacity = 1;
        cells[725][1] = 1;
        cells[726][0].style.opacity = 1;
        cells[726][1] = 1;
        cells[727][0].style.opacity = 1;
        cells[727][1] = 1;
    }

    if(numCols === 40 && numRows === 30) {
        cells[497][0].style.opacity = 1;
        cells[497][1] = 1;
        cells[500][0].style.opacity = 1;
        cells[500][1] = 1;
        cells[541][0].style.opacity = 1;
        cells[541][1] = 1;
        cells[577][0].style.opacity = 1;
        cells[577][1] = 1;
        cells[581][0].style.opacity = 1;
        cells[581][1] = 1;
        cells[618][0].style.opacity = 1;
        cells[618][1] = 1;
        cells[619][0].style.opacity = 1;
        cells[619][1] = 1;
        cells[620][0].style.opacity = 1;
        cells[620][1] = 1;
        cells[621][0].style.opacity = 1;
        cells[621][1] = 1;
    }

    if(numCols === 30 && numRows == 30) {
        cells[402][0].style.opacity = 1;
        cells[402][1] = 1;
        cells[405][0].style.opacity = 1;
        cells[405][1] = 1;
        cells[436][0].style.opacity = 1;
        cells[436][1] = 1;
        cells[462][0].style.opacity = 1;
        cells[462][1] = 1;
        cells[466][0].style.opacity = 1;
        cells[466][1] = 1;
        cells[493][0].style.opacity = 1;
        cells[493][1] = 1;
        cells[494][0].style.opacity = 1;
        cells[494][1] = 1;
        cells[495][0].style.opacity = 1;
        cells[495][1] = 1;
        cells[496][0].style.opacity = 1;
        cells[496][1] = 1;
    }

    if(numCols === 20 && numRows === 30) {
        cells[266][0].style.opacity = 1;
        cells[266][1] = 1;
        cells[269][0].style.opacity = 1;
        cells[269][1] = 1;
        cells[290][0].style.opacity = 1;
        cells[290][1] = 1;
        cells[306][0].style.opacity = 1;
        cells[306][1] = 1;
        cells[310][0].style.opacity = 1;
        cells[310][1] = 1;
        cells[327][0].style.opacity = 1;
        cells[327][1] = 1;
        cells[328][0].style.opacity = 1;
        cells[328][1] = 1;
        cells[329][0].style.opacity = 1;
        cells[329][1] = 1;
        cells[330][0].style.opacity = 1;
        cells[330][1] = 1;
    }

    if(numCols === 15 && numRows === 20) {
        cells[124][0].style.opacity = 1;
        cells[124][1] = 1;
        cells[127][0].style.opacity = 1;
        cells[127][1] = 1;
        cells[143][0].style.opacity = 1;
        cells[143][1] = 1;
        cells[154][0].style.opacity = 1;
        cells[154][1] = 1;
        cells[158][0].style.opacity = 1;
        cells[158][1] = 1;
        cells[170][0].style.opacity = 1;
        cells[170][1] = 1;
        cells[171][0].style.opacity = 1;
        cells[171][1] = 1;
        cells[172][0].style.opacity = 1;
        cells[172][1] = 1;
        cells[173][0].style.opacity = 1;
        cells[173][1] = 1;
    }

});

presetThree.addEventListener('click', () => {
    if(numCols === 50 && numRows === 30) {
        cells[621][0].style.opacity = 1;
        cells[621][1] = 1;
        cells[627][0].style.opacity = 1;
        cells[627][1] = 1;
        cells[670][0].style.opacity = 1;
        cells[670][1] = 1;
        cells[672][0].style.opacity = 1;
        cells[672][1] = 1;
        cells[676][0].style.opacity = 1;
        cells[676][1] = 1;
        cells[678][0].style.opacity = 1;
        cells[678][1] = 1;
        cells[720][0].style.opacity = 1;
        cells[720][1] = 1;
        cells[723][0].style.opacity = 1;
        cells[723][1] = 1;
        cells[725][0].style.opacity = 1;
        cells[725][1] = 1;
        cells[728][0].style.opacity = 1;
        cells[728][1] = 1;
        cells[772][0].style.opacity = 1;
        cells[772][1] = 1;
        cells[776][0].style.opacity = 1;
        cells[776][1] = 1;
        cells[822][0].style.opacity = 1;
        cells[822][1] = 1;
        cells[823][0].style.opacity = 1;
        cells[823][1] = 1;
        cells[825][0].style.opacity = 1;
        cells[825][1] = 1;
        cells[826][0].style.opacity = 1;
        cells[826][1] = 1;
    }

    if(numCols === 40 && numRows === 30) {
        cells[376][0].style.opacity = 1;
        cells[376][1] = 1;
        cells[382][0].style.opacity = 1;
        cells[382][1] = 1;
        cells[415][0].style.opacity = 1;
        cells[415][1] = 1;
        cells[417][0].style.opacity = 1;
        cells[417][1] = 1;
        cells[421][0].style.opacity = 1;
        cells[421][1] = 1;
        cells[423][0].style.opacity = 1;
        cells[423][1] = 1;
        cells[455][0].style.opacity = 1;
        cells[455][1] = 1;
        cells[458][0].style.opacity = 1;
        cells[458][1] = 1;
        cells[460][0].style.opacity = 1;
        cells[460][1] = 1;
        cells[463][0].style.opacity = 1;
        cells[463][1] = 1;
        cells[497][0].style.opacity = 1;
        cells[497][1] = 1;
        cells[501][0].style.opacity = 1;
        cells[501][1] = 1;
        cells[537][0].style.opacity = 1;
        cells[537][1] = 1;
        cells[538][0].style.opacity = 1;
        cells[538][1] = 1;
        cells[540][0].style.opacity = 1;
        cells[540][1] = 1;
        cells[541][0].style.opacity = 1;
        cells[541][1] = 1;
    }

    if(numCols === 30 && numRows == 30) {
        cells[341][0].style.opacity = 1;
        cells[341][1] = 1;
        cells[347][0].style.opacity = 1;
        cells[347][1] = 1;
        cells[370][0].style.opacity = 1;
        cells[370][1] = 1;
        cells[372][0].style.opacity = 1;
        cells[372][1] = 1;
        cells[376][0].style.opacity = 1;
        cells[376][1] = 1;
        cells[378][0].style.opacity = 1;
        cells[378][1] = 1;
        cells[400][0].style.opacity = 1;
        cells[400][1] = 1;
        cells[403][0].style.opacity = 1;
        cells[403][1] = 1;
        cells[405][0].style.opacity = 1;
        cells[405][1] = 1;
        cells[408][0].style.opacity = 1;
        cells[408][1] = 1;
        cells[432][0].style.opacity = 1;
        cells[432][1] = 1;
        cells[436][0].style.opacity = 1;
        cells[436][1] = 1;
        cells[462][0].style.opacity = 1;
        cells[462][1] = 1;
        cells[463][0].style.opacity = 1;
        cells[463][1] = 1;
        cells[465][0].style.opacity = 1;
        cells[465][1] = 1;
        cells[466][0].style.opacity = 1;
        cells[466][1] = 1;
    }

    if(numCols === 20 && numRows === 30) {
        cells[147][0].style.opacity = 1;
        cells[147][1] = 1;
        cells[153][0].style.opacity = 1;
        cells[153][1] = 1;
        cells[166][0].style.opacity = 1;
        cells[166][1] = 1;
        cells[168][0].style.opacity = 1;
        cells[168][1] = 1;
        cells[172][0].style.opacity = 1;
        cells[172][1] = 1;
        cells[174][0].style.opacity = 1;
        cells[174][1] = 1;
        cells[186][0].style.opacity = 1;
        cells[186][1] = 1;
        cells[189][0].style.opacity = 1;
        cells[189][1] = 1;
        cells[191][0].style.opacity = 1;
        cells[191][1] = 1;
        cells[194][0].style.opacity = 1;
        cells[194][1] = 1;
        cells[208][0].style.opacity = 1;
        cells[208][1] = 1;
        cells[212][0].style.opacity = 1;
        cells[212][1] = 1;
        cells[228][0].style.opacity = 1;
        cells[228][1] = 1;
        cells[229][0].style.opacity = 1;
        cells[229][1] = 1;
        cells[231][0].style.opacity = 1;
        cells[231][1] = 1;
        cells[232][0].style.opacity = 1;
        cells[232][1] = 1;
    }

    if(numCols === 15 && numRows === 20) {
        cells[108][0].style.opacity = 1;
        cells[108][1] = 1;
        cells[93][0].style.opacity = 1;
        cells[93][1] = 1;
        cells[79][0].style.opacity = 1;
        cells[79][1] = 1;
        cells[95][0].style.opacity = 1;
        cells[95][1] = 1;
        cells[111][0].style.opacity = 1;
        cells[111][1] = 1;
        cells[125][0].style.opacity = 1;
        cells[125][1] = 1;
        cells[140][0].style.opacity = 1;
        cells[140][1] = 1;
        cells[141][0].style.opacity = 1;
        cells[141][1] = 1;
        cells[143][0].style.opacity = 1;
        cells[143][1] = 1;
        cells[144][0].style.opacity = 1;
        cells[144][1] = 1;
        cells[129][0].style.opacity = 1;
        cells[129][1] = 1;
        cells[113][0].style.opacity = 1;
        cells[113][1] = 1;
        cells[99][0].style.opacity = 1;
        cells[99][1] = 1;
        cells[85][0].style.opacity = 1;
        cells[85][1] = 1;
        cells[101][0].style.opacity = 1;
        cells[101][1] = 1;
        cells[116][0].style.opacity = 1;
        cells[116][1] = 1;
    }

});