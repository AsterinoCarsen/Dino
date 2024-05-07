<script>
    import NavBar from "../../Components/NavBar.svelte";
    import RouteList from "../../Components/RouteList.svelte";
    import RouteWidget from "../../Components/RouteWidget.svelte";
    import jsonData from "../../lib/testData.json"
    import { getLocationName } from "$lib/reverseGeocode";

    let locationName = "";

    async function askForLocation() {
        if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    async position => {
                        locationName = await getLocationName(position.coords.latitude, position.coords.longitude);
                        resolve();
                    },
                    error => reject(error)
                );
            });
        } else {
            console.log("Geolocation is not supported in this environment.");
        }
    }

    askForLocation().then(() => {
        console.log("Location name retrieved:", locationName);
    }).catch(error => {
        console.error("Error:", error);
    });

    
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