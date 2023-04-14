<template>
  <div class="vip-batch-import">
    <el-form label-position="top">
      <el-form-item :label="$t('下载模版')">
        <span class="import-sty">{{
          $t('下载对应模版，如实填写批量导入表后，请以Excel形式保存，点击第二步上传')
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
              :http-request="uploadBaleImg"
            >
              <el-button size="small" type="primary">{{ $t('点击上传') }}</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-table
          :data="addressList"
          stripe
          border
          class="data-list"
          v-loading="tableLoading"
          height="350"
        >
          <el-table-column type="index" width="55" align="center"></el-table-column>
          <el-table-column :label="$t('客户ID')" prop="user_id"> </el-table-column>
          <el-table-column :label="$t('国家')" prop="country.name"> </el-table-column>
          <el-table-column :label="$t('收件电话')" prop="phone"> </el-table-column>
          <el-table-column :label="$t('城市')" prop="city"></el-table-column>
          <el-table-column :label="$t('收件人')" prop="receiver_name"></el-table-column>
          <el-table-column :label="$t('门牌号')" prop="door_no"></el-table-column>
          <el-table-column :label="$t('区号')" prop="timezone"></el-table-column>
          <el-table-column :label="$t('邮编')" prop="postcode"></el-table-column>
          <el-table-column :label="$t('街道')" prop="street"></el-table-column>
          <el-table-column :label="$t('操作')" width="260">
            <template slot-scope="scope">
              <el-button class="btn-light-red" @click="onDelete(scope.$index, addressList)">{{
                $t('删除')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveImport"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      addressList: [],
      tableLoading: false,
      data: null
    }
  },
  methods: {
    uploadList() {
      this.$request.downloadAddressTmp().then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          window.open(res.data.url)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    handleExceed() {
      return this.$message.warning(this.$t('当前限制上传1个文件'))
    },
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        this.tableLoading = true
        const params = new FormData()
        params.append('template', this.data)
        this.$request.uploadAddressTmp(params).then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.addressList = res.data
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
    onUpload(file) {
      this.data = file
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      return this.$request.uploadFiles(params)
    },
    onDelete(index, addressList) {
      addressList.splice(index, 1)
    },
    saveImport() {
      let addressData = this.addressList.map(item => {
        return {
          ...item,
          country: { id: item.country.id }
        }
      })
      this.$request.batchImportAddress({ ...addressData }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.$router.go(-1)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style>
.vip-batch-import {
  background: #fff !important;
  padding: 0 16px;
}
</style>
