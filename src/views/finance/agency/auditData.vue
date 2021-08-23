<template>
  <div class="data-container">
    <div class="headline">
      <el-row :gutter="10">
        <el-col :span="3">
          <!-- 提现方式 -->
          <el-select v-model="page_params.type" :placeholder="$t('提现方式')" size="small">
            <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <!-- 审核状态 -->
        <el-col :span="3">
          <el-select v-model="page_params.status" :placeholder="$t('审核状态')" size="small">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <!-- 日期 -->
        <el-col :span="4">
          <el-date-picker
            size="small"
            class="selectTime"
            v-model="timeList"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('提交开始日期')"
            :end-placeholder="$t('提交结束日期')"
            @change="fm"
          >
          </el-date-picker>
        </el-col>
        <!--搜索  -->
        <el-col :span="3">
          <el-button size="small" class="searchBtn" @click="triggerVal">{{ $t('搜索') }}</el-button>
        </el-col>
        <!--待结算  -->
        <el-col :span="3">
          <el-button size="small" type="primary" class="unsettled" @click="editSettled">
            {{ $t('待结算') }}
            <i class="count">{{ totalSettlement }}</i>
          </el-button>
        </el-col>
        <!-- 关键字搜索 -->
        <el-col :span="4" :offset="4">
          <search-group
            v-model="page_params.keyword"
            @search="goSearch"
            :placeholder="$t('请输入关键字')"
          >
          </search-group>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="data-list">
      <el-table border style="width: 100%" height="calc(100vh - 270px)" :data="allData">
        <el-table-column type="index" width="50" :label="$t('#')"> </el-table-column>
        <el-table-column prop="serial_no" :label="$t('流水号')" width="185"> </el-table-column>
        <el-table-column prop="status" :label="$t('审核状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0" class="noAudit">{{ $t('待审核') }}</span>
            <span v-if="scope.row.status === 1" class="pass">{{ $t('审核通过') }}</span>
            <span v-if="scope.row.status === 2" class="refuse">{{ $t('审核拒绝') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.id" :label="$t('代理ID')" width="100"> </el-table-column>
        <el-table-column prop="user.name" :label="$t('代理昵称')" width="100"> </el-table-column>
        <el-table-column prop="type" :label="$t('提现方式')"> </el-table-column>
        <el-table-column prop="amount" :label="$t('提现金额￥')" width="100"> </el-table-column>
        <el-table-column prop="item_count" :label="$t('提现明细数')" width="100"> </el-table-column>
        <el-table-column prop="created_at" :label="$t('申请时间')" width="100"> </el-table-column>
        <el-table-column prop="operator" :label="$t('处理人')" width="100"> </el-table-column>
        <el-table-column prop="audit_at" :label="$t('处理时间')" width="100"> </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="success"
              plain
              size="mini"
              @click="editInviteDetail(scope.row.id)"
              >{{ $t('审核') }}</el-button
            >
            <el-button
              v-if="scope.row.status === 1 || scope.row.status === 2"
              type="primary"
              plain
              size="mini"
              @click="editDetail(scope.row.id)"
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      timeList: [],
      typeData: [],
      page_params: {
        status: '',
        type: '',
        begin_date: '',
        end_date: ''
      },
      statusData: [
        {
          id: 0,
          name: this.$t('待审核')
        },
        {
          id: 1,
          name: this.$t('审核通过')
        },
        {
          id: 2,
          name: this.$t('审核拒绝')
        }
      ]
    }
  },
  props: {
    allData: {},
    totalSettlement: {
      type: Number,
      required: true
    }
  },
  components: {
    SearchGroup
  },
  mixins: [pagination],
  created() {
    this.goMethods()
  },
  methods: {
    // 详情
    editDetail(id) {
      this.$emit('subprice', id)
    },
    // 审核
    editInviteDetail(id) {
      this.$emit('subprice', id)
    },
    editSettled() {
      this.$router.push({
        name: 'agencyCommission'
      })
    },
    triggerVal() {
      this.page_params.begin_date = this.timeList[0]
      this.page_params.end_date = this.timeList[1]
      this.$emit('passval', this.page_params)
    },
    fm() {
      console.log(this.timeList)
    },
    // 提现方式
    goMethods() {
      this.$request.withdrawalMethod().then(res => {
        console.log(res)
        this.typeData = res.data.type_list
        console.log(this.typeData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data-container {
  .headline {
    margin-top: 20px;
    /deep/.el-button {
      margin: 0px;
    }
    .selectTime {
      width: 260px !important;
    }
    .searchBtn {
      width: 120px;
    }
    .unsettled {
      width: 120px;
      position: relative;
      .count {
        position: absolute;
        top: -10px;
        left: 100px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        background-color: #c81623;
        border-radius: 50%;
        font-style: normal;
      }
    }
  }
  .data-list {
    margin-top: 40px;
    /deep/.el-table tr th.is-leaf {
      border-bottom: 1px #ecedf0 solid;
      background-color: #fff;
    }
    /deep/.noAudit {
      color: red;
    }
    /deep/.pass {
      color: green;
    }
    /deep/.refuse {
      color: #e6a23c;
    }
    /deep/.el-table th > .cell {
      text-align: center;
    }
    /deep/.el-table .cell {
      text-align: center;
    }
  }
}
</style>
