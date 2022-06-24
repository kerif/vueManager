<template>
  <el-dialog :visible.sync="show" :title="$t('分类管理')" @close="clear">
    <add-btn>{{ $t('增加') }}</add-btn>
    <el-table>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column :label="$t('分类')"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template>
          <el-button>{{ $t('编辑') }}</el-button>
          <el-button>{{ $t('删除') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
    <div slot="footer">
      <el-button type="primary" :loading="$store.state.btnLoading" @click="confirm">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AddBtn from '@/components/addBtn'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {}
  },
  components: {
    AddBtn,
    NlePagination
  },
  mixins: [pagination],
  methods: {
    confirm() {},
    clear() {}
  }
}
</script>

<style></style>
