<script>
    let hours = {
        Sunday: '4pm - 12am',
        Monday: '4pm - 10pm',
        Tuesday: '4pm - 10pm',
        Wednesday: '4pm - 12am',
        Thursday: '4pm - 12am',
        Friday: '4pm - 2am',
        Saturday: '4pm - 2am'
    }
</script>

<div class=main>
    <div class=wrapper>
        <div class=title-wrapper>
            <span class=label id=t><strong>Phone:</strong></span>
            <span class=label id=t>248-476-4260</span>
            <span class=label id=t><strong>Address:</strong></span>
            <span class=label id=t>33521 W Seven Mile Rd, Livonia, MI 48152</span>
        </div>
            <span class=label id=t><strong>Hours:</strong></span>
            {#each Object.keys(hours) as day}
                <span class=label><strong>{day}:</strong><span class=inside>{hours[day]}</span></span>
            {/each}
    </div>
</div>

<style>
    .main{
        height: 80vh;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        overflow-y: scroll;
    }

    #t{
        justify-content: center;
        align-items: center;
    }

    .title-wrapper{
        display: flex;
        flex-direction: column;
        min-width: 100%;
        text-align:center;
    }

    .inside{
        margin-left: auto;
        align-items: center;
        justify-content: center;
    }

    .label{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        min-width: 80vw;
        background-color: #253a80;
        height: 2rem;
        color: azure; 
    }
</style>