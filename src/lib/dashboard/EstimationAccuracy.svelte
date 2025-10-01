
<script>
// @ts-nocheck


    import Papa from "papaparse";
    import { onMount } from "svelte";
    import EstimationAccuracyChart from "./EstimationAccuracyChart.svelte";
    import { weekFromDate } from "./utils";

    const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-MriRUo-IH3ZAXz3iobz-zUwjFrOFPuavbZKYIbSzPpN-wbPXxHckvFao42JwgzKlJniqP3brOWFJ/pub?gid=0&single=true&output=csv";


    var estimationData = $state([]);
    var currentSprint = $state(0);

    onMount(fetchMetricData);

    async function fetchMetricData() {
        const data = await fetch(SHEETS_URL);
        const csvText = await data.text();

        Papa.parse(csvText, { header: true, skipEmptyLines: true, delimiter: ",",
        transform: (value, column) => {
            return parseFloat(value);
        }, complete: (results) => {
            loadMetricData(results.data);
        } });
    }

    async function loadMetricData(data) {
        estimationData = data.sort((a, b) => a.Week - b.Week);
        currentSprint = Math.floor(weekFromDate(Date.now()) / 2) - 1 + 5;
    }

</script>

{#if estimationData}

    <EstimationAccuracyChart data={estimationData} currentSprint={currentSprint} />
{:else}
    <div>Loading...</div>
{/if}