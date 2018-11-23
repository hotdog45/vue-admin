<template>
    <div>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 5px;">
            <el-button type="primary" @click="handAdd">新增红包</el-button>
		</el-col>
         <!--列表-->
            <el-table :data="acts" highlight-current-row v-loading="listLoading"  style="width: 100%;">
                <el-table-column prop="id" label="活动ID" width="100" sortable>
                </el-table-column>
                <el-table-column prop="redPacketName" label="红包名称" min-width="160" sortable>
                </el-table-column>
                <el-table-column prop="couponId" label="优惠券id:数量" min-width="160" sortable>
                </el-table-column>
				<el-table-column label="操作" width="120px;">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">红包图片</el-button>
				</template>
			</el-table-column>
                <el-table-column prop="start" label="开始时间" width="160" sortable>
                </el-table-column>
                <el-table-column prop="end" label="结束时间"  width="160" sortable>
                    <template scope="scope">             
                    <span v-if="scope.row.over===1" style="color:red">{{ scope.row.end }}</span>             
                    <span v-else style="color:green">{{ scope.row.end }}</span>      
                    </template>
                </el-table-column>
				<el-table-column label="操作" width="160px;">
				<template scope="scope">
					<el-button size="small" @click="updateRedPacket(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
				</el-table-column>
            </el-table>
            <!--添加活动红包-->
			<el-dialog title="添加活动红包" v-model="addVisble" :close-on-click-modal="true" :visible.sync="addVisble">
				<el-form :model="addActForm" label-width="120px" :rules="addActFormRules" ref="addForm">
				<el-form-item label="红名名称" prop="redPacketName">
					<el-input v-model="addActForm.redPacketName"  auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="优惠券id:数量" prop="couponId">
					<el-input v-model="addActForm.couponId"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="有效时间" prop="timevalue">
				    <el-date-picker
				      v-model="addActForm.timevalue"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期"
				      format="yyyy-MM-dd HH:mm:ss"
          			  value-format="yyyy-MM-dd HH:mm:ss"
				    >
				    </el-date-picker>
				</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addVisble = false">取消</el-button>
					<el-button type="primary" @click.native="addActFormSubmit" :loading="addLoading">提交</el-button>
				</div>
			</el-dialog>

            <!--编辑活动红包-->
			<el-dialog title="编辑活动红包" v-model="editVisble" :close-on-click-modal="true" :visible.sync="editVisble">
				<el-form :model="editActForm" label-width="120px" :rules="editActFormRules" ref="editForm">
                <el-form-item label="活动ID" prop="id">
					<el-input v-model="editActForm.id" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>   
				<el-form-item label="红名名称" prop="redPacketName">
					<el-input v-model="editActForm.redPacketName"  auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="优惠券id:数量" prop="couponId">
					<el-input v-model="editActForm.couponId"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="有效时间" prop="timevalue">
				    <el-date-picker
				      v-model="editActForm.timevalue"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期"
				      format="yyyy-MM-dd HH:mm:ss"
          			  value-format="yyyy-MM-dd HH:mm:ss"
				    >
				    </el-date-picker>
				</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editVisble = false">取消</el-button>
					<el-button type="primary" @click.native="editActFormSubmit" :loading="editLoading">提交</el-button>
				</div>
			</el-dialog>
            <!--上传活动图片-->
			<el-dialog title="上传活动图片" v-model="uploadVisble" :close-on-click-modal="true" :visible.sync="uploadVisble">
				<img :src="defaultImg" style="float:left;width:320px;height:40px;line-height:40px;margin-right:20px;"/>
				<el-upload
				class="upload-demo"
				ref="upload"
				action=""
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:file-list="fileList"
				:auto-upload="false">
				<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
				<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-dialog>
    </div>
</template>

