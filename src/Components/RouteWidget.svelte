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

    export let data = {
        name: "Unnamed",
        grade: "5.10a",
        type: "Trad",
        location: {
            lat: 37.88474204371501,
            long: -119.49049003843668
        },
        images: [
            "https://i.natgeofe.com/n/f14f6c30-8d11-4e33-a5e9-05f1b50bdde3/yosemite-national-park-california_3x2.jpg",
            "https://cdn.aarp.net/content/dam/aarp/travel/destinations/2020/09/1140-yosemite-hero.imgcache.rev.web.1000.575.jpg",
            "https://cdn.britannica.com/94/100594-050-85B1CF62/El-Capitan-Bridalveil-Fall-California-Yosemite-National.jpg"
        ]
    };

    let locationName = "";

    async function getLocationName(latit, longit) {
        try {
            const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

            const params = new URLSearchParams({
                latitude: latit,
                longitude: longit
            });

            const response = await fetch(`${url}?${params}&localityLanguage=en`);

            const responseData = await response.json();
            locationName = responseData.locality + ", " + responseData.principalSubdivision + ", " + responseData.countryCode;

        } catch (error) {
            console.log("Error getting location reverse geocode: " + error);
        }
    }

    getLocationName(data.location.lat, data.location.long);
</script>

<div class="hover:shadow-2xl transition ease-in w-96 h-96 rounded-lg overflow-hidden animate-fadeIn">
    <div class="bg-gray-100 w-full h-1/2 overflow-hidden">
        <ImageViewer images={data.images} />
    </div>

    <div class="bg-blue w-full h-1/2 p-3">
        <h1 class="border-b pb-4 border-white font-extrabold text-xl">{data.name}</h1>
        <h3 class="pb-4 pt-4">Grade: {data.grade}</h3>
        <p class="">{locationName}</p>
    </div>
</div>