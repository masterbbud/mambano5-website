
<script>

    const { name, data } = $props();

</script>

<div>This is a time tracking graph for {name}</div>
<div class="table">
    <div class="row">
        <div>Date</div>
        <div>Time</div>
    </div>
    {#each data as timeEntry}
        <div class="row">
            <div>{timeEntry.Date.toString()}</div>
            <div>{timeEntry.Time}</div>
        </div>
    {/each}
</div>