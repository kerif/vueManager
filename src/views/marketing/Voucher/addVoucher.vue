<template>
  <div class="add-voucher-container">
    <el-form
      label-position="top"
      class="voucher-form"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item :label="$t('名称')" prop="name">
        <el-input :placeholder="$t('请输入名称')" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('金额')" prop="amount">
        <el-input :placeholder="$t('请输入金额')" v-model="ruleForm.amount"></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费')" prop="threshold">
        <el-input :placeholder="$t('请输入最低消费')" v-model="ruleForm.threshold"></el-input>
      </el-form-item>
      <el-form-item :label="$t('生效时间')" prop="effected_at">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="ruleForm.effected_at"
          type="date"
          :picker-options="pickerOptions"
          :placeholder="$t('请输入生效时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('失效时间')" prop="expired_at">
        <el-date-picker
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          v-model="ruleForm.expired_at"
          type="date"
          :placeholder="$t('请输入失效时间')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('使用范围')" prop="scope">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0">{{ $t('全部') }}</el-radio>
          <el-radio :label="1">{{ $t('按路线') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="this.ruleForm.scope === 1" class="choose-btn">
        <el-button class="btn-deep-blue" @click="chooseLine">{{ $t('选择路线') }}</el-button>
        <div class="display-line" v-if="this.lineName.length">
          <p v-for="item in lineName" :key="item.id">
            {{ item.name }}
          </p>
        </div>
      </div>
      <el-form-item :label="$t('优惠券类型')" prop="scope">
        <el-radio-group v-model="ruleForm.is_shared">
          <el-radio :label="0">{{ $t('普通抵用券') }}</el-radio>
          <el-radio :label="1">{{ $t('用户抢券') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="ruleForm.is_shared === 1">
        <el-form-item :label="$t('抢券时间')">
          <el-date-picker
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="timeList"
            type="datetimerange"
            start-placeholder="抢券开始时间"
            end-placeholder="抢券结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('单人限领数量')" prop="name">
          <el-input
            :placeholder="$t('请输入单人限领数量')"
            v-model="ruleForm.share_each_count"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('放券总数')" prop="amount">
          <el-input
            :placeholder="$t('请输入放券总数')"
            v-model="ruleForm.share_total_count"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('后台投放不计入总数')">
          <el-radio-group v-model="ruleForm.ignore_launch_count">
            <el-radio :label="1">{{ $t('是') }}</el-radio>
            <el-radio :label="0">{{ $t('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit('ruleForm')"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        amount: '',
        threshold: '',
        effected_at: '',
        expired_at: '',
        scope: 0,
        usable_line_ids: [],
        is_shared: 0,
        share_total_count: '',
        share_each_count: '',
        share_begin_at: '',
        share_end_at: '',
        ignore_launch_count: 0
      },
      lineName: [], // 保存获取到的路线
      timeList: [],
      rules: {
        name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入金额'), trigger: 'blur' }],
        threshold: [{ required: true, message: this.$t('请输入最低消费'), trigger: 'blur' }],
        expired_at: [{ required: true, message: this.$t('请输入失效时间'), trigger: 'blur' }],
        effected_at: [{ required: true, message: this.$t('请输入生效时间'), trigger: 'blur' }],
        scope: [{ required: true, message: this.$t('请选择使用范围'), trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      //   this.$request.getBill().then(res => {
      //     this.ruleForm = res.data
      //   })
    },
    chooseLine() {
      dialog({ type: 'lineChoose' }, data => {
        // console.log(data, '我是路线data')
        this.lineName = data
        this.ruleForm.usable_line_ids = data.map(item => item.id)
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .addCoupons({
              ...this.ruleForm,
              share_begin_at: this.timeList[0],
              share_end_at: this.timeList[1]
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.getList()
                this.$router.push({ name: 'voucher' })
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.add-voucher-container {
  background-color: #fff !important;
  padding: 20px;
  .voucher-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .el-input {
    width: 40%;
  }
  .choose-btn {
    margin-bottom: 20px;
    // margin-left: 80px;
    .el-button {
      vertical-align: top;
    }
  }
  .display-line {
    display: inline-block;
    padding: 5px;
    width: 245px;
    margin-left: 15px;
    // line-height: 25px;
    background-color: #ccc;
    // margin-bottom: 20px;
    p {
      margin: 0;
    }
  }
}
</style>
