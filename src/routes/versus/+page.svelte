<script>
  import { marked } from 'marked';

  let topic = '';
  let ageA = 5;
  let ageB = 40;
  
  // Store the ages used for the current explanation to prevent reactive updates while typing
  let displayedAgeA = 5;
  let displayedAgeB = 40;

  let explanationA = '';
  let explanationB = '';
  let loading = false;
  let error = '';

  $: formattedExplanationA = explanationA ? marked.parse(explanationA) : '';
  $: formattedExplanationB = explanationB ? marked.parse(explanationB) : '';

  async function handleSubmit() {
    loading = true;
    error = '';
    
    // Update displayed ages only on submit
    displayedAgeA = ageA;
    displayedAgeB = ageB;

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, age: ageA })
        }),
        fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, age: ageB })
        })
      ]);

      if (!resA.ok || !resB.ok) {
        throw new Error('Failed to fetch one or both explanations.');
      }

      const dataA = await resA.json();
      const dataB = await resB.json();

      explanationA = dataA.explanation;
      explanationB = dataB.explanation;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="m3-container">
  <div class="m3-card">
    <h1 class="m3-display-small">ELI-X Versus</h1>

    <form on:submit|preventDefault={handleSubmit}>
      <div class="m3-text-field-container">
        <div class="m3-text-field">
          <input type="text" id="topic" bind:value={topic} required placeholder=" " />
          <label for="topic">Topic</label>
        </div>
      </div>

      <div class="input-row">
        <div class="m3-text-field-container">
          <div class="m3-text-field">
            <input type="number" id="ageA" bind:value={ageA} min="1" max="100" required placeholder=" " />
            <label for="ageA">Age A</label>
          </div>
        </div>

        <div class="m3-text-field-container">
          <div class="m3-text-field">
            <input type="number" id="ageB" bind:value={ageB} min="1" max="100" required placeholder=" " />
            <label for="ageB">Age B</label>
          </div>
        </div>
      </div>

      <button type="submit" class="m3-button-filled" disabled={loading}>
        {#if loading}
          <svg class="m3-circular-progress" viewBox="0 0 48 48">
            <circle class="path" cx="24" cy="24" r="20" fill="none" stroke-width="4"></circle>
          </svg>
        {:else}
          Compare
        {/if}
      </button>
    </form>

    {#if error}
      <div class="m3-error-message">
        <p>Error: {error}</p>
      </div>
    {/if}

    {#if explanationA || explanationB}
      <div class="comparison-container" class:loading-content={loading}>
        <div class="m3-surface-variant output-column">
          <h2 class="m3-headline-small">Age {displayedAgeA} (ELI{displayedAgeA})</h2>
          <div class="markdown-content">
            {@html formattedExplanationA}
          </div>
        </div>

        <div class="m3-surface-variant output-column">
          <h2 class="m3-headline-small">Age {displayedAgeB} (ELI{displayedAgeB})</h2>
          <div class="markdown-content">
            {@html formattedExplanationB}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Reuse M3 Styles from +page.svelte (Ideally these should be global or shared components) */
  /* Container & Card */
  .m3-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 80px 16px 24px 16px;
    background-color: var(--md-sys-color-background);
    box-sizing: border-box;
  }

  .m3-card {
    background-color: var(--md-sys-color-surface);
    border-radius: 28px;
    padding: 20px;
    width: 100%;
    max-width: 1000px;
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
  }

  @media (min-width: 640px) {
    .m3-card {
      padding: 24px;
    }
  }

  /* Typography */
  .m3-display-small {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: var(--md-sys-typescale-headline-large-size);
    font-weight: var(--md-sys-typescale-headline-large-weight);
    color: var(--md-sys-color-on-surface);
    margin: 0 0 32px 0;
    text-align: center;
  }

  .m3-headline-small {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: 20px; /* Slightly smaller for columns */
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    margin: 0 0 16px 0;
    text-align: center;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    padding-bottom: 8px;
  }

  /* Text Fields (Outlined) */
  .m3-text-field-container {
    margin-bottom: 24px;
    width: 100%;
  }

  .input-row {
    display: flex;
    gap: 16px;
  }

  .m3-text-field {
    position: relative;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 4px;
    height: 56px;
    display: flex;
    align-items: center;
    transition: border-color 0.2s;
  }

  .m3-text-field:focus-within {
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
  }

  .m3-text-field input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    padding: 0 16px;
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: var(--md-sys-typescale-body-large-size);
    color: var(--md-sys-color-on-surface);
    outline: none;
    z-index: 1;
  }

  .m3-text-field label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--md-sys-color-surface);
    padding: 0 4px;
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: var(--md-sys-typescale-body-large-size);
    color: var(--md-sys-color-on-surface-variant);
    transition: all 0.2s ease-out;
    pointer-events: none;
    z-index: 2;
  }

  /* Floating Label Logic */
  .m3-text-field input:focus + label,
  .m3-text-field input:not(:placeholder-shown) + label {
    top: 0;
    font-size: 12px;
    color: var(--md-sys-color-primary);
  }

  .m3-text-field input:not(:placeholder-shown) + label {
     color: var(--md-sys-color-on-surface-variant);
  }
  
  .m3-text-field input:focus + label {
    color: var(--md-sys-color-primary);
  }

  /* Filled Button */
  .m3-button-filled {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    font-family: var(--md-sys-typescale-label-large-font);
    font-size: var(--md-sys-typescale-label-large-size);
    font-weight: var(--md-sys-typescale-label-large-weight);
    min-height: 48px;
    border-radius: 24px;
    border: none;
    padding: 12px 24px;
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .m3-button-filled:hover {
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    opacity: 0.92; /* State layer simulation */
  }

  .m3-button-filled:active {
    transform: scale(0.96);
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  }

  .m3-button-filled:disabled {
    background-color: rgba(28, 27, 31, 0.12);
    color: rgba(28, 27, 31, 0.38);
    box-shadow: none;
    cursor: not-allowed;
  }

  /* Comparison Area */
  .comparison-container {
    display: flex;
    gap: 24px;
    margin-top: 24px;
    transition: opacity 0.2s ease;
  }

  .loading-content {
    opacity: 0.5;
  }

  .output-column {
    flex: 1;
    background-color: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
    border-radius: 12px;
    padding: 16px;
  }

  .markdown-content :global(p) {
    margin-bottom: 1em;
    line-height: 1.5;
  }

  /* Error Message */
  .m3-error-message {
    background-color: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
    padding: 16px;
    border-radius: 12px;
    margin-top: 24px;
  }

  /* Circular Progress */
  .m3-circular-progress {
    animation: rotate 2s linear infinite;
    height: 24px;
    width: 24px;
  }

  .m3-circular-progress .path {
    stroke: var(--md-sys-color-on-primary);
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .input-row {
      flex-direction: column;
      gap: 0;
    }
    .comparison-container {
      flex-direction: column;
    }
  }
</style>
