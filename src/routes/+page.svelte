<script lang="ts">
	import Player from '$lib/components/Player.svelte';
	import { db, rerender } from '$lib/db.svelte';
</script>

{#key rerender.all}
	<div class="bg-primary w-full rounded-b-2xl py-5 text-center text-2xl font-bold">Night 2</div>

	<!-- <h1 class=" text-center text-4xl">狼人殺</h1> -->
	{#each db.db?.exec(`SELECT id FROM player`, { returnValue: 'resultRows' }) ?? [] as [id]}
		<Player db={db.db!} id={id as number} />
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
