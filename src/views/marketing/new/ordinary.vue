<template>
  <div class="ordinary-container">
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
      <el-form-item :label="$t('种类')">
        <span v-if="$route.params.type === 5"
          >{{ $t('关注公众号领券') }} - {{ activeName === '0' ? $t('抵现券') : $t('抵重券') }}
        </span>
        <span v-if="$route.params.type === 6"
          >{{ $t('生日券') }} - {{ activeName === '0' ? $t('抵现券') : $t('抵重券') }}
        </span>
      </el-form-item>
      <el-form-item :label="$t('券名称')">
        <el-input
          class="input-sty"
          v-model="ruleForm.name"
          :placeholder="$t('请输入券名称')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('金额')" v-if="activeName === '0'">
        <el-input
          class="input-sty"
          v-model="ruleForm.amount"
          :placeholder="$t('请输入金额')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费金额')" v-if="activeName === '0'">
        <el-input
          class="input-sty"
          v-model="ruleForm.threshold"
          :placeholder="$t('请输入最低消费金额')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('可抵重量')" v-if="activeName === '1' && $route.params.type === 6">
        <el-input
          class="input-sty"
          v-model="ruleForm.weight"
          :placeholder="$t('请输入可抵重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('重量')" v-if="activeName === '1' && $route.params.type === 5">
        <el-input
          class="input-sty"
          v-model="ruleForm.weight"
          :placeholder="$t('请输入重量')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费重量')" v-if="activeName === '1'">
        <el-input
          class="input-sty"
          v-model="ruleForm.min_weight"
          :placeholder="$t('请输入最低消费重量')"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('生效时间')">
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
      </el-form-item> -->
      <el-form-item :label="$route.params.type === 5 ? $t('有效期') : $t('有效时长')">
        <el-input
          :placeholder="$t('请输入有效期')"
          class="input-sty"
          v-model="ruleForm.days"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('使用范围')">
        <el-radio-group v-model="ruleForm.scope">
          <el-radio :label="0">{{ $t('全部') }}</el-radio>
          <el-radio :label="1">{{ $t('按路线') }}</el-radio>
        </el-radio-group>
        <div v-if="ruleForm.scope === 1" class="choose-box">
          <div>
            <el-button class="btn-deep-blue" @click="chooseLine">{{ $t('选择路线') }}</el-button>
          </div>
          <div class="display-line" v-if="this.lineName.length">
            <p v-for="item in lineName" :key="item.id">
              {{ item.name }}
            </p>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit('ruleForm')"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>

      <!-- <el-form-item :label="$t('抢券时间')" v-if="activeName === '0'"></el-form-item>
      <el-form-item :label="$t('单人限领数量')" v-if="activeName === '0'"></el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      activeName: '0',
      lineName: [],
      ruleForm: {
        coupon_type: '',
        name: '',
        amount: '',
        threshold: '',
        days: '',
        weight: '',
        min_weight: '',
        scope: 0,
        express_line_ids: []
      },
      rules: {}
    }
  },
  methods: {
    chooseLine() {
      dialog({ type: 'lineChoose' }, data => {
        this.lineName = data
        this.ruleForm.express_line_ids = data.map(item => item.id)
      })
    },
    handleClick(tab) {
      console.log(tab, 'tab')
      // if (tab.name && tab.name === '0') {
      // } else {
      // }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.activeName === '0') {
            this.ruleForm.coupon_type = 1
          } else {
            this.ruleForm.coupon_type = 2
          }
          this.$request.addNew(this.$route.params.type, this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
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
.ordinary-container {
  background-color: #fff !important;
  .input-sty {
    width: 30%;
  }
  .save-btn {
    min-width: 100px;
  }
  .choose-box {
    display: flex;
    .display-line {
      width: 245px;
      padding: 6px;
      margin-left: 20px;
      background-color: #f3f3f3;
    }
  }
}
</style>
