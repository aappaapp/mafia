<script lang="ts">
	import type { Database } from '@sqlite.org/sqlite-wasm';
	import Button from './Button.svelte';
	import { rerender, triggerRerender } from '$lib/db.svelte';

	type Props = {
		db: Database;
		id: number;
	};

	let { db, id }: Props = $props();
	let data: {
		role: string;
		isAlive: boolean;
		name: string;
	} = $state({
		role: 'villager',
		isAlive: true,
		name: ''
	});
	let roles: {
		id: string;
		name: string;
	}[] = $state([]);
	$effect(() => {
		rerender[`player${id}`];
		data = db
			.exec(`SELECT role, is_alive, name FROM player WHERE id = ${id}`, {
				returnValue: 'resultRows'
			})
			.map((v) => ({ role: v[0], isAlive: v[1] === 1, name: v[2] }) as typeof data)[0];
		roles = db
			.exec(`SELECT id, name FROM roles`, {
				returnValue: 'resultRows'
			})
			.map((v) => ({ id: v[0], name: v[1] }) as (typeof roles)[number]);
	});

	let expanded = $state(false);
</script>

{#key rerender[`player${id}`]}
	<div class="{data.isAlive ? 'bg-foreground' : 'bg-dead'} m-5 rounded-2xl p-5">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div onclick={() => (expanded = !expanded)}>{data.name}</div>
		{#if expanded}
			<div>
				<Button
					onclick={() => {
						db.exec(
							`UPDATE player SET name = '${prompt('請輸入名字', data.name)}' WHERE id = ${id}`
						);
						triggerRerender(`player${id}`);
					}}>Rename</Button
				>
				<Button
					onclick={() => {
						db.exec(`UPDATE player SET is_alive = 0 WHERE id = ${id}`);
						triggerRerender(`player${id}`);
					}}>Kill</Button
				>
				<select
					name="role"
					id="role"
					value={data.role}
					onchange={(e) => {
						db.exec(`UPDATE player SET role = '${e.currentTarget.value}' WHERE id = ${id}`);
						triggerRerender(`player${id}`);
					}}
				>
					{#each roles as role}
						<option value={role.id}>{role.name}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>
{/key}
