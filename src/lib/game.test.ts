import { describe, expect, it } from 'vitest';
import { Game, winnerOf, type Cell } from './game.svelte';

describe('winnerOf', () => {
	it('detects a row win', () => {
		const board: Cell[] = ['X', 'X', 'X', null, null, null, null, null, null];
		expect(winnerOf(board)).toBe('X');
	});

	it('detects a column win', () => {
		const board: Cell[] = ['O', null, null, 'O', null, null, 'O', null, null];
		expect(winnerOf(board)).toBe('O');
	});

	it('detects a diagonal win', () => {
		const board: Cell[] = ['X', null, null, null, 'X', null, null, null, 'X'];
		expect(winnerOf(board)).toBe('X');
	});

	it('detects a draw', () => {
		const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
		expect(winnerOf(board)).toBe('draw');
	});

	it('returns null while game is ongoing', () => {
		const board: Cell[] = ['X', null, null, null, null, null, null, null, null];
		expect(winnerOf(board)).toBeNull();
	});
});

describe('Game', () => {
	it('rejects a move on an occupied cell', () => {
		const game = new Game();
		game.play('top-left', 'O');
		const msg = game.play('top-left', 'X');
		expect(msg).toContain('已被佔用');
		expect(game.board[0]).toBe('O');
	});

	it("rejects a move when it is not that mark's turn", () => {
		const game = new Game();
		const msg = game.play('top-left', 'X');
		expect(msg).toContain('輪到 O');
		expect(game.board[0]).toBeNull();
	});

	it('rejects further moves after the game ends', () => {
		const game = new Game();
		game.play('top-left', 'O');
		game.play('middle-left', 'X');
		game.play('top-center', 'O');
		game.play('middle-center', 'X');
		game.play('top-right', 'O'); // O wins top row
		expect(game.result).toBe('O');

		const msg = game.play('bottom-right', 'X');
		expect(msg).toContain('已結束');
		expect(game.board[8]).toBeNull();
	});

	it('reset clears the board and turn', () => {
		const game = new Game();
		game.play('top-left', 'O');
		game.reset();
		expect(game.board.every((c) => c === null)).toBe(true);
		expect(game.turn).toBe('O');
		expect(game.result).toBeNull();
	});
});
