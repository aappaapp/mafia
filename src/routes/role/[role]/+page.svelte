<script lang="ts">
	import Block from '$lib/components/Block.svelte';
	import { db, rerender } from '$lib/db.svelte.js';

	let { data } = $props();

	let role: any[] = $state([]);

	$effect(() => {
		rerender.all;
		role =
			db.db?.exec(`SELECT name, description FROM roles WHERE id = '${data.role}'`, {
				returnValue: 'resultRows'
			})[0] ?? [];
	});
</script>

<div class="flex flex-col gap-2 p-5">
	<h1 class="text-4xl font-bold">
		{role[0]}
	</h1>
	<Block>
		<h2 class="text-2xl font-bold">功能</h2>
		<p>
			{role[1]}
		</p>
	</Block>
</div>
