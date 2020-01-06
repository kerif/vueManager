<template>
  <div class="line-list-container">
    <div class="add-btn-box"><add-btn router="lineadd">添加路线</add-btn></div>
    <el-table stripe border class="data-list" :data="lineList"
      v-loading="tableLoading">
      <el-table-column type="expand">
        <template slot-scope="scope">
          {{scope.row.remark || "无" }}
        </template>
      </el-table-column>
      <el-table-column label="线路名称" prop="cn_name"></el-table-column>
      <el-table-column label="支持国家">
        <template slot-scope="scope">
          <span v-for="item in scope.row.countries" :key="item.id">
            {{item.cn_name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="参考时效" prop="reference_time"></el-table-column>
      <el-table-column :label="'首重' + this.localization.weight_unit" prop="first_weight"></el-table-column>
      <el-table-column :label="'首费' + this.localization.currency_unit" prop="first_money"></el-table-column>
      <el-table-column :label="'续重' + this.localization.weight_unit" prop="next_weight"></el-table-column>
      <el-table-column :label="'续费' + this.localization.currency_unit" prop="next_money"></el-table-column>
      <el-table-column :label="'最大重量' + this.localization.weight_unit" prop="max_weight"></el-table-column>
      <el-table-column :label="'最小重量' + this.localization.weight_unit" prop="min_weight"></el-table-column>
      <el-table-column label="是否启用" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
            active-text="开"
            inactive-text="关"
            active-color="#13ce66"
            inactive-color="gray">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editLine(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import AddBtn from '@/components/addBtn'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  mixins: [pagination],
  components: {
    AddBtn,
    NlePagination
  },
  data () {
    return {
      lineList: [
        {
          enabled: true
        }
      ],
      localization: {},
      tableLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getLines({
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.lineList = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
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
    // 修改线路
    editLine (id) {
      this.$router.push({ name: 'lineedit',
        params: {
          state: 'edit',
          id: id
        } }
      )
    },
    // 修改转账支付的开关
    changeTransfer (event, enabled, id) {
      console.log(typeof (event), '我是event')
      console.log(event, 'event')
      this.$request.resetLines(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.line-list-container {
  .add-btn-box {
    overflow: hidden;
  }
}
</style>
