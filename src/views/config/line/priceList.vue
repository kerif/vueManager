<template>
  <div class="price-list">
    <div class="title">海运路线-渠道1价格表</div>
    <div class="func-btn">
      <el-button size="small">{{ $t('导出价格表') }}</el-button>
      <el-button size="small">{{ $t('导入价格表') }}</el-button>
      <span class="tips">{{ $t('可导出价格表批量批量修改后，再导入表格') }}</span>
    </div>
    <vxe-table
      border
      show-overflow
      ref="xTable"
      height="300"
      :data="tableData"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
    >
      <vxe-table-column field="start" title="开始重量"></vxe-table-column>
      <vxe-table-column field="end" title="截止重量"></vxe-table-column>
      <vxe-table-column field="unit_weight" title="单位续重"></vxe-table-column>
      <vxe-table-column
        v-for="config in tableColumn"
        :key="config.key"
        :type="config.type"
        :field="config.field"
        :title="config.title"
        :fixed="config.fixed"
        :width="config.width"
        :filters="config.filters"
      >
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableColumn: [],
      tableData: []
    }
  },
  created() {
    this.getPriceTable()
  },
  methods: {
    getPriceTable() {
      this.$request.getPriceTable(this.$route.params.id).then(res => {
        if (res.ret) {
          this.tableData = res.data.map(item => {
            let start = ''
            let end = ''
            let unit_weight = ''
            let name = item.name
            let price = item.prices
            item.prices.forEach(ele => {
              start = ele.start / 1000
              end = ele.end / 1000
              unit_weight = ele.unit_weight / 1000
            })
            return {
              start,
              end,
              unit_weight,
              name,
              price
            }
          })
          this.tableData.forEach(item => {
            item.price.forEach(ele => {
              item[`${item.name}_${ele.id}`] = 1
            })
          })
          console.log(this.tableData, 'this.tableData')
          // var obj = {}
          // this.tableData = this.tableData.reduce(function (item, next) {
          //   ;(obj[next.start] ? '' : (obj[next.start] = true)) &&
          //     (obj[next.end] ? '' : (obj[next.end] = true)) &&
          //     item.push(next)
          //   return item
          // }, [])
          this.tableColumn = res.data.map(item => {
            let field = ''
            let title = ''
            item.prices.map(ele => {
              field = `${item.name}_${ele.id}`
              title = item.name
            })
            return {
              field,
              title
            }
          })
          console.log(this.tableColumn, 'this.tableColumn')
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.price-list {
  padding: 30px;
  font-size: 14px;
  background-color: #fff;
  .title {
    padding-bottom: 30px;
  }
  .func-btn {
    display: flex;
    align-items: flex-end;
  }
  .tips {
    padding-left: 20px;
    color: #999;
  }
}
</style>
