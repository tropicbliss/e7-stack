<script lang="ts">
	import { trpc } from '$lib/trpc';

	const greeting = trpc.greeting.query({ name: 'the e7 stack' });
</script>

<svelte:head>
	<title>E7 Stack</title>
</svelte:head>

<h1>{$greeting.data}</h1>
