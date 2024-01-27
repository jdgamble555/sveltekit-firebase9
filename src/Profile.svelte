<script lang="ts">
	export let user: UserType;
</script>

<h3>Hi {user.displayName}!</h3>

<img src={user.photoURL} width="100" alt="user avatar" />
<p>Your userID is {user.uid}</p>
