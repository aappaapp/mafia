// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface GameState {
			playerCount: number;
			playerData: {
				role: 'werewolf' | 'king' | 'witch' | 'seer' | 'hunter' | 'knight' | 'villager';
				dead: boolean;
				isSheriff: boolean;
				name: string;
			}[];
		}
	}
}

export {};
