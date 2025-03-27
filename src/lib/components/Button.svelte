<script lang="ts">
	import { type HTMLButtonAttributes } from 'svelte/elements';
	let { class: c, children, ...props }: HTMLButtonAttributes = $props();
</script>

<button {...props} class="bg-secondary rounded-md p-2 text-white {c}">
	{#if children}
		{@render children()}
	{/if}
</button>
