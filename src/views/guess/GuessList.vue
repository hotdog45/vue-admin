<template>
    <div>

        <div class="tools">
            <div class="one">
                <el-button v-if="btnsel =='watting'" size="small" type="primary" @click="state('watting')" plain = 'false'>待审核</el-button>
                <el-button v-else size="small" @click="state('watting')">待审核</el-button>
                <el-button v-if="btnsel =='inprogress'" size="small" type="primary" @click="state('inprogress')">进行中</el-button>
                <el-button v-else size="small" @click="state('inprogress')">进行中</el-button>
                <el-button v-if="btnsel =='rejected'" size="small" type="primary" @click="state('rejected')">已驳回</el-button>
                <el-button v-else size="small" @click="state('rejected')">已驳回</el-button>
                <el-button v-if="btnsel =='success'" size="small" type="primary" @click="state('success')">已结束</el-button>
                <el-button v-else size="small" @click="state('success')">已结束</el-button>
                <div style="flex-grow: 5"></div>
                <div>芥末号:</div>
                <el-input class="input" size="small" v-model="account" placeholder="请输入"></el-input>
                <div>昵称:</div>
                <el-input class="input" size="small" v-model="name" placeholder="请输入"></el-input>
            </div>
            <div class="two">
                <div>发布日期:</div>
                <el-date-picker
                        size="small"
                        v-model="value6"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>

                <div style="flex-grow: 5"></div>
                <el-button size="small" type="primary" @click="find">查询</el-button>
                <el-button size="small" @click="reset">重置</el-button>
            </div>

        </div>

        <div class="list" scoped>
            <div class="box" v-for="item in data.records">
                <div class="left">
                    <div class="imgdiv" style="margin-left: 0;">
                        <img :src="item.image_ori_src">
                    </div>

                    <div class="name">{{item.uid}}&nbsp;&nbsp;&nbsp;{{item.nickname}}</div>
                    <div class="time">{{time(item.last_update)}}</div>
                </div>
                <div class="right">

                    <div v-if="item.state=='watting'" class="btn1">待审核</div>
                    <div v-else-if="item.state=='inprogress'" class="btn1" style="background:orangered">进行中</div>
                    <div v-else-if="item.state=='success'" class="btn1" style="background: #999">已结束</div>
                    <div v-else-if="item.state=='rejected'" class="btn1" style="background: #ccc">已驳回</div>
                    <div v-if="item.state=='inprogress' || item.state=='success'"><span class="btn">{{item.stat ? item.stat.attendee_num : 0}}</span>
                        人参加
                    </div>
                    <div>答案:{{item.name}}</div>
                    <div v-if="item.state=='success' && item.correctAttendee" class="btn">
                        {{item.correctAttendee.userInfo.uid}}
                    </div>
                    <div v-if="item.state =='rejected'|| item.state =='success'" @click="deleteGuess(item)" class="btn">
                        删除
                    </div>
                    <div v-if="item.state=='watting'" class="btn" @click="guessConfirm(true,item)">通过</div>
                    <div v-if="item.state=='watting'" class="btn" @click="guessConfirm(false,item)">驳回</div>
                    <!--<div class="btn" @click="guessConfirm(true,item)">通过</div>-->
                    <!--<div class="btn" @click="guessConfirm(false,item)">驳回</div>-->
                </div>
            </div>
        </div>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"-->
            <!--:page-count="data.pages" style="float:right;">-->
            <!--</el-pagination>-->

            <span class="demonstration">共{{data.total}}条记录 第{{currentPage}}/{{data.pages}}页</span>
            <div style="flex-grow: 5"></div>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="10"
                    layout=" prev, pager, next, jumper"
                    :total="data.total">
            </el-pagination>
        </el-col>

        <div class="pagination">

        </div>

    </div>
</template>

<script>
    import {
            getPluginsGuessList,
            postConfirm,
            postAnswer,
            deletePluginsGuess
    } from '../../api/api';

    export default {
        components: {},
        data() {
            return {
                btnsel: 1,
                message: "详情页",
                data: {},
                total: 100,
                currentPage: 1,
                index: 1,
                value6: '',
                account: "",
                name: "",
            };
        },

        methods: {
            find(){

            },
            reset(){
                this.getList(this.index)
            },
            state(val){

                this.getList(this.index,val)
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange: function (val) {
                console.log(val)
                this.index = val
                this.getList(val)
            },
            time(val){
                return this.$moment(val).format("YYYY-MM-DD HH:mm:ss");
            },
            deleteGuess(item){
                var that = this
                this.$confirm('你确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePluginsGuess(item.id).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            that.getList(that.index)
                        } else {
                            this.$message({
                                message: '删除失败',
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            guessConfirm(approved, item){
                var data = {
                    is_approved: approved
                }
                var that = this
                if (approved) {
                    this.$confirm('你确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        postConfirm(item.id, data).then(res => {
                            if (res.code == 200) {
                                this.$message({
                                    message: '通过成功',
                                    type: 'success'
                                });
                                that.getList(that.index)
                            } else {
                                this.$message({
                                    message: '审核失败',
                                    type: 'error'
                                });
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                } else {
                    this.$confirm('你确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        postConfirm(item.id, data).then(res => {
                            if (res.code == 200) {
                                this.$message({
                                    message: '驳回成功',
                                    type: 'success'
                                });
                                that.getList(that.index)
                            } else {
                                this.$message({
                                    message: '驳回失败',
                                    type: 'error'
                                });
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }


            },

            getList(page,state = '') {
                getPluginsGuessList(page,state).then(res => {
                    if (res.code == 200) {
                        this.data = res.data
                    } else {
                        alert("请求失败,稍后重试!");

                    }
                });
            },
        },

        //created创建完毕状态
        created() {
            window.localStorage.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTU0MzM4ODU5OCwiZXhwIjoxNTc0OTI0NTk4fQ.4MdHwDRbSa4eyZn5kbDqxsJS0zmHA94KLQG2O_KzwyM'
            this.getList(1)
        },


    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">


    .list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

    }

    .box {
        margin: 10px;
        display: flex;
        flex-direction: row;
        border-radius: 2px;
        border: 1px solid #eee;
        width: 300px;
        height: 300px;

    }

    .left {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        div {
            margin: 0 10px 10px 10px;
        }

    }

    .imgdiv {
        width: 150px;
        height: 220px;
        position: relative;
        background: #777;
        overflow: hidden;
        border-top-left-radius: 2px;
        img {
            width: 150px;
            position: absolute;
            bottom: 0;
            top: 0;
            left: 0;
            right: 0;
            margin: auto 0;
        }
    }

    .right {
        display: flex;
        flex-direction: column;
        flex-grow: 3;
        padding-right: 20px;
        align-items: center;
        div {
            margin: 10px 0;
        }
    }

    .btn {
        color: #3a8ee6;
    }

    .btn1 {
        color: #fff;
        background: orange;
        border-radius: 4px;
        width: 50px;
        text-align: center;
        padding: 5px 10px;
    }

    .tools {
        margin: 10px;
        .one {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 10px;
            .input {
                width: 170px;
                margin: 0 40px 0 10px;
            }
        }

        .two {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            margin-right: 50px;
        }
    }

    .toolbar {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
    }
</style>
