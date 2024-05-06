<style>
    @font-face {
        font-family: 'gaegu';
        src: url('../fonts/Gaegu-Bold.ttf') format('truetype'),
    }

    div {
        font-family: 'gaegu', sans-serif;
    }
</style>

<script>
    export let isBlack = false;
    export let size = 9;
</script>

{#if isBlack == true}
    <div class="text-{size}xl bg-black text-white">
        Dino
    </div>
{/if}

{#if isBlack == false}
    <div class="text-{size}xl">
        Dino
    </div>
{/if}
