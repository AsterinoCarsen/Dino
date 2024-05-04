<script>
    import RouteWidget from "../../Components/RouteWidget.svelte";


    export let testData = {
        name: "Burden of Dreams",
        grade: "5.14d",
        type: "Boulder",
        location: {
            lat: 60.423895,
            long: 26.135606
        },
        images: [
            "https://s3.us-east-1.amazonaws.com/images.gearjunkie.com/uploads/2023/10/burden-of-dreams-bosi.jpg",
            "https://www.planetmountain.com/uploads/img/1/41631.jpg",
            "https://gripped.com/wp-content/uploads/2017/11/Nalle-Hukkataival-V17.jpg"
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
            locationName = responseData.locality;

        } catch (error) {
            console.log("Error getting location reverse geocode: " + error);
        }
    }

    function askForLocation() {
        if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    getLocationName(position.coords.latitude, position.coords.longitude);
                }
            );
        } else {
            console.log("Geolocation is not supported in this environment.");
        }
    }

    askForLocation();
</script>

<div class="pt-24 pb-24 pl-40 pr-40">
    <a href="/" class="absolute scale-125 top-12 left-12 fa-solid fa-home color-red"></a>

    <h1 class="text-6xl pb-10 border-b border-black fontfamily-calistoga font-extrabold text-blue">
        {#if locationName === ""}
            Popular Routes
        {:else}
            Routes Near {locationName}
        {/if}
    </h1>


    <div class="pt-16 flex justify-center items-center">
        <div class="pt-5 grid grid-cols-3 gap-32 place-content-center">
            <RouteWidget data={testData} />
            <RouteWidget />
            <RouteWidget />
            <RouteWidget />
            <RouteWidget />
            <RouteWidget />
        </div>
    </div>
</div>