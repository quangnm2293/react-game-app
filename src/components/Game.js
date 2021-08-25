import React, { useReducer } from 'react';
import Board from './Board';

const reducer = (state, action) => {
	switch (action.type) {
		case 'MOVE':
			return {
				...state,
				history: state.history.concat({
					squares: action.payload.squares,
				}),
				xIsNext: !state.xIsNext,
			};
		case 'JUMP':
			return {
				...state,
				xIsNext: action.payload.step % 2 === 0,
				history: state.history.slice(0, action.payload.step + 1),
			};

		default:
			return state;
	}
};

export default function Game() {
	const [state, dispatch] = useReducer(reducer, { xIsNext: true, history: [{ squares: Array(9).fill(null) }] });
	const { xIsNext, history } = state;
	const jumpTo = step => {
		dispatch({ type: 'JUMP', payload: { step } });
	};
	const handleClick = index => {
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const winner = calculateWinner(squares);
		if (winner || squares[index]) {
			return;
		}
		squares[index] = xIsNext ? 'X' : 'O';
		dispatch({ type: 'MOVE', payload: { squares } });
	};
	const current = history[history.length - 1];
	const winner = calculateWinner(current.squares);
	const status = winner
		? winner === 'D'
			? 'Draw'
			: 'Winner is ' + winner
		: 'Next player is ' + (xIsNext ? 'X' : 'O');
	const move = history.map((step, move) => {
		const desc = move ? 'Go to #' + move : 'Start the Game';
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{desc}</button>
			</li>
		);
	});
	return (
		<div className={winner ? 'game disabled' : 'game'}>
			<div className='game-board'>
				<Board squares={current.squares} onClick={index => handleClick(index)} />
			</div>
			<div className='game-info'>
				<div>{status}</div>
				<ul>{move}</ul>
			</div>
		</div>
	);
}

const calculateWinner = squares => {
	const winnerLines = [
		[0, 1, 2],
		[0, 3, 6],
		[0, 4, 8],
		[3, 4, 5],
		[6, 7, 8],
		[1, 4, 7],
		[2, 5, 8],
		[2, 4, 6],
	];
	let isDraw = true;
	for (let index = 0; index < winnerLines.length; index++) {
		const [a, b, c] = winnerLines[index];
		if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
			return squares[a];
		}
		if (!squares[a] || !squares[a] || !squares[a]) {
			isDraw = false;
		}
	}
	if (isDraw) {
		return 'D';
	}
	return null;
};
