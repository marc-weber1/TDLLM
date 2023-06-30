<script lang="ts">
  import loader from "@monaco-editor/loader";
  import { onDestroy, onMount } from "svelte";
  import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
  import { AutoTypings, LocalStorageCache } from "monaco-editor-auto-typings/custom-editor";

  let editor: Monaco.editor.IStandaloneCodeEditor;
  let monaco: typeof Monaco;
  let editorContainer: HTMLElement;
  let model: Monaco.editor.ITextModel;

  export let code = "// Loading...";
  export let lang = "javascript";
  export let autoTypings = false;
  export let readOnly = false;

  const loadCode = (code: string, language: string) => {
    model = monaco.editor.createModel(code, language);

    editor.setModel(model);
  };

  onMount(async () => {
    const monacoEditor = await import("monaco-editor");
    loader.config({ monaco: monacoEditor.default });

    monaco = await loader.init(); // monaco is now available

    editor = monaco.editor.create(editorContainer, {
      theme: "vs-dark",
      automaticLayout: true,
      readOnly,
    });

    editor.onDidChangeModelContent(() => (code = editor.getValue()));

    if (autoTypings) {
      await AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
        preloadPackages: true,
        onUpdate(_update, textual) {
          console.log(textual);
        },
        versions: {
          "@types/node": "18",
        },
        monaco,
      });
    }

    loadCode(code, lang);
  });

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
  });
</script>

<div id="monaco-container">
  <div style="flex-grow: 1;" bind:this={editorContainer} />
</div>

<style>
  #monaco-container {
    height: 30em;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
