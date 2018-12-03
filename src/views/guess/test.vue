<template>
    <div>
        <iframe class="ifr" src="http://localhost:8081/guess/list"></iframe>

    </div>
</template>

<script>

    export default {
        components: {},
        data() {
            return {


            };
        },

        methods: {},

        //created创建完毕状态
        created() {
        },


    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">

.ifr{
    width: 100%;
    height: 800px;
    border: none;
}
</style>
