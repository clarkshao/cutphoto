<template>
    <div>
        <h1>
            <div @click="choose" class="middle">选择</div>
        </h1>
    </div>

</template>

<script type="text/ecmascript-6">

    export default {
        data () {
            return {

            }
        },
        methods:{
            choose(){
                document.getElementById('photo').click()
            }
        }
    }

</script>
<style scoped>
    h1{
        width: 100%;
        height: .8rem;
        position: fixed;
        top: 0;
        z-index: 100;
        background: rgba(100,100,100,.2);
        color: white;
        margin: 0;
    }

    h1 div{
        background: #06dc3f;
        width: 1rem;
        position: absolute;
        right: 0;
        height: .7rem;
        line-height: .7rem;
        font-size: .32rem;
        top: .05rem;
        text-align: center;
        border-radius: 2px;
        box-shadow: 3px 2px 10px rgba(0, 0, 0, 0.29);
    }

</style>