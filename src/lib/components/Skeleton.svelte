<script>
  // Skeleton component for loading states
  export let lines = 3;
  export let className = '';
</script>

<div class="skeleton-container {className}">
  {#each Array(lines) as _, i}
    <div class="skeleton-line" style="animation-delay: {i * 50}ms"></div>
  {/each}
</div>

<style>
  .skeleton-container {
    padding: 16px 0;
  }

  .skeleton-line {
    height: 18px;
    background: linear-gradient(
      90deg,
      var(--md-sys-color-surface-variant) 0%,
      var(--md-sys-color-outline-variant) 50%,
      var(--md-sys-color-surface-variant) 100%
    );
    background-size: 200% 100%;
    border-radius: 4px;
    margin-bottom: 12px;
    animation: shimmer 1.5s infinite ease-in-out;
  }

  .skeleton-line:last-child {
    width: 70%;
    margin-bottom: 0;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton-line {
      animation: pulse 2s infinite;
    }
  }
</style>
