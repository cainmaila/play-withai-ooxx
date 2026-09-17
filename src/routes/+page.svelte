<script lang="ts">
	import { AI, Game, HUMAN, POSITIONS } from '$lib/game.svelte';
	import { registerGameTools } from '$lib/webmcp.svelte';

	const game = new Game();
	registerGameTools(game);

	const hasWebMCP = typeof document !== 'undefined' && 'modelContext' in document;

	function statusText() {
		if (!game.result) return `輪到 ${game.turn}${game.turn === AI ? '（AI）' : ''}`;
		if (game.result === 'draw') return '平手';
		return `${game.result} 獲勝`;
	}
</script>

<main class="mx-auto flex max-w-sm flex-col items-center gap-4 p-8">
	<h1 class="text-2xl font-bold">OOXX：你 vs AI（WebMCP）</h1>

	{#if !hasWebMCP}
		<p class="rounded bg-yellow-100 p-3 text-sm text-yellow-900">
			這個瀏覽器沒有 <code>document.modelContext</code>。需要 Chrome 149+ 並開啟
			<code>chrome://flags/#enable-webmcp-testing</code>，AI 對手才能透過 WebMCP 下棋。
		</p>
	{/if}

	<p class="text-lg">{statusText()}</p>

	<div class="grid grid-cols-3 gap-2">
		{#each POSITIONS as position, i (position)}
			<button
				class="flex h-20 w-20 items-center justify-center border text-3xl font-bold disabled:cursor-not-allowed"
				disabled={game.board[i] !== null || game.turn !== HUMAN || !!game.result}
				onclick={() => game.play(position, HUMAN)}
			>
				{game.board[i] ?? ''}
			</button>
		{/each}
	</div>

	<button class="rounded border px-4 py-2" onclick={() => game.reset()}>重新開始</button>
</main>
