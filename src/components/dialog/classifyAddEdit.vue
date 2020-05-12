<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? $t('添加商品分类'): $t('编辑商品分类')" class="dialog-addClassify"
  size="small" @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
    label-width="120px">
        <!-- 员工组中文名 -->
        <el-form-item :label="$t('分类名称')" prop="name" class="input-style">
          <el-input v-model="ruleForm.name"
          :placeholder="$t('请输入分类名称')"></el-input>
          </el-form-item>
        <!-- 用户组描述 -->
          <el-form-item :label="$t('选择分类')" prop="parent_id">
             <el-select v-model="ruleForm.parent_id" clearable filterable>
                <el-option
                    v-for="item in classifyList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                </el-option>
             </el-select>
          </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancelDialog('ruleForm')">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        parent_id: 0
      },
      classifyList: [],
      state: '',
      id: '',
      rules: {
        name: [
          { required: true, message: this.$t('请输入分类名称'), trigger: 'blur' }
        ],
        parent_id: [
          { required: true, message: this.$t('请选择分类'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getList () {
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
    getTree () {
      this.classifyList = [
        {
          id: 0,
          name: this.$t('顶级分类')
        }
      ]
      this.$request.getAllTree().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.classifyList = this.classifyList.concat(res.data.map(item => ({ id: item.id, name: item.name })))
          }
          console.log(this.classifyList, 'this.classifyList')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) { // 如果是编辑状态
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
              this.show = false
            })
          } else { // 如果是添加状态
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
              this.show = false
            })
          }
        } else {
          return false
        }
      })
    },
    clear () {
      this.ruleForm.name = ''
      this.ruleForm.parent_id = 0
    },
    cancelDialog (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.show = false
    },
    init () {
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
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
}
</style>
