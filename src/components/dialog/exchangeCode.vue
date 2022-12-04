<template>
  <el-dialog :visible.sync="show" :title="$t('兑换码管理')" @close="clear">
    <div>
      <el-button>{{ $t('新增兑换码') }}</el-button>
      <div>{{ $t('注：领取与使用情况，请在该优惠券记录中查看') }}</div>
    </div>
    <el-table :data="tableData" border>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column :label="$t('兑换码')" prop=""></el-table-column>
      <el-table-column :label="$t('兑换码备注')" prop=""></el-table-column>
      <el-table-column :label="$t('可领取量')" prop=""></el-table-column>
      <el-table-column :label="$t('使用/领取')" prop=""></el-table-column>
      <el-table-column :label="$t('状态')" prop=""></el-table-column>
      <el-table-column :label="$t('操作')">
        <el-button>{{ $t('作废') }}</el-button>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <el-dialog :visible.sync="showInner" :title="$t('新增兑换码')">
      <el-form>
        <el-form-item :label="$t('最大可领取量')">
          <el-input v-model="value" :placeholder="$t('请输入最大可领取量')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('兑换码备注')">
          <el-input v-model="value" :placeholder="$t('请输入备注')"></el-input>
        </el-form-item>
        <div></div>
        <el-form-item :label="$t('以上兑换码生成数量')">
          <el-input-number v-model="num" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      showInner: false
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    clear() {}
  }
}
</script>

<style lang="scss">
.pagination-box {
  padding: 20px 0;
}
</style>
