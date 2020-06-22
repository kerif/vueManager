<template>
  <el-dialog :visible.sync="show" :title="$t('修改保险服务')" class="dialog-edit-insurance" width="35%"
  @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 商品价值 -->
        <el-form-item :label="$t('*商品价值') + this.localization.currency_unit + $t('大于')" class="input-sty price-sty">
          <el-input v-model="ruleForm.insurance_proportion">
          </el-input>
        </el-form-item>
        <!-- 保价类型 -->
        <el-form-item :label="$t('*保价类型')">
          <el-select v-model="ruleForm.insurance_type" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <!-- 保险金额 -->
        <el-form-item :label="$t('*保险金额')+ this.localization.currency_unit" class="input-sty">
          <el-input v-model="ruleForm.start">
          </el-input>
        </el-form-item>
        <!-- 是否强制购买 -->
        <el-form-item :label="$t('是否强制购买')">
            <el-switch
              v-model="ruleForm.is_force"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('备注')" class="input-sty">
            <el-input type="textarea" v-model="ruleForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :placeholder="$t('请输入备注')"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        insurance_proportion: '',
        insurance_type: '',
        start: '',
        remark: '',
        is_force: 0
      },
      options: [
        {
          id: 1,
          name: '比例'
        },
        {
          id: 2,
          name: '固定金额'
        }
      ],
      localization: '',
      tranAmount: ''
    }
  },
  methods: {
    getList () {
      this.$request.getSingleInsurance(this.id).then(res => {
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
    confirm () {
      if (!this.ruleForm.insurance_proportion) {
        return this.$message.error(this.$t('请输入商品价值'))
      } else if (!this.ruleForm.insurance_type) {
        return this.$message.error(this.$t('请选择保价类型'))
      } else if (!this.ruleForm.start) {
        return this.$message.error(this.$t('请输入保险金额'))
      }
      this.$request.updateInsurance(this.id, this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
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
    },
    clear () {
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
    },
    init () {
      console.log(this.id, '我是接受id')
      this.getList()
    }
  }
}
</script>
<style lang="scss" scope>
.dialog-edit-insurance {
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
      .model-box, .operat-box {
        opacity: 1;
        transition: all .5s ease-in;
      }
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, .3);
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
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .el-dialog__close {
    color: #FFF;
  }
  .price-sty {
    .el-form-item__label {
      color: red !important;
    }
  }
}
</style>
