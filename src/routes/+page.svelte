<script lang="ts">
	import { loginWithGoogle, logout, user } from '$lib/firebase';
	import Profile from '../Profile.svelte';
	import Todos from '../Todos.svelte';
</script>

<section>
	{#if $user}
		<Profile user={$user} />
		<button on:click={logout}>Logout</button>
		<hr />
		<Todos user={$user} />
	{:else}
		<button on:click={loginWithGoogle}>Signin with Google</button>
	{/if}
</section>

<style>
	section {
		/*background: rgb(235, 235, 235);*/
		padding: 20px;
	}
</style>
