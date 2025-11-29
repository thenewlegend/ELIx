<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="m3-navbar">
	<a href="/" class="m3-nav-link">Home</a>
	<a href="/explain" class="m3-nav-link">Explain</a>
	<a href="/versus" class="m3-nav-link">Versus</a>
	<a href="/battle" class="m3-nav-link">Battle</a>
	<a href="/persona" class="m3-nav-link">Persona</a>
</nav>

{@render children()}

<style>
	.m3-navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 64px;
		background-color: var(--md-sys-color-surface);
		display: flex;
		align-items: center;
		padding: 0 16px;
		box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
		z-index: 1000;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
	}

	.m3-nav-link {
		color: var(--md-sys-color-on-surface);
		text-decoration: none;
		font-family: var(--md-sys-typescale-label-large-font);
		font-weight: 500;
		margin-right: 16px;
		padding: 8px 12px;
		border-radius: 20px;
		transition: background-color 0.2s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.m3-nav-link:last-child {
		margin-right: 0;
	}

	.m3-nav-link:hover {
		background-color: var(--md-sys-color-secondary-container);
		color: var(--md-sys-color-on-secondary-container);
	}

	@media (min-width: 640px) {
		.m3-navbar {
			padding: 0 24px;
		}

		.m3-nav-link {
			margin-right: 24px;
			padding: 8px 16px;
		}
	}
</style>
