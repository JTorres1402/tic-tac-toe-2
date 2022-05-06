const triqui = {
    band: false,
    turn: false,
    board: document.querySelector('tbody'),
    modes: document.querySelectorAll('tfoot i'),
    squares: Array.from(document.querySelectorAll('tbody td')),
    decisions: document.querySelectorAll('thead th'),
    scores: document.querySelectorAll('tfoot span'),
    availables: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    /**
     * checks if the board is completely filled
     */
    isFull: function () {
        for (const square of this.squares) { if (!square.hasChildNodes()) { return false; } } return true;
    },
    /**
     * checks if the player in question has won the game
     * @param {string} symbol 
     */
    isWinner: function (symbol) {
        /**
         * checks if the square is checked by the player in question
         * @param {HTMLTableDataCellElement} square 
         * @param {string} player  
         */
        function isMarked(square, player) { return square.hasChildNodes() && square.firstChild.className === player; }
        if (isMarked(this.squares[0], symbol) && isMarked(this.squares[1], symbol) && isMarked(this.squares[2], symbol)) { return true }
        else if (isMarked(this.squares[3], symbol) && isMarked(this.squares[4], symbol) && isMarked(this.squares[5], symbol)) { return true }
        else if (isMarked(this.squares[6], symbol) && isMarked(this.squares[7], symbol) && isMarked(this.squares[8], symbol)) { return true }
        else if (isMarked(this.squares[0], symbol) && isMarked(this.squares[3], symbol) && isMarked(this.squares[6], symbol)) { return true }
        else if (isMarked(this.squares[1], symbol) && isMarked(this.squares[4], symbol) && isMarked(this.squares[7], symbol)) { return true }
        else if (isMarked(this.squares[2], symbol) && isMarked(this.squares[5], symbol) && isMarked(this.squares[8], symbol)) { return true }
        else if (isMarked(this.squares[0], symbol) && isMarked(this.squares[4], symbol) && isMarked(this.squares[8], symbol)) { return true }
        else if (isMarked(this.squares[2], symbol) && isMarked(this.squares[4], symbol) && isMarked(this.squares[6], symbol)) { return true }
        return false;
    },
    /**
     * inserts one cross in the clicked square
     * @param {HTMLTableDataCellElement} square 
     */
    setCross: function (square) {
        const cross = document.createElement('i');
        cross.className = "fas fa-times";
        square.appendChild(cross);
        this.availables.splice(this.availables.indexOf(this.squares.indexOf(square)), 1);
        // console.log(this.availables);
    },
    /**
     * inserts one circle in any available square
     */
    setCircle: function () {
        const random = Math.floor(Math.random() * this.availables.length);
        const circle = document.createElement('i');
        circle.className = "far fa-circle";
        this.squares[this.availables[random]].appendChild(circle);
        this.availables.splice(random, 1);
        // console.log(this.availables);
    },
    /**
     * inserts one circle in the clicked square
     * @param {HTMLTableDataCellElement} square 
     */
    setCirclePlayer: function (square) {
        const circle = document.createElement('i');
        circle.className = "far fa-circle";
        square.appendChild(circle);
        this.availables.splice(this.availables.indexOf(this.squares.indexOf(square)), 1);
        // console.log(this.availables);
    },
    /**
     * adds one point to the match winner
     * @param {string} symbol 
     */
    pointPlayer: function (symbol) {
        if (symbol === 'x') {
            this.scores[0].innerText = parseInt(this.scores[0].innerText) + 1;
        } else if (symbol === 'o') {
            this.scores[2].innerText = parseInt(this.scores[2].innerText) + 1;
        } else {
            this.scores[1].innerText = parseInt(this.scores[1].innerText) + 1;
        }
    },
    /**
     * restore the game to start a new round
     */
    restore: function () {
        this.decisions.forEach(decision => { decision.className = "border-lg"; });
        this.squares.forEach(square => { if (square.hasChildNodes()) { square.removeChild(square.firstChild); } });
        this.availables.splice(0, this.availables.length, 0, 1, 2, 3, 4, 5, 6, 7, 8);
        // console.log(this.availables);
    }
};
/**
 * Game mode in which the user faces the machine
 * @param {HTMLTableDataCellElement} square 
 */
function arcade(square) {
    triqui.setCross(square);
    if (triqui.isWinner("fas fa-times")) {
        triqui.decisions[0].className = "table-light border-bottom border-lg";
        triqui.pointPlayer('x');
        triqui.board.className = "pe-none";
        triqui.modes.forEach(mode => { mode.classList.add('pe-none') });
        setTimeout(() => { triqui.restore(); triqui.setCircle(); triqui.board.className = ""; triqui.modes.forEach(mode => { mode.classList.remove('pe-none') }); }, 1500);
    } else if (triqui.isFull()) {
        triqui.decisions[1].className = "table-light border-bottom border-lg";
        triqui.pointPlayer('-');
        setTimeout(() => { triqui.restore(); triqui.setCircle(); }, 1500);
    } else {
        triqui.setCircle();
        if (triqui.isWinner("far fa-circle")) {
            triqui.decisions[2].className = "table-light border-bottom border-lg";
            triqui.pointPlayer('o');
            triqui.board.className = "pe-none";
            setTimeout(() => { triqui.restore(); triqui.board.className = ""; }, 1500);
        } else if (triqui.isFull()) {
            triqui.decisions[1].className = "table-light border-bottom border-lg";
            triqui.pointPlayer('-');
            setTimeout(() => { triqui.restore(); }, 1500);
        }
    }
}
/**
 * Game mode in which players compete
 */
function versus(square) {
    if (triqui.turn) {
        triqui.setCirclePlayer(square);
        if (triqui.isWinner("far fa-circle")) {
            triqui.decisions[2].className = "table-light border-bottom border-lg";
            triqui.pointPlayer('o');
            triqui.board.className = "pe-none";
            setTimeout(() => { triqui.restore(); triqui.board.className = ""; }, 1500);
        } else if (triqui.isFull()) {
            triqui.decisions[1].className = "table-light border-bottom border-lg";
            triqui.pointPlayer('-');
            setTimeout(() => { triqui.restore(); }, 1500);
        }
    } else {
        triqui.setCross(square);
        if (triqui.isWinner("fas fa-times")) {
            triqui.decisions[0].className = "table-light border-bottom border-lg";
            triqui.pointPlayer('x');
            triqui.board.className = "pe-none";
            setTimeout(() => { triqui.restore(); triqui.board.className = ""; }, 1500);
        } else if (triqui.isFull()) {
            triqui.decisions[1].className = "table-light border-bottom border-lg";
            triqui.pointPlayer('-');
            setTimeout(() => { triqui.restore(); }, 1500);
        }
    }
    triqui.turn = !triqui.turn;
}
/**
 * Active game mode
 * @param {HTMLElement} node 
 * @param {number} num 
 */
function activeMode(node, num) {
    if (node.classList.contains('text-dark')) {
        node.classList.toggle('text-dark');
        triqui.modes[num].classList.toggle('text-dark');
        triqui.scores.forEach(score => { score.innerText = 0; });
        triqui.band = !triqui.band;
        triqui.turn = false;
        triqui.restore();
    }
}
triqui.board.addEventListener('click', e => { if (e.target.matches('tbody td') && !e.target.hasChildNodes()) { triqui.band ? versus(e.target) : arcade(e.target); } });
triqui.modes[0].addEventListener('click', e => { activeMode(e.target, 1); });
triqui.modes[1].addEventListener('click', e => { activeMode(e.target, 0); });
