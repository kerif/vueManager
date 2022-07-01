<template>
  <el-dialog :visible.sync="show" :title="$t('添加')" width="80%" @close="clear">
    <el-form label-position="top">
      <el-form-item :label="$t('推送条件')">
        <el-row :gutter="20">
          <el-input v-model="value" style="width: 20%" :placeholder="$t('请输入')"></el-input>
          <el-select style="width: 10%; margin: 0 2px"></el-select>
          <el-select style="width: 20%; margin: 0 2px"></el-select>
          <el-select style="width: 10%; margin: 0 2px"></el-select>
          <el-input v-model="value" style="width: 20%" :placeholder="$t('请输入')"></el-input>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('配单公司')">
        <el-select></el-select>
      </el-form-item>
      <el-form-item :label="$t('渠道代码')">
        <el-select></el-select>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style></style>
