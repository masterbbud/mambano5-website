
<script>
// @ts-nocheck


    import Papa from "papaparse";
    import { onMount } from "svelte";
    import TimeTrackingGraph from "./TimeTrackingGraph.svelte";

    const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS29qDku8zIhg1sqr0Q3yGn_v8BPwwAWLXm69zzjS9_VIXrX70qbCXojk6fgsLmpFT9SjZ-gMPNqtGL/pub?gid=0&single=true&output=csv";

    const props = $props();
    const week = props.week;

    var timeData = $state([]);
    var selectedUser = $state("");
    var selectedUserData = $state([]);

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
        timeData = data;
    }

    function selectUser(user) {
        console.log(`Viewing ${user}`)
        selectedUser = user;
        selectedUserData = timeData.filter(e => e.Name == user);
    }

</script>

<div>This is a time tracking table. Week: {week}</div>
{#if timeData}
    <span>Select a user to view their time data: </span>
    <select onchange={evt => selectUser(evt.target.value)}>
        <option value=""></option>
        <option value="Anthony">Anthony</option>
        <option value="Brandon">Brandon</option>
        <option value="Catie">Catie</option>
        <option value="Danny">Danny</option>
        <option value="Ivan">Ivan</option>
    </select>
    {#if selectedUser}
        <TimeTrackingGraph name={selectedUser} data={selectedUserData} />
    {/if}
{:else}
    <div>Loading...</div>
{/if}