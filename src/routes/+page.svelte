<script lang="ts">
	import { localStore } from '$lib/index.svelte';
	import { onMount } from 'svelte';

	type State = {
		playerCount?: number;
		playerData?: {
			role?: 'werewolf' | 'witch' | 'seer' | 'hunter' | 'knight' | 'villager';
		}[];
	};
	let state = localStore<State>('state', {
		playerCount: 12,
		playerData: []
	});

	$effect(() => {
		localStorage.setItem('state', JSON.stringify(state.value));
	});

	$effect(() => {
		if (state.value.playerCount !== state.value.playerData?.length) {
			state.value.playerData = new Array(state.value.playerCount).fill({ role: 'villager' });
		}
	});

	onMount(() => {
		state.value = JSON.parse(localStorage.getItem('state') ?? '{}');
		console.log(localStorage.getItem('state'), JSON.parse(localStorage.getItem('state') ?? '{}'));
	});
	$inspect(state.value);
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-center text-4xl">狼人殺</h1>
	<div class="flex flex-col items-center">
		<div class="flex items-center gap-2">
			<label for="players">人數</label>
			<input
				type="number"
				id="players"
				bind:value={state.value.playerCount}
				class="b--input--number"
			/>
		</div>
		{#each new Array(state.value.playerCount) as _, i}
			<div class="flex flex-col rounded-lg border-2 border-black p-2">
				<span>玩家編號{i + 1}</span>
				<div>
					<label for="role-{i}">職業</label>
					<select
						id="role-{i}"
						bind:value={() => {
							return state.value.playerData?.[i]?.role ?? 'villager';
						},
						(v) => {
							state.value.playerData ??= new Array(state.value.playerCount).fill({
								role: 'villager'
							});
							state.value.playerData[i].role = v;
						}}
					>
						<option value="werewolf">狼人</option>
						<option value="witch">女巫</option>
						<option value="seer">預言家</option>
						<option value="hunter">獵人</option>
						<option value="knight">騎士</option>
						<option value="villager">村民</option>
					</select>
				</div>
			</div>
		{/each}
	</div>
</div>
