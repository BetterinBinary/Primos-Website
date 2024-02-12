
<script>
    import { onMount } from "svelte";
    import Menu from "../components/Menu.svelte";
    import Info from "../components/Info.svelte";

    onMount(() => {
    });

    let selected = null;
    let inpVal = '';
</script>

<div class=main>
    <div class=title-div>
        <button class=title on:click={()=>selected=null}><h1>Primo's Pizza</h1></button>
        {#if selected===null}
            <span class=label>7 Mile & Farmington - Livonia</span>
            <span class=label><i>official website</i></span>
            <span class=label>Call to Order!</span>
            <span class=label><h1 id=phone>248 &zwj;476&zwj; 4260 </h1></span>
        {/if}
        <div class=row-container>
            <button class=btn id={selected==='menu'?'selected':''} on:click={()=>selected='menu'}>Menu</button>
            <button class=btn id={selected==='info'?'selected':''} on:click={()=>selected='info'}>Info</button>
        </div>
        {#if selected===null}
            <span class=label id=ad><h2>Enter your phone number or email below to receive deals and updates!</h2></span>
            <input class=phone type="text" placeholder="Phone or Email" bind:value={inpVal}>
        {/if}
    </div>
    <div class=wrapper>
        {#if selected==='menu'}
            <Menu />
        {:else if selected==='info'}
            <Info />
        {:else}
            <div class=filler>
            </div>
        {/if}
    </div>
</div>

<style>
    .main{
        background-color: #253a80;
        height: 100vh + 8px;
        width: 100vw;
        display: flex;
        margin-left: -8px;
        margin-top: -8px;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        overflow-y: scroll;
        gap: 1rem;
    }

    .phone {
        background-color: azure;
        border: none;
        border-radius: 5px;
        padding: 0.5rem;
        font-size: 1rem;
        text-align: center;
        width: 40%;
        color: #253a80;
        font-weight: bold;
    }

    #ad.label{
        color: azure;
        font-size: 1rem;
        pointer-events: none;
        text-decoration: none;
        pointer-events: none;
        text-decoration: none;
    }

    .wrapper{
        height: 100%;
        display: flex;
        min-width: 100%; 
        justify-content: center;
        align-items: center;
        flex-direction: column;
        /* margin: 8rem auto 0; */
    }

    #call{
        color: azure;
    }

    #phone{
        font-size: 3rem;
        text-decoration: none;
        pointer-events: none;
        margin: 0;
    }

    .title-div{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        /* position:fixed; */
        background-color: #253a80;
        /* margin-top: -1.5rem; */
        /* border-radius: 1rem; */
        min-height: 10vh;
        /* padding: 1rem;  */
    }

    .filler{
        min-height: 100vh;
        width: 100%;
        background-color: #253a80;
    }

    .main h1{
        color: #e3b212;
        font-size: 2rem;
        margin: 0;
    }

    .row-container{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        margin: 0;
        margin-top: 1rem;
    }

    .btn{
        background-color: #e3b212;
        border: none;
        border-radius: 5px;
        padding: 0.5rem;
        font-size: 1rem;
        width: 40%;
        color: #253a80;
        font-weight: bold;
        cursor: pointer;
    }

    .title{
        background-color: transparent;
        border: none;
        border-radius: 5px;
        padding: 0.5rem;
        font-size: 1rem;
        width: 100%;
        color: #e3b212;
        font-weight: bold;
        cursor: pointer;
    }

    .label{
        color: #e3b212;
        font-size: 1rem;
        pointer-events: none;
        text-decoration: none;
        pointer-events: none;
        text-decoration: none;
    }

    a {
        /* color: #e3b212; */
        text-decoration: none;
    }

    .btn:hover{
        box-shadow: 0 0 15px #e3b212; 
    }

    #selected.btn{
        box-shadow: 0 0 15px #e3b212; 
        border: azure 1px solid;
    }
</style>
