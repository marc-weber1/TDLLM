<script>
	import Tab1 from "../pages/Run.svelte";
	import Tab2 from "../pages/CLI.svelte";
	import Tab3 from "../pages/API.svelte";
  import Tabs from "../components/Tabs.svelte";

  // List of tab items with labels, values and assigned components
  let items = [
    { label: "Run",
		 value: 1,
		 component: Tab1
		},
    { label: "CLI",
		 value: 2,
		 component: Tab2
		},
    { label: "API",
		 value: 3,
		 component: Tab3
		}
  ];
</script>

<Tabs {items} />