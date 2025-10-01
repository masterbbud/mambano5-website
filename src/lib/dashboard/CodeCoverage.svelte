
<script>
// @ts-nocheck


    import Papa from "papaparse";
    import { onMount } from "svelte";
    import CodeCoverageChart from "./CodeCoverageChart.svelte";
    import { weekFromDate } from "./utils";

    const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-MriRUo-IH3ZAXz3iobz-zUwjFrOFPuavbZKYIbSzPpN-wbPXxHckvFao42JwgzKlJniqP3brOWFJ/pub?gid=2123867650&single=true&output=csv";


    var coverageData = $state([]);
    var currentSprint = $state(0);

    onMount(fetchMetricData);

    async function fetchMetricData() {
        const data = await fetch(SHEETS_URL);
        const csvText = await data.text();

        Papa.parse(csvText, { header: true, skipEmptyLines: true, delimiter: ",",
        transformHeader: (column) => {
            if (column == "Code Coverage (Total)") {
                return "Total";
            }
            return column;
        },
        transform: (value, column) => {
            return parseFloat(value);
        }, complete: (results) => {
            loadMetricData(results.data);
        } });
    }

    async function loadMetricData(data) {
        coverageData = data.sort((a, b) => a.Week - b.Week);
        currentSprint = Math.floor(weekFromDate(Date.now()) / 2) - 1 + 5;
    }

</script>

{#if coverageData}

    <CodeCoverageChart data={coverageData} currentSprint={currentSprint} />
{:else}
    <div>Loading...</div>
{/if}