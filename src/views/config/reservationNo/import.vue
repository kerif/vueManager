<template>
  <div class="reservation-import">
    <div class="content">
      <el-row class="row">
        <el-col :span="2">{{ $t('快递公司') }}</el-col>
        <el-col :span="6">
          <el-select v-model="data.logistics" style="width: 300px" :placeholder="$t('请选择')">
            <el-option
              v-for="item in logisticsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="2">{{ $t('模板') }}</el-col>
        <el-col :span="6">
          <div class="model" @click="downloadTpl">
            <img
              style="width: 30px; height: 30px; margin-right: 8px"
              src="@/assets/excImg.jpg"
              alt=""
            />
            <span>{{ $t('标准模板') }}</span>
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
            <el-button type="primary" style="width: 100px">{{ $t('导入清单') }}</el-button>
            <span
              v-if="tableData.length && importFileSuccess == 1"
              style="margin-left: 10px; color: green"
              >文件导入成功</span
            >
            <span
              v-if="tableData.length && importFileSuccess == 0"
              style="margin-left: 10px; color: red"
              >文件导入失败</span
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
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" width="55" align="center"></el-table-column>
          <el-table-column :label="$t('操作')" width="90">
            <template slot-scope="scope">
              <el-button
                type="danger"
                plain
                size="small"
                @click="deleteReservation(scope.row.id, scope.$index)"
                >{{ $t('刪除') }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="order_sn" :label="$t('预留单号')"></el-table-column>
        </el-table>
        <!--        <nle-pagination-->
        <!--          style="margin-top: 5px"-->
        <!--          :pageParams="page_params"-->
        <!--          :notNeedInitQuery="false"-->
        <!--        ></nle-pagination>-->
      </el-row>
      <el-row class="row" style="margin-top: 16px">
        <el-col :span="2">{{ $t('备注') }}</el-col>
        <el-col :span="16">
          <el-input type="textarea" :rows="6" :placeholder="$t('请输入内容')" v-model="data.remark">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="sub-row">
        <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
// import NlePagination from '@/components/pagination'
// import { pagination } from '@/mixin'
export default {
  name: 'import',
  // components: { NlePagination },
  // mixins: [pagination],
  data() {
    return {
      data: {
        logistics: null,
        remark: null
      },
      logisticsOptions: [],
      tableData: [],
      fileList: [],
      testFile: null,
      uuid: '',
      importFileSuccess: null
    }
  },
  mounted() {
    this.getExpressData()
    console.log('new')
  },
  methods: {
    //获取快递公司
    getExpressData() {
      this.$request.getExpressValue({ page: 1, size: 1000 }).then(res => {
        console.log(res)
        this.logisticsOptions = res.data
      })
    },
    downloadStreamFile(data, name = 'file', type = 'xlsx') {
      if (data && data.code && data.code === 5000) return
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${name}.${type}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    //下载模板
    downloadTpl() {
      this.$request.downloadReservedTpl().then(res => {
        this.downloadStreamFile(res, this.$t('预留单号导入模板'))
      })
    },
    // onUpload(file) {
    //   let params = new FormData()
    //   params.append(`file`, file)
    //   return this.$request.importReservedNo(params)
    // },
    uploadBaleImg(item) {
      let file = item.file
      let params = new FormData()
      params.append(`file`, file)
      this.$request.importReservedNo(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.tableData = res.data.list
          this.uuid = res.data.uuid
          this.importFileSuccess = 1
          // this.getList()
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
      console.log('fileList', this.fileList)
    },
    submit() {
      if (!this.data.logistics) {
        this.$notify({
          title: this.$t('操作失败'),
          message: '请选择快递公司',
          type: 'warning'
        })
        return
      }
      if (!this.uuid) {
        this.$notify({
          title: this.$t('操作失败'),
          message: '请先导入文件',
          type: 'warning'
        })
        return
      }

      const params = {
        express_company_id: this.data.logistics,
        uuid: this.uuid,
        remark: this.data.remark
      }

      this.$request.saveReservedNo(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.$router.push({ name: 'reservationNo' })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
        this.tableData = res.data
      })
    },
    tableRowClassName({ row }) {
      if (row.exp === 1) {
        return 'warning-row'
      }
      return ''
    },
    deleteReservation(id, index) {
      console.log('@@@@@', id)
      this.$confirm(this.$t('您真的要删除此预留单号吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.delItemNo(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.tableData.splice(index, 1)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
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
