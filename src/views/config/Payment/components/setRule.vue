<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('规则设置')"
    class="set-rule"
    width="45%"
    @close="clear"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <el-from-item :label="$t('规则名称:')">
        <el-input v-model="ruleForm.ruleName" :placeholder="$t('请输入')" />
      </el-from-item>
      <div v-for="(item, index) in ruleForm.dynamicItem" :key="index">
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
        <el-radio-group v-model="ruleForm.behavior">
          <el-radio :label="1">{{ $t('替换') }}</el-radio>
          <el-radio :label="2">{{ $t('隐藏') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-from-item :label="$t('替换内容')">
        <el-input :placeholder="$t('请输入')" v-model="ruleForm.replaceContent" />
      </el-from-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button style="background-color: #3540a5; color: #fff" @click="confirm">{{
        $t('保存')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      ruleForm: {
        ruleName: '',
        behavior: '',
        replaceContent: '',
        dynamicItem: [
          {
            match: '',
            keyword: ''
          }
        ]
      },
      options: [
        {
          value: '0',
          label: this.$t('半匹配')
        },
        {
          value: '1',
          label: this.$t('全匹配')
        }
      ]
    }
  },
  methods: {
    addItem() {
      this.ruleForm.dynamicItem.push({
        match: '',
        keyword: ''
      })
    },
    deleteItem(item) {
      var index = this.ruleForm.dynamicItem.indexOf(item)
      if (index !== -1) {
        this.ruleForm.dynamicItem.splice(index, 1)
      }
    },
    confirm() {},
    clear() {
      this.ruleForm.ruleName = ''
      this.ruleForm.behavior = ''
      this.ruleForm.replaceContent = ''
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
