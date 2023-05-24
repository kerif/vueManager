<template>
  <div class="app-version-container">
    <div style="background-color: #fff; padding: 15px 20px">
      <div class="add-btn">
        <el-button @click.native="addEditVersion">{{ $t('添加更新') }}</el-button>
      </div>
      <div style="height: calc(100vh - 230px)">
        <el-table
          :data="versionData"
          v-loading="tableLoading"
          class="data-list"
          border
          stripe
          height="calc(100vh - 250px)"
          ref="table"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
        >
          <el-table-column type="index" :label="$t('#')"></el-table-column>
          <el-table-column :label="$t('版本')" prop="version"></el-table-column>
          <el-table-column :label="$t('更新内容')" prop="content"></el-table-column>
          <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
          <el-table-column :label="$t('创建人')" prop="creator.name"></el-table-column>
          <el-table-column :label="$t('下载')">
            <template slot-scope="scope">
              <el-button type="text" @click="downloadFile(scope.row.file_path)">{{
                scope.row.file_name
              }}</el-button>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column :label="$t('操作')" width="230">
            <template slot-scope="scope">
              <el-button class="btn-dark-green" @click="editVersion(scope.row)">{{
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
    <el-dialog :visible.sync="show" :title="$t('添加/修改更新')" width="30%" @close="clear">
      <el-form
        class="demo-ruleForm"
        :model="ruleForm"
        ref="ruleForm"
        label-position="right"
        label-width="80px"
      >
        <el-form-item :label="$t('版本号')" required>
          <el-input v-model="ruleForm.version" :placeholder="$t('请输入版本号')"> </el-input>
        </el-form-item>
        <el-form-item :label="$t('更新内容')">
          <el-input
            type="textarea"
            v-model="ruleForm.content"
            resize="none"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :placeholder="$t('请输入更新内容')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('上传APK')">
          <el-upload
            class="upload-demo"
            action=""
            :before-upload="beforeUploadAPK"
            :http-request="uploadAPK"
            :show-file-list="false"
            accept="application/vnd.android.package-archive"
          >
            <el-button style="color: black">{{ $t('上传APK') }}</el-button>
          </el-upload>
          <div v-show="ruleForm.file_name">
            <i class="el-icon-document icon-ducoment" />
            <span>{{ ruleForm.file_name }}</span>
          </div>
          <div v-show="uploadInfo.loading">
            <el-progress :percentage="uploadInfo.progress"></el-progress>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :loading="$store.state.btnLoading" @click="onSubmit">{{
          $t('提交')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
import baseUrl from '@/lib/axios/baseApi'
export default {
  data() {
    return {
      versionData: [], // 表格数据
      tableLoading: false,
      show: false,
      ruleForm: {
        version: '',
        content: '',
        file_name: '',
        file_path: ''
      },
      fileList: [],
      files: null,
      editor: null,
      cosBucketConfig: {
        bucket: '',
        region: '',
        storageUrl: '',
        urlPath: ''
      },
      uploadInfo: {
        progress: 0,
        loading: false
      },
      cos: null
    }
  },
  name: 'appVersionList',
  mounted() {
    this.getList()
    this.getCosConfig()
    this.getCos()
  },
  methods: {
    // apk 版本列表
    getList() {
      this.tableLoading = true
      this.$request.getAppVersionList().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.versionData = res.data
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        }
      })
    },

    // 新增按钮
    addEditVersion() {
      this.show = true
    },

    // 获取cos上传配置
    getCosConfig() {
      this.$request.getCosUploadConfig().then(res => {
        if (res.ret) {
          this.cosBucketConfig.bucket = res.data.bucket
          this.cosBucketConfig.region = res.data.region
          this.cosBucketConfig.urlPath = res.data.url_path
          this.cosBucketConfig.storageUrl = res.data.base_path.slice(1)
        }
      })
    },

    // cos 上传对象
    getCos() {
      this.cos = new COS({
        getAuthorization: async (options, callback) => {
          const res = await this.$request.getCosUploadConfig()
          if (res.ret === 0) return
          callback({
            TmpSecretId: res.data.configs.credentials.tmpSecretId,
            TmpSecretKey: res.data.configs.credentials.tmpSecretKey,
            SecurityToken: res.data.configs.credentials.sessionToken,
            StartTime: res.data.configs.startTime,
            ExpiredTime: res.data.configs.expiredTime
          })
        }
      })
    },

    // 编辑版本
    editVersion(item) {
      this.ruleForm = item
      this.show = true
    },

    // 删除版本
    deleteVersion(id) {
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
    downloadFile(url) {
      window.open(url)
    },

    beforeUploadAPK(file) {
      let fileSize = Number(file.size / 1024 / 1024)
      if (fileSize > 50) {
        this.$message.error(this.$t('文件大小不能超过50M,请重新上传'))
        return false
      }
      return true
    },

    // 文件上传
    uploadAPK(item) {
      if (this.uploadInfo.loading) return
      if (!this.ruleForm.version) {
        return this.$message.error(this.$t('请先输入版本号'))
      }
      const file = item.file
      this.ruleForm.file_name = `${this.ruleForm.version}-${file.name}`
      this.cos.uploadFile(
        {
          Bucket: this.cosBucketConfig.bucket,
          Region: this.cosBucketConfig.region,
          Key: `${this.cosBucketConfig.storageUrl}/${this.ruleForm.file_name}`,
          Body: file,
          SliceSize: 1024 * 1024 * 3,
          onProgress: progress => {
            this.uploadInfo.progress = Number.parseInt(progress.percent * 100)
          },
          onFileFinish: err => {
            this.uploadInfo.loading = false
            if (err) {
              this.$message.error(err.error)
            } else {
              this.$message.success(this.$t('上传成功'))
              this.ruleForm.file_path = `${baseUrl.IMAGE_URL}${this.cosBucketConfig.urlPath}/${this.ruleForm.file_name}`
            }
          },
          onTaskReady: () => {
            this.uploadInfo.loading = true
            this.uploadInfo.progress = 0
          }
        },
        err => {
          if (err) {
            this.$message.error(err.error)
          }
        }
      )
    },

    // 提交表单
    async onSubmit() {
      let res
      if (this.ruleForm.id) {
        res = await this.$request.editApkVersion(this.ruleForm.id, this.ruleForm)
      } else {
        res = await this.$request.addVersion(this.ruleForm)
      }
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
    },
    clear() {
      this.uploadInfo.loading = false
      this.uploadInfo.progress = 0
      this.ruleForm.id = ''
      this.ruleForm.content = ''
      this.ruleForm.version = ''
      this.ruleForm.file_name = ''
      this.ruleForm.file_path = ''
    }
  }
}
</script>
<style lang="scss">
.app-version-container {
  .icon-ducoment {
    margin-right: 5px;
  }
  // 新增按钮
  .add-btn {
    button {
      background-color: #fff !important;
      color: #3540a5;
      border: 1px solid #3540a5;
      &:hover {
        background: #3540a5 !important;
        color: #fff;
      }
    }
  }
  .el-dialog__header {
    background-color: #3540a5;
    .el-dialog__title {
      color: #fff;
      font-size: 14px;
    }
  }
  .el-dialog__headerbtn .el-dialog__close:hover {
    color: #909399;
  }

  .el-upload button {
    padding: 10px 30px !important;
  }
}
</style>
