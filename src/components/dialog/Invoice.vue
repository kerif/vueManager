<template>
  <el-dialog :visible.sync="show" title="创建发货单" class="dialog-invoice" width="35%"
  @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <!-- 员工组中文名 -->
            <el-form-item label="目的国" prop="country_id">
            <el-row>
            <el-col :span="8" :offset="2">
                <el-select v-model="ruleForm.country_id" placeholder="请选择目的国">
                <el-option
                  v-for="item in country"
                  :key="item.id"
                  :label="item.cn_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            </el-row>
            </el-form-item>
        <!-- 用户组描述 -->
        <el-form-item label="备注">
           <el-row>
            <el-col :span="8" :offset="2">
                <el-input type="textarea" v-model="ruleForm.remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        country_id: '',
        remark: ''
      },
      country: [],
      rules: {
        country_id: [
          { required: true, message: '请输入目的国', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCountry()
  },
  methods: {
    getCountry () {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    getShipment () {
      this.$request.getShipments(this.id).then(res => {
        this.ruleForm = res.data
      })
    },
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.saveShip(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            this.show = false
          })
        } else {
          return false
        }
      })
    },
    clear () {
      this.ruleForm.country_id = ''
      this.ruleForm.remark = ''
    },
    init () {
      if (this.id) {
        console.log(this.id, 'id')
        this.getShipment()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-invoice {
  .el-form-item__label {
    width: 150px;
  }
}
</style>
