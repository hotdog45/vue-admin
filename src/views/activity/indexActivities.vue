<template>
    <div>
        <!-- <div class="container">
			<div class="addActivity"><el-button type="primary" round @click="addActivity">添加首页活动</el-button></div>
            <div class="phone">
                <iframe src="http://127.0.0.1:8080/#/indexPage" frameborder="0" scrolling="no"></iframe>
            </div>
        </div> -->
		<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;padding-bottom:10px;">
				<el-button type="primary"  @click="addActivity">添加首页活动</el-button>
			</el-col>
            <!--列表-->
            <el-table :data="acts" highlight-current-row v-loading="listLoading" >
                <el-table-column prop="id" label="活动ID" width="100" sortable>
                </el-table-column>
                <el-table-column prop="activityName" label="活动名称" width="220" sortable>
                </el-table-column>
				<el-table-column label="操作" width="100px;">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">活动图片</el-button>
				</template>
			</el-table-column>
                <el-table-column prop="start" label="开始时间" width="100" sortable>
                </el-table-column>
                <el-table-column prop="end" label="结束时间"  width="100" sortable>
                    <template scope="scope">             
                    <span v-if="scope.row.over===1" style="color:red">{{ scope.row.end }}</span>             
                    <span v-else style="color:green">{{ scope.row.end }}</span>      
                    </template>
                </el-table-column>
                <el-table-column prop="itemSkuId" label="已绑的商品"  min-width="200" sortable>
					<template scope="scope">
					<el-tag
					:key="tag"
					v-for="tag in scope.row.itemSkuId"
					closable
					:disable-transitions="false"
					@close="handleClose(tag,scope.row.id)">
					{{tag}}
					</el-tag>
					<el-input
					class="input-new-tag"
					v-if="scope.row.id==showInputIndex"
					v-model="inputValue"
					ref="saveTagInput"
					size="small"
					@keyup.enter.native="handleInputConfirm"
					@blur="handleInputConfirm(scope.row.id)"
					>
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+加商品</el-button>
					</template>
                </el-table-column>
				<el-table-column label="操作" width="160px;">
				<template scope="scope">
					<el-button size="small" @click="updateActivity(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
				</el-table-column>
            </el-table>
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
			<!--编辑活动-->
			<el-dialog title="编辑活动" v-model="editVisble" :close-on-click-modal="true" :visible.sync="editVisble">
				<el-form :model="editActForm" label-width="80px" :rules="editActFormRules" ref="editForm">
				<el-input v-model="editActForm.id" type="hidden" auto-complete="off"></el-input>
				<el-form-item label="活动ID" prop="id">
					<el-input v-model="editActForm.id" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动名称" prop="activityName">
					<el-input v-model="editActForm.activityName"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动描述" prop="timevalue">
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
			<!--添加活动-->
			<el-dialog title="添加活动" v-model="addVisble" :close-on-click-modal="true" :visible.sync="addVisble">
				<el-form :model="addActForm" label-width="80px" :rules="addActFormRules" ref="addForm">
				<el-form-item label="活动名称" prop="activityName">
					<el-input v-model="addActForm.activityName"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动时间" prop="timevalue1">
				    <el-date-picker
				      v-model="addActForm.timevalue1"
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
    </div>
