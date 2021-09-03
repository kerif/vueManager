<template>
  <div class="landing-container">
    <el-form ref="form" :model="landing" label-width="120px">
      <el-form-item :label="$t('落地配配置')">
        <el-select
          @change="changeChannel"
          v-model="landing.docking_type"
          filterable
          allow-create
          default-first-option
          :placeholder="$t('请选择')"
        >
          <el-option v-for="item in dockingList" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('渠道代码')">
        <el-select
          v-model="landing.channel_code"
          filterable
          allow-create
          default-first-option
          :placeholder="$t('请选择')"
        >
          <el-option
            style="width: 100%"
            v-for="item in channelList"
            :key="item.id"
            :value="item.code"
            :label="item.code + '----' + item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveDocking">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      landing: {
        docking_type: '',
        channel_code: ''
      },
      dockingList: [],
      channelList: []
    }
  },
  created() {
    this.getDocking()
    this.dockData()
  },
  methods: {
    // 获取落地陪配置数据
    getDocking() {
      this.$request.dockingPick().then(res => {
        if (res.ret) {
          this.dockingList = res.data
        }
      })
    },
    // 获取渠道代码数据
    getChannel() {
      this.$request.channelCode(this.landing.docking_type).then(res => {
        if (res.ret) {
          this.channelList = res.data
        }
      })
    },
    changeChannel() {
      this.landing.channel_code = ''
      this.channelList = []
      this.getChannel()
    },
    dockData() {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        if (res.ret) {
          this.landing.docking_type = res.data.express_company_id
          this.getChannel()
          this.landing.channel_code = res.data.channel_code
        }
      })
    },
    // 更新落地配配置
    saveDocking() {
      this.$request.updateDocking(this.$route.params.id, { ...this.landing }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.dockData()
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
<style lang="scss" scoped></style>
