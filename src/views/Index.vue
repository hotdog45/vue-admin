<template>
    <section class="chart-container">
        <el-row style="margin-top: 20px">
            <div class="welinfo">
                <span><img src="http://demo.cssmoban.com/cssthemes4/zwtp_2_gi/images/sun.png" alt="天气"/></span>
                <b>Admin，欢迎使用速懒鲜生后台管理平台</b>
            </div>

            <div class="welinfo">
                <span><img src="http://demo.cssmoban.com/cssthemes4/zwtp_2_gi/images/time.png" alt="时间"/></span>
                <i>您上次登录的时间:{{lastLoginTime}}</i>
            </div>

            <div class="xline"></div>

        </el-row>

        <el-row>

        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                lastLoginTime:null
            }
        },

        methods: {
          
        },

        mounted: function () {
            if(localStorage.getItem('lastLoginTime')!=null){
                this.lastLoginTime = localStorage.getItem('lastLoginTime');
            }else{
                 this.lastLoginTime = localStorage.getItem('loginTime');
            }
        },
        updated: function () {
           
        }
    }
</script>

<style scoped>
    /*index*/
    .welinfo {
        height: 32px;
        padding-bottom: 8px;
    }

    .welinfo span {
        float: left;
    }

    .welinfo b {
        padding-left: 8px;
        line-height: 32px;
    }

    .welinfo a {
        padding-left: 15px;
        color: #3186c8;
    }

    .welinfo a:hover {
        color: #F60;
    }

    .welinfo i {
        font-style: normal;
        padding-left: 8px;
        line-height: 32px;
    }

    .xline{border-bottom:solid 1px #dfe9ee; height:5px;}

    .chart-container {
        width: 100%;
        float: left;
    }

    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
