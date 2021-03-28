/* Clase juego ;) */
class Game {
	constructor() {
		this.history = [[null, null, null, null, null, null, null, null, null]];
		this.stepNumber = 0;
		this.xIsNext = true;
	}
}

/* Variable (objeto) global game */
var game;

/* Inicializa el juego */
function init() {
	game = new Game();
	updateView();
}

/* Maneja el evento click sobre un cuadro o casilla del juego */
function handleClick(sq) {
	let audio = "sounds/move.ogg"; // sonido por defecto
	let current = game.history[game.stepNumber].slice(0);
	if(current[sq] || calculateWinner(current)) {
		audio = "sounds/invalid.ogg";
	} else {
		current[sq] = game.xIsNext ? 'X' : 'O';
		game.history = game.history.slice(0, game.stepNumber + 1);
		game.history.push(current);
		game.xIsNext = !game.xIsNext;
		game.stepNumber += 1;
		updateView();
		if(calculateWinner(current)) {
			audio = "sounds/victory.ogg";
		} else if(game.stepNumber == 9) {
			audio = "sounds/tie.ogg";
		}
	}
	(new Audio(audio)).play();
}

/* Para ir a una posición del historial */
function goTo(step) {
	game.stepNumber = step;
	game.xIsNext = (step % 2 == 0);
	updateView();
}

/* Función que actualiza la página de acuerdo a los datos de `game` */
function updateView() {
	updateStatus();
	updateBoard();
	updateHistory();
}

/* Función que actualiza el texto que está justo sobre el tablero */
function updateStatus() {
	let status = "Next Player: " + (game.xIsNext ? "X" : "O");
	if(calculateWinner(game.history[game.stepNumber])) {
		status = "Winner : " + (game.xIsNext ? "O" : "X") + "!";
	} else if(game.stepNumber == 9) {
		status = "Tie!";
	}
	$("#status").text(status);
}

/* Función que actualiza el tablero */
function updateBoard() {
	let win_line = calculateWinner(game.history[game.stepNumber]);
	let [a, b, c] = (win_line === null) ? [-1, -1, -1] : win_line;

	for(var i = 0; i < 9; i++) {
		var sq = game.history[game.stepNumber][i];
		$("#sq" + i).text(sq);

		//Higlight this square if it is part of the winner line
		var iswin = (i === a || i === b || i === c);
		var cc = $("#sq" + i).attr("class");
		cc = cc.replace(" win", "");
		$("#sq" + i).attr("class", cc + (iswin ? " win" : ""));
	}
}

/* Función que actualiza el historial de jugadas */
function updateHistory() {
	$("#history").empty();
	for(let step = 0; step < game.history.length; step++) {
		let element = $("<button></button>");
		
		element.attr("type", "button");
		
		element.text("go to move " + step);
		if(step == 0) {
			element.text("go to game start");
		}
		element.click(step, (event) => { goTo(event.data) });

		if(step == game.stepNumber) {
			element.attr("class", "btn btn-dark");
		} else {
			element.attr("class", "btn btn-secondary");
		}

		$("#history").append(element);
	}
}

/* Función para determinar si hay un ganador sobre el tablero */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
