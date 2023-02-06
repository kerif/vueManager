<template>
  <el-dialog :title="$t('首次设置微信认证')" :visible.sync="show" width="50%" @close="clear">
    <el-form :model="form" class="wechat-auth-point-rule">
      <h3><span class="red-text">* </span>{{ $t('首次设置微信认证，头像和微信名称增加积分') }}:</h3>
      <el-form-item :label="$t('首次认证头像昵称')">
        =
        <el-input-number
          size="mini"
          :step="1"
          :min="1"
          :max="10"
          v-model="form.nickname_point"
        ></el-input-number>
        分
      </el-form-item>
      <el-form-item :label="$t('首次认证微信号')">
        =
        <el-input-number
          size="mini"
          :step="1"
          :min="1"
          :max="10"
          v-model="form.id_point"
        ></el-input-number>
        分
        <div class="red-text">注：积分填写只能为整数</div>
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
        id_point: '',
        nickname_point: '',
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
      this.$request.getPointRuleForWechatAuth().then(res => {
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
      this.$request.setPointRuleForWechatAuth({ ...this.form }).then(res => {
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
      this.form.id_point = ''
      this.form.nickname_point = ''
      this.form.valid_time = ''
    }
  }
}
</script>

<style scoped lang="scss">
.wechat-auth-point-rule {
  .red-text {
    color: red;
  }
}
</style>
