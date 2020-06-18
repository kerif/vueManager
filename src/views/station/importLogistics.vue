<template>
  <div class="import-logistics-container">
    <el-form label-position="top">
      <!-- 公告标题 -->
      <el-form-item :label="$t('下载模版')">
          <span class="import-sty">{{$t('下载对应模版，如实填写批量下单表后，请以Excel形式保存，点击第二步上传')}}</span><br/>
        <el-row>
          <el-col :span="10">
            <el-button @click="uploadList(1)">覆盖模版</el-button>
            <el-button @click="uploadList(2)">追加模版</el-button>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('上传模版')">
        <el-row>
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              action=""
              :limit="3"
              :on-remove="onFileRemove"
              :file-list="fileList"
              :before-upload="beforeUploadImg"
              :http-request="uploadBaleImg">
              <el-button size="small" type="primary">{{$t('点击上传')}}</el-button>
              <!-- <div slot="tip" class="el-upload__tip">{{$t('支持格式：.doc .docx .pdf，单个文件不能超过3MB')}}</div> -->
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-table :data="logisticsList" stripe border class="data-list"
        v-loading="tableLoading" height="350">
          <el-table-column type="index" width="55" align="center"></el-table-column>
          <el-table-column :label="$t('行为')">
            <template slot-scope="scope">
              <span v-if="scope.row.mode === 1">{{$t('覆盖')}}</span>
              <span v-if="scope.row.mode === 2">{{$t('追加')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('快递单号')" prop="logistics_sn">
          </el-table-column>
          <el-table-column :label="$t('快递公司')" prop="logistics_company"></el-table-column>
           <el-table-column :label="$t('轨迹数量')" prop="count"></el-table-column>
          <el-table-column :label="$t('操作人')" prop="operator"></el-table-column>
          <el-table-column :label="$t('最后操作时间')" prop="updated_at"></el-table-column>
          <el-table-column :label="$t('操作')" width="260">
            <template slot-scope="scope">
              <!-- 轨迹 -->
              <el-button class="btn-green" @click="detailed(scope.row.details, scope.row.logistics_sn)">{{$t('详细')}}</el-button>
              <!-- 删除 -->
              <el-button class="btn-light-red" @click="deleteTrack(scope.$index, logisticsList)">{{$t('删除')}}</el-button>
            </template>
          </el-table-column>
          <!-- <template slot="append">
            <div class="append-box">
              <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
            </div>
          </template> -->
        </el-table>
        <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="saveImport"
        :loading="$store.state.btnLoading">{{$t('保存')}}</el-button>
        </el-form-item>
    </el-form>
    <el-dialog :visible.sync="trackDialog" :title="this.sn + $t('的物流轨迹')" class="add-company"
      width="55%" @close="clear">
          <el-table :data="details" style="width: 100%" border>
              <el-table-column :label="$t('创建日期')">
                <template slot-scope="scope">
                  <el-date-picker
                    format="yyyy-MM-dd"
                    v-model="scope.row.created_at"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :placeholder="$t('选择日期')">
                  </el-date-picker>
                  <!-- <el-input v-model="scope.row.start"></el-input> -->
                </template>
                </el-table-column>
                <el-table-column :label="$t('内容')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.content"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('操作')">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="deleteRow(scope.$index, details)" class="btn-light-red">{{$t('移除')}}</el-button>
                </template>
              </el-table-column>
          </el-table>
          <!-- <div slot="footer">
            <el-button @click="show = false">{{$t('取消')}}</el-button>
            <el-button type="primary" @click="addTrack">{{$t('确定')}}</el-button>
          </div> -->
    </el-dialog>
  </div>
</template>
<script>
// import NlePagination from '@/components/pagination'
// import { pagination } from '@/mixin'
export default {
  // components: {
  //   NlePagination
  // },
  // mixins: [pagination],
  data () {
    return {
      fileList: [],
      tableLoading: false,
      logisticsList: [],
      editor: null,
      urlName: '',
      trackDialog: false,
      details: [],
      sn: ''
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getCustomerData({
        name: this.urlName
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.logisticsList = res.data
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        }
      })
    },
    // 详细
    detailed (val, sn) {
      this.trackDialog = true
      this.sn = sn
      this.details = val
    },
    // 下载excel
    uploadList (val) {
      console.log(val)
      this.$request.uploadLgExcel({
        type: val
      }).then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          // window.location.href = this.urlExcel
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
    clear () {
      this.sn = ''
      this.details = []
    },
    // dialog删除
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    // 表格删除
    deleteTrack (index, rows) {
      rows.splice(index, 1)
    },
    // 判断是新增 还是 编辑
    changeText () {
      this.$emit('input', this.editor.txt.html())
    },
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.fileList.push({
              name: item.name,
              url: item.path
            })
          })
          console.log(res.data, 'res.data')
          this.urlName = res.data[0].name
          console.log(this.urlName, 'this.urlName')
          this.getList()
        }
      })
    },
    onUpload (file) {
      let params = new FormData()
      params.append(`files[${0}][file]`, file)
      return this.$request.uploadFiles(params)
      // console.log(1111)
      // this.getList()
    },
    beforeUploadImg (file) {
      // console.log(file)
      // const mimeList = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/wps-writer']
      // if (mimeList.indexOf(file.type) === -1) {
      //   this.$message.error(this.$t('请上传格式正确的文件'))
      //   return false
      // } else if (file.size > 1024 * 1024 * 3) {
      //   this.$message.error(this.$t('上传图片大小不能超过3MB'))
      //   return false
      // }
      // return true
    },
    saveImport () {
      this.$request.saveLgExcel({
        ...this.logisticsList
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.tips,
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
    },
    // 文件删除
    onFileRemove (file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss">
.import-logistics-container {
  background-color: #fff !important;
  .import-sty {
    color: #cdcdcd;
  }
}
</style>
