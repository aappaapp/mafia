import Peer, { type DataConnection } from 'peerjs';

export type HostState = {
	peers: {
		id: string;
		media?: MediaStream;
		context?: AudioContext;
		output?: MediaStreamAudioDestinationNode;
	}[];
	gameState: App.GameState;
};

export function getHostId(id: string, pin: string) {
	return `ap-mafia-${pin}-${id}`;
}

export function host(state: HostState, id: string, pin: string) {
	return new Promise<Peer>((resolve) => {
		const peer = new Peer(`ap-mafia-${pin}-${id}`);
		console.log(peer);
		peer.once('open', () => {
			resolve(peer);
		});
		peer.on('connection', (conn) => {
			console.log(conn.peer);
			state.peers.push({ id: conn.peer });
			conn.on('close', () => {
				state.peers = state.peers.filter((v) => v.id !== conn.peer);
			});
		});
	});
}

export function hostAcceptCall(state: HostState, peer: Peer) {
	peer.on('call', (call) => {
		call.answer();
		call.on('stream', (stream) => {
			let peer2 = state.peers.find((v) => v.id === call.peer);
			if (peer2) {
				peer2.media = stream;
				peer2.context = new AudioContext();
				peer2.output = peer2.context.createMediaStreamDestination();
				// peer2.context.createMediaStreamSource(stream).connect(peer2.output);
				peer.call(call.peer, peer2.output.stream);
				const audio = new Audio();
				audio.autoplay = true;
				audio.srcObject = stream;
			}
		});
	});
}

export function acceptCall(peer: Peer) {
	peer.on('call', (call) => {
		call.answer();
		call.on('stream', (stream) => {
			const audio = new Audio();
			audio.autoplay = true;
			audio.srcObject = stream;
		});
	});
}

export function join(id: string, pin: string) {
	return new Promise<[Peer, DataConnection]>((resolve) => {
		const peer = new Peer();
		peer.once('open', () => {
			const conn = peer.connect(`ap-mafia-${pin}-${id}`);
			conn.on('open', () => {
				resolve([peer, conn]);
			});
		});
	});
}

export async function call(peer: Peer, id: string) {
	const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
	peer.call(id, media);
}
