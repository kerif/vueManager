<template>
  <el-dialog :title="$t('关注公众号送积分')" :visible.sync="show" width="50%" @close="clear">
    <el-form :model="form" class="wechat-office-account-point-rule">
      <h3><span class="red-text">* </span>{{ $t('关注公众号送积分规则') }}:</h3>
      <el-form-item :label="$t('首次关注公众号')">
        =
        <el-input-number
          size="mini"
          :step="1"
          :min="1"
          :max="10"
          v-model="form.point"
        ></el-input-number>
        分
        <div class="red-text">注：充值送积分，不含赠送金额，仅限首次关注，重复关注无效</div>
      </el-form-item>
      <h3>{{ $t('积分有效期') }}:</h3>
      <el-form-item :label="$t('积分到账起计算，有效期为')">
        <el-select v-model="form.valid_time">
          <el-option
            v-for="item in timeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      timeList: [],
      dateList: [
        {
          id: 0,
          name: this.$t('永久')
        },
        {
          id: 1,
          name: this.$t('每天')
        },
        {
          id: 2,
          name: this.$t('每周')
        },
        {
          id: 3,
          name: this.$t('每月')
        },
        {
          id: 4,
          name: this.$t('每年')
        }
      ],
      form: {
        point: '',
        valid_time: ''
      }
    }
  },
  methods: {
    init() {
      this.getInit()
      this.getDetail()
    },
    getInit() {
      this.$request.getInitInfo().then(res => {
        this.timeList = res.data.valid_time_list
      })
    },
    getDetail() {
      this.$request.getPointRuleForWechatOfficeAcccount().then(res => {
        if (res.ret) {
          for (let key in this.form) {
            if (Object.hasOwnProperty.call(this.form, key)) {
              this.form[key] = res.data[key]
            }
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onConfirm() {
      this.$request.setPointRuleForWechatOfficeAcccount({ ...this.form }).then(res => {
        if (res.ret) {
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
    },
    clear() {
      this.form.point = ''
      this.form.valid_time = ''
    }
  }
}
</script>

<style scoped lang="scss">
.wechat-office-account-point-rule {
  .red-text {
    color: red;
  }
}
</style>
