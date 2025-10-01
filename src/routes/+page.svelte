
<script>
// @ts-nocheck

    import TimeTracking from "$lib/dashboard/TimeTracking.svelte";
    import TeamMember from "$lib/dashboard/TeamMember.svelte";
    import PhillippaIcon from "$lib/assets/phillippa.jpg";
    import RichardIcon from "$lib/assets/richard.jpg";
    import PlaceholderIcon from "$lib/assets/placeholder.webp";

    import { userToColor } from "$lib/dashboard/utils";
    import CodeCoverage from "$lib/dashboard/CodeCoverage.svelte";
    import EstimationAccuracy from "$lib/dashboard/EstimationAccuracy.svelte";
    import Methodology from "$lib/dashboard/Methodology.svelte";
    import DomainModel from "$lib/dashboard/DomainModel.svelte";

    const tabs = [
        {
            name: 'Time Tracking',
            component: TimeTracking
        },
        {
            name: 'Domain Model',
            component: DomainModel
        },
        {
            name: 'Engineering Methodology',
            component: Methodology
        },
        {
            name: 'Estimation Accuracy',
            component: EstimationAccuracy
        },
        {
            name: 'Code Coverage',
            component: CodeCoverage
        }
    ]

    var selectedTab = $state(tabs[0]);

    function selectTab(tab) {
        selectedTab = tab;
    }
</script>

<div class="grid lg:grid-cols-2 lg:h-screen">
    <div id="overview" class="p-8 lg:overflow-y-auto max-w-screen">
        <h1 class="mb-2 text-6xl font-bold">BidiiNet</h1>
        <h3 class="mb-6 lg:mb-4 text-2xl lg:text-xl text-gray-800">Presented by <b class="font-semibold">Mamba No. 5</b></h3>
        <h2 class="mb-4 lg:mb-2 text-3xl lg:text-xl text-center lg:text-start font-semibold">Project Overview</h2>
        <p class="mb-2 text-lg lg:text-base">BidiiNet is a platform built to connect higher education institutions in Africa with applicants seeking jobs as professors, researchers, and administrators. The platform will provide an easy-to-use experience for applicants by automatically parsing CVs to fill out their profiles. It will integrate with external sources to provide easy access to publications. A recommendation system will suggest jobs that match each applicant’s skill sets and location preferences. This platform will also provide a simple but powerful interface for employers to create job postings, view applications, and categorize suitable candidates. A comprehensive analytics dashboard will allow each university to analyze its use of the system and provide administrators with platform-wide usage statistics to drive business decisions.</p>
        <p class="mb-2 text-lg lg:text-base">Due to wide cultural and language diversity across the African continent, BidiiNet will be extensible to other languages like French and Arabic, and sensitive to cultural differences compared to other job markets. The application will also limit data usage as much as possible to respect expensive data rates.</p>
        <p class="mb-6 lg:mb-4 text-lg lg:text-base">At the end of this project, a minimum viable product will be deployed in order to allow select English-speaking African universities to test the effectiveness of the platform. This release may not include the full set of necessary features on the platform, but will be built with regard to maintainability and scalability for a future production deployment.</p>
        <h2 class="mb-4 lg:mb-2 text-3xl lg:text-xl text-center lg:text-start font-semibold">Contributors</h2>
        <TeamMember name="Phillippa Thiuri" role="Project Sponsor" color="14, 138, 0" image={PhillippaIcon} />
        <TeamMember name="Emilia Thiuri" role="Project Sponsor" color="14, 138, 0" image={PlaceholderIcon} />
        <TeamMember name="Richard Hanulewicz" role="Project Coach" color="158, 99, 5" image={RichardIcon} />
        <TeamMember name="Anthony Mackay" role="UI Jesus" color={userToColor.Anthony} image={PlaceholderIcon} />
        <TeamMember name="Brandon Faunce" role="Communication Lead" color={userToColor.Brandon} image={PlaceholderIcon} />
        <TeamMember name="Catie Roe" role="Dedicated Scribe" color={userToColor.Catie} image={PlaceholderIcon} />
        <TeamMember name="Danny Gramowski" role="Project Lead" color={userToColor.Danny} image={PlaceholderIcon} />
        <TeamMember name="Ivan Lin" role="Deployment Diva" color={userToColor.Ivan} image={PlaceholderIcon} />
    </div>
    <div id="metric-tabs" class="p-4 flex flex-col lg:h-screen w-full max-w-screen">
        <div id="tab-selector" class="max-w-screen overflow-x-auto min-h-min">
            <div class="flex gap-1 w-max">
                {#each tabs as tab}
                    <button onclick={() => selectTab(tab)} class="rounded-t-md text-xl lg:text-base bg-slate-0 p-2 pl-3 pr-3 lg:p-1 lg:pl-2 lg:pr-2 cursor-pointer w-max text-slate-900 hover:bg-slate-100" class:bg-slate-200={tab.name === selectedTab.name}>
                        {tab.name}
                    </button>
                {/each}
            </div>
        </div>
        <div id="selected-tab" class="bg-slate-200 grow lg:overflow-y-auto">
            <selectedTab.component />
        </div>
    </div>
</div>
