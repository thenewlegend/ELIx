<script lang="ts">
  let topic: string = '';
  let age: number = 5;
  let explanation: string = '';
  let loading: boolean = false;
  let error: string = '';

  async function handleSubmit() {
    loading = true;
    error = '';
    explanation = '';

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic, age })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      explanation = data.explanation;
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="eli-x-container">
  <h1>Explain Like I am X</h1>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="topic">Topic:</label>
      <input type="text" id="topic" bind:value={topic} required />
    </div>

    <div class="form-group">
      <label for="age">Explain Like I am:</label>
      <input type="number" id="age" bind:value={age} min="1" max="100" required />
    </div>

    <button type="submit" disabled={loading}>
      {#if loading}
        Loading...
      {:else}
        Send
      {/if}
    </button>
  </form>

  {#if explanation}
    <div class="output-area">
      <h2>Explanation:</h2>
      <p>{explanation}</p>
    </div>
  {/if}

  {#if error}
    <div class="error-message">
      <p>Error: {error}</p>
    </div>
  {/if}
</div>

<style>
  .eli-x-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }

  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #0056b3;
  }

  .output-area {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 4px;
  }

  .output-area h2 {
    color: #333;
    margin-top: 0;
  }

  .output-area p {
    color: #666;
    line-height: 1.6;
  }

  .error-message {
    margin-top: 20px;
    padding: 10px;
    background-color: #ffe0e0;
    border: 1px solid #ff0000;
    border-radius: 4px;
    color: #ff0000;
  }
</style>