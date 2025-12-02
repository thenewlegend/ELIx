<script>
  import { marked } from 'marked';
  import { ripple } from '$lib/actions/ripple.js';
  import { vibrateHeavy, vibrateSuccess, vibrateError } from '$lib/utils/haptics.js';
  import { showSuccess, showError } from '$lib/stores/toast.js';
  import { getApiKeyConfig } from '$lib/stores/apiKey.js';
  import { updateRateLimitFromHeaders } from '$lib/stores/rateLimit.js';

  let topic = '';
  let persona = 'caveman';
  let explanation = '';
  let loading = false;
  let error = '';

  const personas = [
    { id: 'caveman', name: 'Caveman', icon: '🪨' },
    { id: 'genz', name: 'Gen Z / Brainrot', icon: '💀' },
    { id: 'shakespeare', name: 'Shakespeare', icon: '🎭' },
    { id: 'conspiracy', name: 'Conspiracy Theorist', icon: '👽' },
    { id: 'ramsay', name: 'Gordon Ramsay', icon: '👨‍🍳' },
    { id: 'programmer', name: 'Programmer', icon: '💻' }
  ];

  $: formattedExplanation = explanation ? marked.parse(explanation) : '';

  async function handleSubmit() {
    loading = true;
    error = '';
    vibrateHeavy();

    try {
      const { apiKey } = getApiKeyConfig();

      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          topic, 
          persona,
          userApiKey: apiKey
        })
      });

      // Update rate limit info from headers
      updateRateLimitFromHeaders(response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        
        // Special handling for rate limit errors
        if (response.status === 429) {
          throw new Error(errorData.message || 'Rate limit exceeded. Please use your own API key.');
        }

        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      explanation = data.explanation;
      vibrateSuccess();
      showSuccess('Persona explanation generated!');
    } catch (e) {
      error = e.message;
      vibrateError();
      showError(e.message || 'Failed to generate explanation');
    } finally {
      loading = false;
    }
  }
</script>

<div class="m3-container">
  <div class="m3-card">
    <h1 class="m3-display-small">Persona Mode</h1>

    <form on:submit|preventDefault={handleSubmit}>
      <div class="m3-text-field-container">
        <div class="m3-text-field">
          <input type="text" id="topic" bind:value={topic} required placeholder=" " />
          <label for="topic">Topic</label>
        </div>
      </div>

      <div class="m3-text-field-container">
        <div class="m3-select-container">
          <label for="persona" class="m3-select-label">Choose Persona</label>
          <select id="persona" bind:value={persona} class="m3-select">
            {#each personas as p}
              <option value={p.id}>{p.icon} {p.name}</option>
            {/each}
          </select>
          <div class="m3-select-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
              <path d="M480-360 280-560h400L480-360Z"/>
            </svg>
          </div>
        </div>
      </div>

      <button type="submit" class="m3-button-filled" use:ripple disabled={loading}>
        {#if loading}
          <svg class="m3-circular-progress" viewBox="0 0 48 48">
            <circle class="path" cx="24" cy="24" r="20" fill="none" stroke-width="4"></circle>
          </svg>
        {:else}
          Explain
        {/if}
      </button>
    </form>

    {#if explanation}
      <div class="m3-surface-variant output-area" class:loading-content={loading}>
        <h2 class="m3-headline-small">Explanation</h2>
        <div class="markdown-content">
          {@html formattedExplanation}
        </div>
      </div>
    {/if}

    {#if error}
      <div class="m3-error-message">
        <p>Error: {error}</p>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Reuse M3 Styles */
  .m3-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 80px 16px 16px 16px;
    background-color: var(--md-sys-color-background);
    box-sizing: border-box;
  }

  .m3-card {
    background-color: var(--md-sys-color-surface);
    border-radius: 28px;
    padding: 20px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
  }

  @media (min-width: 640px) {
    .m3-card {
      padding: 24px;
    }
  }

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
    font-size: 24px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface-variant);
    margin: 0 0 16px 0;
  }

  .m3-text-field-container {
    margin-bottom: 24px;
  }

  .m3-text-field {
    position: relative;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 12px;
    height: 56px;
    display: flex;
    align-items: center;
    transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
    background-color: transparent;
  }
  
  .m3-text-field:hover {
    background-color: rgba(103, 80, 164, 0.04);
    border-color: var(--md-sys-color-on-surface);
  }

  .m3-text-field:focus-within {
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
    background-color: transparent;
    box-shadow: 
      0 0 0 3px rgba(103, 80, 164, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.05);
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

  .m3-text-field input:focus + label,
  .m3-text-field input:not(:placeholder-shown) + label {
    top: 0;
    font-size: 12px;
    color: var(--md-sys-color-primary);
  }

  /* Select Styling - Modernized */
  .m3-select-container {
    position: relative;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 12px;
    height: 56px;
    display: flex;
    align-items: center;
    transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
    background-color: transparent;
    cursor: pointer;
  }
  
  .m3-select-container:hover {
    background-color: rgba(103, 80, 164, 0.04);
    border-color: var(--md-sys-color-on-surface);
  }

  .m3-select-container:focus-within {
    border-color: var(--md-sys-color-primary);
    border-width: 2px;
    background-color: transparent;
    box-shadow: 
      0 0 0 3px rgba(103, 80, 164, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .m3-select {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    padding: 0 16px;
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: var(--md-sys-typescale-body-large-size);
    color: var(--md-sys-color-on-surface);
    outline: none;
    appearance: none;
    z-index: 1;
    cursor: pointer;
  }

  .m3-select-label {
    position: absolute;
    top: 0;
    left: 16px;
    font-size: 12px;
    color: var(--md-sys-color-primary);
    background-color: var(--md-sys-color-surface);
    padding: 0 4px;
    transform: translateY(-50%);
    z-index: 2;
  }

  .m3-select-arrow {
    position: absolute;
    right: 16px;
    color: var(--md-sys-color-on-surface-variant);
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .m3-select-arrow svg {
    display: block;
  }

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
    opacity: 0.92;
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

  .m3-surface-variant {
    background-color: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
    border-radius: 12px;
    padding: 16px;
    margin-top: 24px;
    transition: opacity 0.2s ease;
  }
  
  .loading-content {
    opacity: 0.5;
  }

  .markdown-content :global(p) {
    margin-bottom: 1em;
    line-height: 1.5;
  }

  .m3-error-message {
    background-color: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
    padding: 16px;
    border-radius: 12px;
    margin-top: 24px;
  }

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
</style>
