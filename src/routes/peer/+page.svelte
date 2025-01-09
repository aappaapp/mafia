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

<div class="flex">
	<input type="text" placeholder="Id" bind:value={roomId} />
	<input type="text" placeholder="Pin" bind:value={pin} />
</div>
<div>
	<button
		onclick={async () => {
			peer = await host(obj, roomId, pin);
			hostAcceptCall(obj, peer);
			isHost = true;
		}}>Host</button
	>
</div>

<button
	onclick={async () => {
		[peer, conn] = await join(roomId, pin);
		await call(peer, getHostId(roomId, pin));
		acceptCall(peer);
	}}>Join</button
>

{#if isHost}
	<Panel bind:gameState={obj.gameState} />
{:else}
	You are wolfksamdflmasdf
{/if}
