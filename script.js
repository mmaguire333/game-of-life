let container = document.querySelector('.grid-container');

(function createGridCells(numRows, numCols) {
    for(let i = 0; i < numRows; i++) {
        for(let j = 0; j < numCols; j++) {
            let newCell = document.createElement('div');
            newCell.className = `cell row-${i} col-${j}`;
            container.appendChild(newCell);
        }
    }
})(30, 40);