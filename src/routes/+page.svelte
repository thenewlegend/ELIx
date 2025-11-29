<script>
  // No script needed for static links
</script>

<div class="m3-container">
  <div class="hero-section">
    <h1 class="m3-display-large">ELI-X</h1>
    <p class="m3-headline-small">Complex topics, simplified for any age.</p>
  </div>

  <div class="card-grid">
    <!-- Explain Card -->
    <a href="/explain" class="m3-card interactive">
      <div class="card-content">
        <div class="icon-container primary-container">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
            <path d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm-80-240v-80h160v80H400Zm80-160q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM200-800v-160h160v160H200Zm400 0v-160h160v160H600Zm-400 400v-160h160v160H200Zm400 0v-160h160v160H600ZM200 0v-160h160v160H200Zm400 0v-160h160v160H600Z"/> <!-- Placeholder Icon -->
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
          </svg>
        </div>
        <h2 class="m3-headline-medium">Explain</h2>
        <p class="m3-body-large">Get a simple explanation for any topic at any age.</p>
      </div>
    </a>

    <!-- Versus Card -->
    <a href="/versus" class="m3-card interactive">
      <div class="card-content">
        <div class="icon-container secondary-container">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
            <path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-320q66 0 113-47t47-113v-160h-320v160q0 66 47 113t113 47Zm0 400q-100 0-170-70t-70-170v-160q0-100 70-170t170-70q100 0 170 70t170 170v160q0 100-70 170t-170 70Z"/>
          </svg>
        </div>
        <h2 class="m3-headline-medium">Versus</h2>
        <p class="m3-body-large">Compare explanations for two different ages side-by-side.</p>
      </div>
    </a>

    <!-- Coming Soon Card -->
    <div class="m3-card disabled">
      <div class="card-content">
        <div class="icon-container tertiary-container">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor">
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Z"/>
          </svg>
        </div>
        <h2 class="m3-headline-medium">Coming Soon</h2>
        <p class="m3-body-large">More modes coming soon.</p>
      </div>
    </div>
  </div>
</div>

<style>
  .m3-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 80px 24px 24px 24px;
    background-color: var(--md-sys-color-background);
    box-sizing: border-box;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 64px;
  }

  .m3-display-large {
    font-family: var(--md-sys-typescale-display-large-font);
    font-size: var(--md-sys-typescale-display-large-size);
    font-weight: var(--md-sys-typescale-display-large-weight);
    color: var(--md-sys-color-on-background);
    margin: 0 0 16px 0;
  }

  .m3-headline-small {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: 24px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    width: 100%;
    max-width: 1000px;
  }

  .m3-card {
    background-color: var(--md-sys-color-surface);
    border-radius: 28px;
    padding: 24px;
    /* Elevation 1 */
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
    transition: all 0.2s ease;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .m3-card.interactive:hover {
    /* Elevation 2 */
    box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
    background-color: var(--md-sys-color-surface-variant); /* Slight tint on hover */
    transform: translateY(-2px);
  }

  .m3-card.disabled {
    opacity: 0.6;
    cursor: default;
    box-shadow: none;
    border: 1px solid var(--md-sys-color-outline-variant);
    background-color: transparent;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
  }

  .icon-container {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: var(--md-sys-color-on-primary-container);
  }

  .primary-container {
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }

  .secondary-container {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  .tertiary-container {
    background-color: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }

  .m3-headline-medium {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: 28px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface);
    margin: 0 0 16px 0;
  }

  .m3-body-large {
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: 16px;
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
    line-height: 1.5;
  }
</style>
