<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();
	onMount(async () => {});
</script>

{@render children()}
