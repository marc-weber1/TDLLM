<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
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

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

  <section class="col-span-full">
  <span>Test Code</span>
    <!-- <CodeMirror bind:value={$test_code_clitab} lang={javascript()} /> -->
    <MonacoEditor bind:code={$test_code_clitab} lang="javascript" />
  </section>
  <section class="col-span-full">
    <label class="label">
      <span>Prompt</span>
      <textarea bind:value={$prompt_clitab} class="textarea" rows="4" />
    </label>
  </section>
  <section class="col-span-full text-center">
    <button class="btn btn-lg variant-filled-primary font-bold justify-center" disabled={loading}
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
  </section>

  <section class="col-span-full">
    <span>Generated Code</span>
    <CodeMirror bind:value={$generated_code_clitab} readonly lang={javascript()} />
    <!-- <MonacoEditor bind:code={$generated_code_clitab} lang="javascript" readOnly /> -->
  </section>
  <section>
    <label class="label">
      <span>STDOUT</span>
      <textarea bind:value={$stdout_clitab} class="textarea" rows="4" readonly />
    </label>
  </section>
  <section>
    <label class="label">
      <span>STDERR</span>
      <textarea bind:value={$stderr_clitab} class="textarea" rows="4" readonly />
    </label>
  </section>
  <section>
    Exit code: {$exit_code_clitab}
  </section>
  <section>
    Iterations: {$iterations_clitab}
  </section>

</div>