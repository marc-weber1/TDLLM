<script lang="ts">
  // import CodeMirror from "svelte-codemirror-editor";
  // import { javascript } from "@codemirror/lang-javascript";
  import { generate_cli } from "$lib/TDLLMBackend";
  import {
    test_code_clitab,
    prompt_clitab,
    generated_code_clitab,
    stdout_clitab,
    stderr_clitab,
    exit_code_clitab,
    iterations_clitab,
  } from "$lib/stores";
  import MonacoEditor from "../components/MonacoEditor.svelte";

  let loading: boolean = false;
</script>

<span>Test Code</span>
<!-- <CodeMirror bind:value={$test_code_clitab} lang={javascript()} /> -->
<MonacoEditor bind:code={$test_code_clitab} lang="javascript" />
<label class="label">
	<span>Prompt</span>
  <textarea bind:value={$prompt_clitab} class="textarea" rows="4" />
</label>
<button class="btn variant-filled" disabled={loading}
  on:click={async () => {
    loading = true;
    var resp = await generate_cli($test_code_clitab, $prompt_clitab);
    loading = false;
    generated_code_clitab.set(resp.code);
    stdout_clitab.set(resp.test_info.stdout);
    stderr_clitab.set(resp.test_info.stderr);
    exit_code_clitab.set(resp.test_info.exit_code);
    iterations_clitab.set(resp.iterations);
  }}>Generate</button>

<!-- <CodeMirror bind:value={$generated_code_clitab} readonly lang={javascript()} /> -->
<MonacoEditor bind:code={$generated_code_clitab} lang="javascript" readOnly />
<label class="label">
	<span>STDOUT</span>
  <textarea bind:value={$stdout_clitab} class="textarea" rows="4" readonly />
</label>
<label class="label">
	<span>STDERR</span>
  <textarea bind:value={$stderr_clitab} class="textarea" rows="4" readonly />
</label>
Exit code: {$exit_code_clitab}
Iterations: {$iterations_clitab}
