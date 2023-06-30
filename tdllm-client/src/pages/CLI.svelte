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
</script>

<!-- <CodeMirror bind:value={$test_code_clitab} lang={javascript()} /> -->
<MonacoEditor bind:code={$test_code_clitab} lang="javascript" />
<textarea bind:value={$prompt_clitab} />
<br />
<button
  on:click={async () => {
    var resp = await generate_cli($test_code_clitab, $prompt_clitab);
    generated_code_clitab.set(resp.code);
    stdout_clitab.set(resp.test_info.stdout);
    stderr_clitab.set(resp.test_info.stderr);
    exit_code_clitab.set(resp.test_info.exit_code);
    iterations_clitab.set(resp.iterations);
  }}>Generate</button>
<br />
<!-- <CodeMirror bind:value={$generated_code_clitab} readonly lang={javascript()} /> -->
<MonacoEditor bind:code={$generated_code_clitab} lang="javascript" readOnly />

<br />
<textarea bind:value={$stdout_clitab} readonly />
<textarea bind:value={$stderr_clitab} readonly />
Exit code: {$exit_code_clitab}
<br />
Iterations: {$iterations_clitab}
