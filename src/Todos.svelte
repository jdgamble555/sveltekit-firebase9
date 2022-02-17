<script lang="ts">
	import { addTodo, deleteTodo, getTodos, updateTodo } from './firebase';
	import TodoItem from './TodoItem.svelte';

	// User ID passed from parent
	export let uid = undefined;

	// Form Text
	let text = 'some task';

	const todos = getTodos(uid);

	function add() {
		addTodo(uid, text);
		text = '';
	}

	function updateStatus(event: any) {
		const { id, newStatus } = event.detail;
		updateTodo(id, newStatus);
	}

	function removeItem(event: any) {
		const { id } = event.detail;
		deleteTodo(id);
	}
</script>

{#if $todos && $todos.length}
	<ul>
		{#each $todos as todo}
			<TodoItem
				id={todo.id}
				text={todo.text}
				complete={todo.complete}
				on:remove={removeItem}
				on:toggle={updateStatus}
			/>
		{/each}
	</ul>
{/if}
<form on:submit|preventDefault={add}>
	<input bind:value={text} />
	<button type="submit">Add Task</button>
</form>
