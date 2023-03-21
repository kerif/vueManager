<template>
  <div class="reservation-import">
    <div class="content">
      <el-row class="row">
        <el-col :span="2">{{ $t('箱号') }}</el-col>
        <el-col :span="6">
          <el-select
            v-model="data.system_box_id"
            style="width: 300px"
            clearable
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.box_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="2">{{ $t('模板') }}</el-col>
        <el-col :span="12">
          <div style="display: flex">
            <div class="model" @click="downloadTpl(1)">
              <img
                style="width: 30px; height: 30px; margin-right: 8px"
                src="@/assets/excImg.jpg"
                alt=""
              />
              <span>{{ $t('标准模板') }}</span>
            </div>
            <div class="model" @click="downloadTpl(2)">
              <img
                style="width: 30px; height: 30px; margin-right: 8px"
                src="@/assets/excImg.jpg"
                alt=""
              />
              <span>{{ $t('台湾模板') }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :offset="2">
          <el-upload
            class="upload-demo"
            action=""
            :http-request="uploadBaleImg"
            :show-file-list="false"
            :file-list="fileList"
          >
            <el-button type="primary" style="width: 100px">{{ $t('上传模板') }}</el-button>
            <span
              v-if="tableData.length && importFileSuccess == 1"
              style="margin-left: 10px; color: green"
              >{{ $t('文件导入成功') }}</span
            >
            <span
              v-if="tableData.length && importFileSuccess == 0"
              style="margin-left: 10px; color: red"
              >{{ $t('文件导入失败') }}</span
            >
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="{ background: '#f3f3f3' }"
          height="calc(100vh - 550px)"
        >
          <el-table-column type="index" label="#" width="55" align="center"></el-table-column>
          <el-table-column prop="box_sn" :label="$t('预留箱号')"></el-table-column>
          <el-table-column prop="clearance_area" :label="$t('通关专区')"></el-table-column>
          <el-table-column prop="customs_broker" :label="$t('报关业者')"></el-table-column>
        </el-table>
      </el-row>
      <el-row class="row" style="margin-top: 16px">
        <el-col :span="2">{{ $t('备注') }}</el-col>
        <el-col :span="16">
          <el-input type="textarea" :rows="6" :placeholder="$t('请输入内容')" v-model="data.remark">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="sub-row">
        <el-button type="primary" @click="onSubmit">{{ $t('提交') }}</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { downloadStreamFile } from '@/utils/index'
export default {
  data() {
    return {
      options: [],
      tableData: [],
      fileList: [],
      importFileSuccess: null,
      data: {
        system_box_id: '',
        remark: ''
      }
    }
  },
  created() {
    this.getBoxList()
  },
  methods: {
    getBoxList() {
      this.$request.presetPackList().then(res => {
        if (res.ret) {
          this.options = res.data.map(item => {
            return {
              id: item.id,
              box_name:
                item.name +
                '(' +
                '长' +
                ':' +
                item.length +
                ',' +
                '宽' +
                ':' +
                item.width +
                ',' +
                '高' +
                ':' +
                item.height +
                ')'
            }
          })
        }
      })
    },
    downloadTpl(type) {
      this.$request.downloadReservedTmp(type).then(res => {
        downloadStreamFile(res, '箱/袋号模板')
      })
    },
    uploadBaleImg(item) {
      let file = item.file
      let params = new FormData()
      params.append(`file`, file)
      this.$request.importReservedNum(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.tableData = res.data.map(item => {
            return {
              box_sn: item[0],
              clearance_area: item[1],
              customs_broker: item[2]
            }
          })
          this.importFileSuccess = 1
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
          this.importFileSuccess = 0
        }
      })
      this.fileList.push({
        name: 'food2.jpeg',
        url:
          'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      })
    },
    onSubmit() {
      if (!this.data.system_box_id) {
        return this.$message.error(this.$t('请选择箱号'))
      } else if (!this.tableData.length) {
        return this.$message.error(this.$t('请上传模板'))
      }

      const box_sns = []
      this.tableData.forEach(item => {
        box_sns.push(item)
      })
      this.$request
        .saveReservedData({
          ...this.data,
          box_sns
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.$router.push({
              name: 'boxReservedNum'
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

<style lang="scss">
.el-table .warning-row {
  background: #ffccc7;
}
.reservation-import {
  padding: 16px !important;
  height: calc(100% - 65px);
  .content {
    height: 100%;
    background-color: white;
    padding: 16px;
    .row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    .model {
      width: 100px;
      height: 40px;
      text-align: 40px;
      border: 1px solid #c8c8c8;
      display: flex;
      align-items: center;
      width: 200px;
      box-sizing: border-box;
      justify-content: center;
      font-size: 16px;
      margin-right: 30px;
      cursor: pointer;
    }
    .sub-row {
      display: flex;
      justify-content: flex-end;
    }
  }
  .el-table th.el-table__cell > .cell {
    background-color: #f3f3f3;
    text-align: center;
  }
}
</style>
