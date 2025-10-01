
<script>
// @ts-nocheck


    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import { dayFromDate, weekFromDate, submoduleToColor} from './utils';

    const { data, currentSprint } = $props();

    let ctx;
    let chartCanvas;
    let chartRef;

    let barsCtx;
    let barsCanvas;
    let barsRef;

    $effect(() => {
        if (currentSprint && data) {
            refreshData();
            refreshBars();
        }
    })

    function refreshData() {
        ctx = chartCanvas.getContext('2d');
        let datasets;
        
        datasets = Object.keys(submoduleToColor).map(name => {
            return {
                label: name,
                backgroundColor: `rgba(${submoduleToColor[name]}, 0.1)`,
                borderColor: `rgb(${submoduleToColor[name]})`,
                fill: name == 'Goal',
                borderWidth: ['Goal', 'Total'].includes(name) ? 3 : 1,
                pointRadius: ['Goal', 'Total'].includes(name) ? 2 : 0,
                data: getSubmoduleData(name),
            }
        })
        let labels = [];
        for (let s = 1; s <= currentSprint; s ++) {
            labels.push(`Sprint ${s}`);
        }
        if (chartRef != null) {
            chartRef.data.datasets = datasets;
            chartRef.data.labels = labels;
            chartRef.update();
        } else {
            chartRef = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
            })
        }
    }

    function refreshBars() {
        barsCtx = barsCanvas.getContext('2d');
        let datasets;
        
        datasets = [{
            label: 'Code Coverage',
            data: Object.keys(submoduleToColor).map(name => getRecentData(name)),
            backgroundColor: Object.keys(submoduleToColor).map(name => `rgba(${submoduleToColor[name]}, 0.1)`),
            borderColor: Object.keys(submoduleToColor).map(name => `rgba(${submoduleToColor[name]})`),
            fill: true,
            borderWidth: 1,
        }]
        let labels = Object.keys(submoduleToColor);
        if (barsRef != null) {
            barsRef.data.datasets = datasets;
            barsRef.data.labels = labels;
            barsRef.update();
        } else {
            barsRef = new Chart(barsCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
            })
        }
    }

    function getSubmoduleData(name) {
        if (name == "Goal") {
            return new Array(15).fill(80);
        }
        return data.map(row => row[name]);
    }

    function getRecentData(name) {
        if (name == "Goal") {
            return 80;
        }
        for (let i = data.length - 1; i >= 0; i --) {
            if (data[i][name] > 0) {
                return data[i][name];
            }
        }
        return 0;
    }

</script>

<div class="p-8 pb-0 flex justify-between items-end">
    <span class="text-2xl font-bold">Code Coverage, by Submodule</span>
</div>
<div class="p-4 relative">
    <canvas bind:this={barsCanvas} id="codeCoverageBars" ></canvas>
</div>

<div class="p-8 pb-0 flex justify-between items-end">
    <span class="text-2xl font-bold">Code Coverage, by Sprint</span>
</div>
<div class="p-4 relative">
    <canvas bind:this={chartCanvas} id="codeCoverageChart" ></canvas>
</div>
