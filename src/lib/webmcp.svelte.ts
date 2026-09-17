import { AI, HUMAN, POSITIONS, renderBoard, type Game, type Position } from './game.svelte';

const positionSchema = {
	type: 'object',
	properties: {
		position: {
			type: 'string',
			enum: POSITIONS,
			description: '要下的格子'
		}
	},
	required: ['position']
} as const;

function boardStatus(game: Game): string {
	const status = game.result
		? game.result === 'draw'
			? '平手，遊戲結束'
			: `${game.result} 獲勝，遊戲結束`
		: `輪到 ${game.turn}`;
	return `${status}\n${renderBoard(game.board)}\n可下位置：${game.openPositions().join(', ')}`;
}

/** Register/unregister WebMCP tools as the game state changes. Call once from a component. */
export function registerGameTools(game: Game) {
	if (typeof document === 'undefined' || !document.modelContext) return;
	const modelContext = document.modelContext;

	// Register only the tools valid for the current game state.
	$effect(() => {
		const controller = new AbortController();
		const options = { signal: controller.signal };

		modelContext.registerTool(
			{
				name: 'get_board',
				description: '取得井字連線棋盤目前狀態、輪到誰、可下的位置。',
				inputSchema: { type: 'object', properties: {} },
				annotations: { readOnlyHint: true },
				execute: async () => boardStatus(game)
			},
			options
		);

		if (game.turn === AI && !game.result) {
			modelContext.registerTool(
				{
					name: 'play_move',
					description: `你是 ${AI}，在指定位置下棋。`,
					inputSchema: positionSchema,
					execute: async (args) => game.play(args.position as Position, AI)
				},
				options
			);
		}

		if (game.result) {
			modelContext.registerTool(
				{
					name: 'new_game',
					description: '遊戲已結束，重新開始一局。',
					inputSchema: { type: 'object', properties: {} },
					execute: async () => {
						game.reset();
						return `新局開始，${HUMAN} 先手。\n${renderBoard(game.board)}`;
					}
				},
				options
			);
		}

		return () => controller.abort();
	});
}
