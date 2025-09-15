
<script>
// @ts-nocheck


    import Papa from "papaparse";
    import { onMount } from "svelte";
    import TimeTrackingGraph from "./TimeTrackingGraph.svelte";
    import TimeTrackingChart from "./TimeTrackingChart.svelte";
    import { weekFromDate } from "./utils";

    const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS29qDku8zIhg1sqr0Q3yGn_v8BPwwAWLXm69zzjS9_VIXrX70qbCXojk6fgsLmpFT9SjZ-gMPNqtGL/pub?gid=0&single=true&output=csv";

    const props = $props();
    const week = props.week;

    var timeData = $state([]);
    var selectedUser = $state("");
    var selectedUserData = $state([]);
    var currentWeek = $state(0);
    var selectedWeek = $state(-1);
    var selectedChartMode = $state("week");

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

    function selectUser(user) {
        console.log(`Viewing ${user}`)
        selectedUser = user;
        refreshSelectedUserData();
    }

    function selectWeek(week) {
        if (week == "") {
            selectedWeek = -1;
        } else {
            selectedWeek = week;
        }
        refreshSelectedUserData();
    }

    function selectChartMode(mode) {
        selectedChartMode = mode;
    }

    function refreshSelectedUserData() {
        selectedUserData = timeData.filter(e => e.Name == selectedUser);
        if (selectedWeek >= 0) {
            selectedUserData = selectedUserData.filter(e => weekFromDate(Date.parse(e.Date)) == selectedWeek);
        }
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
    <span>Graph Week: </span>
    <select onchange={evt => selectWeek(evt.target.value)}>
        <option value="">All</option>
        {#each { length: currentWeek + 1 }, week}
            <option value={week}>Week {week}</option>
        {/each}
    </select>
    <span>Chart Mode: </span>
    <select onchange={evt => selectChartMode(evt.target.value)}>
        <option value="week">Weeks</option>
        <option value="day">Days</option>
        <option value="cumulative">Cumulative</option>
        <option value="combined">Combined (Team)</option>
    </select>
    {#if selectedUser}
        <TimeTrackingGraph name={selectedUser} data={selectedUserData} />
    {/if}
    <TimeTrackingChart mode={selectedChartMode} data={timeData} currentWeek={currentWeek} />
{:else}
    <div>Loading...</div>
{/if}