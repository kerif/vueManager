<template>
  <div>
    <el-form :inline="true" :model="ruleForm" size="small">
      <el-form-item>
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入采购单号')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入发货物流单号')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="ruleForm.value" :placeholder="$t('请选择创建时间')">
          <el-date-picker
            v-model="ruleForm.time"
            type="daterange"
            :range-separator="$t('至')"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
          >
          </el-date-picker>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入关键字')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t('搜索') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onReset">{{ $t('重置') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        value: '',
        time: ''
      }
    }
  },
  methods: {
    onSubmit() {},
    onReset() {}
  }
}
</script>

<style></style>
