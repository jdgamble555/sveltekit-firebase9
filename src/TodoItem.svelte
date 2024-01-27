<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let todo: Todo;

	const dispatch = createEventDispatcher();

	function remove() {
		dispatch('remove', { id: todo.id });
	}

	function toggleStatus() {
		let newStatus = !todo.complete;
		dispatch('toggle', {
			id: todo.id,
			newStatus
		});
	}
</script>

<li in:fly={{ x: 900, duration: 500 }}>
	<span class:complete={todo.complete}>{todo.text} - {todo.id}</span>
	{#if todo.complete}
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
