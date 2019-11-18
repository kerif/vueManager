<template>
  <el-dialog :visible.sync="show" title="审核" class="dialog-invoice" width="35%"
  @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 支付金额 -->
        <el-form-item label="*支付金额" v-if="state === 'pass'">
          <el-input v-model="ruleForm.pay_amount">
            <template slot="append">$</template>
          </el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注" v-if="state === 'pass'">
            <el-input type="textarea" v-model="ruleForm.customer_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="*备注" v-if="state === 'reject'">
            <el-input type="textarea" v-model="ruleForm.customer_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="上传打包照片" class="updateChe">
            <span class="img-item" v-for="(item, index) in baleImgList" :key="item.name">
            <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
            <span class="model-box"></span>
            <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                <i class="el-icon-delete" @click="onDeleteImg('bale', index)"></i>
            </span>
            </span>
            <el-upload
            v-show="baleImgList.length < 3"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImg"
            :show-file-list="false">
            <i class="el-icon-plus">
            </i>
        </el-upload>
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
        pay_amount: '',
        customer_remark: '',
        customer_images: []
      },
      state: '',
      baleImgList: [],
      rules: {
        pay_amount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        customer_remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCountry()
    console.log(this.state, 'state')
  },
  methods: {
    getCountry () {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    confirm (formName) {
      console.log(this.state, 'this.state')
      this.ruleForm.customer_images = this.baleImgList.map(item => {
        return {
          url: item.url
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.state === 'pass') {
            this.$request.acceptPayment(this.id, this.ruleForm).then(res => {
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
            this.$request.acceptReject(this.id, this.ruleForm).then(res => {
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
          }
        } else {
          return false
        }
      })
    },
    // 上传打包照片
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push({
              name: item.name,
              url: item.path
            })
          })
        }
      })
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clear () {
      this.$refs['ruleForm'].resetFields()
      this.$refs['ruleForm'].clearValidate()
      this.ruleForm.pay_amount = ''
      this.ruleForm.customer_remark = ''
      this.baleImgList = []
      this.ruleForm.customer_images = []
    }
  }
}
</script>
<style lang="scss">
.dialog-invoice {
  .el-dialog__body {
    margin-left: 20px !important;
  }
  .el-input {
    width: 70%;
  }
  .el-textarea__inner {
    width: 70%;
  }
}
</style>
