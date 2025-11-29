<script>
  import { rateLimit, fetchRateLimitStatus } from '$lib/stores/rateLimit.js';
  import { useUserKey } from '$lib/stores/apiKey.js';
  import { toasts } from '$lib/stores/toast.js';
  import { fade, slide } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';

  // Don't show if using user key
  $: show = $rateLimit.isVisible && !$useUserKey;
  $: percentage = ($rateLimit.remaining / $rateLimit.limit) * 100;
  
  // Color based on remaining
  $: color = $rateLimit.remaining === 0 ? 'var(--md-sys-color-error)' : 
             $rateLimit.remaining < 3 ? 'var(--md-sys-color-error)' : 
             $rateLimit.remaining < 5 ? 'var(--md-sys-color-tertiary)' : 
             'var(--md-sys-color-primary)';
             
  $: containerColor = $rateLimit.remaining === 0 ? 'var(--md-sys-color-error-container)' : 
                      $rateLimit.remaining < 3 ? 'var(--md-sys-color-error-container)' : 
                      $rateLimit.remaining < 5 ? 'var(--md-sys-color-tertiary-container)' : 
                      'var(--md-sys-color-primary-container)';
                      
  $: onContainerColor = $rateLimit.remaining === 0 ? 'var(--md-sys-color-on-error-container)' : 
                        $rateLimit.remaining < 3 ? 'var(--md-sys-color-on-error-container)' : 
                        $rateLimit.remaining < 5 ? 'var(--md-sys-color-on-tertiary-container)' : 
                        'var(--md-sys-color-on-primary-container)';

  let timeRemaining = '';
  let interval;
  let resetToastShown = false;

  function updateTime() {
    if (!$rateLimit.resetTime) {
      timeRemaining = '';
      return;
    }

    const now = new Date();
    const diff = new Date($rateLimit.resetTime) - now;

    if (diff <= 0) {
      timeRemaining = 'now';
      
      // If we hit 0 and haven't refreshed yet, do it
      if ($rateLimit.remaining === 0 && !resetToastShown) {
        resetToastShown = true;
        toasts.success('Rate limit reset! You can now make more requests.');
        fetchRateLimitStatus(); // Refresh from server
      }
      return;
    }
    
    // Reset the toast flag if we have time remaining (means we refreshed or got a new limit)
    if (diff > 0 && resetToastShown) {
      resetToastShown = false;
    }

    const minutes = Math.ceil(diff / 60000);
    timeRemaining = `${minutes}m`;
  }

  onMount(() => {
    updateTime();
    interval = setInterval(updateTime, 1000); // Update every second for better precision
    
    // Initial fetch to ensure sync if persisted state is stale
    if (show) {
      fetchRateLimitStatus();
    }
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

{#if show}
  <div 
    class="rate-limit-pill" 
    transition:slide={{ axis: 'y', duration: 300 }}
    style="--pill-color: {color}; --pill-bg: {containerColor}; --pill-text: {onContainerColor}"
  >
    <div class="circular-chart">
      <svg viewBox="0 0 36 36" class="circular-chart-svg">
        <path class="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path class="circle"
          stroke-dasharray="{percentage}, 100"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span class="count">{$rateLimit.remaining}</span>
    </div>
    <div class="text-content">
      <span class="label">Public API Limit</span>
      {#if $rateLimit.remaining === 0}
        <span class="sub-label">Resets in {timeRemaining}</span>
      {:else}
        <span class="sub-label">{$rateLimit.remaining}/{$rateLimit.limit} remaining</span>
      {/if}
    </div>
  </div>
{/if}

<style>
  .rate-limit-pill {
    position: fixed;
    bottom: 24px;
    left: 24px;
    background-color: var(--pill-bg);
    color: var(--pill-text);
    padding: 8px 16px 8px 8px;
    border-radius: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    z-index: 900;
    font-family: var(--md-sys-typescale-label-large-font);
    pointer-events: none; /* Let clicks pass through if needed, or remove if interactive */
    border: 1px solid rgba(255,255,255,0.1);
  }

  .circular-chart {
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circular-chart-svg {
    display: block;
    max-width: 100%;
    max-height: 100%;
    transform: rotate(-90deg); /* Start from top */
  }

  .circle-bg {
    fill: none;
    stroke: currentColor;
    stroke-width: 3.8;
    opacity: 0.2;
  }

  .circle {
    fill: none;
    stroke: var(--pill-color); /* Use the vibrant color for the stroke */
    stroke-width: 3.8;
    stroke-linecap: round;
    transition: stroke-dasharray 0.5s ease;
  }
  
  /* Override stroke color for better visibility on container */
  .circle {
    stroke: currentColor; 
    opacity: 1;
  }

  .count {
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    color: var(--pill-text);
  }

  .text-content {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .label {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.8;
  }

  .sub-label {
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    .rate-limit-pill {
      bottom: 80px; /* Above bottom nav/toast area on mobile */
      left: 16px;
    }
  }
</style>
