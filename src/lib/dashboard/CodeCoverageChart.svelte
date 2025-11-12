
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
        
        datasets = getSubmodules().map(name => {
            return {
                label: name,
                backgroundColor: `hsla(${deterministicColor(name)}, 0.1)`,
                borderColor: `hsl(${deterministicColor(name)})`,
                fill: name == 'Goal',
                borderWidth: ['Goal', 'Total'].includes(name) ? 3 : 1,
                pointRadius: ['Goal', 'Total'].includes(name) ? 2 : 1,
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
            data: getSubmodules().map(name => getRecentData(name)),
            backgroundColor: getSubmodules().map(name => `hsla(${deterministicColor(name)}, 0.1)`),
            borderColor: getSubmodules().map(name => `hsl(${deterministicColor(name)})`),
            fill: true,
            borderWidth: 1,
        }]
        let labels = getSubmodules();
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
                }
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
        console.log(name);
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

    function getSubmodules() {
        return ["Goal", ...Object.keys(data[0]).slice(2)];
    }

    function mulberry32(seed) {
        let t = seed + 0x6D2B79F48;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    // Deterministic HSL color generator
    function deterministicColor(string) {
        const random = mulberry32(generateHash(string));
        const hue = Math.floor(random * 360);
        const saturation = 100;
        const lightness = 50;
        return `${hue}, ${saturation}%, ${lightness}%`;
    }

    function generateHash(string) {
        let hash = 0;
        for (const char of string) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0; // Constrain to 32bit integer
        }
        return hash;
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
