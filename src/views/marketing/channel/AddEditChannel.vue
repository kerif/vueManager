<template>
  <div class="channel-addEdit-container">
    <el-form label-position="top" class="warehouse-form" :model="ruleForm" :rules="rules" ref="ruleForm">
      <!-- 渠道名称 -->
      <el-form-item label="渠道名称" prop="channel_name">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.channel_name"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <!-- 渠道单价 -->
      <el-form-item :label="'渠道单价' + localization.currency_unit" prop="channel_price">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.channel_price"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <!-- 结算方式 -->
      <el-form-item prop="settlement_method" label="结算方式">
          <el-col :span="10">
            <el-select
              clearable
              v-model="ruleForm.settlement_method"
              class="country-select"
              placeholder="请选择结算方式">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item label="备注" prop="remark">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}" v-model="ruleForm.remark"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="save-btn" @click="submit('ruleForm')"
        :loading="$store.state.btnLoading">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        remark: '',
        settlement_method: '',
        channel_price: '',
        channel_name: ''
      },
      options: [],
      localization: {},
      rules: {
        channel_name: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' }
        ],
        channel_price: [
          { required: true, message: '请输入渠道单价', trigger: 'blur' }
        ],
        settlement_method: [
          { required: true, message: '请选择结算方式', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getCountry()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.getAloneChannel(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        }
      })
    },
    // 获取支持国家数据
    getCountry () {
      this.$request.getSettlement().then(res => {
        this.options = res.data
        this.localization = res.localization
      })
    },
    submit (formName) {
      // 编辑状态
      if (this.$route.params.id) {
        this.$request.updateChannel(this.$route.params.id, this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else { // 新建
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$request.addChannel(this.ruleForm).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: '操作成功',
                  message: res.msg
                })
                this.$router.go(-1)
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
}
</script>
<style lang="scss">
.channel-addEdit-container {
  background-color: #fff !important;
  .tips-box {
    padding: 20px;
    line-height: 30px;
    background-color: #f0f0f0;
    margin: 20px 20px 50px 0;
    display: inline-block;
    border-radius: 5px;
  }
  .tips-title {
    font-weight: bold;
  }
  .tips-content {
    font-size: 14px;
  }
  .warehouse-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .country-select {
    width: 100%;
  }
  .el-tag.el-tag--info {
    border-color: #3540A5;
    color: #3540A5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540A5;
    background-color: #fff;
  }
  .country-btn {
    margin-left: 15px;
    .el-button--primary {
      background-color: #EAECF5;
      border-color: #EAECF5;
      color: #3540A5;
    }
  }
  .icon-info {
    color: #74B34F;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .address-sty {
    color:#606266;
  }
}
</style>
