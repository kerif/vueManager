<template>
  <div class="batch-shelves-container">
    <el-form label-position="top">
      <!-- 公告标题 -->
      <el-form-item :label="$t('下载模版')">
        <span>{{
          $t('下载对应模版，如实填写批量下单表后，请以Excel形式保存，点击第二步上传')
        }}</span
        ><br />
        <el-row>
          <el-col :span="10">
            <el-button @click="uploadList">{{ $t('下载模版') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('上传模版')">
        <el-row>
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              action=""
              :limit="1"
              :on-remove="onFileRemove"
              :file-list="fileList"
              :on-exceed="handleExceed"
              :before-upload="beforeUploadImg"
              :http-request="uploadBaleImg"
            >
              <el-button size="small" type="primary">{{ $t('点击上传') }}</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="packageList"
          stripe
          border
          class="data-list"
          v-loading="tableLoading"
          height="350"
        >
          <el-table-column type="index" width="55" align="center"></el-table-column>
          <el-table-column :label="$t('仓库')" prop="warehouse_name"> </el-table-column>
          <el-table-column :label="$t('货位')" prop="location"></el-table-column>
          <!-- 上架数量 -->
          <!-- <el-table-column :label="$t('上架数量')" prop="packages_count"> </el-table-column> -->
          <el-table-column :label="$t('包裹')" prop="express_num"></el-table-column>
          <el-table-column :label="$t('操作')" width="260">
            <template slot-scope="scope">
              <!-- 删除 -->
              <el-button class="btn-light-red" @click="deleteTrack(scope.$index, packageList)">{{
                $t('删除')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="packageList.length">
          <span>货位:{{ locations }} 个</span
          ><span style="margin-left: 10px">上架包裹:{{ packages }} 个</span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="saveImport">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      tableLoading: false,
      packageList: [],
      localization: {},
      urlName: '',
      file: '',
      locations: '',
      packages: ''
    }
  },
  created() {},
  methods: {
    //上传获取解析后的数据
    // getList() {
    //   this.tableLoading = true
    //   this.$request.getPackageTemplate().then(res => {
    //     this.tableLoading = false
    //     if (res.ret) {
    //       this.packageList = res.data
    //       this.localization = res.localization
    //     } else {
    //       this.$notify({
    //         title: this.$t('操作失败'),
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
    // },
    // 下载excel
    uploadList() {
      this.$request.getPackageTemplate().then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          window.open(this.urlExcel)
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
    },
    handleExceed() {
      return this.$message.warning(this.$t('当前限制上传1个文件'))
    },
    // 自定义上传方法
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        if (res.ret) {
          this.packageList = res.data.data
          this.locations = res.data.locations_count
          this.packages = res.data.packages_count
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onUpload(file) {
      // 通过FormData对象上传文件
      let params = new FormData()
      params.append(`file`, file)
      return this.$request.importPackageData(params)
    },
    // 文件删除
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    saveImport() {
      this.$request
        .savePackageData({
          ...this.packageList
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
            this.$router.push({ name: 'orderlist', query: { activeName: '2' } })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 表格删除
    deleteTrack(index, rows) {
      rows.splice(index, 1)
    },
    beforeUploadImg() {}
  }
}
</script>

<style lang="scss">
.batch-shelves-container {
  padding: 16px;
  background-color: #fff !important;
}
</style>
