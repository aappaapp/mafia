<script lang="ts">
	import {
		hostAcceptCall,
		call,
		getHostId,
		host,
		join,
		type HostState,
		acceptCall
	} from '$lib/peer';
	import { browser } from '$app/environment';

	let peer: import('peerjs').Peer | undefined = $state();
	let conn: import('peerjs').DataConnection | undefined = $state();
	let isHost = $state(false);
	let obj: HostState = $state({
		peers: [],
		gameState: {
			playerCount: 0,
			playerData: []
		}
	});

	if (browser) {
		let item = localStorage.getItem('state');
		if (item) obj.gameState = JSON.parse(item);
	}

	$effect.pre(() => {
		obj.gameState.playerCount = obj.peers.length;
		if (obj.gameState.playerData.length < obj.gameState.playerCount) {
			for (let i = obj.gameState.playerData.length; i < obj.gameState.playerCount; i++) {
				obj.gameState.playerData.push({
					role: 'villager',
					dead: false
				});
			}
		}
	});

	$effect(() => {
		localStorage.setItem('state', JSON.stringify(obj.gameState));
	});
</script>

<button
	onclick={async () => {
		peer = await host(obj, 'spirit', '4123');
		hostAcceptCall(obj, peer);
		isHost = true;
	}}>Host</button
>

<button
	onclick={async () => {
		[peer, conn] = await join('spirit', '4123');
		await call(peer, getHostId('spirit', '4123'));
		acceptCall(peer);
	}}>Join</button
>

{#if isHost}
	<div class="flex flex-col gap-4">
		<h1 class="text-center text-4xl">狼人殺</h1>
		<div class="flex flex-col items-center">
			<div class="flex items-center gap-2">
				<label for="players">人數</label>
				<input
					type="number"
					id="players"
					bind:value={obj.gameState.playerCount}
					class="b--input--number"
				/>
			</div>
			{#each new Array(obj.gameState.playerCount) as _, i}
				<div
					class="flex flex-col rounded-lg border-2 border-black p-2 {obj.gameState.playerData[i]
						.dead
						? 'bg-black text-white'
						: ''}"
				>
					<span>玩家編號{i + 1}</span>
					<div>
						<label for="role-{i}">職業</label>
						<select
							id="role-{i}"
							bind:value={obj.gameState.playerData[i].role}
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
						<input type="checkbox" id="dead-{i}" bind:checked={obj.gameState.playerData[i].dead} />
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	as
{/if}
