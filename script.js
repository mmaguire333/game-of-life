// create grid cells and add them to the container
let container = document.querySelector('.grid-container');

(function createGridCells(numRows, numCols) {
    for(let i = 0; i < numRows; i++) {
        for(let j = 0; j < numCols; j++) {
            let newCell = document.createElement('div');
            newCell.className = 'cell';
            newCell.dataset.row = i;
            newCell.dataset.col = j;
            container.appendChild(newCell);
        }
    }
})(20, 40);

// add event listener to each grid cell that toggles background color on click
let cells = document.querySelectorAll('.cell');

(function toggleColorOnClick() {
    for(let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', () => {
            toggleColor(cells[i]);
        });
    }
})();

function toggleColor(cell) {
    if(cell.style.backgroundColor === '') {
        cell.style.backgroundColor = 'black';
    } else {
        cell.style.backgroundColor = '';
    }
}

function getTopNeighbor(cell) {
    let topRow = Number(cell.dataset.row) - 1;
    let topCol = Number(cell.dataset.col);
    return document.querySelector(`div[data-row="${topRow}"][data-col="${topCol}"]`);
}

function getTopLeftNeighbor(cell) {
    let topLeftRow = Number(cell.dataset.row) - 1;
    let topLeftCol = Number(cell.dataset.col) - 1;
    return document.querySelector(`div[data-row="${topLeftRow}"][data-col="${topLeftCol}"]`);
}

function getTopRightNeighbor(cell) {
    let topRightRow = Number(cell.dataset.row) - 1;
    let topRightCol = Number(cell.dataset.col) + 1;
    return document.querySelector(`div[data-row="${topRightRow}"][data-col="${topRightCol}"]`);
}

function getLeftNeighbor(cell) {
    let leftRow = Number(cell.dataset.row);
    let leftCol = Number(cell.dataset.col) - 1;
    return document.querySelector(`div[data-row="${leftRow}"][data-col="${leftCol}"]`);
}

function getRightNeighbor(cell) {
    let rightRow = Number(cell.dataset.row);
    let rightCol = Number(cell.dataset.col) + 1;
    return document.querySelector(`div[data-row="${rightRow}"][data-col="${rightCol}"]`);
}

function getBottomNeighbor(cell) {
    let bottomRow = Number(cell.dataset.row) + 1;
    let bottomCol = Number(cell.dataset.col);
    return document.querySelector(`div[data-row="${bottomRow}"][data-col="${bottomCol}"]`);
}

function getBottomLeftNeighbor(cell) {
    let bottomLeftRow = Number(cell.dataset.row) + 1;
    let bottomLeftCol = Number(cell.dataset.col) - 1;
    return document.querySelector(`div[data-row="${bottomLeftRow}"][data-col="${bottomLeftCol}"]`);
}

function getBottomRightNeighbor(cell) {
    let bottomRightRow = Number(cell.dataset.row) + 1;
    let bottomRightCol = Number(cell.dataset.col) + 1;
    return document.querySelector(`div[data-row="${bottomRightRow}"][data-col="${bottomRightCol}"]`);
}

function isCellAlive(cell) {
    if(!cell) {
        return false;
    } else if(cell.style.backgroundColor === 'black') {
        return true;
    } else {
        return false;
    }
}

function countLiveNeighbors(cell) {
    let count = 0;
    let neighbors = [];
    neighbors.push(getTopNeighbor(cell));
    neighbors.push(getTopLeftNeighbor(cell));
    neighbors.push(getTopRightNeighbor(cell));
    neighbors.push(getLeftNeighbor(cell));
    neighbors.push(getRightNeighbor(cell));
    neighbors.push(getBottomNeighbor(cell));
    neighbors.push(getBottomLeftNeighbor(cell));
    neighbors.push(getBottomRightNeighbor(cell));

    for(let i = 0; i < neighbors.length; i++) {
        if(isCellAlive(neighbors[i])) {
            count++;
        }
    }
    return count;
}

function playOneStep() {

}