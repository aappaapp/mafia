<script lang="ts">
	type Props = {
		playerNumber: number;
		data: App.GameState['playerData'][number];
	};

	let { playerNumber, data }: Props = $props();
	$effect.pre(() => {
		if (!data.name) {
			data.name = `玩家${playerNumber}`;
		}
	});
</script>

<div
	class="flex flex-col items-center rounded-lg border-2 border-black p-5 {data.dead
		? 'bg-black text-white'
		: ''}"
>
	<div>
		<span>#{playerNumber}</span>
	</div>
	<div>
		<input
			type="text"
			value={data.name}
			onchange={(e) => (data.name = e.currentTarget.value)}
			class="w-full text-center"
		/>
	</div>
	<div>
		<select bind:value={data.role} class="bg-transparent">
			<option value="king">狼王</option>
			<option value="werewolf">狼人</option>
			<option value="seer">預言家</option>
			<option value="witch">女巫</option>
			<option value="hunter">獵人</option>
			<option value="knight">騎士</option>
			<option value="villager">村民</option>
		</select>
	</div>
	<div>
		<button onclick={() => (data.dead = !data.dead)}>{data.dead ? '☠️' : '😀'}</button>
		<button onclick={() => (data.isSheriff = !data.isSheriff)}
			>{data.isSheriff ? '👮' : '🎩'}</button
		>
	</div>
</div>
