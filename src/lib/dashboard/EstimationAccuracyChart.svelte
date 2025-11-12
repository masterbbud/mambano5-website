
<script>
// @ts-nocheck


    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import { dayFromDate, weekFromDate} from './utils';

    const { data, currentSprint } = $props();

    let ctxVelocity;
    let velocityChartCanvas;
    let chartRefVelocity;

    let ctxEstimation;
    let estimationChartCanvas;
    let chartRefEstimation;

    var overallVelocity = $state(0);
    
    var selectedChartMode = $state("week");

    function selectChartMode(mode) {
        selectedChartMode = mode;
    }

    $effect(() => {refreshVelocityData();}) // cool! these are done seperately so each triggers rerenders seperately, instead of all together
    $effect(() => {refreshEstimationData();})
    $effect(() => {calculateVelocity();})

    function refreshVelocityData() {
        ctxVelocity = velocityChartCanvas.getContext('2d');
        let datasets;
        
        datasets = [{
            label: "Planned Velocity",
            backgroundColor: `rgba(38, 209, 0, 0.1)`,
            borderColor: `rgb(38, 209, 0)`,
            data: getColumn('Velocity (estimated)'),
        }, {
            label: "Actual Velocity",
            backgroundColor: `rgba(255, 28, 0, 0.1)`,
            borderColor: `rgb(255, 28, 0)`,
            data: getColumn('Velocity (actual)'),
        }]
        let labels = [];
        for (let s = 1; s <= currentSprint; s ++) {
            labels.push(`Sprint ${s}`);
        }
        if (chartRefVelocity != null) {
            chartRefVelocity.data.datasets = datasets;
            chartRefVelocity.data.labels = labels;
            chartRefVelocity.update();
        } else {
            chartRefVelocity = new Chart(ctxVelocity, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                }
            })
        }
    }

    function refreshEstimationData() {
        ctxEstimation = estimationChartCanvas.getContext('2d');
        let datasets;
        
        datasets = [{
            label: "Estimation Accuracy",
            backgroundColor: `rgba(0, 158, 255, 0.1)`,
            borderColor: `rgb(0, 158, 255)`,
            data: getColumn('Compare to Estimate', selectedChartMode == 'absolute'),
        }]
        let labels = [];
        for (let s = 1; s <= currentSprint; s ++) {
            labels.push(`Sprint ${s}`);
        }
        if (chartRefEstimation != null) {
            chartRefEstimation.data.datasets = datasets;
            chartRefEstimation.data.labels = labels;
            chartRefEstimation.update();
        } else {
            chartRefEstimation = new Chart(ctxEstimation, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                }
            })
        }
    }

    function getColumn(name, should_abs = false) {
        return data.map(row => should_abs ? Math.abs(row[name]) : row[name]);
    }

    function calculateVelocity() {
        console.log(data)
        let values = [];
        for (let i = data.length - 1; i >= 0; i --) {
            if (data[i]['Velocity (actual)']) {
                values.push(data[i]['Velocity (actual)']);
            }
            if (values.length >= 3) {
                break;
            }
        }
        console.log(values)
        overallVelocity = values.reduce((a, val) => a + val, 0) / values.length;
    }

</script>

<div class="p-8 pb-0 flex justify-between items-end">
    <span class="text-2xl font-bold">Velocity, by Sprint</span>
</div>
<div class="p-4 relative">
    <canvas bind:this={velocityChartCanvas} id="velocityChart" ></canvas>
</div>
<div class="p-8 pb-0">
    <div class="p-4 flex items-end bg-slate-100 rounded-md shadow-md">
        <span class="text-2xl mr-4">Current Velocity (last 3 sprints): </span><span class="text-2xl font-bold">{overallVelocity}</span>
    </div>
</div>
<div class="p-8 pb-0 flex justify-between items-end">
    <span class="text-2xl font-bold">Estimation Accuracy, by Sprint</span>
    <span class="float-right">
        <select onchange={evt => selectChartMode(evt.target.value)}>
            <option value="absolute">Absolute Value</option>
            <option value="signed">With Sign</option>
        </select>
    </span>
</div>
<div class="p-4 relative">
    <canvas bind:this={estimationChartCanvas} id="estimationAccuracyChart" ></canvas>
</div>