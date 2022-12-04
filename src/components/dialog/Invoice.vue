<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('创建发货单') : $t('编辑发货单')"
    class="dialog-invoice"
    width="35%"
    @close="clear"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      label-position="top"
    >
      <!-- 目的地 -->
      <el-form-item :label="$t('目的地')" prop="country_id">
        <el-select v-model="ruleForm.country_id" :placeholder="$t('请选择目的地')" filterable>
          <el-option v-for="item in country" :key="item.id" :label="item.cn_name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('仓库')" prop="warehouse_id">
        <el-select v-model="ruleForm.warehouse_id" :placeholder="$t('请选择仓库')" filterable>
          <el-option
            v-for="item in warehouseData"
            :key="item.id"
            :label="item.warehouse_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('名称')">
        <el-input
          v-model="ruleForm.name"
          :placeholder="$t('请输入名称，字数限制在五十个字内')"
        ></el-input>
      </el-form-item>
      <!-- 用户组描述 -->
      <el-form-item :label="$t('备注')">
        <el-input
          type="textarea"
          v-model="ruleForm.remark"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        country_id: '',
        warehouse_id: '',
        name: '',
        remark: ''
      },
      country: [],
      warehouseData: [],
      rules: {
        country_id: [{ required: true, message: this.$t('请输入目的地'), trigger: 'blur' }]
      },
      id: '',
      state: ''
    }
  },
  methods: {
    getList() {
      this.$request.getAloneShipDetails(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        }
      })
    },
    getCountry() {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    // 获取仓库数据
    getWarehouse() {
      this.$request.getShipWarehouse().then(res => {
        this.warehouseData = res.data
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.state === 'add') {
            // 新增
            this.$request.saveShip(this.ruleForm).then(res => {
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
            })
          } else {
            // 编辑
            this.$request.editShip(this.id, this.ruleForm).then(res => {
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
            })
          }
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.country_id = ''
      this.ruleForm.warehouse_id = ''
      this.ruleForm.remark = ''
      this.ruleForm.name = ''
      this.state = ''
      this.id = ''
    },
    init() {
      this.getCountry()
      this.getWarehouse()
      if (this.state === 'edit') {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scope>
.dialog-invoice {
  .el-input {
    // width: 300px !important;
    margin-left: 50px;
    width: 250px !important;
  }
  .el-select {
    width: 60%;
  }
  .el-textarea {
    width: 250px !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 100px;
  }
  .el-form-item__error {
    margin-left: 100px !important;
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