</template>
<script>
import { getActivityIndexByTimeDesc,uploadActivityImage,delActivityItemById,bindActivityItemById,updateActivityIndexById,delActivityIndexById,addActivityIndex } from '../../api/api';
import defaultImg from '@/assets/defaultImg.jpg'
export default {
  data() {
    return {
	  currentDate: new Date(),
	  listLoading:false,
	  editLoading:false,
	  addLoading:false,
	  acts:[],
	  dynamicItems:[],
	  uploadVisble:false,
	  editVisble:false,
	  addVisble:false,
	  defaultImg:defaultImg,
	  fileList:[],
	  file:"",
	  activityId:'',
	  editActForm:{},
	  addActForm:{},
	  timevalue:'',
	  timevalue1:'',
	  inputVisible: false,
	  inputValue: '',
	  showInputIndex:'',
	  editActForm:{
		  activityName:'',
		  start:'',
		  end:'',
		  timevalue:'',
	  },
	  addActForm:{
		  activityName:'',
		  start:'',
		  end:'',
		  timevalue1:'',
	  },
	  editActFormRules: {
			activityName: [
				{ required: true, message: '请输入活动名称', trigger: 'blur' }
			],
			timevalue:[
				{ required:true,message:'请输入活动时间',trigger:'blur'}
			],
		},
	  addActFormRules: {
			activityName: [
				{ required: true, message: '请输入活动名称', trigger: 'blur' }
			],
			timevalue1:[
				{ required:true,message:'请输入活动时间',trigger:'blur'}
			],
		},
    };
  },
  methods:{
		getActivityIndex(){
			let para = {num:12}
			getActivityIndexByTimeDesc(para).then((res)=>{
				this.acts = res.data.module;
				this.dynamicItems = res.data.module.itemSkuId;
			})
		},
	    //显示编辑界面
		handleEdit: function (index, row) {
			this.uploadVisble = true;
			if(row.barImg!=null){
				this.defaultImg = "http://pic.xianzaishi.com/imgs/"+row.barImg;
			}else{
				this.defaultImg = defaultImg;
			}
			this.activityId = row.id;
			this.fileList = [];
		},
		updateActivity: function (index, row){
			this.editVisble = true;
			this.editActForm = Object.assign({}, row);
			if(row.start!=null&&row.end!=null){
					this.editActForm.timevalue = [row.start,row.end]
			}	
		},
		handleDel(index,row){
			let para = {activityId:row.id}
			this.listLoading = true;
			delActivityIndexById(para).then((res)=>{
				if(res.data.success){
					this.$message({
							message: '删除成功',
							type: 'success'
					});
					this.getActivityIndex();
					this.listLoading = false;
				}else{
					this.$message({
							message: '删除失败',
							type: 'error'
					});
				}
			})
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
						updateActivityIndexById(this.editActForm).then((res)=>{
							this.getActivityIndex();
							this.listLoading = false;
							this.editVisble = false;
						});
					}
			});
		},
		addActivity(){
			this.addVisble = true;
		},
		addActFormSubmit(){
			this.$refs.addForm.validate((valid) => {
					if (valid) {
						if(this.addActForm.timevalue1!=null&&this.addActForm.timevalue1!='undefined'){
								this.addActForm.start = this.addActForm.timevalue1[0];
								this.addActForm.end = this.addActForm.timevalue1[1];
							}else{
								this.addActForm.start = '';
								this.addActForm.end = '';
						}
						this.listLoading = true;
						addActivityIndex(this.addActForm).then((res)=>{
							this.getActivityIndex();
							this.listLoading = false;
							this.addVisble = false;
						});
					}
			});
		},

		submitUpload() {
			let fs = document.getElementsByName('file');
			let formData = new FormData();
			formData.append('activityId', this.activityId);
            formData.append('file', fs[0].files[0]);
			let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
 
            this.$http.post('/api/uploadActivityImage', formData, config).then(response => {
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
		handleClose(tag,row) {
		this.listLoading = true;
		let para = {activityId:row,skuId:tag}
		delActivityItemById(para).then((res)=>{
			if(res.data.success){
				this.getActivityIndex();
				this.listLoading = false;
			}
		})
		
      },
      showInput(row) {
		  console.log(row)
		  this.showInputIndex = row.id;

      },

      handleInputConfirm(row) {
        let inputValue = this.inputValue;
        if (inputValue) {
			// 绑定商品
			this.listLoading = true;
			inputValue = inputValue.replace(/ /g,'');
			let para = {activityId:row,skuId:inputValue}
			console.log(para)
			bindActivityItemById(para).then((res)=>{
				if(res.data.success){
					this.getActivityIndex();
					this.listLoading = false;
				}
			});
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
  },
  mounted(){
      this.getActivityIndex();
  }
}
</script>
<style scoped>
    .container {
        margin-top: 40px;
        width:25%;
        float:left;
    }
	.round{
		float: left;
		overflow: hidden;
	}
	.round img {
	    height: 80px;
	    border-radius: 100%;
	    max-width: 100%;
	}
	.round~div{
		margin-left: 130px;
		padding-top: 5px;
	}
	

	
	@media (min-width: 650px){
		.round img {
		    height: 200px;
		    border-radius: 100%;
		    max-width: 100%;
		}
		.round~div{
			margin-left: 200px;
			padding-top: 15px;
		}
		  .phone:before {
		    content: '';
		    width: 40px;
		    height: 10px;
		    border-radius: 10px;
		    position: absolute;
		     left:50%; 
		    margin-left: -20px;
		     background:#333; 
		    top: 50px;
		}
		  

		  
		  .phone:after {
		    content: '';
		    position: absolute;
		    width: 40px;
		    height: 40px;
		    left: 50%;
		    margin-left: -20px;
		    bottom: 10px;
		    border-radius: 100%;
		    box-sizing: border-box;
		    border: 5px solid #333;
		}
	}

	.phone {
		margin: 50 50 50 50;
		position: relative;
	    background: #111;
	    border-radius: 55px;
	    box-shadow: 0px 0px 0px 2px #aaa;
	    width: 300px;
	    height: 532px;
	    padding: 55px 5px;
	    -webkit-box-sizing: content-box;
	    box-sizing: content-box;
	}

	.phone iframe {
	    width: 300px;
	    height: 95%;
	    display: block;
	    width: 100%;
	    margin-top: 20px;
	}
	.el-tag + .el-tag {
	}
	.button-new-tag {
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
		margin-left:-4px;
	}
	.input-new-tag {
		width: 90px;
		vertical-align: bottom;
	}
	.addActivity{
		margin:auto;
		text-align: center;
		margin-bottom: 10px;
	}

</style>




