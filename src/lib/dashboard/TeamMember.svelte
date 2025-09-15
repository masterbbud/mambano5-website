
<script>
    const { name, role, color, image } = $props();
</script>

<div class="flex items-center gap-4 bg-slate-50 mb-3 lg:mb-2 rounded-md p-2 pl-3 pb-2.5" style={`background-color: rgba(${color}, 0.2)`}>
    <img src={image} alt="Photo of {name}" style="width: 3.5em; height: 3.5em;" class="rounded-md" />
    <div>
        <div class="text-2xl lg:text-lg font-semibold">{name}</div>
        <div class="text-lg lg:text-sm text-gray-800 italic">{role}</div>
    </div>
</div>