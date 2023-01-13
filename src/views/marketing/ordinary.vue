<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('抵现券')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('抵重券')" name="1"></el-tab-pane>
    </el-tabs>
    <el-form
      :model="ruleForm"
      label-width="200px"
      label-position="left"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item :label="$t('种类')"> </el-form-item>
      <el-form-item :label="$t('券名称')">
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入券名称')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('金额')" v-if="activeName === '0'">
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入券名称')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费金额')" v-if="activeName === '0'">
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入最低消费金额')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('可抵重量')" v-if="activeName === '1'">
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入可抵重量')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费重量')" v-if="activeName === '1'">
        <el-input v-model="ruleForm.value" :placeholder="$t('请输入最低消费重量')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('生效时间')">
        <el-date-picker
          v-model="ruleForm.value"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          type="date"
          :placeholder="$t('请选择生效时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('失效时间')">
        <el-date-picker
          v-model="ruleForm.value"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          type="date"
          :placeholder="$t('请选择失效时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('使用范围')">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0" :disabled="statusEdit">{{ $t('全部') }}</el-radio>
          <el-radio :label="1" :disabled="statusEdit">{{ $t('按路线') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('抢券时间')" v-if="activeName === '0'"></el-form-item>
      <el-form-item :label="$t('单人限领数量')" v-if="activeName === '0'"></el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '0',
      ruleForm: {
        value: '',
        scope: 1
      }
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>

<style></style>
