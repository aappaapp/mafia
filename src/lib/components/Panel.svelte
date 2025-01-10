<script lang="ts">
	import Player from './Player.svelte';

	type Props = {
		gameState: App.GameState;
	};
	let { gameState = $bindable() }: Props = $props();

	$effect.pre(() => {
		if (gameState.playerData.length < gameState.playerCount) {
			for (let i = gameState.playerData.length; i < gameState.playerCount; i++) {
				gameState.playerData.push({
					role: 'villager',
					name: '',
					dead: false,
					isSheriff: false
				});
			}
		}
	});
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-col items-center">
		<label for="players" class="text-center text-xl">人數</label>
		<input
			type="number"
			id="players"
			bind:value={() => gameState.playerCount, (v) => (gameState.playerCount = Math.max(v, 0))}
			class="b--input"
		/>
	</div>
	<div>
		<button
			onclick={() => ((gameState.playerData = []), (gameState.playerCount = 0))}
			class="b--button">Reset</button
		>
	</div>
	<div class="grid grid-cols-2">
		{#each new Array(gameState.playerCount) as _, i}
			<Player data={gameState.playerData[i]} playerNumber={i + 1} />
		{/each}
	</div>
</div>
