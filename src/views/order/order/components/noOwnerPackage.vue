<template>
  <div class="no-owner-container">
    <el-table
      class="data-list"
      border
      stripe
      :data="ownerData"
      @selection-change="selectionChange"
      v-loading="tableLoading"
      height="calc(100vh - 275px)"
      ref="table"
    >
      <!-- height="550" -->
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 快递单号 -->
      <el-table-column :label="$t('快递单号')" width="155">
        <template slot-scope="scope">
          <el-button @click="oderDetails(scope.row.id)" type="text">{{
            scope.row.express_num
          }}</el-button>
          <span
            :title="$t('复制单号')"
            class="copy-number"
            @click="copyNumber(scope.row.express_num)"
          >
            <i class="el-icon-copy-document"></i>
          </span>
        </template>
      </el-table-column>
      <!-- 包裹编码 -->
      <el-table-column :label="$t('包裹编码')" prop="code"></el-table-column>
      <!-- 物品价值 -->
      <el-table-column
        :label="$t('包裹重量') + this.localization.weight_unit"
        prop="package_weight"
        width="155"
      ></el-table-column>
      <!-- 物品属性 -->
      <el-table-column :label="$t('物品属性')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{ item.cn_name }}
          </span>
        </template>
      </el-table-column>
      <!-- 货位 -->
      <!-- <el-table-column label="货位" prop="location"></el-table-column> -->
      <!-- 规格 -->
      <el-table-column
        :label="$t('规格') + this.localization.length_unit"
        prop="dimension"
        width="120px"
      ></el-table-column>
      <!-- 提交时间 -->
      <el-table-column :label="$t('提交时间')" prop="created_at" width="155"> </el-table-column>
      <!-- 仓库 -->
      <el-table-column :label="$t('仓库')" prop="warehouse.warehouse_name" width="155">
      </el-table-column>
      <el-table-column :label="$t('货位')" prop="location"> </el-table-column>
      <!-- 包裹图片 -->
      <el-table-column :label="$t('包裹图片')" prop="package_pictures" width="150">
        <template slot-scope="scope">
          <span
            v-for="(item, index) in scope.row.package_pictures"
            :key="index"
            style="cursor: pointer"
            @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item}`), (imgVisible = true)"
          >
            <img :src="`${$baseUrl.IMAGE_URL}${item}`" style="width: 40px; margin-right: 5px" />
          </span>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
        </div>
      </template> -->
      <el-table-column :label="$t('操作')" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="getLabel(scope.row.id)" class="btn-pink">{{
            $t('打印标签')
          }}</el-button>
          <el-button class="btn-deep-blue" @click="goClaim(scope.row.id)">{{
            $t('认领')
          }}</el-button>
          <!-- <el-button class="btn-deep-purple">详细</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="noDate" v-else>{{$t('暂无数据')}}</div> -->
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="show" :title="$t('预览打印标签')" class="props-dialog" width="45%">
      <div class="dialogSty">
        <iframe class="iframe" :src="urlHtml"></iframe>
      </div>
      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updateLabel">{{ $t('下载') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import OrderListSearch from '../order/components/orderListSearch'
// import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    // SearchGroup,
    NlePagination
    // OrderListSearch
  },
  name: 'noOwner',
  mixins: [pagination],
  props: {
    activeName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableLoading: false,
      agent_name: '',
      agentData: [],
      localization: {},
      ownerData: [],
      claimData: [],
      storageList: [],
      timeList: [],
      in_storage_end_date: '',
      in_storage_begin_date: '',
      begin_date: '',
      end_date: '',
      imgVisible: false,
      urlHtml: '',
      show: false,
      labelId: '',
      imgSrc: '',
      hasFilterCondition: false,
      express_num: ''
    }
  },
  methods: {
    // storage (id, expressNum, userId, userName, props, warehouseName) {
    //   console.log(warehouseName, 'warehouseName')
    //   this.$router.push({ name: 'editStorage', params: { id: id, express_num: expressNum, user_id: userId, user_name: userName, warehouse_id: warehouseName }, query: { props: JSON.stringify(props) } })
    // },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 详情
    oderDetails(id) {
      this.$router.push({ name: 'oderDetails', params: { id: id } })
    },
    goExpress(expressNum) {
      console.log(expressNum)
      window.open(`https://m.kuaidi100.com/app/query/?coname=uc&nu=${expressNum}`)
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      this.$confirm(this.$t('您真的要删除这个包裹吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request
          .deleteNoOwner({
            DELETE: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    onAgentChange() {
      this.page_params.page = 1
      this.page_params.handleQueryChange('agent', this.agent_name)
      this.getList()
    },
    // 打印标签
    getLabel(id) {
      this.labelId = id
      this.show = true
      this.$request.checkPackageLabel(id).then(res => {
        if (res.ret) {
          this.urlHtml = res.data.url
          // this.urlImport = res.data.url
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
    // 认领记录
    claimList() {
      dialog({ type: 'claimRecord' })
    },
    // 导出清单
    uploadList() {
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        warehouse: this.agent_name
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.uploadNoOwner(params).then(res => {
        if (res.ret) {
          // this.urlExcel = res.data.url
          // window.location.href = this.urlExcel
          // window.open(this.urlExcel)
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
    // 确认下载标签
    updateLabel() {
      this.show = false
      console.log(this.labelId, 'this.labelId')
      this.$request.updatePackagePdf(this.labelId).then(res => {
        if (res.ret) {
          window.open(res.data.url)
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
    // 获取无人认领列表
    getList() {
      this.tableLoading = true
      this.ownerData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        warehouse: this.agent_name
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getNoOwner(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.ownerData = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
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
    // 认领包裹
    goClaim(id) {
      dialog({ type: 'claim', id: id }, () => {
        this.getList()
      })
    },
    // 获取代理列表
    getAgentData() {
      this.$request.getSimpleList().then(res => {
        this.agentData = res.data
      })
    },
    // 提交时间
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      // this.getList()
    },
    // 重置筛选
    resetForm() {
      this.timeList = []
      this.agent_name = ''
    },
    //复制单号
    copyNumber(orderSn) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', orderSn)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    // 搜索
    submitForm() {
      this.onTime(this.timeList)
      this.onAgentChange()
    },
    goMatch() {}
  },
  activated() {
    this.getAgentData()
    this.getList()
  },
  created() {
    this.getAgentData()
    this.getList()
  }
}
</script>

<style lang="scss">
.data-list {
  max-height: calc(100vh - 200px);
  overflow: auto;
}
.no-owner-container {
  .tabLength {
    width: 300px !important;
    display: inline-block;
  }
  .headerList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headr-r {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .searchGroup {
        width: 25%;
        margin-right: 10px;
      }
    }
  }

  .agentRight {
    // display: inline-block;
    float: right;
  }
  .changeTime {
    display: inline-block;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
  .copy-number {
    padding-left: 5px;
    cursor: pointer;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .chooseOrder {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .operating-btn {
    margin-bottom: 5px;
  }
  .dialogSty {
    margin-left: 30px;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .chooseStatus {
    // width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
  }
  .import-list {
    display: inline-block;
    margin-left: 10px;
  }
  .bottom-sty {
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
.order-list-search {
  font-size: 14px;
  background: #fff;
  margin: 10px 0;
  padding: 10px;
  overflow: hidden;
  .changeTime {
    display: inline-block;
    margin-right: 20px;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
    .shipments {
      display: inline-block;
    }
  }
  .chooseStatus {
    // width: 150px;
    display: inline-block;
  }
  .submit {
    float: right;
    margin-top: 10px;
  }
}
</style>
