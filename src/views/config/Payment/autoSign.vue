<template>
  <div class="settings-container">
    <el-row>
      <el-col>
        <el-switch v-model="open" active-color="#1AD900FF" class="sign-tib"></el-switch>
        <span>{{ $t('开始自动签收') }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="remark-cel" style="margin-left: 56px">{{ $t('隔天生效') }}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="tib-cel">{{ $t('发货后触发自动签收时间') }}</el-col>
      <el-col :span="5">
        <el-input
          v-model="data.trigger_days"
          :placeholder="$t('请输入内容')"
          style="width: 200px; margin-right: 16px"
        ></el-input
        ><span>{{ $t('天') }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="remark-cel" :offset="4">*{{ $t('货到付款的不能签收不能少于7天') }}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="tib-cel">{{ $t('签收后是否自动评价') }}</el-col>
      <el-col :span="20">
        <el-switch
          v-model="evaluate"
          active-color="#1AD900FF"
          style="margin-right: 16px"
        ></el-switch>
        <span class="remark-cel">*{{ $t('开启自动评价功能后会触发自动返券积分成长值事件') }}</span>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="tib-cel">{{ $t('自动评价内容') }}</el-col>
      <el-col :span="5">
        <el-input
          v-model="data.evaluate_content"
          :placeholder="$t('请输入内容')"
          style="width: 200px; margin-right: 16px"
        ></el-input>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="tib-cel">{{ $t('自动评价评分') }}</el-col>
      <el-col :span="5">
        <el-rate v-model="data.evaluate_score"></el-rate>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :offset="4">
        <el-button type="primary" style="width: 200px" @click="save">{{ $t('保存') }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      evaluate: false,
      data: {
        enabled: null,
        trigger_days: null,
        is_evaluate: null,
        evaluate_content: null,
        evaluate_score: 3
      }
    }
  },
  mounted() {
    this.getAutoSian()
  },
  methods: {
    getAutoSian() {
      this.$request.getAutoSign(this.data).then(res => {
        this.data = res.data
        this.open = this.data.enabled ? true : false
        this.evaluate = this.data.is_evaluate ? true : false
      })
    },
    save() {
      this.data.enabled = this.open ? 1 : 0
      this.data.is_evaluate = this.evaluate ? 1 : 0
      this.$request.saveAutoSign(this.data).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getAutoSian()
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
<style scoped lang="scss">
.settings-container {
  .sign-tib {
    margin-right: 16px;
  }
  .remark-cel {
    color: #ff9933;
    font-size: 14px;
    font-weight: bold;
  }
  .tib-cel {
  }
  .row {
    margin-top: 16px;
    display: flex;
    align-items: center;
  }
}
</style>
