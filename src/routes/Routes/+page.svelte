<script>
    import NavBar from "../../Components/NavBar.svelte";
import RouteList from "../../Components/RouteList.svelte";
    import RouteWidget from "../../Components/RouteWidget.svelte";
    import jsonData from "../../lib/testData.json"

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
    
    let isList = false;
    function listView() {
        isList = !isList;
    }
</script>

<div class="pt-24 pb-24 pl-64 pr-64">
    <NavBar />

    <h1 class="text-6xl pb-10 mb-10 border-b border-white font-extrabold text-blue">
        {#if locationName === ""}
            Popular Routes
        {:else}
            Routes Near {locationName}
        {/if}
    </h1>

    <div class="flex justify-center">
        {#if isList == false}
            <div class="grid gap-10 grid-cols-3 ">
                {#each jsonData as route}
                    <RouteWidget data={route} />
                {/each}
            </div>
        {/if}


        {#if isList == true}
            <div class="flex flex-col w-screen">
                {#each jsonData as route}
                    <div class="odd:bg-gray-400">
                        <RouteList data={route} />
                    </div>
                {/each}
            </div>
        {/if}
    </div>

</div>