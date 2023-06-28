<script lang="ts">
  // import CodeMirror from "svelte-codemirror-editor";
  // import { javascript } from "@codemirror/lang-javascript";
  import { run } from "$lib/TDLLMBackend";
  import MonacoEditor from "../components/MonacoEditor.svelte";
  import { code_runtab, stdout_runtab, stderr_runtab, exit_code_runtab } from "$lib/stores";
</script>

<!-- <CodeMirror bind:value={$code_runtab} lang={javascript()} /> -->
<MonacoEditor bind:code={$code_runtab} />
<button
  on:click={async () => {
    var resp = await run($code_runtab);
    stdout_runtab.set(resp.stdout);
    stderr_runtab.set(resp.stderr);
    exit_code_runtab.set(resp.exit_code);
  }}>Run</button>
<br />
<textarea bind:value={$stdout_runtab} readonly />
<textarea bind:value={$stderr_runtab} readonly />
Exit code: {$exit_code_runtab}
