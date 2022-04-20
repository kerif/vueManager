<template>
  <div>
    <el-tabs v-model="activeName" class="tab-length" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('待付款')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('已付款')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('作废')" name="3"></el-tab-pane>
    </el-tabs>
    <div class="order-replenishment-search" v-show="hasFilterCondition">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="value" size="mini" :placeholder="$t('请选择付款状态')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="value" size="mini" :placeholder="$t('请选择付款方式')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            size="mini"
            class="timeStyle"
            v-model="timeList"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('提交开始日期')"
            :end-placeholder="$t('提交结束日期')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain size="small" @click="submitForm">{{
            $t('搜索')
          }}</el-button>
          <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex; margin-top: 10px">
      <div style="flex: 1">
        <el-button type="primary" size="small" @click="addSupplement">{{
          $t('创建补款单')
        }}</el-button>
        <el-button class="btn-main">{{ $t('补款方式设置') }}</el-button>
      </div>
      <div class="headr-r" style="display: flex">
        <div class="searchGroup">
          <search-group
            :placeholder="$t('请输入关键字')"
            v-model="page_params.keyword"
            @search="goSearch"
          >
          </search-group>
        </div>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="date" :label="$t('流水号')"></el-table-column>
        <el-table-column prop="name" :label="$t('状态')"></el-table-column>
        <el-table-column prop="address" :label="$t('所属客户')"></el-table-column>
        <el-table-column prop="name" :label="$t('关联订单号')"></el-table-column>
        <el-table-column prop="name" :label="$t('费用类型')"></el-table-column>
        <el-table-column prop="name" :label="$t('应付金额')"></el-table-column>
        <el-table-column prop="name" :label="$t('实付金额')"></el-table-column>
        <el-table-column prop="name" :label="$t('支付方式')"></el-table-column>
        <el-table-column prop="name" :label="$t('创建时间')"></el-table-column>
        <el-table-column prop="name" :label="$t('支付时间')"></el-table-column>
        <el-table-column :label="$t('操作')" fixed="right" width="150">
          <template>
            <el-button class="btn-green">{{ $t('修改') }}</el-button>
            <el-button class="btn-main">{{ $t('详情') }}</el-button>
            <el-button class="btn-deep-purple">{{ $t('审核') }}</el-button>
            <el-button class="btn-light-red">{{ $t('作废') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="showConfig" :title="$t('补款方式设置')" @close="clear">
      <el-form>
        <el-form-item :label="$t('请选择可用收款方式')">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import dialog from '@/components/dialog'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      activeName: '0',
      showConfig: false,
      hasFilterCondition: false,
      checkList: [],
      timeList: [],
      formInline: {},
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  components: {
    NlePagination,
    SearchGroup
  },
  mixins: [pagination],
  methods: {
    handleClick(tab) {
      console.log(tab)
    },
    addSupplement() {
      dialog({
        type: 'qaCumulative'
      })
    }
  }
}
</script>

<style lang="scss">
.order-replenishment-search {
  background: #fff;
  padding-left: 10px;
}
</style>