<script>
import { getRedPacketList,addRedPacket,delRedPacketPostLog,updateRedPacketById,updateRedPacketImg } from '../../api/api';
import defaultImg from '@/assets/defaultImg.jpg'
export default {
    data(){
        return {
            listLoading:false,
            acts:[],
            addVisble:false,
            editVisble:false,
            addActForm:{},
            addActFormRules:{
                redPacketName: [
				    { required: true, message: '请输入红包名称', trigger: 'blur' }
                ],
                couponId:[
                     { required: true, message: '请输入优惠券', trigger: 'blur' }
                ],
                timevalue:[
                     { required: true, message: '请输入时间', trigger: 'blur' }
                ]
            },
            addLoading:false,
            editActForm:{
                timevalue:[],
                packetImg:'',
            },
            editActFormRules:{
                 redPacketName: [
				    { required: true, message: '请输入红包名称', trigger: 'blur' }
                ],
                couponId:[
                     { required: true, message: '请输入优惠券', trigger: 'blur' }
                ],
                timevalue:[
                     { required: true, message: '请输入时间', trigger: 'blur' }
                ]
            },
            editLoading:false,
            uploadVisble:false,
            defaultImg:defaultImg,
            activityRedPacketId:'',
            fileList:[],
        }
    },
    methods:{
       getActivityRedPacket(){
			getRedPacketList().then((res)=>{
				this.acts = res.data.module;
			})
        },
        updateRedPacket(index,row){
            this.editVisble = true;
            this.editActForm = Object.assign({}, row);
            if(row.start!=null&&row.end!=null){
				this.editActForm.timevalue = [row.start,row.end]
			}
        },
        handAdd(){
            this.addVisble = true;
        },
        addActFormSubmit(){
            this.$refs.addForm.validate((valid) => {
					if (valid) {
						if(this.addActForm.timevalue!=null&&this.addActForm.timevalue!='undefined'){
								this.addActForm.start = this.addActForm.timevalue[0];
								this.addActForm.end = this.addActForm.timevalue[1];
							}else{
								this.addActForm.start = '';
								this.addActForm.end = '';
						}
						this.listLoading = true;
						addRedPacket(this.addActForm).then((res)=>{
                            if(res.data.success){
                                this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                });
                            }else{
                                this.$message({
                                        message: '添加失败',
                                        type: 'error'
                                });
                            }
							this.getActivityRedPacket();
							this.listLoading = false;
							this.addVisble = false;
						});
					}
			});
        },
         editActFormSubmit(){
            this.$refs.editForm.validate((valid) => {
					if (valid) {
						if(this.editActForm.timevalue!=null&&this.editActForm.timevalue!='undefined'){
								this.editActForm.start = this.editActForm.timevalue[0];
								this.editActForm.end = this.editActForm.timevalue[1];
							}else{
								this.editActForm.start = '';
								this.editActForm.end = '';
						}
						this.listLoading = true;
						updateRedPacketById(this.editActForm).then((res)=>{
                            if(res.data.success){
                                this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                });
                            }else{
                                this.$message({
                                        message: '修改失败',
                                        type: 'error'
                                });
                            }
							this.getActivityRedPacket();
							this.listLoading = false;
							this.editVisble = false;
						});
					}
			});
        },
        handleDel(index,row){
            let para = {id:row.id}
			this.listLoading = true;
			delRedPacketPostLog(para).then((res)=>{
				if(res.data.success){
					this.$message({
							message: '删除成功',
							type: 'success'
					});
					this.getActivityRedPacket();
					this.listLoading = false;
				}else{
					this.$message({
							message: '删除失败',
							type: 'error'
					});
				}
			})
        },
        //显示编辑界面
		handleEdit: function (index, row) {
            this.uploadVisble = true;
			if(row.packetImg!=null){
				this.defaultImg = "http://pic.xianzaishi.com/imgs/"+row.packetImg;
			}else{
				this.defaultImg = defaultImg;
			}
			this.activityRedPacketId = row.id;
			this.fileList = [];
        },
        submitUpload() {
			let fs = document.getElementsByName('file');
			let formData = new FormData();
			formData.append('id', this.activityRedPacketId);
            formData.append('file', fs[0].files[0]);
			let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
 
            this.$http.post('/api/updateRedPacketImg', formData, config).then(response => {
            if(response.data.success){
            	var _this = this;
                this.$message({
                  message: "设置成功",
                  type: 'success'
                });                
            }else{
            	var _this = this;
                this.$message({
                  message: "设置失败",
                  type: 'error'
                });
                }
            })
            formData = '';
        },
        handleRemove(file, fileList) {
        	console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
    },
    mounted(){
        this.getActivityRedPacket();
    }
}
</script>

<style>

</style>
