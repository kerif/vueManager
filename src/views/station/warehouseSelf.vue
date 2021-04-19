<template>
  <div class="warehouse-self-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
      <!-- <div class="changeTime">
        <el-date-picker
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        @change="onTime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="提交开始日期"
        end-placeholder="提交结束日期">
      </el-date-picker>
    </div> -->
    <!-- 是否精选 -->
    <!-- <div class="chooseStatus">
      <el-select v-model="is_recommend" @change="onShipStatus" clearable>
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
      </el-select>
    </div> -->
    </search-group>
    <div v-if="evaluationData.length">
      <ul>
        <li v-for="(item, index) in evaluationData"
        :key="index" class="evaluation-list">
        <!-- <div class="order-num">订单号：{{item.order}}</div> -->
        <el-row :gutter="20">
          <!-- 头像 -->
          <el-col :span="6">
            <span><strong>{{$t('转运订单号')}}</strong></span><br/>
            <span>{{$t('转运订单号')}}收货人</span><br/>
            <span>{{$t('转运订单号')}}联系电话</span><br/>
            <span>{{$t('转运订单号')}}收货地址</span><br/>
            <span>{{$t('转运订单号')}}邮编</span><br/>
            <span>{{$t('转运订单号')}}国际物流单号</span><br/>
          </el-col>
          <el-col :span="12" :offset="1">
            <span><strong>{{item.order_sn}}</strong></span><br/>
            <span>{{item.user_name}}</span><br>
            <span>{{item.address.phone}}</span><br>
            <span>{{item.address.door_no}},{{item.address.street}},{{item.address.city}},{{item.address.postcode}},{{item.address.country_name}}</span><br>
            <span>{{item.address.postcode}}</span><br>
            <span>{{item.logistics_sn}}</span><br>
          </el-col>
          <el-col :span="4" :offset="1">
            <!-- 线路 -->
            <span><strong>{{item.express_line.cn_name}}</strong></span><br/>
            <!-- 重量 -->
            <span><strong>{{item.actual_weight}}{{localization.weight_unit}}</strong></span><br/>
            <el-button class="btn-dark-green btn-sty" @click="self(item.id, item.order_sn, item.status)">{{$t('转运订单号')}}设为自提签收</el-button>
            <el-button class="btn-purple btn-sty" @click="goDetails(item.id, item.status_name)">{{$t('转运订单号')}}查看详情</el-button>
          </el-col>
      </el-row>
      <div class="bottom-btn">
        <el-row :gutter="20">
          <el-col :span="6">
            <span>{{$t('转运订单号')}}提交时间</span>
          </el-col>
          <el-col :span="12" :offset="1">
            <span>{{item.created_at}}</span>
          </el-col>
        </el-row>
        <!-- <el-button class="btn-light-red">取消精选</el-button>
        <el-button class="btn-deep-purple">设为精选</el-button> -->
      </div>
        </li>
      </ul>
    </div>
    <div v-else class="noDate">
       {{$t('转运订单号')}}暂无数据
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import { pagination } from '@/mixin'
import NlePagination from '@/components/pagination'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  name: 'warehouseSelf',
  mixins: [pagination],
  data () {
    return {
      tableLoading: false,
      is_recommend: '', // 是否精选
      agentData: [],
      localization: {},
      evaluationData: [],
      timeList: [],
      begin_date: '',
      end_date: '',
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: '',
      form: {},
      value: 2
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.evaluationData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        is_recommend: this.is_recommend
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getWarehouseSelf(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.evaluationData = res.data
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
    // 查看详情
    goDetails (id, status) {
      this.$router.push({ name: 'selfDetails',
        params: {
          id: id,
          status
        } }
      )
    },
    // 精选状态选择
    onShipStatus () {
      this.page_params.handleQueryChange('status', this.is_recommend)
      this.getList()
    },
    // 获取代理列表
    getAgentData () {
      this.$request.getSimpleList().then(res => {
        this.agentData = res.data
      })
    },
    // 提交时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    self (id, order, status) {
      console.log(id, 'id', status)
      dialog({ type: 'warehouseSelf', id, order, status }, () => {
        this.getList()
      })
    }
  },
  created () {
    // this.getAgentData()
    this.getList()
  }
}
</script>

<style lang="scss">
.warehouse-self-container {
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
  .chooseStatus {
    width: 150px;
    display: inline-block;
  }
  ul {
    list-style:none;
    padding: 0;
    margin-top: 0;
    .el-row {
      margin: 0 !important;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 10px;
      font-size: 15px;
    }
  }
  .evaluation-list {
    background-color: #fff !important;
    width: 100%;
    padding-bottom: 10px;
    border: 1px solid #EBEEF5;
    margin-bottom: 10px;
    .font-order {
      // font-size: 14px;
      color: #7f7f7f;
    }
    .list-font {
      .list-evaluation {
        margin-top: 10px;
        font-size: 13px;
      }
      .order-img {
        width: 40px;
        img {
          display: inline-block;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  .order-num {
    border-bottom: 1px solid #EBEEF5;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-top: 10px;
  }
  .bottom-btn {
    border-top: 1px solid #EBEEF5;
    padding-top: 10px;
    text-align: left;
    padding-right: 20px;
  }
  .btn-sty {
    margin-top: 10px;
  }
}
</style>
