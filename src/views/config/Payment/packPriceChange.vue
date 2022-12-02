<template>
  <el-form :model="form" label-width="200px">
    <h4>{{ $t('桌面端打包改价配置') }}</h4>
    <el-form-item :label="$t('不允许桌面端提交打包')">
      <el-switch
        v-model="form.pc_forbid_pack"
        :active-text="$t('开')"
        :active-value="1"
        :inactive-value="0"
        :inactive-text="$t('关')"
        active-color="#13ce66"
        inactive-color="gray"
        @change="changeSwitch($event)"
      ></el-switch>
      <span class="tip-text">{{ $t('开启后桌面端只允许保存') }}</span>
    </el-form-item>
    <el-form-item :label="$t('不允许桌面端改价')">
      <el-switch
        v-model="form.pc_forbid_change_price"
        :active-text="$t('开')"
        :active-value="1"
        :inactive-value="0"
        :inactive-text="$t('关')"
        active-color="#13ce66"
        inactive-color="gray"
        @change="changeSwitch($event)"
      ></el-switch>
      <span class="tip-text">{{ $t('开启后桌面端不允许改价') }}</span>
    </el-form-item>
    <h4>{{ $t('APP端打包改价配置') }}</h4>
    <el-form-item :label="$t('不允许运营APP端提交打包')">
      <el-switch
        v-model="form.app_forbid_pack"
        :active-text="$t('开')"
        :active-value="1"
        :inactive-value="0"
        :inactive-text="$t('关')"
        active-color="#13ce66"
        inactive-color="gray"
        @change="changeSwitch($event)"
      ></el-switch>
      <span class="tip-text">{{ $t('开启后APP端只允许保存') }}</span>
    </el-form-item>
    <el-form-item :label="$t('不允许运营APP端改价')">
      <el-switch
        v-model="form.app_forbid_change_price"
        :active-text="$t('开')"
        :active-value="1"
        :inactive-value="0"
        :inactive-text="$t('关')"
        active-color="#13ce66"
        inactive-color="gray"
        @change="changeSwitch($event)"
      ></el-switch>
      <span class="tip-text">{{ $t('开启后运营APP端不允许改价') }}</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        pc_forbid_pack: 0,
        pc_forbid_change_price: 0,
        app_forbid_pack: 0,
        app_forbid_change_price: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.getChangePrice().then(res => {
        this.form = res.data
      })
    },
    changeSwitch() {
      this.$request.updateChangePrice(this.form).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style>
.tip-text {
  color: red;
  margin-left: 50px;
}
</style>
