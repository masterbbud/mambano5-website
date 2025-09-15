
<script>
// @ts-nocheck

    import { weekFromDate } from "./utils";


    const { data, currentWeek } = $props();
    
    var selectedUser = $state("");
    var selectedUserData = $state([]);
    var selectedWeek = $state(-1);

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
    
    function refreshSelectedUserData() {
        selectedUserData = data.filter(e => e.Name == selectedUser);
        if (selectedWeek >= 0) {
            selectedUserData = selectedUserData.filter(e => weekFromDate(Date.parse(e.Date)) == selectedWeek);
        }
    }

</script>

<div class="p-4 pb-0">
    <span class="pr-2">View time data for: </span>
    <select onchange={evt => selectUser(evt.target.value)}>
        <option value=""></option>
        <option value="Anthony">Anthony</option>
        <option value="Brandon">Brandon</option>
        <option value="Catie">Catie</option>
        <option value="Danny">Danny</option>
        <option value="Ivan">Ivan</option>
    </select>
    <span> during </span>
    <select onchange={evt => selectWeek(evt.target.value)}>
        <option value="">All Weeks</option>
        {#each { length: currentWeek + 1 }, week}
            <option value={week}>Week {week}</option>
        {/each}
    </select>

</div>
{#if selectedUser}
    <div class="flex flex-col w-full p-4">
        <div class="grid grid-cols-8">
            <div class="border-1 border-gray-800 p-0.5 pl-1 col-span-2 font-semibold bg-slate-300">Date</div>
            <div class="border-1 border-gray-800 p-0.5 pl-1 col-span-1 font-semibold bg-slate-300">Time</div>
            <div class="border-1 border-gray-800 p-0.5 pl-1 col-span-5 font-semibold bg-slate-300">Description</div>
        </div>
        {#each selectedUserData as timeEntry}
            <div class="grid grid-cols-8">
                <div class="border-1 border-gray-800 p-0.5 pl-1 col-span-2">{timeEntry.Date.toString()}</div>
                <div class="border-1 border-gray-800 p-0.5 pl-1 col-span-1">{timeEntry.Time}</div>
                <div class="border-1 border-gray-800 p-0.5 pl-1 col-span-5">{timeEntry.Description}</div>
            </div>
        {/each}
    </div>
{:else}
    <div class="w-full text-center pt-8 pb-8 text-xl font-semibold">You must select a user to view their entries!</div>
{/if}