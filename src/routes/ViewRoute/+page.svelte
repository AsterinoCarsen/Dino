<script>
    import NavBar from "../../Components/NavBar.svelte";
    import '/src/css/tailwind.css';

    export let data = {
        name: "Unnamed",
        grade: "5.10a",
        type: "Trad",
        location: {
            lat: 37.88474204371501,
            long: -119.49049003843668,
            title: ""
        },
        images: [
            "https://i.natgeofe.com/n/f14f6c30-8d11-4e33-a5e9-05f1b50bdde3/yosemite-national-park-california_3x2.jpg",
            "https://cdn.aarp.net/content/dam/aarp/travel/destinations/2020/09/1140-yosemite-hero.imgcache.rev.web.1000.575.jpg",
            "https://cdn.britannica.com/94/100594-050-85B1CF62/El-Capitan-Bridalveil-Fall-California-Yosemite-National.jpg"
        ]
    };
</script>

<div class="flex justify-center items-center">
    <NavBar />
    <h1 class="pt-32 font-extrabold text-5xl border-b-2 pb-4">Enlarged route goes here.</h1>
</div>