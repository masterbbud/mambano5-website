
<script>
// @ts-nocheck


    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import { dayFromDate, weekFromDate, userToColor} from './utils';

    const { data, currentWeek } = $props();
    
    var selectedChartMode = $state("week");

    const modeToTitle = {
        week: 'Individual Contributions, by Week',
        day: 'Individual Contributions, by Day',
        cumulative: 'Cumulative Individual Contributions',
        combined: 'Team Contributions, by Week',
    }

    let ctx;
    let chartCanvas;
    let chartRef;

    $effect(() => {
        if (currentWeek && data) {
            refreshData();
        }
    })

    function selectChartMode(mode) {
        selectedChartMode = mode;
    }

    function refreshData() {
        ctx = chartCanvas.getContext('2d');
        let datasets;
        
        if (selectedChartMode == 'combined') {
            datasets = [{
                label: 'Team',
                backgroundColor: 'rgba(38, 209, 0, 0.1)',
                borderColor: 'rgb(38, 209, 0)',
                fill: true,
                data: getTeamData()
            }]
        } else {
            datasets = Object.keys(userToColor).map(name => {
                return {
                    label: name,
                    backgroundColor: `rgba(${userToColor[name]}, 0.1)`,
                    borderColor: `rgb(${userToColor[name]})`,
                    fill: true,
                    data: getUserData(name),
                }
            })
        }
        let labels;
        if (selectedChartMode == 'week' || selectedChartMode == 'combined') {
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
                    },
                }
            })
        }
    }

    function getUserData(user) {
        const userData = data.filter(e => e.Name == user);
        if (selectedChartMode == 'week') {
            return [...Array(currentWeek + 1).keys()].map(w => userData.filter(e => weekFromDate(Date.parse(e.Date)) == w).reduce((sum, b) => (sum + b.Time), 0));
        }
        else if (selectedChartMode == 'day') {
            return [...Array(dayFromDate(Date.now()) + 1).keys()].map(d => userData.filter(e => dayFromDate(Date.parse(e.Date)) == d).reduce((sum, b) => (sum + b.Time), 0));
        } else if (selectedChartMode == 'cumulative') {
            let cumDays = [];
            let lastVal = 0;
            for (let d = 0; d < dayFromDate(Date.now()) + 1; d ++) {
                lastVal += userData.filter(e => dayFromDate(Date.parse(e.Date)) == d).reduce((sum, b) => (sum + b.Time), 0);
                cumDays.push(lastVal);
            }
            return cumDays;
        }
    }

    function getTeamData() {
        return [...Array(currentWeek + 1).keys()].map(w => data.filter(e => weekFromDate(Date.parse(e.Date)) == w).reduce((sum, b) => (sum + b.Time), 0));
    }

</script>

<div class="p-8 pb-0 flex justify-between items-end">
    <span class="text-2xl font-bold">{modeToTitle[selectedChartMode]}</span>
    <span class="float-right">
        <select onchange={evt => selectChartMode(evt.target.value)}>
            <option value="week">Weeks</option>
            <option value="day">Days</option>
            <option value="cumulative">Cumulative</option>
            <option value="combined">Combined (Team)</option>
        </select>
    </span>
</div>
<div class="p-4 relative">
    <canvas bind:this={chartCanvas} id="timeTrackingChart" ></canvas>
</div>
