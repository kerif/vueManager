<template>
  <div class="apply-list-container">
    <!-- <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div> -->
      <div class="apply-top">
        <el-row :gutter="20">
          <el-col :span="3">
            <el-radio-group v-model="radio">
              <el-radio :label="1" class="radio-sty">{{$t('按预报单号')}}</el-radio>
              <el-radio :label="2">{{$t('按会员ID')}}</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="12" :offset="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              :placeholder="this.radio === 1 ? $t('多个包裹单号，请用回车分割') : $t('请输入会员ID')"
              v-model="textarea2">
            </el-input>
            <span class="tips-sty">*{{$t('不能将不同用户的包裹合并打包')}}</span>
          </el-col>
          <el-col :span="2">
            <el-button @click.native="search">{{$t('查询')}}</el-button>
          </el-col>
          <el-col :span="2">
            <el-button @click.native="byBatch">{{$t('按预报批次集包')}}</el-button>
          </el-col>
        </el-row>
      </div>
    <el-table :data="applyList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- 客户ID -->
      <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
      <!-- 预报单号 -->
      <el-table-column :label="$t('预报单号')" prop="express_num"></el-table-column>
      <!-- 物品名称 -->
      <el-table-column :label="$t('物品名称')" prop="package_name"></el-table-column>
      <!-- 物品属性 -->
      <el-table-column :label="$t('物品属性')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">{{item.name}}&nbsp;</span>
        </template>
      </el-table-column>
      <!-- 物品重量 -->
      <el-table-column :label="$t('物品重量') + (this.localization.weight_unit ? this.localization.weight_unit : '')" prop="package_weight"></el-table-column>
      <!-- 寄往国家 -->
      <el-table-column :label="$t('寄往国家')" prop="destination_country.name"></el-table-column>
      <!-- 入库时间 -->
      <el-table-column :label="$t('入库时间')" prop="in_storage_at"></el-table-column>
      <!-- 提交时间 -->
      <el-table-column :label="$t('提交时间')" prop="created_at"></el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button class="btn-green" @click="editWarehoused(scope.row.id)">{{$t('编辑')}}</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-deep-purple" @click="boxing">{{$t('申请打包&合箱')}}</el-button>
        </div>
      </template>
    </el-table>
    <!-- 按预报批次集包弹窗 -->
    <el-dialog :visible.sync="boxDialog" :title="$t('按预报批次集包')" @close="clear"
    width="74%">
      <search-group v-model="page_params.user_id" @search="goMatch"
      :placeholder="$t('请输入客户ID')">
        <el-date-picker
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          @change="onTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')">
        </el-date-picker>
      </search-group>
      <div v-for="(item, index) in forecastData" :key="item.id">
        <div class="box-main">
        <p>{{$t('批次号')}}: {{item.batch}}，{{$t('本次同时预报了')}}<span class="item-sty">{{item.total}}</span>{{$t('个包裹')}}，<span class="item-sty">{{item.in_storage}}</span>{{$t('个已入库')}}</p>
        <el-table :data="item.packages" stripe border class="data-list"
          v-loading="tableLoading" height="250"
          @selection-change="(e) => pickChange(e, index)">
          <el-table-column type="selection" width="55" align="center"
          :selectable="checkboxInit" :reserve-selection="true"></el-table-column>
          <!-- 公告标题 -->
          <el-table-column :label="$t('客户ID')" prop="user_id"></el-table-column>
          <!-- 发布人员 -->
          <el-table-column :label="$t('预报单号')" prop="express_num">
          </el-table-column>
          <!-- 发布时间 -->
          <el-table-column :label="$t('物品名称')" prop="package_name"> </el-table-column>
          <el-table-column :label="$t('物品属性')">
            <template slot-scope="scope">
              <span v-for="item in scope.row.props" :key="item.id">{{item.name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('物品重量')" prop="package_weight"> </el-table-column>
          <el-table-column :label="$t('寄往国家')" prop="destination_country.cn_name"> </el-table-column>
          <el-table-column :label="$t('入库时间')" prop="in_storage_at"> </el-table-column>
          <el-table-column :label="$t('提交时间')" prop="created_at"> </el-table-column>
          <!-- <template slot="append">
            <div class="append-box">
              <el-button size="small" class="btn-light-red" @click="deleteData">{{$t('您当前选择了')}}{{$t('包裹')}}</el-button>
            </div>
          </template> -->
        </el-table>
        </div>
      </div>
      <div v-if="this.forecastData.length">
        {{$t('您当前选择了')}}<span class="item-sty">{{this.pickNum.length}}</span>{{$t('包裹')}}
      </div>
        <div slot="footer">
          <el-button @click="boxDialog = false">{{$t('取消')}}</el-button>
          <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'applyList',
  components: {
    SearchGroup
  },
  mixins: [pagination],
  data () {
    return {
      applyList: [],
      tableLoading: false,
      deleteNum: [],
      textarea2: '',
      radio: 1,
      expressNum: [],
      userId: '',
      userNum: [],
      localization: {},
      boxDialog: false,
      timeList: [],
      forecastData: [],
      pickNum: [],
      pickNumArr: []
    }
  },
  methods: {
    // 编辑
    editWarehoused (id) {
      this.$router.push({ name: 'editWarehouse', params: { id: id, state: 'editWarehouse' } })
    },
    search () {
      if (this.radio === '') {
        return this.$message.error(this.$t('请选择按预报单号或会员ID查询'))
      } else if (this.textarea2 === '') {
        return this.$message.error(this.$t('请输入'))
      }
      this.expressNum = this.textarea2.split(/[(\r\n)\r\n]+/)
      this.userId = this.textarea2
      // for (let i = 0; i < this.expressNum.length; i++) {
      //   if (this.expressNum[i] === '') {
      //     this.expressNum.remove(this.expressNum[i])
      //   }
      // }
      console.log(this.expressNum, 'this.expressNum')
      if (this.radio === 1) {
        this.$request.packs({
          express_num: this.expressNum
        }).then(res => {
          if (res.data.length) {
            this.applyList = res.data
            this.localization = res.localization
          } else {
            this.$notify({
              title: this.$t('包裹未找到'),
              type: 'warning'
            })
          }
        })
      } else {
        this.$request.packs({
          user_id: this.userId
        }).then(res => {
          if (res.data.length) {
            this.applyList = res.data
            this.localization = res.localization
          } else {
            this.$notify({
              title: this.$t('当前用户没有可打包的包裹'),
              type: 'warning'
            })
          }
        })
      }
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      this.userNum = selection.map(item => (item.user_id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 打包合箱
    boxing () {
      console.log(this.deleteNum, 'this.deleteNum')
      console.log(this.userNum, 'this.userNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      const Num = new Set(this.userNum)
      if (Num.size > 1) {
        return this.$message.error(this.$t('不能将不同用户的包裹合并打包'))
      }
      this.$request.preview({
        package_ids: this.deleteNum
      }).then(res => {
        if (res.ret) {
          this.$router.push({ name: 'boxing',
            query: {
              id: this.deleteNum
            } })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    byBatch () {
      this.boxDialog = true
      // this.getGroup()
    },
    // 获取按预报批次集包 数据
    getGroup () {
      let params = {
        // page: this.page_params.page,
        // size: this.page_params.size,
        is_recommend: this.is_recommend
      }
      this.page_params.user_id && (params.user_id = this.page_params.user_id)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.groupBy(params).then(res => {
        if (res.ret) {
          this.forecastData = res.data
          // this.pickData = res.data
        }
      })
    },
    pickChange (selection, type) {
      this.pickNumArr[type] = selection.map(item => (item.id))
      this.pickNum = this.pickNumArr.flatMap(item => item)
      console.log(this.pickNum, 'this.pickNum')
    },
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getGroup()
    },
    checkboxInit (row, index) {
      if (row.status === 1) {
        return 0 // 不可勾选
      } else {
        return 1
      }
    },
    // checkboxInit (row, index) {
    //   if (this.arr.some(el => { return el === row.id })) {
    //     return false
    //   } else {
    //     return true
    //   }
    // },
    goMatch () {
      // this.page_params.page = 1
      // this.page_params.size = 10
      // this.handleQueryChange('page', this.page_params.page)
      // this.handleQueryChange('size', this.page_params.size)
      this.handleQueryChange('user_id', this.page_params.user_id)
      this.getGroup()
    },
    deleteData () {},
    clear () {},
    confirm () {
      this.$request.preview({
        package_ids: this.pickNum
      }).then(res => {
        if (res.ret) {
          this.$router.push({ name: 'boxing',
            query: {
              id: this.pickNum
            } })
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
<style lang="scss" scope>
.apply-list-container {
  .radio-sty {
    margin-bottom: 15px;
  }
  .apply-top {
    background-color: #fff;
    padding: 20px;
  }
  .tips-sty {
    font-size: 13px;
    color: #adadad;
  }
}
.item-sty {
  color: red;
  font-weight: 700;
  padding-left: 5px;
  padding-right: 5px;
}
.box-main {
  padding: 10px;
  background-color: #F5F5F5 !important;
  margin-bottom: 20px;
}
</style>
