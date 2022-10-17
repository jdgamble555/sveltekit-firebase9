<script lang="ts">
	import { fly } from 'svelte/transition';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function remove() {
		dispatch('remove', { id });
	}

	function toggleStatus() {
		let newStatus = !complete;
		dispatch('toggle', {
			id,
			newStatus
		});
	}

	export let id = undefined;
	export let text = undefined;
	export let complete = undefined;
</script>

<li in:fly={{ x: 900, duration: 500 }}>
	<span class:complete>{text} - {id}</span>
	{#if complete}
		<button on:click={toggleStatus}> ✔️ </button>
	{:else}
		<button on:click={toggleStatus}> ❌ </button>
	{/if}

	<button on:click={remove}> 🗑 </button>
</li>

<style>
	.complete {
		text-decoration: line-through;
		color: green;
	}
</style>
