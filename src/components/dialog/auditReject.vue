<template>
  <el-dialog :visible.sync="showDialog" :title="$t('审核')" class="dialog-auditReject">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <!--支付金额  -->
      <el-form-item :label="$t('支付金额')" prop="name_cn">
        <el-input v-model="ruleForm.name_cn" :placeholder="$t('请输入支付金额')"></el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" prop="name_en">
        <el-input v-model="ruleForm.name_en" :placeholder="$t('请输入备注')"></el-input>
      </el-form-item>
      <!--上传照片-->
      <el-form-item prop="password_confirmation" :label="$t('上传照片')">
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
      <el-button @click="cancelDialog('ruleForm')">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        name_cn: '',
        name_en: '',
        description: ''
      },
      rules: {
        name_cn: [{ required: true, message: this.$t('请输入员工组中文名'), trigger: 'blur' }],
        name_en: [{ required: true, message: this.$t('请输入员工组英文名'), trigger: 'blur' }]
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dialog-auditReject {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-input {
    width: 40%;
    margin-left: 50px;
  }
  .el-textarea {
    width: 40%;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 300px !important;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
}
</style>
