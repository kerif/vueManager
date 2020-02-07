<template>
  <div class="evaluation-management-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
      <div class="changeTime">
      <!-- 提交时间 -->
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
    </div>
      <div class="chooseStatus">
        <el-select v-model="agent_name" @change="onAgentChange" clearable
        placeholder="请选择仓库">
          <el-option
            v-for="item in agentData"
            :key="item.id"
            :value="item.id"
            :label="item.warehouse_name">
          </el-option>
        </el-select>
      </div>
    </search-group>
    <div class="evaluation-list">
      <ul>
        <li>
          <el-col :span="2">
            <div class="list-img">
              <img src="../../assets/tree.png">
            </div>
          </el-col>
          <el-col :span="5">
            <div class="list-font">
              <span>JY10001</span><br/>
              <span class="font-order">订单号：JY10001</span><br/>
              <div class="list-evaluation">
                第一次使用集运系统，
                真的很快一周就收到了，
                服务很棒，推荐大家使用
              </div>
              <div class="order-img">
                <img src="../../assets/storage.png">
                <img src="../../assets/ship.png">
              </div>
              <i class="el-icon-time"></i>
            </div>
          </el-col>
        </li>
      </ul>
    </div>
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
export default {
  components: {
    SearchGroup
  },
  name: 'evaluationList',
  mixins: [pagination],
  data () {
    return {
      status: 1,
      tableLoading: false,
      agent_name: '',
      agentData: [],
      localization: {},
      ownerData: [],
      timeList: [],
      begin_date: '',
      end_date: '',
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: ''
    }
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.ownerData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        warehouse: this.agent_name,
        status: this.status
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
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onAgentChange () {
      this.page_params.page = 1
      this.page_params.handleQueryChange('agent', this.agent_name)
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
    }
  },
  created () {
    // this.getAgentData()
    // this.getList()
  }
}
</script>

<style lang="scss">
.evaluation-management-container {
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
  ul {
    list-style:none;
  }
  .evaluation-list {
    .list-img {
      width: 80px;
      padding: 0 10px;
      img {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        border: 1px solid #ececec;
      }
    }
    .font-order {
      font-size: 14px;
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
}
</style>
