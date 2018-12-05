<template>
    <div>


        <!--列表-->
        <el-table :data="data.records" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" prop="id" width="60">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="answer" label="答案" width="180" sortable>
            </el-table-column>
            <el-table-column prop="uid" label="猜物方" min-width="280" sortable>
                <template scope="scope">
                    <span>{{scope.row.uid}}</span>
                    <span  v-if="scope.row.is_correct" style="color: #fff;background: #409eff;border-radius: 5px; margin-left:20px;padding: 4px 10px;">猜中方</span>

                </template>
            </el-table-column>
            <el-table-column prop="created_at" :formatter="time" label="发布时间" min-width="180" sortable>
            </el-table-column>

            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="deleteGuess(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="25"
                           :total="data.total" style="float:right;">
            </el-pagination>
        </el-col>


    </div>
</template>

<script>
    import {
        postAnswer,
        getAnswerList,
    } from '../../api/api';

    export default {
        components: {},
        data() {
            return {
                message: "详情页",
                id: '',
                index: 0,
                data: {},
            };
        },

        methods: {
            time(row, column) {
                return this.$moment(row.val).format("YYYY-MM-DD HH:mm:ss");
            },
            dateFormat(value) {
                var value = new Date(value);
                value.setDate(value.getDate() + 14)
                var year = value.getFullYear();
                var month = value.getMonth() + 1;
                var day = value.getDate();
                return year + '年' + month + '月' + day + '号';
            },
            getList(id, page) {
                getAnswerList(id, page).then(res => {
                    if (res.code == 200) {
                        this.data = res.data
                    } else {
                        alert("请求失败,稍后重试!");
                    }
                });
            },
            handleCurrentChange: function (val) {
                console.log(val)
                this.index = val
                this.getList(this.id, val)
            },
            deleteGuess(index, row) {
                var that = this
                this.$confirm('你确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    postAnswer(row.id).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getList(this.id, this.index)
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
        },

        //created创建完毕状态
        created() {
            this.id = window.localStorage.anwserId;
            this.getList(this.id, 1)
        },


    };
</script>


<style>

</style>