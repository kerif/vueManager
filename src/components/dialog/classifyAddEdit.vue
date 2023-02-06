<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('添加商品分类') : $t('编辑商品分类')"
    class="dialog-addClassify"
    size="small"
    @close="clear"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      label-width="120px"
    >
      <!-- 员工组中文名 -->
      <el-form-item :label="$t('分类名称')" prop="name" class="input-style">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入分类名称')"></el-input>
      </el-form-item>
      <!-- 用户组描述 -->
      <el-form-item :label="$t('选择分类')" prop="parent_id">
        <el-select v-model="ruleForm.parent_id" clearable filterable :placeholder="$t('请选择')">
          <el-option
            v-for="item in classifyList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="ruleForm.parent_id > 0"
        :label="$t('分类分组')"
        prop="group_name"
        class="input-style"
      >
        <el-input v-model="ruleForm.group_name" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item label="sku" prop="sku" class="input-style">
        <el-input v-model="ruleForm.sku" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('海关编码')" prop="hs_code" class="input-style">
        <el-input v-model="ruleForm.hs_code" :placeholder="$t('请输入海关编码')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('物品属性')" prop="hs_code" class="input-style">
        <el-select v-model="ruleForm.prop_ids" clearable :placeholder="$t('请选择')">
          <el-option
            v-for="item in propList"
            :key="item.id"
            :value="item.id"
            :label="item.cn_name"
          ></el-option>
        </el-select>
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
  data() {
    return {
      ruleForm: {
        name: '',
        parent_id: 0,
        sku: '',
        hs_code: '',
        prop_ids: ''
      },
      propList: [],
      classifyList: [],
      state: '',
      id: '',
      rules: {
        name: [{ required: true, message: this.$t('请输入分类名称'), trigger: 'blur' }],
        parent_id: [{ required: true, message: this.$t('请选择分类'), trigger: 'change' }]
      }
    }
  },
  created() {
    this.getPropList()
  },
  methods: {
    getPropList() {
      this.$request.getProps().then(res => {
        this.propList = res.data
      })
    },
    getList() {
      this.$request.getRiskDetails(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
        } else {
          this.$notify({
            message: res.msg,
            type: 'error',
            title: this.$t('操作失败')
          })
        }
      })
    },
    // 获取全部分类
    getTree() {
      this.classifyList = [
        {
          id: 0,
          name: this.$t('顶级分类')
        }
      ]
      this.$request.getAllTree().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.classifyList = this.classifyList.concat(
              res.data.map(item => ({ id: item.id, name: item.name }))
            )
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.prop_ids = [this.ruleForm.prop_ids]
          if (this.id) {
            // 如果是编辑状态
            this.$request.updateCategories(this.id, this.ruleForm).then(res => {
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
            })
          } else {
            // 如果是添加状态
            this.$request.newCategories(this.ruleForm).then(res => {
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
            })
          }
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.parent_id = 0
      this.ruleForm.sku = ''
      this.ruleForm.hs_code = ''
      this.ruleForm.prop_ids = []
    },
    cancelDialog(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init() {
      this.getTree()
      if (this.id) {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-addClassify {
  .input-style {
    width: 50%;
  }
  .el-form-item__label {
    // width: 200px;
  }
  .el-form-item__error {
    // margin-left: 300px !important;
  }
  .el-select {
    // width: 44%;
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
