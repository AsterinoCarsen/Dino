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
    }

    .parent:hover {
        filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.2));
    }

    img {
        height: 50%;
        object-fit: cover;
    }

    .content {
        margin: 0px 10px 0px 10px;
    }

    .description {

    }
    
    h1 {
        margin: 10px 0px 10px 0px;
    }

    p {
        margin: 10px 0px 10px 0px;
    }
</style>

<script lang="ts">
    export let src;
    export let title = "Unnamed";
    export let yds = 5.5;

    export let data = ["https://demofree.sirv.com/nope-not-here.jpg", "Unnamed", 5.5, "ac auctor augue mauris augue neque gravida in fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam id leo in vitae turpis massa sed elementum tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse in est ante in nibh mauris cursus mattis molestie a iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et"];

</script>

<div class="parent">
    <img src={data[0]} />
    <div class="content">
        <h1>{data[1]}</h1>
        <h3>{data[2]} yds</h3>
        <h4>Description:</h4>
        <div class="description">
            ac auctor augue mauris augue neque gravida in fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam id leo in vitae turpis massa sed elementum tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse in est ante in nibh mauris cursus mattis molestie a iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et
        </div>

    </div>
</div>