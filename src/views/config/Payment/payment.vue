<template>
    <div class="payment-container">
      <el-table  :data="paymentData" v-loading="tableLoading" class="data-list"
      border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="配置">
          <template slot-scope="scope">
            <el-button class="btn-green" @click="configuration(scope.row.id)">配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      paymentData: [
        {
          type: '微信支付'
        }
      ],
      tableLoading: false
    }
  },
  methods: {
    configuration (id) {
      dialog({ type: 'configuration', id: id
      }, () => {
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss">
</style>
