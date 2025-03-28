<script lang="ts">
	import type { Database, SqlValue } from '@sqlite.org/sqlite-wasm';
	import Button from './Button.svelte';
	import { db, rerender, triggerRerender } from '$lib/db.svelte';

	type Props = {
		id: number;
	};

	let { id }: Props = $props();
	let data: Record<string, SqlValue>[] = $state([]);
	let roles: {
		id: string;
		name: string;
	}[] = $state([]);
	$effect(() => {
		rerender[`player${id}`];
		data = db.db!.exec(
			`SELECT role, name, EXISTS (SELECT 1 FROM kill WHERE target = ${id}) as isKilled, EXISTS (SELECT 1 FROM sheriff WHERE player = ${id}) as isSheriff FROM player WHERE id = ${id}`,
			{
				rowMode: 'object',
				returnValue: 'resultRows'
			}
		);
		roles = db
			.db!.exec(`SELECT id, name FROM roles`, {
				returnValue: 'resultRows'
			})
			.map((v) => ({ id: v[0], name: v[1] }) as (typeof roles)[number]);
	});

	let expanded = $state(false);
</script>

{#key rerender[`player${id}`]}
	<div class="{!data[0]?.isKilled ? 'bg-foreground' : 'bg-dead'} m-5 rounded-2xl p-5">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div onclick={() => (expanded = !expanded)}>{data[0]?.name}</div>
		{#if expanded}
			<div>
				<Button
					onclick={() => {
						const newName = prompt('請輸入名字', data[0]?.name as string | undefined);
						if (newName) {
							db.db!.exec(`UPDATE player SET name = '${newName}' WHERE id = ${id}`);
						}
						triggerRerender(`player${id}`);
					}}>Rename</Button
				>
				<Button
					onclick={() => {
						if (data[0]?.isKilled) {
							db.db!.exec(`DELETE FROM kill WHERE target = ${id} AND phase = ${db.state.phase}`);
						} else {
							db.db!.exec(`INSERT INTO kill (phase, target) VALUES (${db.state.phase}, ${id})`);
						}
						triggerRerender(`player${id}`);
					}}>{data[0]?.isKilled ? 'Un' : ''}Kill</Button
				>
				<select
					name="role"
					id="role"
					value={data[0]?.role}
					onchange={(e) => {
						db.db!.exec(`UPDATE player SET role = '${e.currentTarget.value}' WHERE id = ${id}`);
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
