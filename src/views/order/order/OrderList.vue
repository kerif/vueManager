<template>
  <div class="order-list-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch"></search-group>
      <el-tabs v-model="activeName" class="tabLength">
        <!-- 未入库 -->
        <el-tab-pane label="未入库" name="1"></el-tab-pane>
        <!-- 已入库 -->
        <el-tab-pane label="已入库" name="2"></el-tab-pane>
        <!-- 无人认领包裹 -->
        <el-tab-pane label="无人认领包裹" name="3"></el-tab-pane>
    </el-tabs>
    <!-- <div class="agentRight" v-if="activeName === '1' || activeName === '2'"> -->
    <!-- <el-select v-model="agent_name" @change="getList" clearable>
      <el-option
      v-for="item in agentData"
      :key="item.id"
      :value="item.user_id"
      :label="item.agent_name">
      </el-option>
    </el-select> -->
    <!-- </div> -->
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
      <!-- 称重时间 -->
        <el-date-picker
        v-if="activeName === '2'"
        class="timeStyle"
        v-model="storageList"
        type="daterange"
        @change="onStorage"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="称重开始日期"
        end-placeholder="称重结束日期">
      </el-date-picker>
    </div>
    <div v-if="activeName === '1' || activeName === '2'">
      <el-table v-if="oderData.length" class="data-list" border stripe
      :data="oderData"
      @selection-change="selectionChange"
      v-loading="tableLoading">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID">
        <template slot-scope="scope">
          <span>{{scope.row.user_id}}---{{scope.row.user_name}}</span>
        </template>
      </el-table-column>
      <!-- 快递单号 -->
      <el-table-column label="快递单号">
        <template slot-scope="scope">
          <span @click="goExpress(scope.row.express_num)" class="chooseOrder">{{scope.row.express_num}}</span>
        </template>
      </el-table-column>
      <!-- 物品名称 -->
      <el-table-column label="物品名称" prop="package_name"></el-table-column>
      <!-- 物品价值 -->
      <el-table-column :label="'物品价值' + this.localization.currency_unit" prop="package_value"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{item.cn_name}}
          </span>
        </template>
      </el-table-column>
      <!-- 商品清单 -->
      <el-table-column label="商品清单" prop="item_pictures" width="130">
        <template slot-scope="scope">
          <span v-for="item in scope.row.item_pictures"
          :key="item.id" style="cursor:pointer;"
          @click.stop="imgSrc=$baseUrl.IMAGE_URL + item.path, imgVisible=true">
           <img :src="$baseUrl.IMAGE_URL + item.path" style="width: 40px; margin-right: 5px;">
          </span>
        </template>
      </el-table-column>
      <!-- 货位 -->
      <el-table-column label="货位" prop="location"></el-table-column>
      <!-- 规格 -->
      <el-table-column label="规格(长宽高cm)" prop="dimension"
      v-if="activeName === '2'" width="120px"></el-table-column>
      <!-- 称重时间 -->
      <el-table-column label="称重时间" v-if="activeName === '2'" prop="in_storage_at"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间" prop="created_at">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" v-if="activeName === '1'">
        <template slot-scope="scope" >
          <!-- 入库 -->
            <el-button class="btn-green" @click="storage(scope.row.id, scope.row.express_num, scope.row.user_id, scope.row.user_name, scope.row.props)">入库</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template>
    </el-table>
    <div class="noDate" v-else>暂无数据</div>
    </div>
    <!-- 无人认领包裹 -->
    <div v-if="activeName === '3'">
      <el-table v-if="ownerData.length" class="data-list" border stripe
      :data="ownerData"
      @selection-change="selectionChange"
      v-loading="tableLoading">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 快递单号 -->
      <el-table-column label="快递单号">
        <template slot-scope="scope">
          <span @click="goExpress(scope.row.express_num)" class="chooseOrder">{{scope.row.express_num}}</span>
        </template>
      </el-table-column>
      <!-- 物品价值 -->
      <el-table-column :label="'包裹重量' + this.localization.weight_unit" prop="package_weight"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column label="物品属性">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{item.cn_name}}
          </span>
        </template>
      </el-table-column>
      <!-- 货位 -->
      <el-table-column label="货位" prop="location"></el-table-column>
      <!-- 规格 -->
      <el-table-column :label="'规格'+ this.localization.length_unit" prop="dimension"
      width="120px"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间" prop="created_at">
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
    </el-table>
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
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  name: 'orderList',
  mixins: [pagination],
  data () {
    return {
      activeName: '1',
      oderData: [],
      status: 1,
      tableLoading: false,
      agent_name: '',
      agentData: [],
      localization: {},
      ownerData: [],
      storageList: [],
      timeList: [],
      in_storage_end_date: '',
      in_storage_begin_date: '',
      begin_date: '',
      end_date: '',
      imgVisible: false,
      imgSrc: ''
    }
  },
  methods: {
    getList () {
      if (this.activeName === '3') {
        return this.getNO()
      }
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      if (this.activeName === '2') {
        // 提交时间
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
        // 称重时间
        this.in_storage_begin_date && (params.in_storage_begin_date = this.in_storage_begin_date)
        this.in_storage_end_date && (params.in_storage_end_date = this.in_storage_end_date)
      } else {
        this.begin_date && (params.begin_date = this.begin_date)
        this.end_date && (params.end_date = this.end_date)
      }
      this.$request.getWarehouse(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.oderData = res.data
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
    storage (id, expressNum, userId, userName, props) {
      console.log(userName, 'userName')
      console.log(props, 'props')
      this.$router.push({ name: 'editStorage', params: { id: id, express_num: expressNum, user_id: userId, user_name: userName }, query: { props: JSON.stringify(props) } })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    goExpress (expressNum) {
      console.log(expressNum)
      window.open(`https://m.kuaidi100.com/app/query/?coname=uc&nu=${expressNum}`)
    },
    // 删除
    deleteData () {
      this.$confirm(`您真的要移除发货单吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.deletePackages({
          DELETE: this.deleteNum
        }).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
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
    // 获取无人认领列表
    getNO () {
      this.tableLoading = true
      this.ownerData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        agent: this.agent_name,
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
    // 获取代理列表
    getAgentData () {
      this.$request.getAgent().then(res => {
        this.agentData = res.data
      })
    },
    // 提交时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      if (this.activeName === '3') {
        this.getNO()
      } else {
        this.getList()
      }
    },
    // 称重时间
    onStorage (val) {
      this.in_storage_begin_date = val ? val[0] : ''
      this.in_storage_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.in_storage_begin_date} ${this.in_storage_end_date}`)
      this.getList()
    }
  },
  mounted () {
    this.getAgentData()
    this.getList()
  },
  watch: {
    // 监听tab组件参数
    activeName (newValue) {
      switch (newValue) {
        case '1': // 未入库
          this.page_params.page = 1
          this.status = 1
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '2': // 已入库
          this.page_params.page = 1
          this.status = 2
          this.timeList = []
          this.storageList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.getList()
          break
        case '3':
          this.page_params.page = 1
          this.timeList = []
          this.storageList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.getList()
      }
      // this.getList()
    }
  }
}
</script>

<style lang="scss">
.order-list-container {
  .tabLength {
    width: 300px !important;
    display: inline-block;
  }
  .noDate {
    text-align: center;
    color: #ccc;
  }
  .agentRight {
    // display: inline-block;
    float: right;
  }
  .changeTime {
    .timeStyle {
      margin-right: 20px;
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
}
</style>
