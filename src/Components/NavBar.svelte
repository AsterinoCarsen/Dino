<script>
    import Logo from "./Logo.svelte";

</script>

<style>
    a {
        font-family: "mont", sans-serif;
    }
</style>

<div class="absolute top-0 left-0 w-screen h-16 bg-black pl-32 border-b-2 border-white">
    <div class="flex justify-center items-center">
        <a href="/">
            <Logo size={6} isBlack={true} />
        </a>

        <div class="flex justify-end gap-12 pr-32 h-full w-full">
            <a href="/Routes">Routes</a>
            <a href="/AddRoutes">Submit a Route</a>
            <a href="/">Home</a>
        </div>
    </div>
</div>