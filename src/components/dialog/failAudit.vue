<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" class="dialog-failAudit">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.remark"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!--上传照片-->
      <el-form-item prop="uploadPhotos" :label="$t('上传照片')">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          action=""
          :before-upload="beforeUploadImg"
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
export default {
  data() {
    return {
      ruleForm: {
        remark: ''
      },
      rules: {
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
      ]
    }
  },
  methods: {
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
    submit() {
      this.$request.refusedWithdraw(this.userid, this.withdrawsId).then(res => {
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
.dialog-failAudit {
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
