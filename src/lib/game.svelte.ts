export type Mark = 'O' | 'X';
export type Cell = Mark | null;

export const POSITIONS = [
	'top-left',
	'top-center',
	'top-right',
	'middle-left',
	'middle-center',
	'middle-right',
	'bottom-left',
	'bottom-center',
	'bottom-right'
] as const;

export type Position = (typeof POSITIONS)[number];

const LINES = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

export function winnerOf(board: Cell[]): Mark | 'draw' | null {
	for (const [a, b, c] of LINES) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return board[a];
		}
	}
	return board.every((cell) => cell !== null) ? 'draw' : null;
}

export function renderBoard(board: Cell[]): string {
	const rows = [board.slice(0, 3), board.slice(3, 6), board.slice(6, 9)];
	return rows.map((row) => row.map((cell) => cell ?? '.').join(' ')).join('\n');
}

export const HUMAN: Mark = 'O';
export const AI: Mark = 'X';

export class Game {
	board: Cell[] = $state(POSITIONS.map(() => null));
	turn: Mark = $state(HUMAN);
	result: Mark | 'draw' | null = $derived(winnerOf(this.board));

	openPositions(): Position[] {
		return POSITIONS.filter((_, i) => this.board[i] === null);
	}

	play(position: Position, mark: Mark): string {
		if (this.result)
			return `遊戲已結束：${this.result === 'draw' ? '平手' : `${this.result} 獲勝`}`;
		if (mark !== this.turn) return `現在輪到 ${this.turn}，不是 ${mark}`;
		const i = POSITIONS.indexOf(position);
		if (this.board[i] !== null) return `${position} 已被佔用`;

		this.board[i] = mark;
		this.turn = mark === 'O' ? 'X' : 'O';

		const result = winnerOf(this.board);
		if (result === 'draw') return `平手\n${renderBoard(this.board)}`;
		if (result) return `${result} 獲勝\n${renderBoard(this.board)}`;
		return `輪到 ${this.turn}\n${renderBoard(this.board)}`;
	}

	reset() {
		this.board = POSITIONS.map(() => null);
		this.turn = HUMAN;
	}
}
