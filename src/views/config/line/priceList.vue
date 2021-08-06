<template>
  <div class="price-list">
    <div class="title">{{ name }}{{ $t('价格表') }}</div>
    <div class="func-btn">
      <el-button size="small" @click="exportPrice" style="margin-right: 10px">{{
        $t('导出价格表')
      }}</el-button>
      <!-- <el-upload class="upload-demo" action="" :limit="1" :http-request="importPrice">
        <el-button size="small" type="primary">{{ $t('导入价格表') }}</el-button>
      </el-upload> -->
      <el-upload
        class="upload-demo"
        action=""
        :http-request="uploadBaleImg"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">{{ $t('导入价格表') }}</el-button>
      </el-upload>
      <span class="tips">{{ $t('可导出价格表批量修改后，再导入表格') }}</span>
    </div>
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
        :span-method="mergeRowMethod"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        @edit-closed="editClosedEvent"
      >
        <vxe-table-column type="seq" title="#" width="80"></vxe-table-column>
        <vxe-table-colgroup>
          <vxe-table-colgroup
            field="range"
            :title="$t('重量范围') + localization.weight_unit"
            min-width="120"
          ></vxe-table-colgroup
        ></vxe-table-colgroup>
        <vxe-table-colgroup v-if="type === 1 || type === 4">
          <vxe-table-colgroup
            field="unit_weight"
            :title="$t('单位重量') + localization.weight_unit"
            min-width="120"
          ></vxe-table-colgroup
        ></vxe-table-colgroup>
        <vxe-table-colgroup>
          <vxe-table-colgroup
            field="type"
            :title="$t('价格类型')"
            min-width="120"
          ></vxe-table-colgroup
        ></vxe-table-colgroup>
        <vxe-table-colgroup
          v-for="config in ctableColumn"
          :key="config.id"
          :title="config.name + ' (' + $t('点击修改') + ')'"
        >
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
    <el-button class="save-btn" type="primary" @click="editPrice">{{ $t('保存') }}</el-button>
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
      ctableColumn: [],
      urlExcel: '',
      name: '',
      localization: {},
      file: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getPriceTable() {
      this.$request.getPriceTable(this.$route.params.id).then(res => {
        if (res.ret) {
          this.localization = res.localization
          res.data.forEach(item => {
            this.ctableData.push(
              ...item.prices.map(ele => {
                let range = ''
                if (ele.start / 1000 === ele.end / 1000) {
                  range = ele.start / 1000
                } else {
                  range = `(${ele.start / 1000}，${ele.end / 1000}]`
                }
                let unit_weight = ele.unit_weight / 1000
                let price = ele.price / 100
                let priceId = ele.id
                let type = ''
                if (this.type === 1) {
                  //首重续重
                  ele.type === 0 ? (type = this.$t('首费')) : (type = this.$t('续单价'))
                } else if (this.type === 2) {
                  //阶梯价格
                  type = '单价'
                } else if (this.type === 3) {
                  //首重+阶梯
                  ele.type === 3 ? (type = this.$t('单价')) : (type = this.$t('阶梯总价'))
                } else if (this.type === 4) {
                  //多级续重
                  ele.type === 0 ? (type = this.$t('首费')) : (type = this.$t('续单价'))
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
            if (this.type === 4) {
              arr.forEach((ele, index) => {
                if (ele.range === item.range && ele.unit_weight === item.unit_weight) {
                  flag = index
                }
              })
            } else {
              arr.forEach((ele, index) => {
                if (ele.range === item.range) {
                  flag = index
                }
              })
            }
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
      })
    },
    mergeRowMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ['range']
      const cellValue = row[column.property]
      if (fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1]
        let nextRow = visibleData[_rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    getList() {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        if (res.ret) {
          this.type = res.data.mode
          this.name = res.data.name
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
    },
    exportPrice() {
      this.$request.exportPrice(this.$route.params.id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    uploadBaleImg(item) {
      let file = item.file
      let params = new FormData()
      params.append(`file`, file)
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getPriceTable()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onUpload(file) {
      let params = new FormData()
      console.log(params, 'params')
      params.append(`file`, file)
      return this.$request.importPrice(this.$route.params.id, params)
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
