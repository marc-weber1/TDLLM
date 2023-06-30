<script lang="ts">
  // import CodeMirror from "svelte-codemirror-editor";
  // import { javascript } from "@codemirror/lang-javascript";
  import { run } from "$lib/TDLLMBackend";
  import MonacoEditor from "../components/MonacoEditor.svelte";
  import { code_runtab, stdout_runtab, stderr_runtab, exit_code_runtab } from "$lib/stores";

  let loading: boolean = false;
</script>

<span>Test Code</span>
<!-- <CodeMirror bind:value={$code_runtab} lang={javascript()} /> -->
<MonacoEditor bind:code={$code_runtab} />
<button class="btn variant-filled" disabled={loading}
  on:click={async () => {
    loading = true;
    var resp = await run($code_runtab);
    loading = false;
    stdout_runtab.set(resp.stdout);
    stderr_runtab.set(resp.stderr);
    exit_code_runtab.set(resp.exit_code);
  }}>Run</button>

<label class="label">
	<span>STDOUT</span>
  <textarea bind:value={$stdout_runtab} class="textarea" rows="4" readonly />
</label>
<label class="label">
	<span>STDERR</span>
  <textarea bind:value={$stderr_runtab} class="textarea" rows="4" readonly />
</label>
Exit code: {$exit_code_runtab}
