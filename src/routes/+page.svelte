<script lang="ts">
	import { localStore } from '$lib';
	import { onMount } from 'svelte';

	type DeepPartial<T> = {
		[P in keyof T]?: DeepPartial<T[P]>;
	};
	type State = {
		playerCount?: number;
		playerData?: {
			role?: 'werewolf' | 'king' | 'witch' | 'seer' | 'hunter' | 'knight' | 'villager';
			dead: boolean;
		}[];
	};
	let state = localStore<DeepPartial<State>>('state', {
		playerCount: 12,
		playerData: []
	});

	$effect(() => {
		if (state.value.playerCount && state.value.playerData) {
			if (state.value.playerData.length < state.value.playerCount) {
				for (let i = state.value.playerData.length; i < state.value.playerCount; i++) {
					state.value.playerData.push({
						role: 'villager',
						dead: false
					});
				}
			}
		}
	});
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-center text-4xl">狼人殺</h1>
	<div class="flex flex-col items-center">
		<div class="flex items-center gap-2">
			<label for="players">人數</label>
			<input
				type="number"
				id="players"
				bind:value={() => state.value.playerCount,
				(v) => {
					state.value.playerCount = v ?? 0;
				}}
				class="b--input--number"
			/>
		</div>
		{#each new Array(state.value.playerCount) as _, i}
			<div
				class="flex flex-col rounded-lg border-2 border-black p-2 {state.value.playerData?.[i]?.dead
					? 'bg-black text-white'
					: ''}"
			>
				<span>玩家編號{i + 1}</span>
				<div>
					<label for="role-{i}">職業</label>
					<select
						id="role-{i}"
						bind:value={() => state.value.playerData?.[i]?.role ?? 'villager',
						(v) => {
							if (typeof state.value.playerData?.[i]?.role !== 'undefined')
								state.value.playerData[i].role = v;
						}}
						class="bg-transparent"
					>
						<option value="werewolf">狼人</option>
						<option value="king">狼王</option>
						<option value="witch">女巫</option>
						<option value="seer">預言家</option>
						<option value="hunter">獵人</option>
						<option value="knight">騎士</option>
						<option value="villager">村民</option>
					</select>
				</div>
				<div>
					<label for="dead-{i}">已死亡?</label>
					<input
						type="checkbox"
						id="dead-{i}"
						bind:checked={() => state.value.playerData?.[i]?.dead ?? false,
						(v) => {
							if (typeof state.value.playerData?.[i]?.dead !== 'undefined')
								state.value.playerData[i].dead = v;
						}}
					/>
				</div>
			</div>
		{/each}
	</div>
</div>
