<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="bg-foreground rounded-2xl p-5" {...props}>
	{#if children}
		{@render children()}
	{/if}
</div>
