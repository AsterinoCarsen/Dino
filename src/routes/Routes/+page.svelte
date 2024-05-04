<script>
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
    <a href="/" class="absolute scale-125 top-12 left-12 fa-solid fa-home color-red"></a>
    <button on:click={listView} class="absolute scale-125 right-12 top-12 fa-solid fa-list"></button>

    <h1 class="text-6xl pb-10 border-b border-black fontfamily-calistoga font-extrabold text-blue">
        {#if locationName === ""}
            Popular Routes
        {:else}
            Routes Near {locationName}
        {/if}
    </h1>

    <div class="pt-16 flex justify-center items-center">
        {#if isList == false}
            <div class="pt-5 grid grid-cols-3 gap-32 place-content-center">
                {#if jsonData}
                    {#each jsonData as route}
                        <RouteWidget data={route} />
                    {/each}
                {/if}
            </div>
        {/if}

        {#if isList == true}
            <div>
                {#if jsonData}
                    {#each jsonData as route}
                        <div class="odd:bg-gray-400">
                            <RouteList data={route} />
                        </div>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>
</div>