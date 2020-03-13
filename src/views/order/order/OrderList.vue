<template>
  <div class="order-list-container">
    <el-tabs v-model="activeName" class="tabLength">
        <!-- 未入库 -->
        <el-tab-pane label="未入库" name="1"></el-tab-pane>
        <!-- 已入库 -->
        <el-tab-pane label="已入库" name="2"></el-tab-pane>
        <!-- 已集包 -->
        <el-tab-pane label="已集包" name="3"></el-tab-pane>
        <!-- 已发货 -->
        <el-tab-pane label="已发货" name="4"></el-tab-pane>
        <!-- 已收货 -->
        <el-tab-pane label="已收货" name="5"></el-tab-pane>
        <!-- 弃件包裹 -->
        <el-tab-pane label="弃件包裹" name="6"></el-tab-pane>
    </el-tabs>
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
      <el-table v-if="oderData.length" class="data-list" border stripe
      :data="oderData"
      @selection-change="selectionChange"
      v-loading="tableLoading">
      <el-table-column type="selection" width="55" align="center"
      v-if="activeName === '1' || activeName === '2' || activeName === '6'"></el-table-column>
      <!-- 客户ID -->
      <el-table-column label="客户ID">
        <template slot-scope="scope">
          <span>{{scope.row.user_id}}---{{scope.row.user_name}}</span>
        </template>
      </el-table-column>
      <!-- 快递单号 -->
      <el-table-column label="快递单号" prop="express_num">
        <!-- <template slot-scope="scope">
          <span @click="goExpress(scope.row.express_num)" class="chooseOrder">{{scope.row.express_num}}</span>
        </template> -->
      </el-table-column>
      <!-- 物品名称 -->
      <el-table-column label="物品名称" prop="package_name" width="150" :show-overflow-tooltip="true"></el-table-column>
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
      <!-- 商品重量 -->
       <el-table-column label="物品重量" v-if="activeName === '2'">
        <template slot-scope="scope">
          <span>{{ scope.row.package_weight }}{{ localization.weight_unit }}</span>
        </template>
       </el-table-column>
      <!-- 商品清单 -->
      <el-table-column label="商品清单" prop="item_pictures" width="130" v-if="activeName === '1' || activeName === '2'">
        <template slot-scope="scope">
          <span v-for="item in scope.row.item_pictures"
          :key="item.id" style="cursor:pointer;"
          @click.stop="imgSrc=$baseUrl.IMAGE_URL + item.path, imgVisible=true">
           <img :src="$baseUrl.IMAGE_URL + item.path" style="width: 40px; margin-right: 5px;">
          </span>
        </template>
      </el-table-column>
      <!-- 货位 -->
      <!-- <el-table-column label="货位" prop="location"></el-table-column> -->
      <!-- 商品数量 -->
      <el-table-column label="商品数量" prop="qty" v-if="activeName === '1' || activeName === '2'"></el-table-column>
      <!-- 商品分类 -->
      <el-table-column label="商品分类" prop="categories" v-if="activeName === '1' || activeName === '2'">
        <template slot-scope="scope">
          <span v-for="item in scope.row.categories" :key="item.id">
            {{item.name_cn}}
          </span>
        </template>
      </el-table-column>
      <!-- 寄往国家 -->
       <el-table-column label="寄往国家" prop="destination_country.cn_name"></el-table-column>
      <!-- 仓库 -->
      <el-table-column label="仓库" prop="warehouse.warehouse_name">
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" prop="remark" v-if="activeName === '2'"></el-table-column>
      <!-- 规格 -->
      <el-table-column label="规格(长宽高cm)" prop="dimension"
      v-if="activeName === '2'" width="120px"></el-table-column>
      <!-- 存放货位 -->
      <el-table-column label="存放货位" prop="location"
      v-if="activeName === '2'" width="120px"></el-table-column>
      <!-- 称重时间 -->
      <el-table-column label="入库时间" v-if="activeName === '2'" prop="in_storage_at"></el-table-column>
      <!-- 弃件时间 -->
      <el-table-column label="弃件时间" prop="invalid_at" v-if="activeName === '3'"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column label="提交时间" prop="created_at">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <!-- 入库 -->
          <el-button class="btn-main" v-if="activeName === '1'" @click="storage(scope.row.id)">入库</el-button>
          <!-- 单号追踪 -->
          <el-button class="btn-green operating-btn" @click="goExpress(scope.row.express_num)" v-if="activeName === '1' || activeName === '2'">单号追踪</el-button>
          <!-- 入库日志 -->
          <el-button class="btn-blue operating-btn" v-if="activeName === '2' || activeName === '3' || activeName === '4' || activeName === '5'" @click="onLogs(scope.row.express_num)">入库日志</el-button>
          <!-- 编辑 -->
          <el-button class="btn-deep-purple" v-if="activeName === '2'" @click="editWarehoused(scope.row.id)">编辑</el-button>
          <!-- 日志 -->
          <el-button class="btn-blue operating-btn" v-if="activeName === '6'"
          @click="invalidLog(scope.row.id)">日志</el-button>
          <!-- 打印标签 -->
          <el-button size="small" @click="getLabel(scope.row.id)" v-if="activeName ==='2'" class="btn-pink operating-btn">打印标签</el-button>
        </template>
      </el-table-column>
      <template slot="append" v-if="activeName === '1' || activeName === '2' || activeName === '6'">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData"
          v-if="activeName === '1'">删除</el-button>
          <el-button size="small" class="btn-blue-green" @click="discardPackage"
           v-if="this.activeName === '1' || this.activeName === '2'">弃件</el-button>
           <el-button size="small" class="btn-deep-purple" v-if="activeName === '6'"
           @click="restore">恢复</el-button>
           <el-button size="small" class="btn-light-red"
            v-if="activeName === '6'" @click="deleteDiscard">彻底删除</el-button>
        </div>
      </template>
    </el-table>
    <div class="noDate" v-else>暂无数据</div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
    </el-dialog>
      <el-dialog :visible.sync="show" title="预览打印标签" class="props-dialog" width="45%">
        <div class="dialogSty">
          <iframe class="iframe" :src="urlHtml"></iframe>
        </div>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="updateLabel">下载</el-button>
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
      imgSrc: '',
      urlHtml: '',
      show: false,
      labelId: '',
      deleteNum: []
    }
  },
  methods: {
    getList () {
      if (this.activeName === '6') {
        return this.getDiscard()
      }
      // console.log('我没有执行下一步')
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        warehouse: this.agent_name,
        status: this.status
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
    getDiscard () {
      this.tableLoading = true
      this.oderData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.status,
        warehouse: this.agent_name
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
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
    storage (id) {
      this.$router.push({ name: 'editStorage', params: { id: id } })
    },
    // 已入库编辑
    editWarehoused (id) {
      this.$router.push({ name: 'editWarehouse', params: { id: id, state: 'editWarehouse' } })
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
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error('请选择包裹')
      }
      this.$confirm(`您真的要删除这个包裹吗？`, '提示', {
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
    // 弃件日志
    invalidLog (id) {
      dialog({ type: 'invalidLog', id: id })
    },
    // 批量弃件
    discardPackage () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error('请选择包裹')
      }
      dialog({ type: 'discardList', deleteNum: this.deleteNum }, () => {
        this.getList()
      })
    },
    // 彻底删除
    deleteDiscard () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error('请选择包裹')
      }
      this.$confirm(`您真的要彻底删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.deleteDiscard({
          ids: this.deleteNum
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
    // 恢复被弃件的包裹
    restore () {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error('请选择包裹')
      }
      this.$confirm(`您真的要恢复包裹吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request.restoreDiscard({
          ids: this.deleteNum
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
    onAgentChange () {
      this.page_params.page = 1
      this.page_params.handleQueryChange('agent', this.agent_name)
      this.getList()
      // if (this.activeName === '3') {
      //   // this.getDiscard()
      // } else {
      // }
    },
    // 打印标签
    getLabel (id) {
      this.labelId = id
      this.show = true
      this.$request.checkPackageLabel(id).then(res => {
        if (res.ret) {
          this.urlHtml = res.data.url
          // this.urlImport = res.data.url
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
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
            title: '操作成功',
            message: res.msg,
            type: 'success'
          })
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
      // if (this.activeName === '3') {
      //   this.getDiscard()
      // } else {
      // }
    },
    // 称重时间
    onStorage (val) {
      this.in_storage_begin_date = val ? val[0] : ''
      this.in_storage_end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.in_storage_begin_date} ${this.in_storage_end_date}`)
      this.getList()
    },
    // 入库日志
    onLogs (expressNum) {
      this.$router.push({ name: 'pickingContainer', query: { keyword: expressNum } })
    }
  },
  created () {
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
        case '3': // 已集包
          this.page_params.page = 1
          this.status = 3
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '4': // 已发货
          this.page_params.page = 1
          this.status = 4
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '5': // 已收货
          this.page_params.page = 1
          this.status = 5
          this.timeList = []
          this.begin_date = ''
          this.end_date = ''
          this.in_storage_end_date = ''
          this.in_storage_end_date = ''
          this.storageList = []
          this.getList()
          break
        case '6':
          this.page_params.page = 1
          this.status = 19
          // this.timeList = []
          // this.storageList = []
          // this.begin_date = ''
          // this.end_date = ''
          // this.in_storage_end_date = ''
          // this.in_storage_end_date = ''
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
    width: 500px !important;
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
}
</style>
