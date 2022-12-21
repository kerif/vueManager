<template>
  <div>
    <el-dialog :visible.sync="show" :title="$t('设置转运单号')" @close="onClear" width="55%">
      <div class="dialog-pickup-tracking-info">
        <el-button @click="onBatchFill">批量设置</el-button>
        <el-table :data="tableList" border style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="pickup_no" label="预约单号" width="180"> </el-table-column>
          <el-table-column prop="express_company_id" label="快递公司" width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.express_company_id" clearable placeholder="请选择">
                <el-option
                  v-for="item in expressCompanyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="express_number" label="快递单号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.express_number"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onSumbit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量设置" :visible.sync="dialogBatchVisible" width="30%">
      <span>预约单号 快递公司 快递单号 格式一行一个,中间空格分开</span>

      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10 }"
        placeholder="如YY00001 顺丰快递 SF000001"
        v-model="batchFillValue"
      >
      </el-input>

      <el-alert
        :closable="false"
        v-for="(item, index) in batchFillError"
        :key="index"
        :title="item"
        type="error"
      >
      </el-alert>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBatchVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onFillSubmit">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogBatchVisible: false,
      batchFillValue: '',
      batchFillError: [],
      expressCompanyList: [],
      tableList: [
        {
          id: 1,
          pickup_no: 'YY0001',
          express_company_id: '',
          express_number: ''
        },
        {
          id: 2,
          pickup_no: 'YY0002',
          express_company_id: '',
          express_number: ''
        },
        {
          id: 3,
          pickup_no: 'YY0003',
          express_company_id: '',
          express_number: ''
        }
      ]
    }
  },
  created() {
    this.loadExpressCompanyList()
  },
  methods: {
    init() {
      this.show = true
    },
    onBatchFill() {
      this.batchFillValue = ''
      this.dialogBatchVisible = true
    },
    onFillSubmit() {
      this.batchFillError = []
      let fillValue = this.batchFillValue.replace(/^s+/, '').replace(/s+$/, '').split('\n')
      console.log('fillValue--,', fillValue)
      for (let index = 0; index < fillValue.length; index++) {
        const element = fillValue[index].replace(/^s+/, '').replace(/s+$/, '')
        let fillValueLineArr = element.split(' ')
        console.log('fillValueLineArr--,', index, fillValueLineArr)
        let found = false
        for (let index2 = 0; index2 < this.tableList.length; index2++) {
          const tableRowData = this.tableList[index2]
          // 如果是同一个取件单号
          if (fillValueLineArr[0] === tableRowData.pickup_no) {
            for (let index3 = 0; index3 < this.expressCompanyList.length; index3++) {
              const element3 = this.expressCompanyList[index3]
              if (element3.name === fillValueLineArr[1]) {
                console.info('找到', fillValueLineArr)
                this.tableList[index2].express_company_id = element3.id
                found = true
                break
              }
            }
            this.tableList[index2].express_number = fillValueLineArr[2]
          }
        }
        if (!found) {
          this.batchFillError.push(element + '未找到')
          console.error('未找到', fillValueLineArr)
        }
      }
      if (this.batchFillError.length === 0) {
        this.dialogBatchVisible = false
      }
    },
    onSumbit() {
      for (let index = 0; index < this.tableList.length; index++) {
        const element = this.tableList[index]
        if (element.express_company_id === '' || element.express_company_id == 0) {
          break
        }
        if (element.express_number === '') {
          break
        }
      }
      this.show = false
    },
    loadExpressCompanyList() {
      this.$request.getExpressData().then(res => {
        this.expressCompanyList = res.data
      })
    },
    onClear() {
      this.batchFillValue = ''
    }
  }
}
</script>
<style lang="scss">
.dialog-pickup-tracking-info {
  padding: 20px;
  .btn-group {
    padding-top: 20px;
    text-align: right;
  }
}
</style>
