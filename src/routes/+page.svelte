
<script>
    import { onMount } from "svelte";

    let message = "loading"
    let timeout = 1000;

    onMount(() => {
    });

    $: if (message.length > 10) {
        message = "loading";
    }

    $: {
        if (message.length <= 10){
            setTimeout(() => {
                message += '.';
            }, timeout);
        }
    }

</script>

<div class=main>
    <h1>Welcome to Primo's</h1>
    <span class=msg><h3>{message}</h3></span>
</div>
<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->


<style>
    html {
        font-family: sans-serif;
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        background-color : #38446B;
    }
    .main{
        background-color: #253a80;
        height: 100vh;
        width: 100vw;
        display: flex;
        margin-left: -8px;
        margin-top: -8px;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .main h1{
        color: #e3b212;
        font-size: 2rem;
        margin: 0;
    }

    .msg{
        width: 4rem;
        text-align: left;
        color: #e3b212;
    }

</style>
