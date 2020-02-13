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
    <!-- 是否精选 -->
    <div class="chooseStatus">
      <el-select v-model="is_recommend" @change="onShipStatus" clearable>
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
      </el-select>
    </div>
    </search-group>
    <div v-if="evaluationData.length">
      <ul>
        <li v-for="(item, index) in evaluationData"
        :key="index" class="evaluation-list">
        <div class="order-num">订单号：{{item.order}}</div>
        <el-row :gutter="20">
          <!-- 头像 -->
          <el-col :span="2">
            <div class="list-img">
              <img :src="item.user.avatar">
            </div>
          </el-col>
          <el-col :span="16" :offset="1">
            <div class="list-font">
              <span>{{item.user.id}}---{{item.user.name}}</span>&nbsp;&nbsp;
              <span class="font-order">{{item.created_at}}</span>
              <!-- 评价 -->
              <div class="list-evaluation" v-if="item.content">
                {{item.content}}
              </div>
              <div v-else class="noDate">
                暂无数据
              </div>
              <div class="left-img" v-for="(ele, index) in item.images" :key="index">
                <span style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${ele}`, imgVisible=true">
                  <img :src="`${$baseUrl.IMAGE_URL}${ele}`" class="productImg" >
                </span>
              </div>
              <div class="location-sty">
                <i class="el-icon-map-location"></i><span>{{item.country}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" :offset="1">
            <!-- 星级 -->
            <el-rate
              v-model="item.score"
              disabled>
            </el-rate>
            <!-- 精选 -->
            <div class="featured" v-if="item.is_recommend === 1">
              <span class="featured-font">
              精选
              </span>
            </div>
          </el-col>
      </el-row>
      <div class="bottom-btn">
        <el-button class="btn-light-red" v-if="item.is_recommend === 1" @click="resetRecommend(item.id, 0)">取消精选</el-button>
        <el-button class="btn-deep-purple" v-else @click="resetRecommend(item.id, 1)">设为精选</el-button>
      </div>
        </li>
      </ul>
    </div>
    <div v-else class="noDate">
       暂无数据
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
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  name: 'evaluationList',
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
      value: 2,
      statusList: [
        {
          id: 0,
          name: '非精选'
        },
        {
          id: 1,
          name: '精选'
        }
      ]
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
      this.$request.getComments(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.evaluationData = res.data
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
    // 取消或设置精选
    resetRecommend (id, status) {
      console.log(id, 'im id')
      console.log(status, 'im status')
      this.$confirm(`您真的要执行此操作吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.updateRecommend(id, status).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
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
  }
  ul {
    list-style:none;
    padding: 0;
    margin-top: 0;
    .el-row {
      margin: 0 !important;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .evaluation-list {
    background-color: #fff !important;
    width: 100%;
    padding-bottom: 10px;
    border: 1px solid #EBEEF5;
    margin-bottom: 10px;
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
      // font-size: 14px;
      color: #7f7f7f;
    }
    .list-font {
      .list-evaluation {
        margin-top: 10px;
        font-size: 13px;
        // width: 200px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
      // .list-evaluation:hover {
      //   // cursor: pointer;
      //   width: auto !important;
      // }
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
  .left-img {
    margin-top: 20px;
    padding: 10px 5px;
    display: inline-block;
  }
  .productImg {
    border: 1px dashed #ccc;
    display: inline-block;
    margin-right: 15px;
    width: 110px;
    height: 100px;
  }
  .location-sty {
    margin-top: 10px;
  }
  .featured {
    text-align: center;
    margin-top: 20px;
    .featured-font {
      color: #fff;
      background-color: red;
      line-height: 40px;
      font-size: 23px;
      padding: 0 5px;
      border-radius: 5px;
    }
  }
  .bottom-btn {
    border-top: 1px solid #EBEEF5;
    padding-top: 10px;
    text-align: right;
    padding-right: 20px;
  }
}
</style>
