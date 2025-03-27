<script lang="ts">
	import { type HTMLInputAttributes } from 'svelte/elements';
	let {
		class: c,
		value = $bindable(),
		...props
	}: Omit<HTMLInputAttributes, 'children' | 'type'> = $props();
</script>

<input {...props} bind:value type="number" class="rounded-md bg-black/10 p-2 {c}" />
