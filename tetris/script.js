const canvas = document.querySelector('canvas');
const width = 12;
const height = 20;
const scale = 20;
canvas.width = width * scale;
canvas.height = height * scale;
const ctx = canvas.getContext('2d');
ctx.scale(scale,scale);
ctx.fillStyle = '#273746';
ctx.fillRect(0,0,width,height);
let board = Array(height).fill(null).map(()=>Array(width).fill(null));
let gameOver = false;
let score = 0;

const colors = [
	'#00FFFF', // I-piece (Cyan): 
	'#0000FF', // J-piece (Blue): 
	'#FFA500', // L-piece (Orange): 
	'#FFFF00', // O-piece (Yellow): 
	'#00FF00', // S-piece (Green): 
	'#800080', // T-piece (Purple): 
	'#FF0000', // Z-piece (Red): 
];
const pieces = [
	[
		[colors[0]],
		[colors[0]],
		[colors[0]],
		[colors[0]],
	],
	[
		[null,      colors[1]],
		[null,      colors[1]],
		[colors[1], colors[1]],
	],
	[
		[colors[2], null],
		[colors[2], null],
		[colors[2], colors[2]],
	],
	[
		[colors[3], colors[3]],
		[colors[3], colors[3]],
	],
	[
		[null,      colors[4], colors[4]],
		[colors[4], colors[4], null],
	],
	[
		[null,      colors[5], null],
		[colors[5], colors[5], colors[5]],
	],
	[
		[colors[6], colors[6], null],
		[null,      colors[6], colors[6]],
	],
];
let currPiece = pieces[Math.floor(Math.random()*pieces.length)];
let currPieceX = Math.floor(width/2);
let currPieceY = 0;

function drawBoard() {
	ctx.fillStyle = '#273746';
	ctx.fillRect(0,0,width,height);
	board.forEach((fila,i) => {
		fila.forEach((celda,j) => {
			if (celda) {
				ctx.fillStyle = celda;
				ctx.fillRect(j,i,1,1);
			}
		})
	})
}

function drawCurrPiece() {
	currPiece.forEach((fila,i)=>{
		fila.forEach((celda,j)=>{
			if (celda) {
				ctx.fillStyle = celda;
				ctx.fillRect(currPieceX+j,currPieceY+i,1,1);
			}
		})
	})
}

function colision(piece,pieceX,pieceY) {
	if (pieceX<0) return true;
	if (pieceX+piece[0].length>width) return true;
	if (piece.length+pieceY>height) return true;
	for (let i = 0; i < piece.length; i++) {
		const fila = piece[i];
		for (let j = 0; j < fila.length; j++) {
			const celda = fila[j];
			if (celda && board[pieceY+i][pieceX+j]) {
				return true;
			}
		}
	}
	return false;
}

function solidify() {
	currPiece.forEach((fila,i)=>{
		fila.forEach((celda,j)=>{
			if (celda) {
				board[currPieceY+i][currPieceX+j] = celda;
			}
		})
	})
}

function draw() {
	drawBoard();
	drawCurrPiece();
}

function clearLines() {
	board = board.filter(fila => fila.filter(celda => celda == null).length > 0);
	while(board.length < height) {
		board = [Array(width).fill(null), ...board];
		score++;
	}
}

function bajar() {
	if (gameOver) return;
	draw();
	if (colision(currPiece,currPieceX,currPieceY+1)) {
		solidify();
		clearLines();
		currPieceX = Math.floor(width/2);
		currPieceY = 0;
		currPiece = pieces[Math.floor(Math.random()*pieces.length)];
	} else {
		currPieceY++;
	}
}

function rotar() {
	const rows = currPiece.length;
	const columns = currPiece[0].length;
	pieceRotated = Array(columns).fill(null).map(()=>Array(rows).fill(null));
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			pieceRotated[j][rows - 1 - i] = currPiece[i][j];
		}
	}
	if (!colision(pieceRotated, currPieceX, currPieceY)) {
		currPiece = pieceRotated;
		draw();
	}
}

function checkGameOver() {
	gameOver = board[0].filter(celda => celda).length > 0;
	if (gameOver) {
		clearInterval(interval);
		document.getElementById("gameInfo").innerHTML = "Score = " + score + ' | GAME OVER';
	} else {
		document.getElementById("gameInfo").innerHTML = "Score = " + score;
	}
}

const speed = 1000/3; // lower: faster
let interval = null; 

function iniciar() {
	interval = setInterval(() => {
		bajar();
		checkGameOver();
	}, speed);
	document.addEventListener('keydown', function (event) {
		switch (event.key) {
			case 'ArrowUp':
				rotar();
				break;
			case 'ArrowDown':
				bajar();
				break;
			case 'ArrowLeft':
				if (!colision(currPiece,currPieceX-1,currPieceY)) {
					currPieceX--;
					draw();
				}
				break;
			case 'ArrowRight':
				if (!colision(currPiece,currPieceX+1,currPieceY)) {
					currPieceX++;
					draw();
				}
				break;
		}
	});
	$("#iniciar").hide();
	document.getElementById("gameInfo").innerHTML = "Score = " + score;
}
