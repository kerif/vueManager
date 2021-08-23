<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" class="dialog-confirmAudit">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <!--支付金额  -->
      <el-form-item :label="$t('支付金额')" prop="amount">
        <!-- <el-input v-model="ruleForm.amount" :placeholder="$t('请输入支付金额')"> </el-input> -->
        <el-input v-model="ruleForm.amount">
          <template slot="append"></template>
        </el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.remark"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!--上传照片-->
      <el-form-item :label="$t('上传照片')" class="updateChe">
        <span class="img-item">
          <img :src="$baseUrl.IMAGE_URL" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        amount: '',
        remark: ''
      },
      rules: {
        amount: [{ required: true, message: this.$t('请输入支付金额'), trigger: 'blur' }],
        remark: [{ required: true, message: this.$t('请输入备注'), trigger: 'blur' }]
      },
      statusData: [
        {
          id: 0,
          name: this.$t('待审核')
        },
        {
          id: 1,
          name: this.$t('审核通过')
        },
        {
          id: 2,
          name: this.$t('审核拒绝')
        }
      ],
      userid: '',
      withdrawsId: '',
      amount: ''
    }
  },
  methods: {
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            // this.baleImgList.push(item.path)
            console.log(item)
          })
        }
      })
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      // this.baleImgList.splice(index, 1)
      console.log(index)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    init() {
      this.ruleForm.amount = this.amount
      console.log(this.amount)
    },
    submit() {
      // if (this.ruleForm.amount === '') {
      //   return this.$message.error(this.$t('请输入支付金额'))
      // } else if (this.ruleForm.remark === '') {
      //   return this.$message.error(this.$t('请输入备注'))
      // }
      this.$request.approveWithdraw(this.userid, this.withdrawsId).then(res => {
        console.log(res)
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-confirmAudit {
  /deep/ .el-dialog__header {
    background-color: #0e102a;
  }
  /deep/.el-input {
    width: 50%;
  }
  /deep/.el-textarea {
    width: 50%;
  }
  /deep/.el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  /deep/.el-dialog__close {
    color: #fff;
  }
}
</style>
