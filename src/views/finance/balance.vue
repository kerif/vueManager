<template>
  <div class="balance-container">
    <el-form label-position="top" class="warehouse-form" :model="ruleForm" :rules="rules" ref="ruleForm">
      <!-- 客户 -->
      <el-form-item label="客户" prop="user_id" class="changeQuery">
        <el-row>
          <el-col :span="10">
            <el-autocomplete
            :fetch-suggestions="queryCNSearch"
            @select="handleSelect"
            placeholder="请输入客户ID"
            v-model="ruleForm.user_id">
          </el-autocomplete>
            </el-col>
        </el-row>
      </el-form-item>
      <!-- 扣款金额 -->
      <el-form-item :label="'扣款金额' + localization.currency_unit" prop="amount">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.amount"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <!-- 相关订单 -->
      <el-form-item label="相关订单" prop="order_sn">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="ruleForm.order_sn"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <!-- 结算方式 -->
      <!-- <el-form-item prop="settlement_method" label="结算方式">
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
      </el-form-item> -->
      <!-- 扣款备注 -->
      <el-form-item label="扣款备注" prop="remark">
        <el-row>
          <el-col :span="10">
            <el-input placeholder="请输入内容" type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}" v-model="ruleForm.remark"></el-input>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item  class="updateChe" label="物品照片">
          <el-row>
            <el-col :span="10">
              <span class="img-item" v-for="(item, index) in baleImgList.slice(0, 1)" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                    <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
                </span>
                </span>
              <el-upload
                v-show="baleImgList.length < 3"
                class="avatar-uploader"
                action=""
                list-type="picture-card"
                :before-upload="beforeUploadImg"
                :http-request="uploadBaleImg"
                :show-file-list="false">
                <i class="el-icon-plus">
                </i>
            </el-upload><br/>
            <span class="suggest-btn">建议尺寸：345px*120px</span>
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
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        user_id: '',
        amount: '',
        order_sn: '',
        remark: '',
        images: []
      },
      options: [],
      baleImgList: [],
      localization: {},
      rules: {
        user_id: [
          { required: true, message: '请输入客户', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入渠道单价', trigger: 'blur' }
        ],
        order_sn: [
          { required: true, message: '请输入关联订单号', trigger: 'blur' }
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
          res.data.images && (this.baleImgList = res.data.images)
        }
      })
    },
    // 客户id
    queryCNSearch (queryString, callback) {
      console.log(this.ruleForm.user_id)
      var list = [{}]
      this.$request.AutoDeductions({
        keyword: this.ruleForm.user_id.toString()
      }).then(res => {
        for (let i of res.data) {
          // i.value = i.id
          i.value = i.id + '---' + i.name
        }
        list = res.data
        callback(list)
      })
    },
    // 客户id
    handleSelect (item) {
      console.log(item)
      this.supplierId = item.id
      this.supplierName = item.name
    },
    // 获取支持国家数据
    getCountry () {
      this.$request.getSettlement().then(res => {
        this.options = res.data
        this.localization = res.localization
      })
    },
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        }
      })
    },
    beforeUploadImg (file) {
      if (!(/^image/.test(file.type))) {
        this.$message.info('请上传图片类型文件')
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info('上传图片大小不能超过2M')
        return false
      }
      return true
    },
    onDeleteImg (index) {
      this.baleImgList.splice(index, 1)
    },
    onPreview (image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    submit (formName) {
      this.ruleForm.images = this.baleImgList
      // 编辑状态
      if (this.$route.params.id) {
        this.$request.updateChannel(this.$route.params.id, this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.baleImgList = []
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
.balance-container {
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
  .changeQuery {
    .el-autocomplete {
      width: 100% !important;
    }
  }
}
</style>
