<script lang="ts">
	import Block from '$lib/components/Block.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-2 p-5">
	<Block>
		<h2 class="text-2xl font-bold">勝利條件</h2>
		<h3 class="text-xl font-bold">好人陣營</h3>
		<p>投出全部狼人即為勝利</p>
		<h3 class="text-xl font-bold">狼人陣營</h3>
		<p>神職為一邊，平民為一邊，狼人殺死其中一邊所有玩家或三邊人數相同即為勝利</p>
	</Block>
</div>
