
<script>
// @ts-nocheck


    import Papa from "papaparse";
    import { onMount } from "svelte";
    import TimeTrackingGraph from "./TimeTrackingGraph.svelte";
    import TimeTrackingChart from "./TimeTrackingChart.svelte";
    import { weekFromDate } from "./utils";

    const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS29qDku8zIhg1sqr0Q3yGn_v8BPwwAWLXm69zzjS9_VIXrX70qbCXojk6fgsLmpFT9SjZ-gMPNqtGL/pub?gid=0&single=true&output=csv";


    var timeData = $state([]);
    var currentWeek = $state(0);

    onMount(fetchTrackingData);

    async function fetchTrackingData() {
        const data = await fetch(SHEETS_URL);
        const csvText = await data.text();

        Papa.parse(csvText, { header: true, skipEmptyLines: true, delimiter: ",",
        transformHeader: (column) => {
            if (column == "Time (hours)") {
                return "Time";
            }
            return column;
        },
        transform: (value, column) => {
            if (column == "Time") {
                return parseFloat(value);
            }
            return value;
        }, complete: (results) => {
            loadTrackingData(results.data);
        } });
    }

    async function loadTrackingData(data) {
        timeData = data.sort((a, b) => Date.parse(b.Date) - Date.parse(a.Date));
        currentWeek = weekFromDate(Date.now());
        console.log(currentWeek)
    }

</script>

{#if timeData}

    <TimeTrackingChart data={timeData} currentWeek={currentWeek} />
    
    
    <TimeTrackingGraph data={timeData} currentWeek={currentWeek} />
{:else}
    <div>Loading...</div>
{/if}