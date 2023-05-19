<template>
  <div>
    <div style='color: #ffa943;margin-bottom: 16px'>{{ $t('批量预报：通过EXCEL模板导入，协助量大的客户进行包裹预报') }}</div>
    <div class="batch-forecast-container">
      <el-form label-position="top">
        <el-form-item :label="$t('下载模版')">
        <span class="import-sty">{{
            $t('下载对应模版，如实填写批量下单表后，请以Excel形式保存，点击第二步上传')
          }}</span
        ><br />
          <el-row>
            <el-col :span="10">
              <el-button @click="downloadTemplate">{{ $t('下载模版') }}</el-button>
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
            stripe
            border
            class="data-list"
            :data="tableData"
            v-loading="tableLoading"
            height="350"
          >
            <el-table-column type="index" width="55" align="center"></el-table-column>
            <el-table-column :label="$t('客户ID')" prop="user_id"> </el-table-column>
            <el-table-column :label="$t('物品名称')" prop="package_name"> </el-table-column>
            <el-table-column :label="$t('包裹单号')" prop="express_num"></el-table-column>
            <el-table-column :label="$t('快递名称')">
              <template slot-scope="scope">
                <span>{{ scope.row.express ? scope.row.express.name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('商品类型')">
              <template slot-scope="scope">
                <span v-for="item in scope.row.categories" :key="item.id">{{ item.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('商品数量')" prop="qty"></el-table-column>
            <el-table-column :label="$t('物品价值')" prop="package_value"></el-table-column>
            <el-table-column :label="$t('物品属性')">
              <template slot-scope="scope">
              <span v-for="item in scope.row.prop" :key="item.id"
              ><span
                class="prop-box"
                :style="'background-color:' + item.color + ';color:' + item.font_color"
              >{{ item.cn_name }}</span
              ></span
              >
              </template>
            </el-table-column>
            <el-table-column :label="$t('商品备注')" prop="remark"></el-table-column>
            <el-table-column :label="$t('仓库')">
              <template slot-scope="scope">
                <span>{{ scope.row.warehouse ? scope.row.warehouse.warehouse_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')" width="260">
              <template slot-scope="scope">
                <el-button class="btn-light-red" @click="deleteImportData(scope.$index, tableData)">{{
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
            @click="saveData"
            :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      data: null,
      tableLoading: false,
      localization: {},
      tableData: []
    }
  },
  methods: {
    downloadTemplate() {
      this.$request.getForecastTemplate().then(res => {
        if (res.ret) {
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
    handleExceed() {
      return this.$message.warning(this.$t('当前限制上传1个文件'))
    },
    onFileRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeUploadImg() {},
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        this.tableLoading = true
        console.log(res)
        const params = new FormData()
        params.append('template', this.data)
        this.$request.parseData(params).then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.tableData = res.data
            this.localization = res.localization
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
    deleteImportData(index, rows) {
      rows.splice(index, 1)
    },
    saveData() {
      this.$request.importForecast({ ...this.tableData }).then(res => {
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
    }
  }
}
</script>

<style>
.batch-forecast-container {
  padding: 16px;
  background: #fff !important;
  .import-sty {
    color: #cdcdcd;
  }
}
</style>
