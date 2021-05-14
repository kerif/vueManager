<template>
  <div class="new-add-container">
    <el-form
      label-position="top"
      class="voucher-form"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item :label="$t('种类')">
        <span v-if="this.$route.params.type === 1">{{ $t('新用户送券') }}</span>
        <span v-if="this.$route.params.type === 2">{{ $t('邀请新人送券') }}</span>
        <span v-if="this.$route.params.type === 3">{{ $t('被邀请人送券') }}</span>
      </el-form-item>
      <el-form-item :label="$t('名称')" prop="name">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入名称')"
          v-model="ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('金额')" prop="amount">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入金额')"
          v-model="ruleForm.amount"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('最低消费')" prop="threshold">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入最低消费')"
          v-model="ruleForm.threshold"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('生效时间')" prop="begin_at">
           <el-date-picker
           value-format="yyyy-MM-dd"
            v-model="ruleForm.begin_at"
            type="date"
            :picker-options="pickerOptions"
            :placeholder="$t('请输入生效时间')">
            </el-date-picker>
    </el-form-item> -->
      <el-form-item :label="$t('有效期')" prop="days">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入有效期，例如78而不是2020-01-01')"
          v-model="ruleForm.days"
        ></el-input>
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
        begin_at: '',
        days: '',
        scope: 0,
        express_line_ids: []
      },
      lineName: [], // 保存获取到的路线
      rules: {
        name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入金额'), trigger: 'blur' }],
        threshold: [{ required: true, message: this.$t('请输入最低消费'), trigger: 'blur' }],
        days: [{ required: true, message: this.$t('请输入有效期'), trigger: 'blur' }],
        begin_at: [{ required: true, message: this.$t('请输入生效时间'), trigger: 'blur' }],
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
    console.log(typeof this.$route.params.type, 'type')
    console.log(this.$route.params.type, 'type')
  },
  methods: {
    chooseLine() {
      dialog({ type: 'lineChoose' }, data => {
        // console.log(data, '我是路线data')
        this.lineName = data
        this.ruleForm.express_line_ids = data.map(item => item.id)
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.addNew(this.$route.params.type, this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              if (this.$route.params.type === 1) {
                // 新用户送券
                this.$router.push({ name: 'new', params: { type: this.$route.params.type } })
              } else if (this.$route.params.type === 2) {
                // 邀请新人送券
                this.$router.push({ name: 'invite', params: { type: this.$route.params.type } })
              } else if (this.$route.params.type === 3) {
                // 被邀请人送券
                this.$router.push({ name: 'invitees', params: { type: this.$route.params.type } })
              } else if (this.$route.params.type === 4) {
                // 下单返券
                this.$router.push({ name: 'rebate', params: { type: this.$route.params.type } })
              }
              // this.$router.push({ name: 'managementNew', params: { type: this.$route.params.type } })
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
.new-add-container {
  background-color: #fff !important;
  padding: 20px;
  .save-btn {
    min-width: 100px;
  }
  .input-sty {
    width: 30%;
  }
  .choose-btn {
    margin-bottom: 20px;
    .el-button {
      vertical-align: top;
    }
  }
  .display-line {
    display: inline-block;
    padding: 5px;
    width: 245px;
    margin-left: 15px;
    background-color: #ccc;
    p {
      margin: 0;
    }
  }
}
</style>
