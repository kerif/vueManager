<template>
  <el-dialog
    v-if="reset_day < 15"
    :visible.sync="show"
    :title="$t('到期提醒')"
    class="dialog-system-expired"
  >
    <div>
      <h1>尊敬的 【{{ company_name }}】用户您好!</h1>
      <h2>
        您的系统使用期限<u
          >还有<span> {{ reset_day }} </span>天即将到期</u
        >
      </h2>
      <h3>
        系统使用服务将在 <span>{{ expired_at }}</span> 停止工作, 为了避免影响正常工作,请尽快联系续费
      </h3>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      company_name: '',
      expired_at: '',
      reset_day: 999
    }
  },
  methods: {
    // init
    init() {
      this.$request.aboutMe().then(res => {
        if (res.ret) {
          this.company_name = res.data.company_name
          this.expired_at = res.data.expired_at

          var today = new Date() //结束时间
          var expiredAt = res.data.expired_at //开始时间
          var diffTime = new Date(expiredAt).getTime() - today.getTime() //时间差的毫秒数

          var resetDay = Math.floor(diffTime / (24 * 3600 * 1000))
          this.reset_day = resetDay
          // 半个月提醒
          if (resetDay < 15) {
            this.show = true
          } else {
            this.show = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-system-expired {
  h1 {
    color: red;
  }
  span {
    color: blue;
  }
}
</style>
