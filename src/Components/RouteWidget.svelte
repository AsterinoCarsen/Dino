<style>
    .parent {
        display: flex;
        flex-direction: column;
        width: 350px;
        height: 350px;
        background-color: antiquewhite;
        border-radius: 10px;
        overflow: hidden;

        transition: 0.05s ease-out 100ms;
        position: relative;
    }

    .parent:hover {
        filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.2));
    }

    .image-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;

        position: relative;
    }

    .prevButton,
    .nextButton {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        background-color: transparent;
        color: whitesmoke;
        border: none;
        cursor: pointer;
        font-size: 20px;
        z-index: 1;
    }

    .prevButton {
        left: 0;
    }

    .nextButton {
        right: 0;
    }

    .image-container img {
        width: 100%;
        height: auto;
        object-fit: cover;
    }

    .content {
        margin: 0px 10px 0px 10px;
    }
    
    h1 {
        margin: 10px 0px 10px 0px;
    }

    p {
        margin: 10px 0px 10px 0px;
    }
</style>

<script>
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

    function scrollNext() {
        const container = document.getElementById('imageContainer');
        let scrollWidth = container?.scrollWidth;
        let scrollLeft = container?.scrollLeft;
        let containerWidth = container?.clientWidth;
        const nextScrollPosition = Math.min(scrollWidth, scrollLeft + containerWidth);

        container?.scrollTo({
            left: nextScrollPosition,
            behavior: "smooth"
        });
    }

    function scrollPrevious() {
        const container = document.getElementById('imageContainer');
        let scrollLeft = container?.scrollLeft;
        let containerWidth = container?.clientWidth;
        const prevScrollPosition = Math.min(0, scrollLeft - containerWidth);

        container?.scrollTo({
            left: prevScrollPosition,
            behavior: "smooth"
        });
    }

    function showButtons() {
        document.querySelector('.prevButton').style.display = 'block';
        document.querySelector('.nextButton').style.display = 'block';
    }

    function hideButtons() {
        document.querySelector('.prevButton').style.display = 'none';
        document.querySelector('.nextButton').style.display = 'none';
    }
</script>

<div on:mouseenter={showButtons} on:mouseleave={hideButtons} class="parent">
    <div class="image-container" id="imageContainer">
        {#each data.images as img, index}
            <img src={img}>
        {/each}

        <button style="display: none;" class="nextButton" on:click={scrollNext}>&gt;</button>
        <button style="display: none;" class="prevButton" on:click={scrollPrevious}>&lt;</button>
    </div>


</div>