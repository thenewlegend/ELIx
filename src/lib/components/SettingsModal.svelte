<script>
  import { userApiKey, useUserKey } from '$lib/stores/apiKey.js';
  import { toasts } from '$lib/stores/toast.js';
  import { ripple } from '$lib/actions/ripple.js';
  
  let { isOpen = $bindable(false) } = $props();
  
  let localKey = $state('');
  let localUseKey = $state(false);
  let validating = $state(false);
  
  // Initialize from store
  $effect(() => {
    localKey = $userApiKey;
    localUseKey = $useUserKey;
  });
  
  async function handleSave() {
    if (localUseKey && !localKey.trim()) {
      toasts.error('Please enter an API key or disable "Use my API key"');
      return;
    }

    if (localUseKey) {
      validating = true;
      try {
        const response = await fetch('/api/validate-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: localKey.trim() })
        });
        
        const data = await response.json();
        
        if (!data.valid) {
          toasts.error('Invalid API Key. Please check and try again.');
          validating = false;
          return;
        }
      } catch (e) {
        toasts.error('Failed to validate API key.');
        validating = false;
        return;
      } finally {
        validating = false;
      }
    }
    
    userApiKey.set(localKey.trim());
    useUserKey.set(localUseKey);
    
    if (localUseKey) {
      toasts.success('Your API key has been verified and saved!');
    } else {
      toasts.success('Settings saved. Using default API key.');
    }
    
    isOpen = false;
  }
  
  function handleClear() {
    localKey = '';
    localUseKey = false;
    userApiKey.set('');
    useUserKey.set(false);
    toasts.success('API key cleared');
  }
  
  function handleClose() {
    isOpen = false;
  }
  
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={handleBackdropClick} role="presentation">
    <div class="modal-dialog" role="dialog" aria-labelledby="settings-title" aria-modal="true">
      <div class="modal-header">
        <h2 id="settings-title" class="m3-headline-medium">API Key Settings</h2>
        <button 
          class="close-button" 
          onclick={handleClose}
          aria-label="Close settings"
          use:ripple
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-content">
        <div class="info-banner">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
          </svg>
          <div>
            <p class="m3-body-medium"><strong>Rate Limit:</strong> 10 queries per 15 minutes when using the default API key.</p>
            <p class="m3-body-small">Use your own API key for unlimited queries.</p>
          </div>
        </div>
        
        <div class="toggle-section">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              bind:checked={localUseKey}
              class="toggle-input"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text m3-body-large">Use my own API key</span>
          </label>
        </div>
        
        {#if localUseKey}
          <div class="input-section">
            <label for="api-key-input" class="m3-label-large">Your Gemini API Key</label>
            <input 
              id="api-key-input"
              type="password" 
              bind:value={localKey}
              placeholder="Enter your API key"
              class="m3-input"
            />
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              class="api-link m3-body-small"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
              </svg>
              Get your API key from Google AI Studio
            </a>
          </div>
        {/if}
      </div>
      
      <div class="modal-footer">
        {#if localKey}
          <button 
            class="m3-button text-button" 
            onclick={handleClear}
            use:ripple
          >
            Clear Key
          </button>
        {/if}
        <div class="spacer"></div>
        <button 
          class="m3-button text-button" 
          onclick={handleClose}
          use:ripple
        >
          Cancel
        </button>
        <button 
          class="m3-button filled-button" 
          onclick={handleSave}
          use:ripple
          disabled={validating}
        >
          {#if validating}
            Validating...
          {:else}
            Save
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    padding: 16px;
    animation: fadeIn 0.2s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal-dialog {
    background-color: var(--md-sys-color-surface);
    border-radius: 28px;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 
      0px 8px 16px rgba(0, 0, 0, 0.2),
      0px 4px 8px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease-out;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 16px 24px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }
  
  .m3-headline-medium {
    font-family: var(--md-sys-typescale-headline-medium-font);
    font-size: 24px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    margin: 0;
  }
  
  .close-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background-color: transparent;
    color: var(--md-sys-color-on-surface-variant);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-fast);
    position: relative;
    overflow: hidden;
  }
  
  .close-button:hover {
    background-color: var(--md-sys-color-surface-variant);
  }
  
  .modal-content {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
  
  .info-banner {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    padding: 16px;
    border-radius: 12px;
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .info-banner svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .m3-body-medium {
    font-family: var(--md-sys-typescale-body-medium-font);
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 4px 0;
  }
  
  .m3-body-small {
    font-family: var(--md-sys-typescale-body-small-font);
    font-size: 12px;
    line-height: 1.4;
    margin: 0;
    opacity: 0.8;
  }
  
  .toggle-section {
    margin-bottom: 24px;
  }
  
  .toggle-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
  }
  
  .toggle-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: relative;
    width: 52px;
    height: 32px;
    background-color: var(--md-sys-color-surface-variant);
    border-radius: 16px;
    transition: background-color var(--transition-normal);
    border: 2px solid var(--md-sys-color-outline);
  }
  
  .toggle-slider::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--md-sys-color-outline);
    top: 50%;
    left: 6px;
    transform: translateY(-50%);
    transition: all var(--transition-normal);
  }
  
  .toggle-input:checked + .toggle-slider {
    background-color: var(--md-sys-color-primary);
    border-color: var(--md-sys-color-primary);
  }
  
  .toggle-input:checked + .toggle-slider::before {
    background-color: var(--md-sys-color-on-primary);
    left: 26px;
    width: 20px;
    height: 20px;
  }
  
  .toggle-text {
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: 16px;
    color: var(--md-sys-color-on-surface);
  }
  
  .input-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .m3-label-large {
    font-family: var(--md-sys-typescale-label-large-font);
    font-size: 14px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
  }
  
  .m3-input {
    width: 100%;
    padding: 16px;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: 12px;
    background-color: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: 16px;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    box-sizing: border-box;
  }
  
  .m3-input:focus {
    outline: none;
    border-color: var(--md-sys-color-primary);
    box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
  }
  
  .api-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--md-sys-color-primary);
    text-decoration: none;
    transition: opacity var(--transition-fast);
  }
  
  .api-link:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  
  .modal-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px 24px 24px;
    border-top: 1px solid var(--md-sys-color-outline-variant);
  }
  
  .spacer {
    flex: 1;
  }
  
  .m3-button {
    padding: 10px 24px;
    border-radius: 20px;
    border: none;
    font-family: var(--md-sys-typescale-label-large-font);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color var(--transition-fast), 
                box-shadow var(--transition-fast),
                transform var(--transition-fast);
    position: relative;
    overflow: hidden;
  }
  
  .text-button {
    background-color: transparent;
    color: var(--md-sys-color-primary);
  }
  
  .text-button:hover {
    background-color: rgba(103, 80, 164, 0.08);
  }
  
  .filled-button {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .filled-button:hover {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .m3-button:active {
    transform: scale(0.96);
  }
  
  @media (max-width: 640px) {
    .modal-dialog {
      border-radius: 28px 28px 0 0;
      max-height: 95vh;
      align-self: flex-end;
    }
    
    .modal-header,
    .modal-content,
    .modal-footer {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
</style>
