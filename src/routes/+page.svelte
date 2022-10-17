<script lang="ts">
	import { loginWithGoogle, logout, user } from '../firebase';
	import Profile from '../Profile.svelte';
	import Todos from '../Todos.svelte';
</script>

<section>
	{#if $user}
		<Profile displayName={$user.displayName} photoURL={$user.photoURL} uid={$user.uid} />
		<button on:click={logout}>Logout</button>
		<hr />
		<Todos uid={$user.uid} />
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
