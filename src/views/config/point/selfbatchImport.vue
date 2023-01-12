<template>
  <div class="batch-import-container">
    <el-form label-position="top">
      <el-form-item :label="$t('下载模版')">
        <span class="import-sty">{{
          $t('下载对应模版，如实填写批量下单表后，请以Excel形式保存，点击第二步上传')
        }}</span
        ><br />
        <el-row>
          <el-col :span="10">
            <el-button size="small" @click="downloadTemplate">{{ $t('下载模版') }}</el-button>
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
          <el-table-column :label="$t('自提点名称')" prop="name"> </el-table-column>
          <el-table-column :label="$t('自提点编号')" prop="code"> </el-table-column>
          <el-table-column :label="$t('所属国家/地区')" prop="country_id">
            <template slot-scope="scope">
              <span
                >{{ scope.row.country && scope.row.country.name
                }}{{ scope.row.area && scope.row.area.name
                }}{{ scope.row.sub_area && scope.row.sub_area.name }}</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('详细地址')" prop="address"> </el-table-column>
          <el-table-column :label="$t('联系电话')" prop="contact_info"> </el-table-column>
          <el-table-column :label="$t('联系人')" prop="contactor"></el-table-column>
          <el-table-column :label="$t('支持线路')" prop="express"></el-table-column>
          <el-table-column
            :label="$t(`单箱限长${localization.length_unit ? localization.length_unit : ''}`)"
            prop="limit_length"
          ></el-table-column>
          <el-table-column
            :label="$t(`单箱限重${localization.weight_unit ? localization.weight_unit : ''}`)"
            prop="limit_one_weight"
          >
          </el-table-column>
          <el-table-column
            :label="$t(`整票限重${localization.weight_unit ? localization.weight_unit : ''}`)"
            prop="limit_many_weight"
          ></el-table-column>
          <!-- <el-table-column :label="$t('营业时间')" prop="opening_hours"></el-table-column> -->
          <el-table-column :label="$t('是否同行货')" prop="is_stg">
            <template slot-scope="scope">
              <span>{{ scope.row.is_stg === 0 ? $t('否') : $t('是') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('允许所有订单入库')" prop="allow_all_order">
            <template slot-scope="scope">
              <span>{{ scope.row.allow_all_order === 0 ? $t('否') : $t('是') }}</span>
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
</template>

<script>
import { downloadStreamFile } from '@/utils/index'
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
      this.$request
        .importStationTmp()
        .then(res => {
          downloadStreamFile(res, '自提点批量导入模板')
        })
        .catch(err => {
          console.log(err)
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
        params.append('file', this.data)
        this.$request.stationTmpAnalysis(params).then(res => {
          this.tableLoading = false
          if (res.ret) {
            res.data.forEach(item => {
              this.tableData.push(...item)
            })
            this.tableData.forEach(item => {
              item.express = item.express_lines.map(item => item.name).join(',')
            })
            console.log(this.tableData, 'table')
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
      this.$request.batchAddStation({ ...this.tableData }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.tips,
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
    }
  }
}
</script>

<style>
.batch-import-container {
  background: #fff !important;
}
</style>
