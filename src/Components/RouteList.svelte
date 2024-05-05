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

<div class="flex justify-between w-screen h-auto pb-4 prose font-bold">
    <div class="flex w-screen justify-center items-center text-center">
        {data.name}
    </div>

    <div class="flex w-screen justify-center items-center text-center">
        {data.grade}
    </div>

    <div class="flex w-screen justify-center items-center text-center">
        {locationName}
    </div>

</div>