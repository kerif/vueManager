<template>
  <div class="add-voucher-container">
  <el-form label-position="top" class="voucher-form" :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="名称" prop="name">
          <el-input placeholder="请输入名称" v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="金额" prop="amount">
          <el-input placeholder="请输入金额" v-model="ruleForm.amount"></el-input>
    </el-form-item>
    <el-form-item label="最低消费" prop="threshold">
          <el-input placeholder="请输入最低消费" v-model="ruleForm.threshold"></el-input>
    </el-form-item>
    <el-form-item label="生效时间" prop="effected_at">
           <el-date-picker
           value-format="yyyy-MM-dd"
            v-model="ruleForm.effected_at"
            type="date"
            :picker-options="pickerOptions"
            placeholder="请输入生效时间">
            </el-date-picker>
    </el-form-item>
    <el-form-item label="失效时间" prop="expired_at">
        <el-date-picker
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          v-model="ruleForm.expired_at"
          type="date"
          placeholder="请输入失效时间">
        </el-date-picker>
    </el-form-item>
    <el-form-item label="使用范围" prop="scope">
      <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">按路线</el-radio>
        </el-radio-group>
    </el-form-item>
    <div v-if="this.ruleForm.scope === 1" class="choose-btn">
      <el-button class="btn-deep-blue" @click="chooseLine">选择路线</el-button>
        <div class="display-line" v-if="this.lineName.length">
            <p v-for="item in lineName" :key="item.id">
              {{item.name}}
            </p>
        </div>
    </div>
    <el-form-item>
      <el-button type="primary" class="save-btn" @click="submit('ruleForm')"
      :loading="$store.state.btnLoading">保存</el-button>
      </el-form-item>
  </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        amount: '',
        threshold: '',
        effected_at: '',
        expired_at: '',
        scope: 0,
        usable_line_ids: []
      },
      lineName: [], // 保存获取到的路线
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        threshold: [
          { required: true, message: '请输入最低消费', trigger: 'blur' }
        ],
        expired_at: [
          { required: true, message: '请输入失效时间', trigger: 'blur' }
        ],
        effected_at: [
          { required: true, message: '请输入生效时间', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '请选择使用范围', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
    //   this.$request.getBill().then(res => {
    //     this.ruleForm = res.data
    //   })
    },
    chooseLine () {
      dialog({ type: 'lineChoose' }, (data) => {
        // console.log(data, '我是路线data')
        this.lineName = data
        this.ruleForm.usable_line_ids = data.map(item => (item.id))
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.addCoupons(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
              this.getList()
              this.$router.push({ name: 'voucher' })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.add-voucher-container {
  background-color: #fff !important;
  padding: 20px;
  .voucher-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .el-input {
    width: 40%;
  }
  .choose-btn {
    margin-bottom: 20px;
    // margin-left: 80px;
    .el-button {
      vertical-align: top;
    }
  }
  .display-line {
    display: inline-block;
    padding: 5px;
    width: 245px;
    margin-left: 15px;
    // line-height: 25px;
    background-color: #ccc;
    // margin-bottom: 20px;
    p {
      margin: 0;
    }
  }
}
</style>
