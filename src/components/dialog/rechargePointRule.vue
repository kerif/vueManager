<template>
  <el-dialog :title="$t('充值送积分')" :visible.sync="show" width="50%" @close="clear">
    <el-form :model="form" class="wechat-auth-point-rule">
      <h3><span class="red-text">* </span>{{ $t('充值送积分规则') }}:</h3>
      <el-form-item :label="$t('100元')">
        =
        <el-input-number
          size="mini"
          :step="1"
          :min="1"
          :max="10"
          v-model="form.point"
        ></el-input-number>
        分
        <div class="red-text">注：充值送积分，不含赠送金额</div>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.is_ceil" :true-label="1" :false-label="0">{{
          $t('是否向上取整')
        }}</el-checkbox>
        <div class="red-text">向上取整意思如: 1.1 = 2, 2.9 = 3</div>
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
      <el-form-item>
        <el-button class="btn-main" @click="setRule">{{ $t('设置规则说明') }}</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
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
        is_ceil: '',
        point: '',
        valid_time: '',
        illustrate: []
      },
      langObj: {}
    }
  },
  methods: {
    setRule() {
      dialog(
        {
          type: 'growthExplain',
          langObj: this.langObj
        },
        data => {
          this.form.illustrate = data
        }
      )
    },
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
      this.$request.getPointRuleForRecharge().then(res => {
        if (res.ret) {
          for (let key in this.form) {
            if (Object.hasOwnProperty.call(this.form, key)) {
              this.form[key] = res.data[key]
            }
            this.langObj = res.data.illustrate ? res.data.illustrate : {}
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
      this.$request.setPointRuleForRecharge({ ...this.form }).then(res => {
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
      this.form.is_ceil = ''
      this.form.point = ''
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
