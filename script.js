// create grid cells and add them to the container
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

// add event listener to each grid cell that toggles background color on click
let cells = document.querySelectorAll('.cell');

(function toggleColorOnClick() {
    for(let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', () => {
            if(cells[i].style.backgroundColor === '') {
                cells[i].style.backgroundColor = 'black';
            } else {
                cells[i].style.backgroundColor = '';
            }
        });
    }
})();