<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="活动名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getActivityByTitle">查询</el-button>
				</el-form-item>
				<el-button type="primary" @click="addAct">添加活动</el-button>
		</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="acts" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" prop="id" width="60">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="id" label="活动ID" width="120" sortable>
			</el-table-column>
			<el-table-column prop="title" label="活动名称" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="description" label="活动描述" min-width="180" sortable>
			</el-table-column>
			<el-table-column prop="start" label="开始时间" width="100" sortable>
			</el-table-column>
			<el-table-column prop="end" label="结束时间"  width="100" sortable>
				<template scope="scope">             
				 <span v-if="scope.row.over===1" style="color:red">{{ scope.row.end }}</span>             
				 <span v-else style="color:green">{{ scope.row.end }}</span>      
				</template>
			</el-table-column>
			<el-table-column prop="label" label="标签" :formatter="getTagLabel" width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="120px;">
				<template scope="scope">
					<el-button size="small" @click="editAct(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="编辑活动" v-model="addActFormVisible" :close-on-click-modal="true" :visible.sync="dialogVisible">
			<el-form :model="addActForm" label-width="80px" :rules="addActFormRules" ref="addForm">

				<el-form-item label="活动名称" prop="title">
					<el-input v-model="addActForm.title"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动描述" prop="description">
					<el-input v-model="addActForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动描述" prop="timevalue">
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
				
				<el-form-item label="标签" prop="tags_id" >
				<el-select v-model="addActForm.tags_id" placeholder="请选择标签">
			    <el-option
			      v-for="tag in tags"
			      :key="tag.tagsId"
			      :label="tag.label"
			      :value="tag.tagsId">
			    </el-option>
			    </el-select>
				</el-form-item>

				<el-form-item label="配送模板" prop="tags_id" >
					<el-select v-model="addActForm.tags_id" placeholder="请选择标签">
						<el-option
								v-for="tag in tags"
								:key="tag.tagsId"
								:label="tag.label"
								:value="tag.tagsId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动头图" prop="description">
					<input type="file"  @change="getFile($event)"/>
				</el-form-item>
				<el-form-item label="活动楼层" prop="description">
					<el-upload
							class="upload-demo"
							action="http://jsonplaceholder.typicode.com/posts/"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:before-remove="beforeRemove"
							multiple
							:limit="10"
							:on-exceed="handleExceed"
							:file-list="fileList">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addActFormSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑活动" v-model="editActFormVisible1" :close-on-click-modal="true" :visible.sync="dialogVisible1">
			<el-form :model="editActForm" label-width="80px" :rules="editActFormRules" ref="editForm">
				<el-input v-model="editActForm.id" type="hidden" auto-complete="off"></el-input>
				<el-form-item label="活动ID" prop="id">
					<el-input v-model="editActForm.id" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动名称" prop="title">
					<el-input v-model="editActForm.title"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动描述" prop="description">
					<el-input v-model="editActForm.description" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动描述" prop="timevalue">
				    <el-date-picker
				      v-model="timevalue"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期"
				      format="yyyy-MM-dd HH:mm:ss"
          			  value-format="yyyy-MM-dd HH:mm:ss"
				    >
				    </el-date-picker>
				</el-form-item>

				<el-form-item label="标签" prop="tags_id" >
				<el-select v-model="editActForm.tags_id" placeholder="请选择标签">
			   <el-option
			      v-for="tag in tags"
			      :key="tag.tagsId"
			      :label="tag.label"
			      :value="tag.tagsId">
			    </el-option>
			    </el-select>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="dialogVisible1 = false">取消</el-button>
				<el-button type="primary" @click.native="editActFormSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { activities,addActivity,updateActivity,activitiesByTitle,queryAllTags } from '../../api/api';

	export default {
		data() {
			return {
				fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
					{name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
				files1:[],
				files2:[],
				filters: {
					skuId: ''
				},
				acts: [],
				total: 0,
				page: 1,
				activities:[],
				listLoading: false,
				sels: [],//列表选中列
				dialogVisible: false,
				addActFormVisible: false,//编辑界面是否显示
				addLoading: false,
				tags:[{tag_id:'0',label:"未打标"},{tag_id:'1',label:'直捕'},{tag_id:'2',label:'直采'},{tag_id:'3',label:'民间好货'}],
				addActFormRules: {
					title: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' }
					],
					description:[
						{ required:true,message:'请输入活动描述',trigger:'blur'}
					],
					tags_id:[
						{ required:true,message:'请输入活动标签',trigger:'blur'}
					],
				},
				//新增界面数据
				addActForm: {
					description:'',
					start:'',
					end:'',
					tags_id:'',
					timevalue:''
				},
				dialogVisible1: false,
				editActFormVisible1: false,//编辑界面是否显示
				editLoading: false,
				editActFormRules: {
					title: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' }
					],
					description:[
						{ required:true,message:'请输入活动描述',trigger:'blur'}
					],
					tags_id:[
						{ required:true,message:'请输入活动标签',trigger:'blur'}
					],
				},
				timevalue:'',
				//编辑界面数据
				editActForm: {
					description:'',
					start:'',
					end:'',
					tags_id:'',
					timevalue:''
				},

			}
		},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			getFile(event) {
				this.files1 = event.target.files
			},
			getFile2(event) {
				this.files2 = event.target.files
			},
			getTagLabel(row,column){
				return row.label==null?'未打标':row.label;
			},
			getActivityByTitle(){
				this.listLoading = true;
				this.title = this.filters.title;
				activitiesByTitle(this.title).then((res)=>{
					this.acts = res.data.module;
					this.listLoading = false;
				});
			},
			//显示编辑界面
			editAct: function (index, row) {
				this.editActFormVisible1 = true;
				this.dialogVisible1 = true;
				this.editActForm = Object.assign({}, row);
				if(row.start!=null&&row.end!=null){
					this.timevalue = [row.start,row.end]
				}			
			},
			addAct:function(){
				this.addActFormVisible = true;
				this.dialogVisible = true;
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			handleCurrentChange:function(){

			},
			AllTags(){
				queryAllTags().then((res)=>{
					this.tags = res.data.module;
				});
			},
			editActFormSubmit(){
				if(this.timevalue!=null&&this.timevalue!='undefined'){
					var startTime = this.timevalue[0];
					var endTime = this.timevalue[1];
				}else{
					startTime = '';
					endTime = '';
				}
				if(this.timevalue[0]=='--未设置--'){
					startTime = '';
					endTime = '';
				}
				let para = {activityId:this.editActForm.id,title:this.editActForm.title,
					description:this.editActForm.description,start:startTime,end:endTime,tagsId:this.editActForm.tags_id}
					console.log(para);
				updateActivity(para).then((res)=> {
					if(res.data.success){
						this.dialogVisible1=false,
						this.editActFormVisible1=false,
						this.listLoading = true;
						//NProgress.done();
						this.$message({
							message: '更新成功',
							type: 'success'
						});

						location.reload()//刷新
					}
				})
			},
			addActFormSubmit(){
				if(this.addActForm.timevalue!=null&&this.addActForm.timevalue[0]!=undefined){
					var startTime = this.addActForm.timevalue[0];
					var endTime = this.addActForm.timevalue[1];
				}else {
					startTime = '';
					endTime = '';
				}
				let para = {title:this.addActForm.title,description:this.addActForm.description,start:startTime,end:endTime,tagsId:this.addActForm.tags_id}
				addActivity(para).then((res) => {
					if(res.data.success){
						this.dialogVisible=false,
						this.addActFormVisible=false,
						this.listLoading = true;
						//NProgress.done();
						this.$message({
							message: '添加成功',
							type: 'success'
						});
						location.reload()//刷新
					}
				})
			},
			//获取活动列表
			queryActivityList() {
				this.listLoading = true;
				activities().then((res) => {
					this.acts = res.data.module;
					for (var i = 0; i < this.acts.length; i++) {
					if(this.acts[i].start==null){this.acts[i].start="--未设置--"}else{
							this.acts[i].start = this.$moment(this.acts[i].start).format("YYYY-MM-DD HH:mm:ss");
						}
					}
					for (var i = 0; i < this.acts.length; i++) {
						if(this.acts[i].end==null){this.acts[i].end="--未设置--"}else{
							this.acts[i].end = this.$moment(this.acts[i].end).format("YYYY-MM-DD HH:mm:ss");
						}
					
					}
					this.listLoading = false;
				});
			},

		},
		mounted() {
			this.queryActivityList();
			this.AllTags();
		}
	}

</script>

<style scoped>

</style>