<script lang="ts">
  // import CodeMirror from "svelte-codemirror-editor";
  // import { javascript } from "@codemirror/lang-javascript";
  import { generate_api } from "$lib/TDLLMBackend";
  import {
    test_code_apitab,
    prompt_apitab,
    generated_code_apitab,
    server_stdout_apitab,
    server_stderr_apitab,
    server_exit_code_apitab,
    test_stdout_apitab,
    test_stderr_apitab,
    test_exit_code_apitab,
    iterations_apitab,
  } from "$lib/stores";
  import MonacoEditor from "../components/MonacoEditor.svelte";

  let loading: boolean = false;
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

  <section class="col-span-full">
    <span>Test Code</span>
    <!-- <CodeMirror bind:value={$test_code_apitab} lang={javascript()} /> -->
    <MonacoEditor bind:code={$test_code_apitab} lang="javascript" />
  </section>
  <section class="col-span-full">
    <label class="label">
      <span>Prompt</span>
      <textarea bind:value={$prompt_apitab} class="textarea" rows="4" />
    </label>
  </section>
  <section class="col-span-full text-center">
    <button class="btn btn-lg variant-filled-primary font-bold justify-center" disabled={loading}
      on:click={async () => {
        loading = true;
        var resp = await generate_api($test_code_apitab, $prompt_apitab);
        loading = false;
        generated_code_apitab.set(resp.code);
        server_stdout_apitab.set(resp.server_info.stdout);
        server_stderr_apitab.set(resp.server_info.stderr);
        server_exit_code_apitab.set(resp.server_info.exit_code);
        test_stdout_apitab.set(resp.test_info.stdout);
        test_stderr_apitab.set(resp.test_info.stderr);
        test_exit_code_apitab.set(resp.test_info.exit_code);
        iterations_apitab.set(resp.iterations);
      }}>Generate</button>
  </section>

  <section class="col-span-full">
    <span>Generated Code</span>
    <!-- <CodeMirror bind:value={$generated_code_apitab} readonly lang={javascript()} /> -->
    <MonacoEditor bind:code={$generated_code_apitab} lang="javascript" readOnly />
    </section>
  <section>
    <label class="label">
      <span>STDOUT</span>
      <textarea bind:value={$server_stdout_apitab} class="textarea" rows="4" readonly />
    </label>
  </section>
  <section>
    <label class="label">
      <span>STDERR</span>
      <textarea bind:value={$server_stderr_apitab} class="textarea" rows="4" readonly />
    </label>
  </section>
  <section class="col-span-full">
    Exit code: {$server_exit_code_apitab}
  </section>
  <section>
  <label class="label">
    <span>STDOUT</span>
    <textarea bind:value={$test_stdout_apitab} class="textarea" rows="4" readonly />
  </label>
  </section>
  <section>
    <label class="label">
      <span>STDERR</span>
      <textarea bind:value={$test_stderr_apitab} class="textarea" rows="4" readonly />
    </label>
  </section>
  <section class="col-span-full">
    Exit code: {$test_exit_code_apitab}
  </section>
  <section class="col-span-full">
    Iterations: {$iterations_apitab}
  </section>

</div>