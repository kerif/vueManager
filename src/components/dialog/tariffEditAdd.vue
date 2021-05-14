<template>
  <el-dialog
    :visible.sync="show"
    :title="state == 'add' ? $t('新增关税服务') : $t('修改关税服务')"
    class="dialog-edit-tariff"
    width="35%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <!-- 商品价值 -->
      <el-form-item
        :label="$t('*商品价值') + currencyUnit + $t('大于')"
        class="input-sty price-sty"
      >
        <el-input v-model="ruleForm.threshold"> </el-input>
      </el-form-item>
      <!-- 收费类型 -->
      <el-form-item :label="$t('*收费类型')">
        <el-select v-model="ruleForm.type" clearable :placeholder="$t('请选择')">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 关税金额 -->
      <el-form-item
        :label="
          (this.ruleForm.type === 1 ? '比例' : $t('*关税金额')) +
          (this.ruleForm.type === 1 ? '%' : currencyUnit)
        "
        class="input-sty"
      >
        <el-input v-model="ruleForm.amount"> </el-input>
      </el-form-item>
      <!-- 是否强制购买 -->
      <el-form-item :label="$t('是否强制购买')">
        <el-switch
          v-model="ruleForm.enforce"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" class="input-sty">
        <el-input
          type="textarea"
          v-model="ruleForm.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        amount: '',
        type: '',
        threshold: '',
        remark: '',
        enforce: 0
      },
      options: [
        {
          id: 1,
          name: this.$t('比例')
        },
        {
          id: 2,
          name: this.$t('固定金额')
        }
      ],
      localization: '',
      currencyUnit: '',
      start: '',
      tranAmount: '',
      state: '',
      id: ''
    }
  },
  methods: {
    getList() {
      this.$request.getAloneTariff(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.localization = res.localization
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm() {
      if (!this.ruleForm.threshold) {
        return this.$message.error(this.$t('请输入商品价值'))
      } else if (!this.ruleForm.type) {
        return this.$message.error(this.$t('请选择收费类型'))
      } else if (!this.ruleForm.amount) {
        return this.$message.error(this.$t('请输入关税金额'))
      }
      if (this.state === 'add') {
        this.$request
          .tariffAdd({
            ...this.ruleForm,
            threshold: this.ruleForm.threshold === 0 ? 0 : this.ruleForm.threshold
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
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
      } else if (this.state === 'edit') {
        this.$request
          .tariffEdit(this.id, {
            ...this.ruleForm,
            threshold: this.ruleForm.threshold === 0 ? 0 : this.ruleForm.threshold
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
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
    },
    clear() {
      this.id = ''
      this.ruleForm.amount = ''
      this.ruleForm.type = ''
      this.ruleForm.threshold = ''
      this.ruleForm.remark = ''
      this.ruleForm.enforce = 0
    },
    init() {
      // this.start = this.start
      if (this.id) {
        this.getList()
      }
      console.log(this.start, 'start')
    }
  }
}
</script>
<style lang="scss" scope>
.dialog-edit-tariff {
  .el-dialog__body {
    margin-left: 20px !important;
  }
  .input-sty {
    width: 70%;
  }
  .input-sty {
    width: 70%;
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
    margin-left: 50px;
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
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
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
  .price-sty {
    .el-form-item__label {
      color: red !important;
    }
  }
}
</style>
