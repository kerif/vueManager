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
          <el-table-column :label="$t('客户ID')"> </el-table-column>
          <el-table-column :label="$t('国家')"> </el-table-column>
          <el-table-column :label="$t('收件电话')"> </el-table-column>
          <el-table-column :label="$t('城市')"></el-table-column>
          <el-table-column :label="$t('收件人')"></el-table-column>
          <el-table-column :label="$t('门牌号')"></el-table-column>
          <el-table-column :label="$t('区号')"></el-table-column>
          <el-table-column :label="$t('邮编')"></el-table-column>
          <el-table-column :label="$t('附加地址')"></el-table-column>
          <el-table-column :label="$t('街道')"></el-table-column>
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
      // this.$request.downloadAddressTmp().then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       title: this.$t('操作成功'),
      //       message: res.msg,
      //       type: 'success'
      //     })
      //     window.open(res.data.url)
      //   } else {
      //     this.$notify({
      //       title: this.$t('操作失败'),
      //       message: res.msg,
      //       type: 'warning'
      //     })
      //   }
      // })
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
        // this.$request.uploadAddressTmp(params).then(res => {
        //   this.tableLoading = false
        //   if (res.ret) {
        //     console.log(res)
        //   } else {
        //     this.$notify({
        //       title: this.$t('操作失败'),
        //       message: res.msg,
        //       type: 'warning'
        //     })
        //   }
        // })
      })
    },
    onUpload(file) {
      this.data = file
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      // return this.$request.uploadFiles(params)
    },
    onDelete(index, addressList) {
      addressList.splice(index, 1)
    },
    saveImport() {}
  }
}
</script>

<style>
.vip-batch-import {
  background: #fff !important;
}
</style>
