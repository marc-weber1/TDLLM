<script lang="ts">
  import RunTab from "../pages/Run.svelte";
  import CLITab from "../pages/CLI.svelte";
  import APITab from "../pages/API.svelte";
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';

  let tabSet: number = 0;
</script>

<TabGroup>
  <Tab bind:group={tabSet} name="tab1" value={0}>Run</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>CLI</Tab>
	<Tab bind:group={tabSet} name="tab3" value={2}>API</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<RunTab />
		{:else if tabSet === 1}
			<CLITab />
		{:else if tabSet === 2}
			<APITab />
		{/if}
	</svelte:fragment>
</TabGroup>
