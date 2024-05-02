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

    async function getLocationName() {
        try {
            const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

            const params = new URLSearchParams({
                latitude: data.location.lat,
                longitude: data.location.long
            });

            const response = await fetch(`${url}?${params}&localityLanguage=en`);

            const responseData = await response.json();
            console.log(responseData);
            locationName = responseData.locality + ", " + responseData.principalSubdivision + ", " + responseData.countryCode;

        } catch (error) {
            console.log("Error getting location reverse geocode: " + error);
        }
    }

    getLocationName();
</script>

<div class="w-96 h-96 rounded-lg overflow-hidden animate-fadeIn">
    <div class="bg-gray-100 w-full h-1/2 overflow-hidden">
        <ImageViewer />
    </div>

    <div class="bg-stone-300 w-full h-1/2 p-3 prose prose-sm">
        <h1 class="border-b pb-4 border-black">{data.name}</h1>
        <h3>Grade: {data.grade}</h3>
        <p>{locationName}</p>
    </div>
</div>