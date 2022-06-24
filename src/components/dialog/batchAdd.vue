<template>
  <el-dialog :visible.sync="show" :title="$t('批量添加')" class="dialog-batch-add" @close="clear">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item :label="$t('箱数')" required>
        <el-input
          v-model="ruleForm.boxes"
          class="input-sty"
          :placeholder="$t('请输入生成箱数')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('重量')">
        <el-input
          v-model="ruleForm.weight"
          class="input-sty"
          :placeholder="$t('请输入重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('尺寸')">
        <el-input
          v-model="ruleForm.length"
          class="inner-sty"
          :placeholder="$t('长') + localization.length_unit"
        ></el-input>
        <el-input
          v-model="ruleForm.width"
          class="inner-sty"
          :placeholder="$t('宽') + localization.length_unit"
        ></el-input>
        <el-input
          v-model="ruleForm.height"
          class="inner-sty"
          :placeholder="$t('高') + localization.length_unit"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        boxes: '',
        weight: '',
        length: '',
        width: '',
        height: ''
      },
      localization: {},
      rules: {
        boxes: [{ required: true, message: this.$t('请输入箱数'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {},
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.show = false
          this.success(JSON.parse(JSON.stringify(this.ruleForm)))
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.boxes = ''
      this.ruleForm.weight = ''
      this.ruleForm.height = ''
      this.ruleForm.width = ''
      this.ruleForm.length = ''
    }
  }
}
</script>

<style lang="scss">
.dialog-batch-add {
  .input-sty {
    width: 55%;
  }
  .inner-sty {
    width: 15%;
  }
}
</style>
