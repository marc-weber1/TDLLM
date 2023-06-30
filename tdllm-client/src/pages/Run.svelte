<script lang="ts">
  // import CodeMirror from "svelte-codemirror-editor";
  // import { javascript } from "@codemirror/lang-javascript";
  import { run } from "$lib/TDLLMBackend";
  import MonacoEditor from "../components/MonacoEditor.svelte";
  import { code_runtab, stdout_runtab, stderr_runtab, exit_code_runtab } from "$lib/stores";

  let loading: boolean = false;
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

  <section class="col-span-full">
    <span>Code</span>
    <!-- <CodeMirror bind:value={$code_runtab} lang={javascript()} /> -->
    <MonacoEditor bind:code={$code_runtab} />
  </section>
  <section class="col-span-full text-center">
    <button class="btn btn-lg variant-filled-primary font-bold" disabled={loading}
      on:click={async () => {
        loading = true;
        var resp = await run($code_runtab);
        loading = false;
        stdout_runtab.set(resp.stdout);
        stderr_runtab.set(resp.stderr);
        exit_code_runtab.set(resp.exit_code);
      }}>Run</button>
  </section>

  <section>
    <label class="label">
      <span>STDOUT</span>
      <textarea bind:value={$stdout_runtab} class="textarea" rows="4" readonly />
    </label>
  </section>
  <section>
    <label class="label">
      <span>STDERR</span>
      <textarea bind:value={$stderr_runtab} class="textarea" rows="4" readonly />
    </label>
  </section>
  <section class="col-span-full">
    Exit code: {$exit_code_runtab}
  </section>

</div>