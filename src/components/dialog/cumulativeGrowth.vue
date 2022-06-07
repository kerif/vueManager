<template>
  <el-dialog :title="$t('邀新累计成长值')" :visible.sync="show" @close="clear">
    <el-form :model="form">
      <el-row :gutter="20">
        <h3>{{ $t('新用户注册') }}:</h3>
        <el-form-item :label="$t('每邀请一个新用户【注册】获得成长值:')">
          <el-input v-model="value"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <h3>{{ $t('新用户下单') }}:</h3>
        <el-form-item :label="$t('新用户【首次下单并支付】获得成长值:')">
          <el-input v-model="value"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <h3>{{ $t('成长值有效期') }}:</h3>
        <el-form-item :label="$t('成长值到账之日起计算,有效期为')">
          <el-select v-model="value">
            <el-option></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <h3>{{ $t('规则限制') }}:</h3>
        <el-form-item>
          <el-select v-model="value">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('最高奖励成长值')">
          <el-input v-model="value"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      form: {}
    }
  },
  methods: {
    onConfirm() {},
    clear() {}
  }
}
</script>

<style></style>
