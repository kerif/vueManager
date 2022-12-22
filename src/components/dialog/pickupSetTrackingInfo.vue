<template>
  <div>
    <el-dialog :visible.sync="show" :title="$t('设置转运单号')" @close="onClear" width="55%">
      <div class="dialog-pickup-tracking-info">
        <el-button @click="onBatchFill" class="config-btn">{{ $t('批量设置') }}</el-button>
        <el-table :data="tableList" border style="width: 100%">
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="sn" :label="$t('预约单号')" width="180"> </el-table-column>
          <el-table-column prop="company" :label="$t('快递公司')" width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.company" clearable :placeholder="$t('请选择')">
                <el-option
                  v-for="item in expressCompanyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="express_num" :label="$t('快递单号')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.express_num"></el-input>
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
      <span>{{ $t('预约单号 快递公司 快递单号 格式一行一个,中间空格分开') }}</span>

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
      tableList: []
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
          if (fillValueLineArr[0] === tableRowData.sn) {
            for (let index3 = 0; index3 < this.expressCompanyList.length; index3++) {
              const element3 = this.expressCompanyList[index3]

              console.info('找到-->', element3.name, fillValueLineArr[1])
              if (element3.name === fillValueLineArr[1]) {
                console.info('找到', fillValueLineArr)
                this.tableList[index2].company = element3.name
                found = true
                break
              }
            }
            this.tableList[index2].express_num = fillValueLineArr[2]
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
      let requestData = []
      let allok = true
      for (let index = 0; index < this.tableList.length; index++) {
        const element = this.tableList[index]
        if (element.company === undefined || element.company === '') {
          allok = false
          break
        }
        if (element.express_num === '') {
          allok = false
          break
        }
        requestData.push({
          sn: element.sn,
          company: element.company,
          express_num: element.express_num
        })
      }

      if (!allok) {
        this.$notify({
          title: this.$t('操作失败'),
          message: '请填写转运信息',
          type: 'warning'
        })
        return false
      }

      allok = true

      this.$request.pickupSetTrackingInfo(requestData).then(res => {
        if (!res.ret) {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        } else {
          this.show = false
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        }
      })
    },
    loadExpressCompanyList() {
      this.$request.getExpressData().then(res => {
        this.expressCompanyList = res.data
      })
    },
    onClear() {
      this.show = false
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
  .config-btn {
    margin-bottom: 20px;
  }
}
</style>
