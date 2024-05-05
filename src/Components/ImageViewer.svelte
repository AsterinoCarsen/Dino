<script>
    import '/src/css/tailwind.css';
    import '@fortawesome/fontawesome-free/css/all.css';

    export let images = [
            "https://i.natgeofe.com/n/f14f6c30-8d11-4e33-a5e9-05f1b50bdde3/yosemite-national-park-california_3x2.jpg",
            "https://cdn.aarp.net/content/dam/aarp/travel/destinations/2020/09/1140-yosemite-hero.imgcache.rev.web.1000.575.jpg",
            "https://cdn.britannica.com/94/100594-050-85B1CF62/El-Capitan-Bridalveil-Fall-California-Yosemite-National.jpg"
        ];

    let index = 0;
    let currImage = images[index];

    function left() {
        if (index != 0) {
            index--;
            currImage = images[index];
        }
    }

    function right() {
        if (index < images.length - 1) {
            index++;
            currImage = images[index];
        }
    }
</script>

<style>
    button {
        transform: scale(2);
    }
</style>

<div class="relative flex items-center justify-center h-full w-full">
    {#if images.length > 1}
        <button on:click={left} style="color: white" class="absolute pl-2 left-0 fa-solid fa-chevron-left"></button>
        <button on:click={right} style="color: white" class="absolute pr-2 right-0 fa-solid fa-chevron-right"></button>
    {/if}

    <div>
        <img src={currImage} alt="Image" />
    </div>
</div>