<template>
    <div class="appVersion-list-container">
        <div style="background-color: #fff;padding:15px 20px">
            <div class="addbtn">
                <el-button @click.native="addEditVersion">{{ $t('添加更新') }}</el-button>
            </div>
            <div style="height: calc(100vh - 230px)">
                <el-table :data="versionData" v-loading="tableLoading" class="data-list" border stripe
                    height="calc(100vh - 250px)" ref="table"
                    :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
                    <el-table-column type="index" :label="$t('#')"></el-table-column>
                    <el-table-column :label="$t('版本')" prop="version"></el-table-column>
                    <el-table-column :label="$t('更新内容')" prop="content"></el-table-column>
                    <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
                    <el-table-column :label="$t('创建人')" prop="creator.name"></el-table-column>
                    <el-table-column :label="$t('下载')">
                        <a @click="downloadFile(scope.row.file_name, scope.row.file_path)">APK</a>
                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column :label="$t('操作')" width="230">
                        <template slot-scope="scope">
                            <el-button class="btn-dark-green" @click="editVersion(scope.row.id)">{{
                                $t('编辑')
                            }}</el-button>
                            <el-button class="btn-light-red" @click="deleteVersion(scope.row.id)">{{
                                $t('删除')
                            }}</el-button>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <el-empty :image-size="200"></el-empty>
                    </template>
                </el-table>
            </div>
        </div>

        <!-- 修改弹框 -->
        <el-dialog
            :visible.sync="show"
            :title="$t('添加/修改更新')"
            width="30%"
            @close="clear"
            >
            <el-form class="demo-ruleForm" :model="ruleForm" ref="ruleForm" label-position="right" label-width="80px">
                <el-form-item :label="$t('版本号')" required>
                    <el-input v-model="ruleForm.version" :placeholder="$t('请输入版本号')"> </el-input>
                </el-form-item>
                <el-form-item :label="$t('更新内容')">
                    <el-input type="textarea" v-model="ruleForm.content" resize="none" :autosize="{ minRows: 4, maxRows: 4 }"
                        :placeholder="$t('请输入更新内容')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('上传APK')">
                    <el-upload
                        class="upload-demo"
                        action="apk/file"
                        :limit="1"
                        :multiple="false"
                        :on-remove="onFileRemove"
                        :on-exceed="handleExceed"
                        :before-upload="beforeUploadAPK"
                        :before-remove="beforeRemove"
                        :http-request="uploadAPK"
                    >
                        <el-button style="color: black">{{
                            $t('上传APK')
                        }}</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="confirmBtn" @click="confirm('ruleForm')">{{ $t('提交') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import COS from 'cos-js-sdk-v5'
// import baseApi from '@/lib/axios/baseApi'
import editor from '@/components/editor.vue'

export default {
    components: { editor },
    data() {
        return {
            versionData: [], // 表格数据
            tableLoading: false,
            show: false,
            ruleForm: {
                version:'',
                content:'',
                file_name: '',
                file_path: '',
            },
            fileList:[],
            files: null,
            editor: null,
        }
    },
    name: 'appVersionList',
    mounted() {
        this.getList()
    },
    methods: {
        // 获取所有
        getList() {
            this.tableLoading = true
            this.$request.getAppVersionList().then(res => {
                console.log(res)
                this.tableLoading = false
                if (res.ret) {
                    this.versionData = res.data
                    this.$nextTick(() => {
                        this.$refs.table.doLayout()
                    })
                } else {
                    this.$notify({
                        title: this.$t('操作失败'),
                        message: res.msg,
                        type: 'warning'
                    })
                }
            })
        },

        // 新增按钮
        addEditVersion(){
            this.show=!this.show
        },
        // 编辑按钮
        // editVersion(id){
        //     this.versionData.filter(item=>{
        //         item.id=
        //     })
        //     this.ruleForm=res.data
        // }

        // 删除按钮
        deleteVersion(id){
            this.$confirm(this.$t('您确定要删除吗'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
            }).then(() => {
                this.$request.deleteApk(id).then(res => {
                    if (res.ret) {
                        this.$notify({
                            title: this.$t('操作成功'),
                            message: res.msg,
                            type: 'success'
                        })
                        this.getList()
                    } else {
                        this.$notify({
                            title: this.$t('操作失败'),
                            message: res.msg,
                            type: 'warning'
                        })
                    }
                })
            })
        },

        // 文件下载
        downloadFile(name, url){

        },
        


        // 单个查询
        // getDialog() {
        //     this.$request.getSuggests(this.dialogId).then(res => {
        //         if (res.ret) {
        //             this.ruleForm = res.data
        //             res.data.qr_code && (this.baleImgList[0] = res.data.qr_code)
        //         } else {
        //             this.$message({
        //                 message: res.msg,
        //                 type: 'error'
        //             })
        //         }
        //     })
        // },
       
        beforeUploadAPK(file) {
            let fileSize = Number(file.size / 1024 / 1024);
            if (fileSize > 50) {
                this.$message.error(this.$t('文件大小不能超过50M,请重新上传'))
                return false
            }
            if (file.type!="application/vnd.android.package-archive") {
                this.$message.error("上传文件只能是 apk 格式!");
                return false
            }
            return true
        },
        // 删除文件
         onFileRemove(file, fileList) {
            this.fileList = fileList
        },
        beforeRemove(file, fileList) {
            return this.$confirm(this.$t(`确定移除 ${file.name}?`))
        },
        handleExceed() {
            return this.$message.warning(this.$t('文件数量超过限制'))
        },
        // 文件上传
        uploadAPK(item) {
            let file = item.file
            console.log(file)
            let params = new FormData()
            params.append(`file`, file)
            console.log(params.getAll('file'))

            this.$request.uploadApk(params).then(res=>{
                
                if (res.ret) {
                    console.log(res.data)
                     this.ruleForm.file_name= res.data.name
                     this.ruleForm.file_path = res.data.path
                    this.$notify({
                        title: this.$t('操作成功'),
                        message: res.msg,
                        type: 'success'
                    })
                } else {
                    this.$notify({
                        title: this.$t('操作失败'),
                        message: res.msg,
                        type: 'warning'
                    })
                }
            })

            // this.onUpload(file).then(res => {
            //     if (res.ret) {
            //         this.$notify({
            //             title: this.$t('操作成功'),
            //             message: res.msg,
            //             type: 'success'
            //         })
            //     } else {
            //         this.$notify({
            //             title: this.$t('操作失败'),
            //             message: res.msg,
            //             type: 'warning'
            //         })
            //     }
            // })
        },
        // onUpload(file) {
        //     console.log(file)
        //     // 通过FormData对象上传文件
        //     let params = new FormData()
        //     params.append(`file`, file)
        //     this.files = new FormData()
        //     this.files.append(`file`, file)
        //     console.log(this.files)
        //     return this.$request.uploadApk(params)
        // },



        // 提交表单
        confirm() {
            // this.$refs.uploadFile.submit()
            // console.log(222222)
            // console.log(this.ruleForm.file)

            // const formDatas = new FormData();
            // formDatas.append("file", this.ruleForm.file);

            // this.$request.uploadFiles(formDatas)
            // console.log((formDatas.getAll('file'))[0])

            console.log(this.fileList)

            // this.ruleForm.file=  this.fileList
            
            // formDatas.append("version", this.ruleForm.version);
            // formDatas.append("content", this.ruleForm.content);
            
           
            this.$request.addVersion(this.ruleForm).then(res => {
                console.log(res.msg)
                console.log(res)
                if (res.ret) {
                    this.$notify({
                        type: 'success',
                        title: this.$t('操作成功'),
                        message: res.msg
                    })
                    this.show = false
                    this.getList()
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    })
                }
                this.show = false
            })
        },
        clear() {
            this.fileList = []
        },
    }
}
</script>
<style lang="scss">
.appVersion-list-container {
    background-color: #fff;

     // 新增按钮
    .addbtn {
        button{
            background-color: #fff !important;
            color: #3540a5;
            border: 1px solid #3540a5;
            &:hover {
                background: #3540a5 !important;
                color: #fff;
            }
        }
    }
    .el-dialog__header{
        background-color: #3540A5;
        .el-dialog__title{
            color: #fff;
            font-size: 14px;
        }
    }
    .el-dialog__headerbtn .el-dialog__close:hover{
        color: #909399;
    }
    .confirmBtn{
        background-color: #3B8ECE;
        color: #fff;
        padding-left: 40px !important;
        padding-right: 40px !important;
        &:hover {
            background: #5598cc;
        }
    }
    .el-upload button{
         padding: 10px 30px !important;
    }
    // .el-dialog__body {
    //     .img_box {
    //         text-align: center;

    //         img {
    //             width: 300px !important;
    //         }
    //     }
    // }
}
</style>
