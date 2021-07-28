<template>
  <div class="price-list">
    <div class="title">海运路线-渠道1价格表</div>
    <div class="func-btn">
      <el-button size="small">{{ $t('导出价格表') }}</el-button>
      <el-button size="small">{{ $t('导入价格表') }}</el-button>
      <span class="tips">{{ $t('可导出价格表批量批量修改后，再导入表格') }}</span>
      <div style="flex: 1; display: flex; justify-content: flex-end">
        <el-button type="primary" size="mini" @click="type = 1">首重续重</el-button>
        <el-button type="primary" size="mini" @click="type = 2">阶梯价格</el-button>
        <el-button type="primary" size="mini" @click="type = 3">单位价格+阶梯价格</el-button>
        <el-button type="primary" size="mini" @click="type = 4">多级续重</el-button>
      </div>
    </div>
    <!-- <vxe-table
      border
      show-overflow
      auto-resize
      highlight-hover-row
      align="center"
      ref="xTable"
      height="300"
      class="x-table"
      :data="tableData"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
      @edit-closed="editClosedEvent"
      v-if="type === 0"
    >
      <vxe-table-column field="start" title="开始重量" min-width="120"></vxe-table-column>
      <vxe-table-column field="end" title="截止重量" min-width="120"></vxe-table-column>
      <vxe-table-column field="unit_weight" title="单位续重" min-width="120"></vxe-table-column>
      <vxe-table-column
        v-for="config in tableColumn"
        :key="config.field"
        :field="config.field"
        :title="config.title"
        :minWidth="config.minWidth"
        :edit-render="config.editRender"
      >
      </vxe-table-column>
    </vxe-table>
    <div v-if="type === 1">
      <p>阶梯价格模式</p>
      <vxe-table
        border
        show-overflow
        auto-resize
        highlight-hover-row
        align="center"
        ref="xBable"
        height="300"
        class="x-table"
        :data="bTableData"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        @edit-closed="editClosedEvent"
      >
        <vxe-table-column type="seq" title="分区" width="80"></vxe-table-column>
        <vxe-table-column field="name" title="分区名称" min-width="150"></vxe-table-column>
        <vxe-table-column field="areas" title="国家" min-width="220"></vxe-table-column>
        <vxe-table-column
          v-for="config in bTableColumn"
          :key="config.field"
          :field="config.field"
          :title="config.title"
          :minWidth="config.minWidth"
          :edit-render="config.editRender"
          @edit-closed="editClosedEvent"
        >
        </vxe-table-column>
      </vxe-table>
    </div> -->
    <div>
      <p v-if="type === 1">{{ $t('首重续重模式') }}</p>
      <p v-if="type === 2">{{ $t('阶梯价格模式') }}</p>
      <p v-if="type === 3">{{ $t('单位价格+阶梯价格模式（总价=单位价格*重量+所属阶梯总价）') }}</p>
      <p v-if="type === 4">{{ $t('多级续重模式') }}</p>
      <vxe-table
        border
        auto-resize
        show-overflow
        show-header-overflow
        :tooltip-config="{ enterable: true }"
        align="center"
        ref="cTable"
        class="x-table"
        height="400"
        :data="ctableData"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        @edit-closed="editClosedEvent"
      >
        <vxe-table-column type="seq" title="#" width="80"></vxe-table-column>
        <vxe-table-colgroup>
          <vxe-table-colgroup field="range" title="重量范围" min-width="120"></vxe-table-colgroup
        ></vxe-table-colgroup>
        <vxe-table-colgroup v-if="type === 1 || type === 4">
          <vxe-table-colgroup
            field="unit_weight"
            title="首位续重"
            min-width="120"
          ></vxe-table-colgroup
        ></vxe-table-colgroup>
        <vxe-table-colgroup>
          <vxe-table-colgroup field="type" title="价格类型" min-width="120"></vxe-table-colgroup
        ></vxe-table-colgroup>
        <vxe-table-colgroup v-for="config in ctableColumn" :key="config.id" :title="config.name">
          <vxe-table-colgroup
            :title="config.areas"
            :field="config.field"
            min-width="250"
            :edit-render="config.editRender"
            @edit-closed="editClosedEvent"
          ></vxe-table-colgroup>
        </vxe-table-colgroup>
      </vxe-table>
    </div>
    <el-button class="save-btn" type="primary" @click="editPrice">保存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 0, //1.首重续重 2.阶梯价格 3.首重+阶梯 4.多级续重
      tableColumn: [],
      tableData: [],
      region_id: '',
      id: '',
      oldCellValue: '',
      newCellValue: '',
      newField: '',
      params: [],
      bTableData: [],
      bTableColumn: [],
      ctableData: [],
      ctableColumn: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getPriceTable() {
      this.$request.getPriceTable(this.$route.params.id).then(res => {
        if (res.ret) {
          // if (this.type === 0) {
          //   res.data.forEach(item => {
          //     this.tableData.push(
          //       ...item.prices.map(ele => {
          //         let name = item.name
          //         let regionId = item.id //分区id
          //         let priceId = ele.id //价格id
          //         let start = ele.start / 1000
          //         let end = ele.end / 1000
          //         let unit_weight = ele.unit_weight / 1000
          //         let price = ele.price
          //         return {
          //           name,
          //           regionId,
          //           priceId,
          //           start,
          //           end,
          //           unit_weight,
          //           price
          //         }
          //       })
          //     )
          //   })
          //   this.tableData.forEach(item => {
          //     item[`price_${item.regionId}`] = item.price / 100 //价格
          //     item[`${item.regionId}`] = item.priceId //价格id
          //   })
          //   let arr = []
          //   this.tableData.forEach(item => {
          //     let flag = -1
          //     arr.forEach((ele, index) => {
          //       if (
          //         ele.start === item.start &&
          //         ele.end === item.end &&
          //         ele.unit_weight === item.unit_weight
          //       ) {
          //         flag = index
          //       }
          //     })
          //     if (flag !== -1) {
          //       arr[flag] = { ...arr[flag], ...item }
          //     } else {
          //       arr.push(item)
          //     }
          //   })
          //   this.tableData = arr
          //   this.tableColumn = res.data.map(item => {
          //     let field = ''
          //     let title = ''
          //     let minWidth = 170
          //     let editRender = { name: 'input', attrs: { type: 'text' } }
          //     item.prices.map(() => {
          //       field = `price_${item.id}`
          //       title = `${item.name}(点击修改)`
          //     })
          //     return {
          //       field,
          //       title,
          //       minWidth,
          //       editRender
          //     }
          //   })
          // } else if (this.type === 1) {
          //   //阶梯价格模式
          //   let pricesList = []
          //   res.data.forEach(item => {
          //     pricesList.push(
          //       ...item.prices.map(ele => {
          //         let start = ele.start / 1000
          //         let end = ele.end / 1000
          //         return {
          //           start,
          //           end
          //         }
          //       })
          //     )
          //   })
          //   let obj = {}
          //   pricesList = pricesList.reduce((item, next) => {
          //     obj[next.start] ? '' : (obj[next.start] = true && item.push(next))
          //     return item
          //   }, [])
          //   this.bTableColumn = pricesList.map(item => {
          //     let field = `${item.start}_${item.end}`
          //     let title = `(${item.start}，${item.end}]`
          //     let minWidth = 100
          //     let editRender = { name: 'input', attrs: { type: 'text' } }
          //     return {
          //       field,
          //       title,
          //       minWidth,
          //       editRender
          //     }
          //   })
          //   this.bTableData = res.data.map(item => {
          //     const areas = item.areas
          //       .map(item => item.country_name + item.area_name + item.sub_area_name)
          //       .join('、')
          //     return {
          //       ...item,
          //       areas
          //     }
          //   })
          //   this.bTableData.forEach(item => {
          //     item.prices.map(ele => {
          //       item[`${ele.start / 1000}_${ele.end / 1000}`] = ele.price / 100
          //       item[`${ele.start / 1000}_${ele.end / 1000}_id`] = ele.id
          //     })
          //   })
          // } else
          if (this.type !== 4) {
            res.data.forEach(item => {
              this.ctableData.push(
                ...item.prices.map(ele => {
                  let range = `(${ele.start / 1000}，${ele.end / 1000}]`
                  let unit_weight = ele.unit_weight / 1000
                  let price = ele.price / 100
                  let priceId = ele.id
                  let type = ''
                  if (this.type === 1) {
                    type === 0 ? (type = '首重') : (type = '续重')
                  } else if (this.type === 2) {
                    type = ''
                  } else if (this.type === 3) {
                    type === 3 ? (type = '单位价格') : (type = '阶梯价格')
                  } else if (this.type === 4) {
                    type === 0 ? (type = '首重') : (type = '多级续重')
                  }
                  return {
                    ...item,
                    range,
                    unit_weight,
                    type,
                    price,
                    priceId
                  }
                })
              )
            })
            this.ctableData.forEach(item => {
              item[`${item.id}_price`] = item.price
              item[`${item.id}_price_id`] = item.priceId
            })
            let arr = []
            this.ctableData.forEach(item => {
              let flag = -1
              arr.forEach((ele, index) => {
                if (ele.range === item.range) {
                  flag = index
                }
              })
              if (flag !== -1) {
                arr[flag] = { ...arr[flag], ...item }
              } else {
                arr.push(item)
              }
            })
            this.ctableData = arr
            this.ctableColumn = res.data.map(item => {
              const areas = item.areas
                .map(item => item.country_name + item.area_name + item.sub_area_name)
                .join('、')
              const field = `${item.id}_price`
              let editRender = { name: 'input', attrs: { type: 'text' } }
              return {
                ...item,
                areas,
                field,
                editRender
              }
            })
          }
        }
      })
    },
    getList() {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        if (res.ret) {
          this.type = res.data.mode
          this.getPriceTable()
        }
      })
    },
    editClosedEvent({ row, column }) {
      this.newField = column.property
      this.newCellValue = row[this.newField] //价格
      if (this.type === 0) {
        this.region_id = +column.property.split('_')[1] //分区id
        this.id = row[this.region_id] //价格id
      } else if (this.type === 1) {
        this.region_id = row.id //分区id
        this.id = row[`${this.newField}_id`] //价格id
      } else {
        this.region_id = +this.newField.split('_')[0] //分区id
        this.id = row[`${this.newField}_id`] //价格id
      }
      let obj = {
        region_id: this.region_id,
        prices: [
          {
            id: this.id,
            price: +this.newCellValue
          }
        ]
      }
      this.params.push(obj)
    },
    editPrice() {
      if (!this.params.length) return
      this.$request.editPrice(this.$route.params.id, this.params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getPriceTable()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          this.$router.go(0)
        }
      })
      this.newCellValue = ''
      this.newField = ''
      this.params = []
      this.region_id = ''
      this.id = ''
    }
  }
}
</script>
<style scoped lang="scss">
.price-list {
  padding: 30px;
  font-size: 14px;
  overflow: hidden;
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
  .x-table {
    margin: 20px 0;
  }
  .save-btn {
    float: right;
  }
}
</style>
