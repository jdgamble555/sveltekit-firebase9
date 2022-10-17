<script lang="ts">
	export let displayName = undefined;
	export let photoURL = undefined;
	export let uid = undefined;
</script>

<h3>Hi {displayName}!</h3>

<img src={photoURL} width="100" alt="user avatar" />
<p>Your userID is {uid}</p>
