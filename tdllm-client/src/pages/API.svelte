<script lang="ts">
    import CodeMirror from "svelte-codemirror-editor";
    import { javascript } from "@codemirror/lang-javascript";
    import { generate_api } from "$lib/TDLLMBackend";
    import { test_code_apitab, prompt_apitab, generated_code_apitab, server_stdout_apitab, server_stderr_apitab, server_exit_code_apitab, test_stdout_apitab, test_stderr_apitab, test_exit_code_apitab, iterations_apitab } from "$lib/stores";
</script>

<CodeMirror bind:value={$test_code_apitab} lang={javascript()} />
<textarea bind:value={$prompt_apitab} />
<br />
<button on:click={async () => {
    var resp = await generate_api($test_code_apitab, $prompt_apitab);
    generated_code_apitab.set(resp.code);
    server_stdout_apitab.set(resp.server_info.stdout);
    server_stderr_apitab.set(resp.server_info.stderr);
    server_exit_code_apitab.set(resp.server_info.exit_code);
    test_stdout_apitab.set(resp.test_info.stdout);
    test_stderr_apitab.set(resp.test_info.stderr);
    test_exit_code_apitab.set(resp.test_info.exit_code);
    iterations_apitab.set(resp.iterations);
}}>Generate</button>
<br />
<CodeMirror bind:value={$generated_code_apitab} readonly lang={javascript()} />
<br />
<textarea bind:value={$server_stdout_apitab} readonly/>
<textarea bind:value={$server_stderr_apitab} readonly/>
Exit code: {$server_exit_code_apitab}
<br />
<textarea bind:value={$test_stdout_apitab} readonly/>
<textarea bind:value={$test_stderr_apitab} readonly/>
Exit code: {$test_exit_code_apitab}
<br />
Iterations: {$iterations_apitab}