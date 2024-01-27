/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces

declare global {

	type UserType = {
		displayName: string | null;
		photoURL: string | null;
		uid: string;
		email: string | null;
	};

	type Todo = {
		id: string;
		text: string;
		complete: boolean;
		createdAt: Date;
	};

	declare namespace App {

		interface Locals { }

		interface Platform { }

		interface Session { }

		interface Stuff { }
	}

}

export { }
