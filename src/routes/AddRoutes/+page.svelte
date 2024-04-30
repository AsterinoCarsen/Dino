<style>
    .parent {
        display: flex;
        margin-left: 20%;
        margin-right: 20%;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        margin-top: 5%;
    }

    h1 {
        border-bottom: solid gainsboro 1px;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<script>
    let isSubmitted = "Not yet";

    let data = {
        name: ''
    };

    async function submitData() {
        isSubmitted = "yes!";
    }
</script>

<div class="parent">
    <a href="/">Home</a>

    <h1>Submit a Climbing Route</h1>
    <p>{data.name}</p>


    <form on:submit={submitData}>
        <label for="name">Name</label>
        <input type="text" id="name" bind:value={data.name}>

        <button type="submit">Submit</button>
    </form>
</div>