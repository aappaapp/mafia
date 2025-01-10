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
	import Panel from '$lib/components/Panel.svelte';

	let peer: import('peerjs').Peer | undefined = $state();
	let conn: import('peerjs').DataConnection | undefined = $state();
	let isHost = $state(false);
	let status = $state('idle');
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

	$effect(() => {
		localStorage.setItem('state', JSON.stringify(obj.gameState));
	});

	let roomId = $state('spirit');
	let pin = $state('1234');
</script>

{#if isHost}
	<Panel bind:gameState={obj.gameState} />
{:else if peer}
	<div>Waiting for host...</div>
{:else}
	<div class="">
		<h1 class="text-center text-3xl">狼人殺 Online</h1>
		<div class="flex flex-col items-center gap-2">
			<label for="roomId" class="text-center text-xl">房間號</label>
			<input type="text" placeholder="Id" id="roomId" bind:value={roomId} class="b--input" />
			<label for="pin" class="text-center text-xl">PIN</label>
			<input type="text" placeholder="Pin" id="pin" bind:value={pin} class="b--input" />
			<div class="flex gap-2">
				<button
					onclick={async () => {
						peer = await host(obj, roomId, pin);
						hostAcceptCall(obj, peer);
						isHost = true;
					}}
					class="b--button">Host</button
				>
				<button
					onclick={async () => {
						status = 'joining';
						[peer, conn] = await join(roomId, pin);
						status = 'calling';
						await call(peer, getHostId(roomId, pin));
						acceptCall(peer);
					}}
					class="b--button">Join</button
				>
			</div>
			<div>
				Status: {status}
			</div>
		</div>
	</div>
{/if}
