<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { ripple } from '$lib/actions/ripple.js';

  let visible = $state(false);
  let currentStep = $state(0);
  let dontShowAgain = $state(false);

  const steps = [
    {
      title: "Welcome to ELI-X",
      description: "Complex topics, simplified for any age.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 -960 960 960" width="64" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
    },
    {
      title: "Explain Mode",
      description: "Get simple explanations for any topic at any age level (1-100).",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 -960 960 960" width="64" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
    },
    {
      title: "Versus Mode",
      description: "Compare explanations for two different ages side-by-side.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 -960 960 960" width="64" fill="currentColor"><path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-320q66 0 113-47t47-113v-160h-320v160q0 66 47 113t113 47Zm0 400q-100 0-170-70t-70-170v-160q0-100 70-170t170-70q100 0 170 70t170 170v160q0 100-70 170t-170 70Z"/></svg>`
    },
    {
      title: "Persona Mode",
      description: "Hear explanations from unique characters like Caveman, Shakespeare, or Gen Z.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 -960 960 960" width="64" fill="currentColor"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-32q0-34 17.5-62.5T224-304q85-36 173.5-56T560-380q20 0 38 1.5t36 4.5q-14 11-25 24.5t-19 29.5q-28-5-55-7.5t-55-2.5q-76 0-146 19t-134 50v20h302q14 22 33 40t43 32H160Zm560 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Z"/></svg>`
    },
    {
      title: "Battle Mode",
      description: "Watch personas debate from opposing viewpoints.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 -960 960 960" width="64" fill="currentColor"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-400l80-80v480h-80Zm160 0v-560l80-80v640h-80Zm160 0v-720l80-80v800h-80Z"/></svg>`
    },
    {
      title: "Settings & Customization",
      description: "Add your own API key for unlimited usage and choose between Light, Dark, or AMOLED themes.",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 -960 960 960" width="64" fill="currentColor"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`
    }
  ];

  onMount(() => {
    const seen = localStorage.getItem('elix_intro_seen');
    if (!seen) {
      visible = true;
    }
  });

  function handleNext() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      handleFinish();
    }
  }

  function handleFinish() {
    if (dontShowAgain) {
      localStorage.setItem('elix_intro_seen', 'true');
    }
    visible = false;
  }
</script>

{#if visible}
  <div class="splash-backdrop" transition:fade={{ duration: 300 }}>
    <div class="splash-card" transition:fly={{ y: 20, duration: 400 }}>
      <div class="splash-content">
        {#key currentStep}
          <div class="step-content" in:fly={{ x: 20, duration: 300, delay: 150 }} out:fly={{ x: -20, duration: 150 }}>
            <div class="icon-container">
              {@html steps[currentStep].icon}
            </div>
            <h2 class="m3-headline-medium">{steps[currentStep].title}</h2>
            <p class="m3-body-large">{steps[currentStep].description}</p>
          </div>
        {/key}
      </div>

      <div class="splash-footer">
        <div class="indicators">
          {#each steps as _, i}
            <div class="indicator" class:active={i === currentStep}></div>
          {/each}
        </div>

        <div class="controls">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={dontShowAgain} />
            <span class="m3-body-small">Don't show again</span>
          </label>
          
          <button 
            class="m3-button filled-button" 
            onclick={handleNext}
            use:ripple
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .splash-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .splash-card {
    background-color: var(--md-sys-color-surface);
    border-radius: 28px;
    width: 100%;
    max-width: 400px;
    padding: 32px;
    box-shadow: 
      0px 8px 16px rgba(0, 0, 0, 0.2),
      0px 4px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: relative;
    overflow: hidden;
  }

  .splash-content {
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .step-content {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .icon-container {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .m3-headline-medium {
    font-family: var(--md-sys-typescale-headline-medium-font);
    font-size: 24px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    margin: 0;
  }

  .m3-body-large {
    font-family: var(--md-sys-typescale-body-large-font);
    font-size: 16px;
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
    line-height: 1.5;
  }

  .splash-footer {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--md-sys-color-surface-variant);
    transition: all var(--transition-fast);
  }

  .indicator.active {
    background-color: var(--md-sys-color-primary);
    width: 24px;
    border-radius: 4px;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .m3-body-small {
    font-family: var(--md-sys-typescale-body-small-font);
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .m3-button {
    padding: 10px 24px;
    border-radius: 20px;
    border: none;
    font-family: var(--md-sys-typescale-label-large-font);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .filled-button {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .filled-button:hover {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }

  .filled-button:active {
    transform: scale(0.96);
  }
</style>
