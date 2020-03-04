<template>
  <el-dialog :visible.sync="show" title="加入发货单" class="invoice-container" @close="clear">
    <el-select v-model="invoice.sn">
      <el-option
      v-for="item in invoiceList"
      :title="item.remark"
      :key="item.id"
      :value="item.id"
      :label="`${item.sn} ${item.destination_country}`">
      </el-option>
    </el-select>
    <el-button class="created-btn" @click="goCreated">创建发货单</el-button>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirmShip">确定</el-button>
    </div>
      <!-- 创建发货单 -->
      <el-dialog :visible.sync="innerVisible" title="创建发货单" class="dialog-invoice" width="35%" @close="clear" append-to-body>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
        label-position="top">
            <!-- 员工组中文名 -->
                <el-form-item label="目的地" prop="country_id">
                    <el-select v-model="ruleForm.country_id" placeholder="请选择目的地"
                    filterable>
                    <el-option
                      v-for="item in country"
                      :key="item.id"
                      :label="item.cn_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
            <!-- 用户组描述 -->
            <el-form-item label="备注">
              <el-input type="textarea" v-model="ruleForm.remark"
              placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="returnShip">取消</el-button>
          <el-button type="primary" @click="confirmCreated('ruleForm')">确定</el-button>
        </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      innerVisible: false,
      invoiceList: [],
      invoice: {
        sn: ''
      },
      ruleForm: {
        country_id: '',
        remark: ''
      },
      country: [],
      rules: {
        country_id: [
          { required: true, message: '请输入目的地', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 创建发货单
    goCreated () {
      this.innerVisible = true
      this.show = false
    },
    // 创建发货单 取消
    returnShip () {
      this.innerVisible = false
      this.show = true
    },
    getUser () {
      this.$request.getInvoice().then(res => {
        this.invoiceList = res.data
      })
    },
    getCountry () {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    // 确认加入发货单
    confirmShip () {
      if (this.invoice.sn === '') {
        return this.$message.error('请选择发货单')
      }
      this.show = false
      this.success(this.invoice.sn)
      // this.$request.updateShipment(this.id, this.invoice.sn).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       type: 'success',
      //       title: '操作成功',
      //       message: res.msg
      //     })
      //     this.show = false
      //     this.success()
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      //   this.show = false
      // })
    },
    // 确认创建发货单
    confirmCreated (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.saveShip(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: res.msg
              })
              this.innerVisible = false
              this.show = true
              this.getUser()
              // this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            // this.innerVisible = false
          })
        } else {
          return false
        }
      })
    },
    clear () {
      this.ruleForm.country_id = ''
      this.ruleForm.remark = ''
      this.invoice.sn = ''
    },
    init () {
      this.getUser()
      this.getCountry()
    }
  }
}
</script>
<style lang="scss">
.invoice-container{
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
  .created-btn {
    margin-left: 5px;
  }
}
</style>
