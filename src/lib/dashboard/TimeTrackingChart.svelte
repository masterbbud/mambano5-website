
<script>

    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import { dayFromDate, weekFromDate } from './utils';

    const { mode, data, currentWeek } = $props();

    const userToColor = {
        Anthony: '255, 28, 0',
        Brandon: '255, 90, 0',
        Catie: '0, 169, 200',
        Danny: '0, 158, 255',
        Ivan: '168, 0, 255'
    }

    let ctx;
    let chartCanvas;
    let chartRef;

    $effect(() => {
        if (currentWeek && data && mode) {
            refreshData();
        }
    })

    function refreshData() {
        ctx = chartCanvas.getContext('2d');
        let datasets = Object.keys(userToColor).map(name => {
            return {
                label: name,
                backgroundColor: `rgba(${userToColor[name]}, 0.1)`,
                borderColor: `rgb(${userToColor[name]})`,
                fill: true,
                data: getUserData(name),
            }
        })
        let labels;
        if (mode == 'week') {
            labels = [...Array(currentWeek + 1).keys()].map(e => `Week ${e}`);
        } else {
            labels = [];
            for (let w = 0; w <= currentWeek; w ++) {
                labels.push(`Week ${w}`);
                for (let d = 1; d < 7; d++) {
                    labels.push("");
                }
            }
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
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        }
    }

    function getUserData(user) {
        const userData = data.filter(e => e.Name == user);
        if (mode == 'week') {
            return [...Array(currentWeek + 1).keys()].map(w => userData.filter(e => weekFromDate(Date.parse(e.Date)) == w).reduce((sum, b) => (sum + b.Time), 0));
        }
        else if (mode == 'day') {
            return [...Array(dayFromDate(Date.now()) + 1).keys()].map(d => userData.filter(e => dayFromDate(Date.parse(e.Date)) == d).reduce((sum, b) => (sum + b.Time), 0));
        } else if (mode == 'cumulative') {
            let cumDays = [];
            let lastVal = 0;
            for (let d = 0; d < dayFromDate(Date.now()) + 1; d ++) {
                lastVal += userData.filter(e => dayFromDate(Date.parse(e.Date)) == d).reduce((sum, b) => (sum + b.Time), 0);
                cumDays.push(lastVal);
            }
            return cumDays;
        }
    }

</script>

<div>Displaying in {mode} mode</div>
<div class="chartContainer">
<canvas bind:this={chartCanvas} id="timeTrackingChart" ></canvas>
</div>
