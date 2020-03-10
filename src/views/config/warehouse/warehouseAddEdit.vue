<template>
  <div class="warehouse-addEdit-container">
    <div class="tips-box">
      <span class="tips-title">温馨提示: </span>
      <span class="tips-content">当前页面配置的地址为用户发往仓库的真实收件地址，请填写有效准确的信息，请不要填写座机</span>
    </div>
    <el-form label-position="top" class="warehouse-form" :model="ruleForm" :rules="rules" ref="ruleForm">
      <!-- 仓库名称 -->
      <el-form-item label="仓库名称" prop="warehouse_name">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.warehouse_name"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="收件人姓名" prop="receiver_name">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.receiver_name"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.phone"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.postcode"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>
              <span class="address-sty">忽略地址精确度检查</span>
              <el-tooltip class="item" effect="dark" content="选择开启会忽略当次地址精确度检查。" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-radio-group v-model="ruleForm.ignore_lon_lat">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" type="textarea" :row="3" v-model="ruleForm.address"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="自动货位功能">
        <el-row>
          <el-col :span="10">
            <el-radio-group v-model="ruleForm.auto_location">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="温馨提示（主要提醒客户需要注意的事项，在客户端仓库地址页面显示）" prop="tips">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入温馨提示" type="textarea" :row="4" v-model="ruleForm.tips"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="support_countries" label="支持国家/地区">
          <el-col :span="10">
            <el-select
              v-model="ruleForm.support_countries"
              multiple
              filterable
              class="country-select"
              placeholder="请选择国家/地区">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.cn_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="country-btn">
            <el-button type="primary" @click="onAddCountry">+ 新增国家/地区</el-button>
          </el-col>
      </el-form-item>
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
        receiver_name: '',
        warehouse_name: '',
        phone: '',
        postcode: '',
        address: '',
        tips: '',
        auto_location: 0,
        ignore_lon_lat: 0,
        support_countries: ''
      },
      options: [],
      rules: {
        warehouse_name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        receiver_name: [
          { required: true, message: '请输入收件人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        postcode: [
          { required: true, message: '请输入邮编', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        tips: [
          { required: true, message: '请输入温馨提示', trigger: 'blur' }
        ],
        support_countries: [
          { required: true, message: '请选择国家或地区', trigger: 'blur' }
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
      this.$request.aloneWarehouseAddress(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.ruleForm.support_countries = res.data.support_countries.map(item => item.id)
        }
      })
    },
    // 添加国家或地区
    onAddCountry () {
      dialog({
        type: 'addcountry'
      }, () => {
        this.getCountry()
      })
    },
    // 获取支持国家数据
    getCountry () {
      this.$request.getCountry().then(res => {
        this.options = res.data
      })
    },
    submit (formName) {
      // 编辑状态
      if (this.$route.params.id) {
        this.$request.editWarehouseAddress(this.$route.params.id, this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.$router.push({ name: 'warehouse' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$request.addWarehouseAddress(this.ruleForm).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: '操作成功',
                  message: res.msg
                })
                this.$router.push({ name: 'warehouse' })
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
.warehouse-addEdit-container {
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
