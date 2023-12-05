const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const win_state = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[2, 4, 6],
	[0, 4, 8],
];

let HUMAN = -1;
let COMP = +1;

function evalute(state) {
	let score = 0;

	if (gameOver(state, COMP)) {
		score = +1;
	} else if (gameOver(state, HUMAN)) {
		score = -1;
	} else {
		score = 0;
	}

	return score;
}

function gameOver(state, player) {
	for (let i = 0; i < win_state.length; i++) {
		const [x, y, z] = win_state[i];
		let line = [state[x], state[y], state[z]];
		let filled = 0;
		for (let j = 0; j < 3; j++) {
			if (line[j] == player) filled++;
		}
		if (filled == 3) return true;
	}
	return false;
}

function gameOverAll(state) {
	return gameOver(state, HUMAN) || gameOver(state, COMP);
}

function emptyCells(state) {
	let cells = [];

	for (let x = 0; x <= 9; x++) {
		if (state[x] === 0) {
			cells.push(x);
		}
	}

	return cells;
}

function validMove(cell) {
	try {
		if (board[cell] == 0) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

function setMove(cell, player) {
	if (validMove(cell)) {
		board[cell] = player;
		return true;
	} else {
		return false;
	}
}

function minimax(state, depth, player) {
	var best;
	let score;

	if (player == COMP) {
		best = [-1, -1000];
	} else {
		best = [-1, +1000];
	}

	if (depth == 0 || gameOverAll(state)) {
		score = evalute(state);
		return [-1, score];
	}

	emptyCells(state).forEach(function (cell) {
		state[cell] = player;
		score = minimax(state, depth - 1, -player);
		state[cell] = 0;
		score[0] = cell;

		if (player == COMP) {
			if (score[1] > best[1]) best = score;
		} else {
			if (score[1] < best[1]) best = score;
		}
	});

	return best;
}

function aiTurn() {
	let cellMove;
	let cell;

	if (emptyCells(board).length == 9) {
		cellMove = parseInt(Math.random() * 9);
	} else {
		cellMove = minimax(board, emptyCells(board).length, COMP);
		console.log(cellMove);
	}

	if (setMove(cellMove[0] ?? cellMove, COMP)) {
		cell = document.getElementById(cellMove[0] ?? cellMove);
		cell.innerHTML = "O";
	}
}

function clickedCell(cell) {
	let button = document.getElementById("bnt-restart");
	button.disabled = true;
	let conditionToContinue =
		gameOverAll(board) == false && emptyCells(board).length > 0;

	if (conditionToContinue) {
		let move = setMove(cell.id, HUMAN);

		if (move) {
			cell.innerHTML = "X";

			if (conditionToContinue) aiTurn();
		}
	}
	if (gameOver(board, COMP)) {
		let lines;
		let cell;
		let msg;

		for (let i = 0; i < win_state.length; i++) {
			const [x, y, z] = win_state[i];

			if (board[x] === 1 && board[y] === 1 && board[z] === 1)
				lines = [x, y, z];
		}

		for (let i = 0; i < lines.length; i++) {
			cell = document.getElementById(String(lines[i]));
			cell.style.color = "#C70039";
			cell.style.borderColor = "var(--primary-300)";
		}

		msg = document.getElementById("message");
		msg.innerHTML = "Es casi imposible ganarle!";
		msg.style.color = "#C70039";
	}

	if (emptyCells(board).length == 0 && !gameOverAll(board)) {
		let msg = document.getElementById("message");
		msg.innerHTML = "Tuviste suerte, quedo empate!";
		msg.style.color = "#6499E9";
	}

	if (gameOverAll(board) == true || emptyCells(board).length == 0) {
		button.value = "Reiniciar";
		button.disabled = false;
		button.style.cursor = "pointer";
	}
}

function restartBnt(button) {
	if (button.value == "Comenzar IA") {
		aiTurn();
		button.disabled = true;
		button.style.cursor = "no-drop";
	} else if (button.value == "Reiniciar") {
		let htmlBoard;
		let msg;

		for (let x = 0; x < 9; x++) {
			board[x] = 0;
			htmlBoard = document.getElementById(String(x));
			htmlBoard.style.color = "#fff";
			htmlBoard.innerHTML = "";
		}
		button.value = "Comenzar IA";
		msg = document.getElementById("message");
		msg.innerHTML = "";
	}
}

function main() {
	const tableGame = document.querySelector("#table");

	let html = "";

	for (let i = 0; i < board.length; i++) {
		html += `<li class="cell" id=${i}></li>`;
	}

	tableGame.innerHTML = html;

	tableGame.addEventListener("click", (e) => {
		clickedCell(e.target);
	});
}

main();
