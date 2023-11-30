
<div class=col-container>
    {#each [[1,2],[3,4],[5,6]] as i}
        <div class=row-container>
            <img src="primos-menu-{i[0]}.png" class=menu alt="favicon.png">
            <img src="primos-menu-{i[1]}.png" class=menu alt="favicon.png">
        </div>
    {/each}
</div>

<style>
    .menu{
        width: 50%;
    }

    .col-container{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        margin: 0;
    }

    .row-container{
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 0;
    }


</style>