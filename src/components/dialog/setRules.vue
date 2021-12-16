<template>
  <el-dialog
    :visible.sync="show"
    :title="this.state === 'add' ? $t('规则设置') : $t('修改规则设置')"
    class="set-rule"
    width="45%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <el-form-item :label="$t('规则名称:')">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入')" />
      </el-form-item>
      <div v-for="(item, index) in ruleForm.rules" :key="index">
        <el-form-item :label="$t('关键词')">
          <el-select v-model="item.match" style="width: 20%" :placeholder="$t('请选择')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input v-model="item.keyword" style="width: 50%" :placeholder="$t('请输入关键词')">
          </el-input>
          <i class="el-icon-circle-plus-outline" @click="addItem"></i>
          <i class="el-icon-remove-outline" @click="deleteItem(item)" v-if="index !== 0"></i>
        </el-form-item>
      </div>
      <el-form-item :label="$t('行为')">
        <el-radio-group v-model="ruleForm.action">
          <el-radio :label="0">{{ $t('替换') }}</el-radio>
          <el-radio :label="1">{{ $t('隐藏') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('替换内容')">
        <el-input :placeholder="$t('请输入')" v-model="ruleForm.replace" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button style="background-color: #3540a5; color: #fff" @click="confirm">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        action: 1,
        replace: '',
        rules: [
          {
            match: '',
            keyword: ''
          }
        ]
      },
      options: [
        {
          value: 0,
          label: this.$t('半匹配')
        },
        {
          value: 1,
          label: this.$t('全匹配')
        }
      ],
      show: false,
      id: '',
      ids: '',
      state: ''
    }
  },
  methods: {
    addItem() {
      this.ruleForm.rules.push({
        match: '',
        keyword: ''
      })
    },
    deleteItem(item) {
      var index = this.ruleForm.rules.indexOf(item)
      if (index !== -1) {
        this.ruleForm.rules.splice(index, 1)
      }
    },
    init() {
      if (this.state === 'edit') {
        this.getDetail()
      }
    },
    getDetail() {
      this.$request.deliveryCompanyDetail(this.ids).then(res => {
        if (res.ret) {
          this.ruleForm.name = res.data.name
          this.ruleForm.action = res.data.action
          this.ruleForm.replace = res.data.replace
          this.ruleForm.rules = res.data.rules
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm() {
      let param = {
        ...this.ruleForm
      }
      if (this.state === 'add') {
        this.$request.deliveryCompanyNew(this.id, param).then(res => {
          if (res.ret) {
            console.log(res)
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
        })
      } else {
        this.$request.deliveryCompanyUpdate(this.ids, param).then(res => {
          if (res.ret) {
            console.log(res)
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
        })
      }
    },
    close() {
      this.$emit('passVal', false)
    },
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.action = 0
      this.ruleForm.replace = ''
      this.ruleForm.rules = []
    }
  }
}
</script>

<style lang="scss">
.set-rule {
  .input-select {
    width: 40%;
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
  .el-select {
    width: 40%;
  }
  .el-icon-circle-plus-outline:before {
    font-size: 24px;
    cursor: pointer;
  }
  .el-icon-remove-outline:before {
    font-size: 24px;
    cursor: pointer;
  }
}
</style>
