<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

<script>
    import '/src/css/tailwind.css';
    import ImageViewer from './ImageViewer.svelte';
    import { getLocationName } from '$lib/reverseGeocode';

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

    async function updateLocationTitle() {
        if (data.location.title == "") {
            data.location.title = await getLocationName(data.location.lat, data.location.long);
        }
    }

    updateLocationTitle().then(() => {});

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>

<a href="/ViewRoute">
    <div class="hover:shadow-2xl shadow-white transition ease-in w-96 h-96 overflow-hidden animate-fadeIn border-b-2 border-white">
        <div class="w-full h-1/2 overflow-hidden">
            <ImageViewer images={data.images} />
        </div>
    
        <div class="w-full h-1/2 p-3">
            <h1 class="border-b pb-4 border-white font-extrabold text-xl">{data.name}</h1>
            <h3 class="pb-4 pt-4">Grade: {data.grade} | {capitalize(data.type)}</h3>
            <p class="">{data.location.title}</p>
        </div>
    </div>
</a>