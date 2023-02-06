<template>
  <div>
    <el-form :model="form" label-width="200px">
      <el-form-item :label="$t('可上门取件日期')">
        <el-checkbox-group v-model="form.date">
          <el-checkbox v-for="week in weeks" :label="week.id" :key="week.id">{{
            week.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="$t('可预约未来时间')">
        <el-input-number v-model="form.day" :min="1" :max="10" label="天"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('当天最早可预约时间')">
        <el-time-select
          v-model="form.begin_time"
          :picker-options="{
            start: '08:30',
            step: '00:30',
            end: '12:30'
          }"
          placeholder="选择时间"
        ></el-time-select>
      </el-form-item>
      <el-form-item :label="$t('当天截止最晚预约时间')">
        <el-time-select
          v-model="form.end_time"
          :picker-options="{
            start: '18:30',
            step: '00:30',
            end: '22:30'
          }"
          placeholder="选择时间"
        ></el-time-select>
      </el-form-item>
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" size="small" @click="onSubmit">{{ $t('确定') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        day: 2,
        begin_time: '10:00',
        end_time: '18:00',
        date: []
      },
      weeks: [
        { id: 1, name: '周一' },
        { id: 2, name: '周二' },
        { id: 3, name: '周三' },
        { id: 4, name: '周四' },
        { id: 5, name: '周五' },
        { id: 6, name: '周六' },
        { id: 7, name: '周日' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.pickupTimeGetConfig().then(res => {
        if (res.ret) {
          this.form = res.data
        }
      })
    },
    onSubmit() {
      this.$request.pickupTimeUpdateConfig(this.form).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style>
.red-warn {
  color: red;
  margin: 10px 0;
}
</style>
