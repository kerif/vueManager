<template>
  <div class="declare-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('待提交')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('已提交')" name="2"></el-tab-pane>
    </el-tabs>
    <div class="headline">
      <div class="head-status">
        <el-button size="small" @click="batchSub">{{ $t('批量提交') }}</el-button>
      </div>
      <div class="head-search">
        <el-input v-model="keyword" :placeholder="$t('请输入内容')">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
      <el-table-column type="selection" label="#" width="180"> </el-table-column>
      <el-table-column prop="" :label="$t('客户ID')"> </el-table-column>
      <el-table-column prop="" :label="$t('客户昵称')"> </el-table-column>
      <el-table-column prop="" :label="$t('订单号')"> </el-table-column>
      <el-table-column prop="" :label="$t('线路名称')"> </el-table-column>
      <el-table-column prop="" :label="$t('收货国家')"> </el-table-column>
      <el-table-column prop="" :label="$t('申报价值')"> </el-table-column>
      <el-table-column prop="" :label="$t('提交时间')"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <el-button>{{ $t('报关信息') }}</el-button>
        <el-button>{{ $t('查看') }}</el-button>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="$t('报关信息')">
      <div></div>
      <add-btn>{{ $t('新增') }}</add-btn>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="" :label="$t('中文品名')"> </el-table-column>
        <el-table-column prop="" :label="$t('英文品名')"> </el-table-column>
        <el-table-column prop="" :label="$t('数量')"> </el-table-column>
        <el-table-column prop="" :label="$t('单位')"> </el-table-column>
        <el-table-column prop="" :label="$t('单价')"> </el-table-column>
        <el-table-column prop="" :label="$t('总价值')"> </el-table-column>
        <el-table-column prop="" :label="$t('币种')"> </el-table-column>
        <el-table-column :label="$t('操作')">
          <el-button>{{ $t('删除') }}</el-button>
        </el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      <div slot="footer">
        <el-button @click="cancel">{{ $t('取消') }}</el-button>
        <el-button @click="submit">{{ $t('提交') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
export default {
  data() {
    return {
      activeName: '1',
      tableData: [],
      keyword: ''
    }
  },
  components: {
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  created() {},
  methods: {
    handleClick() {},
    batchSub() {},
    cancel() {},
    submit() {}
  }
}
</script>

<style lang="scss">
.declare-container {
  font-size: 14px;
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
  .headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-status {
    }
    .head-search {
      width: 200px;
    }
  }
}
</style>
