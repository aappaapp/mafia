<script lang="ts">
	import Player from '$lib/components/Player.svelte';
	import { db, rerender } from '$lib/db.svelte';
</script>

{#key rerender.all}
	<div class="bg-primary flex w-full rounded-b-2xl p-5 text-center text-2xl font-bold">
		<button onclick={() => (db.state.phase = Math.max(db.state.phase - 1, 0))}>&lArr;</button>
		<span class="flex-1">
			{db.state.phase % 2 === 0 ? 'Day' : 'Night'}
			{Math.floor(db.state.phase / 2) + 1}
		</span>
		<button onclick={() => db.state.phase++}>&rArr;</button>
	</div>

	<!-- <h1 class=" text-center text-4xl">狼人殺</h1> -->
	{#each db.db?.exec(`SELECT id FROM player`, { returnValue: 'resultRows' }) ?? [] as [id]}
		<Player id={id as number} />
	{/each}
{/key}

<!-- {#if !hasType(transactions, 'start')}
	<button
		onclick={() => {
			transactions.push({
				type: 'start',
				playerCount
			});
		}}>Start Game</button
	>
{:else}
	AsyncDisposableStack
{/if} -->
