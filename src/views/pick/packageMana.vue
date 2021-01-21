<template>
  <div class="package-management-container">
    <div class="package-top">
      <div class="top-left">
        <h3 class="auto-sty">{{$t('自提点信息')}}</h3>
        <el-select @change="changePick" v-model="XStationId" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button class="location-sty">{{$t('仓位管理')}}</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="100px" label-position="right">
        <el-row class="container-center" :gutter="20">
          <el-col :span="7">
            <span class="leftWidth">{{$t('所属国家/地区')}}</span>
            <span>{{form.country && form.country.name}}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{$t('联系人')}}</span>
            <span>{{form.contact_info}}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{$t('计佣方式')}}</span>
            <!-- <span>{{111}}</span> -->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="7">
            <span class="leftWidth">{{$t('详细地址')}}</span>
            <span>{{form.address}}</span>
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{$t('联系电话')}}</span>
            <!-- <span>{{111}}</span> -->
          </el-col>
          <el-col :span="7" :offset="1">
            <span class="leftWidth">{{$t('计佣金额')}}</span>
            <!-- <span>{{111}}</span> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="package-middle">
      <el-row>
        <el-col :span="5">
          <div class="middle-left" @click="goAnnouncement">{{$t('公告设置')}}</div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="middle-left" @click="fastReceipt">{{$t('快速收货')}}</div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="middle-left" @click="fastSign">{{$t('快速签收')}}</div>
        </el-col>
        <el-col :span="5" :offset="1">
          <div class="middle-left" @click="fastDelivery">{{$t('快速出库')}}</div>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" class="tabLength">
      <!-- 未到自提点 -->
      <el-tab-pane :label="$t('未到自提点') + '(' + 0 + ')'" name="0" v-if="!this.countData.wait_receive"></el-tab-pane>
      <el-tab-pane v-else :label="$t('未到自提点') + '(' + this.countData.wait_receive + ')'" name="0"></el-tab-pane>
      <!-- 已到自提点 -->
      <el-tab-pane :label="$t('已到自提点') + '(' + 0 + ')'" name="1" v-if="!this.countData.received"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已到自提点') + '(' + this.countData.received + ')'" name="1"></el-tab-pane>
      <!-- 已完成订单 -->
      <el-tab-pane :label="$t('已完成订单') + '(' + 0 + ')'" name="2" v-if="!this.countData.finished"></el-tab-pane>
      <el-tab-pane v-else :label="$t('已完成订单') + '(' + this.countData.finished + ')'" name="2"></el-tab-pane>
    </el-tabs>
    <search-group :placeholder="$t('请输入关键字')" v-model="page_params.keyword" @search="goMatch">
      <div class="changeTime">
      <!-- 发货时间 -->
        <el-date-picker
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        @change="onTime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('发货开始日期')"
        :end-placeholder="$t('发货结束日期')">
      </el-date-picker>
      <!-- 称重时间 -->
        <!-- <el-date-picker
        v-if="activeName === '2'"
        class="timeStyle"
        v-model="storageList"
        type="daterange"
        @change="onStorage"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('称重开始日期')"
        :end-placeholder="$t('称重结束日期')">
      </el-date-picker> -->
    </div>
    <div class="import-list">
     <el-button @click="uploadList(status)">{{$t('导出清单')}}</el-button>
    </div>
    </search-group>
    <el-table v-if="oderData.length" class="data-list" border stripe
      :data="oderData"
      @selection-change="selectionChange"
      v-loading="tableLoading">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')">
        <template slot-scope="scope">
          <span>{{scope.row.user.id}}---{{scope.row.user.name}}</span>
        </template>
      </el-table-column>
      <!-- 转运单号 -->
      <el-table-column :label="$t('转运单号')" prop="logistics_sn">
      </el-table-column>
      <!-- 收件人 -->
      <el-table-column :label="$t('收件人')" prop="receiver_name">
      </el-table-column>
      <!-- 联系电话 -->
      <el-table-column :label="$t('联系电话')" prop="receiver_phone">
      </el-table-column>
      <!-- 发货时间 -->
      <el-table-column :label="$t('发货时间')" prop="shipped_at">
      </el-table-column>
      <!-- 箱数 -->
      <el-table-column :label="$t('箱数')" prop="box_count">
      </el-table-column>
      <!-- 重量 -->
      <el-table-column :label="$t('重量')" prop="actual_weight">
      </el-table-column>
      <!-- 尺寸/体积 -->
      <el-table-column :label="$t('尺寸/体积')">
        <template slot-scope="scope">
          <span>{{scope.row.length}}</span>
          <span>{{scope.row.width}}</span>
          <span>{{scope.row.height}}</span>/
          <span>{{scope.row.volume_weight}}</span>
        </template>
      </el-table-column>
      <!-- 所属发货单 -->
      <el-table-column :label="$t('所属发货单')" prop="shipment_sn">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="160px" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary">
              {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="item-sty" @click.native="storage(scope.row.id)">
                <!-- 收货 -->
                 <span>{{$t('收货')}}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="goExpress(scope.row.express_num)">
                <!-- 跟踪 -->
                <span>{{$t('跟踪')}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <!-- 弃件 -->
          <el-button size="small" @click="discardPackage">{{$t('批量收货')}}</el-button>
        </div>
      </template>
    </el-table>
    <div class="noDate" v-else>{{$t('暂无数据')}}</div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
    <el-dialog :visible.sync="show" :title="$t('预览打印标签')" class="props-dialog" width="45%">
      <div class="dialogSty">
        <iframe class="iframe" :src="urlHtml"></iframe>
        </div>
      <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="updateLabel">{{$t('下载')}}</el-button>
      </div>
    </el-dialog>
    <!-- 公告设置 -->
    <el-dialog close="clearAnnouncement" :visible.sync="announcementDailog" :title="$t('自提点公告设置')" class="props-dialog" width="45%">
      <span>{{$t('营业时间')}}</span>
      <el-input v-model="announcementData.opening_hours"
      type="textarea" :rows="4" :placeholder="$t('例：周一至周六 08:00 ～ 20:00')">
      </el-input>
      <span>{{$t('公告')}}</span>
      <el-input v-model="announcementData.announcement"
      type="textarea" :rows="4" :placeholder="$t('例：本自提点免费保存两日，逾期收费2¥/日。重量限制：40KG。长度限制：180CM')">
      </el-input>
      <div slot="footer">
      <el-button @click="announcementDailog = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="updateAnnoucement">{{$t('确定')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  name: 'orderList',
  mixins: [pagination],
  data () {
    return {
      activeName: '',
      oderData: [],
      status: 1,
      tableLoading: false,
      localization: {},
      storageList: [],
      timeList: [],
      in_storage_end_date: '',
      in_storage_begin_date: '',
      begin_date: '',
      end_date: '',
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: '',
      deleteNum: [],
      countData: {},
      urlExcel: '',
      filterForm: {
        start: '',
        end: ''
      },
      options: [],
      transferId: '',
      value: '',
      form: {},
      announcementDailog: false,
      announcementData: {
        opening_hours: '',
        announcement: ''
      },
      textarea: '',
      XStationId: ''
    }
  },
  methods: {
    // 获取自提点数据
    pickData () {
      this.$request.packagePick().then(res => {
        if (res.ret) {
          this.options = res.data
          this.transferId = res.data[0].id
          if (this.transferId) {
            this.getCounts()
            this.getList()
            this.pickDetails()
          }
        }
      })
    },
    // 切换自提点时
    changePick () {
      // this.transferId = this.XStationId ? this.XStationId : this.transferId
      console.log(this.transferId, 'this.transferId')
      if (this.XStationId) {
        this.transferId = this.XStationId
        this.pickDetails()
        this.getCounts()
        this.getList()
      }
      // XStationId
    },
    // 获取自提点统计数据
    getCounts () {
      this.$request.stationsCounts({
        XStationId: this.transferId,
        keyword: this.page_params.keyword
      }).then(res => {
        if (res.ret) {
          this.countData = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 自提点信息详情
    pickDetails () {
      this.$request.pickData(this.transferId).then(res => {
        if (res.ret) {
          this.form = res.data
        }
      })
    },
    goMatch () {
      this.page_params.page = 1
      this.page_params.size = 10
      this.handleQueryChange('page', this.page_params.page)
      this.handleQueryChange('size', this.page_params.size)
      this.handleQueryChange('keyword', this.page_params.keyword)
      this.getList()
      this.getCounts()
    },
    getList () {
      this.tableLoading = true
      // this.oderData = []
      let params = {
        XStationId: this.transferId,
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.shipped_begin && (params.shipped_begin = this.shipped_begin)
      this.shipped_end && (params.shipped_end = this.shipped_end)
      this.$request.stationsData(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 快速收货
    fastReceipt () {
      dialog({ type: 'fastReceipt', id: this.transferId })
    },
    // 快速签收
    fastSign () {
      dialog({ type: 'fastSign' })
    },
    // 快速出库
    fastDelivery () {
      dialog({ type: 'fastDelivery' })
    },
    storage (id) {
      this.$router.push({ name: 'editStorage', params: { id: id } })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    goExpress (expressNum) {
      console.log(expressNum)
      // window.open(`https://m.kuaidi100.com/app/query/?coname=uc&nu=${expressNum}`)
    },
    // 批量弃件
    discardPackage () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择包裹'))
      }
      dialog({ type: 'discardList', deleteNum: this.deleteNum }, () => {
        this.getList()
      })
    },
    // 确认下载标签
    updateLabel () {
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
    // 导出清单
    uploadList (val) {
      let params = {
        status: val
        // status: this.status,
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 已入库
      if (this.activeName === '2') {
        // 提交时间
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
        // 称重时间
        this.in_storage_begin_date && (params.in_storage_begin_date = this.in_storage_begin_date)
        this.in_storage_end_date && (params.in_storage_end_date = this.in_storage_end_date)
      } else { // 未入库
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
      }
      this.$request.uploadPackage(params).then(res => {
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
    // 提交时间
    onTime (val) {
      this.shipped_begin = val ? val[0] : ''
      this.shipped_end = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.shipped_begin} ${this.shipped_end}`)
      this.getList()
    },
    // 公告设置
    goAnnouncement () {
      this.announcementDailog = true
      this.announcementData.opening_hours = this.form.opening_hours
      this.announcementData.announcement = this.form.announcement
    },
    clearAnnouncement () {
      this.announcementData.opening_hours = ''
      this.announcementData.announcement = ''
    },
    // 更新 公告设置
    updateAnnoucement () {
      this.$request.updatePickData(this.transferId, this.announcementData).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.announcementDailog = false
          this.pickDetails()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  },
  created () {
    this.pickData() // 获取自提点筛选数据
  },
  watch: {
    // 监听tab组件参数
    activeName (newValue) {
      switch (newValue) {
        case '0': // 全部
          this.page_params.page = 1
          this.status = 0
          this.timeList = []
          this.shipped_begin = ''
          this.shipped_end = ''
          this.storageList = []
          // this.getList()
          break
        case '1': // 未入库
          this.page_params.page = 1
          this.status = 1
          this.timeList = []
          this.shipped_begin = ''
          this.shipped_end = ''
          this.storageList = []
          this.getList()
          break
        case '2': // 已入库
          this.page_params.page = 1
          this.status = 2
          this.timeList = []
          this.storageList = []
          this.shipped_begin = ''
          this.shipped_end = ''
          this.getList()
          break
        case '3': // 已集包
          this.page_params.page = 1
          this.status = 3
          this.timeList = []
          this.shipped_begin = ''
          this.shipped_end = ''
          this.storageList = []
          this.getList()
          break
      }
      // this.getList()
    }
  }
}
</script>

<style lang="scss">
.package-management-container {
  .tabLength {
    width: 450px !important;
    display: inline-block;
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
 .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
  }
  .chooseOrder {
    cursor: pointer;
    color:blue;
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
    width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
  }
  .import-list {
    display: inline-block;
    margin-left: 10px;
  }
  .excel-date {
    margin-top: 20px;
  }
  .input-sty {
    width: 30%;
  }
  .warning-sty {
    color: red;
  }
  .package-top {
    padding: 20px;
    // border: 1px solid black;
    background-color: #fff;
    margin-bottom: 30px;
  }
  .container-center {
    margin-bottom: 20px;
  }
  .leftWidth {
    display: inline-block;
    width: 120px;
  }
  .top-left {
    margin-bottom: 20px;
  }
  .location-sty {
    margin-left: 20px;
  }
  .middle-left {
    background-color: #fff;
    line-height: 60px;
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
  }
  .package-middle {
    padding-left: 40px;
    margin-bottom: 20px;
  }
  .auto-sty {
    display: inline-block;
    margin-right: 20px;
  }
}
</style>
