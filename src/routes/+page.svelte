<script lang="ts">
	import { browser } from '$app/environment';
	import Panel from '$lib/components/Panel.svelte';

	let gameState: App.GameState = $state({
		playerCount: 0,
		playerData: []
	});

	if (browser) {
		let item = localStorage.getItem('state');
		if (item) gameState = JSON.parse(item);
	}

	$effect(() => {
		localStorage.setItem('state', JSON.stringify(gameState));
	});
</script>

<h1 class="text-center text-4xl">狼人殺</h1>
<Panel bind:gameState />
