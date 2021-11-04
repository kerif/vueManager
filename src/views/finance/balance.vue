<template>
  <div class="balance-container">
    <el-form label-position="top" class="warehouse-form" :model="ruleForm" ref="ruleForm">
      <!-- 客户 -->
      <el-form-item :label="$t('客户')" class="changeQuery">
        <el-row>
          <el-col :span="10">
            <el-autocomplete
              :fetch-suggestions="queryCNSearch"
              @select="handleSelect"
              :placeholder="$t('请输入客户ID')"
              v-model="ruleForm.user_id"
            >
            </el-autocomplete>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 扣款金额 -->
      <el-form-item
        :label="$t('扣款金额') + `${localization.currency_unit ? localization.currency_unit : ''}`"
      >
        <el-row>
          <el-col :span="10">
            <el-input :placeholder="$t('请输入内容')" v-model="ruleForm.amount"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 相关订单 -->
      <el-form-item :label="$t('相关订单')">
        <el-row>
          <el-col :span="10">
            <el-input :placeholder="$t('请输入内容')" v-model="ruleForm.order_sn"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 扣款备注 -->
      <el-form-item :label="$t('扣款备注')" prop="remark">
        <el-row>
          <el-col :span="10">
            <el-input
              :placeholder="$t('请输入内容')"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
              v-model="ruleForm.remark"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="updateChe" :label="$t('物品照片')">
        <el-row>
          <el-col :span="16">
            <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
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
              :show-file-list="false"
            >
              <i class="el-icon-plus"> </i> </el-upload
            ><br />
            <span class="suggest-btn">{{
              $t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张')
            }}</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        user_id: '',
        amount: '',
        order_sn: '',
        remark: '',
        images: []
      },
      baleImgList: [],
      localization: {}
    }
  },
  created() {
    this.getMe()
  },
  methods: {
    // getList () {
    //   this.$request.getAloneChannel(this.$route.params.id).then(res => {
    //     if (res.ret) {
    //       this.ruleForm = res.data
    //       res.data.images && (this.baleImgList = res.data.images)
    //     }
    //   })
    // },
    // 客户id
    queryCNSearch(queryString, callback) {
      console.log(this.ruleForm.user_id)
      var list = [{}]
      this.$request
        .AutoDeductions({
          keyword: this.ruleForm.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            // i.value = i.id
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback(list)
        })
    },
    submit() {
      if (this.ruleForm.user_id === '') {
        return this.$message.error(this.$t('请输入客户'))
      } else if (this.ruleForm.amount === '') {
        return this.$message.error(this.$t('请输入扣款金额'))
      }
      this.ruleForm.images = this.baleImgList
      this.ruleForm.user_id = this.ruleForm.user_id.split('---')[0]
      this.$request.addDeductions(this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.ruleForm.user_id = ''
          this.ruleForm.amount = ''
          this.ruleForm.order_sn = ''
          this.ruleForm.remark = ''
          this.baleImgList = []
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 客户id
    handleSelect(item) {
      console.log(item)
      this.supplierId = item.id
      this.supplierName = item.name
    },
    getMe() {
      this.$request.getMe().then(res => {
        this.localization = res.localization
      })
    },
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        }
      })
    },
    beforeUploadImg(file) {
      if (!/^image/.test(file.type)) {
        this.$message.info(this.$t('请上传图片类型文件'))
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info(this.$t('上传图片大小不能超过2M'))
        return false
      }
      return true
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
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
    border-color: #3540a5;
    color: #3540a5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540a5;
    background-color: #fff;
  }
  .country-btn {
    margin-left: 15px;
    .el-button--primary {
      background-color: #eaecf5;
      border-color: #eaecf5;
      color: #3540a5;
    }
  }
  .icon-info {
    color: #74b34f;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .address-sty {
    color: #606266;
  }
  .changeQuery {
    .el-autocomplete {
      width: 100% !important;
    }
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      width: 500px !important;
    }
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
  }
  .img-item {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 148px;
    height: 148px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .model-box,
      .operat-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .operat-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    i {
      font-size: 20px;
      color: #fff;
      margin-right: 10px;
    }
  }
}
</style>
