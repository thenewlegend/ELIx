<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import RateLimitIndicator from '$lib/components/RateLimitIndicator.svelte';
	import { toasts } from '$lib/stores/toast.js';
	import { useUserKey } from '$lib/stores/apiKey.js';
	
	let { children } = $props();
	let settingsOpen = $state(false);
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
	<div class="nav-spacer"></div>
	<button 
		class="settings-button" 
		onclick={() => settingsOpen = true}
		aria-label="Settings"
		title="API Key Settings"
	>
		<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
			<path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
		</svg>
		{#if $useUserKey}
			<span class="key-indicator" title="Using your API key"></span>
		{/if}
	</button>
</nav>

{@render children()}

<!-- Toast Container -->
<div class="toast-container">
	{#each $toasts as toast (toast.id)}
		<Toast 
			message={toast.message} 
			type={toast.type} 
			duration={toast.duration}
			onDismiss={() => toasts.dismiss(toast.id)}
		/>
	{/each}
</div>

<!-- Settings Modal -->
<SettingsModal bind:isOpen={settingsOpen} />

<!-- Rate Limit Indicator -->
<RateLimitIndicator />

<style>
	.m3-navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 64px;
		background-color: rgba(255, 251, 254, 0.8);
		backdrop-filter: blur(12px) saturate(180%);
		-webkit-backdrop-filter: blur(12px) saturate(180%);
		display: flex;
		align-items: center;
		padding: 0 16px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(121, 116, 126, 0.15);
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
		transition: background-color var(--transition-fast),
		            color var(--transition-fast),
		            transform var(--transition-fast);
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

	.m3-nav-link:active {
		transform: scale(0.95);
	}

	.nav-spacer {
		flex: 1;
	}

	.settings-button {
		position: relative;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		background-color: transparent;
		color: var(--md-sys-color-on-surface);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color var(--transition-fast), transform var(--transition-fast);
		flex-shrink: 0;
	}

	.settings-button:hover {
		background-color: var(--md-sys-color-secondary-container);
	}

	.settings-button:active {
		transform: scale(0.95);
	}

	.key-indicator {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--md-sys-color-primary);
		border: 2px solid rgba(255, 251, 254, 0.9);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.7;
			transform: scale(1.1);
		}
	}

	/* Toast Container */
	.toast-container {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 2000;
		display: flex;
		flex-direction: column;
		gap: 12px;
		pointer-events: none;
	}

	.toast-container :global(*) {
		pointer-events: auto;
	}

	@media (max-width: 640px) {
		.toast-container {
			bottom: 16px;
			right: 16px;
			left: 16px;
		}
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
