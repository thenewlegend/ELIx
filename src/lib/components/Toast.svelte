<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  
  export let message = '';
  export let type = 'info'; // 'success', 'error', 'warning', 'info'
  export let duration = 3000;
  export let onDismiss = () => {};
  
  let visible = true;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  onMount(() => {
    if (duration > 0) {
      setTimeout(() => {
        visible = false;
        setTimeout(onDismiss, 300); // Wait for animation
      }, duration);
    }
  });
  
  function dismiss() {
    visible = false;
    setTimeout(onDismiss, 300);
  }
</script>

{#if visible}
  <div 
    class="toast toast-{type}"
    transition:fly={{ y: 20, duration: 300 }}
    role="alert"
  >
    <span class="toast-icon">{icons[type]}</span>
    <span class="toast-message">{message}</span>
    <button class="toast-close" on:click={dismiss} aria-label="Dismiss">×</button>
  </div>
{/if}

<style>
  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15),
                0px 2px 4px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: 14px;
    min-width: 280px;
    max-width: 400px;
    animation: slideIn var(--transition-normal) ease-out;
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .toast-success {
    background-color: rgba(46, 125, 50, 0.95);
    color: white;
  }
  
  .toast-error {
    background-color: rgba(179, 38, 30, 0.95);
    color: white;
  }
  
  .toast-warning {
    background-color: rgba(237, 108, 2, 0.95);
    color: white;
  }
  
  .toast-info {
    background-color: rgba(25, 118, 210, 0.95);
    color: white;
  }
  
  .toast-icon {
    font-size: 20px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .toast-message {
    flex: 1;
    line-height: 1.4;
  }
  
  .toast-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color var(--transition-fast);
    flex-shrink: 0;
  }
  
  .toast-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .toast-close:active {
    transform: scale(0.9);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .toast {
      animation: none;
    }
  }
</style>
