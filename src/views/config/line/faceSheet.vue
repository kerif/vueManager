<template>
  <div class="landing-container">
    <el-form ref="form" :model="landing" label-width="130px">
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
      <el-form-item :label="$t('多箱订单推送方式')">
        <el-radio-group v-model="landing.push_type">
          <el-radio :label="1">{{ $t('按订单推送') }}</el-radio>
          <el-radio :label="2">{{ $t('按箱数推送') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('开启直接提交')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            $t(
              '开启直接提交：开启时，客户支付后直接推送订单；关闭时，订单需要后台在进行报关信息审核'
            )
          "
          placement="top"
        >
          <span class="el-icon-warning-outline icon-info"></span>
        </el-tooltip>
        <el-switch
          v-model="landing.third_push_now"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="gray"
          :inactive-text="$t('关')"
        >
        </el-switch>
      </el-form-item>
      <!-- <el-form-item :label="$t('落地配对接方式')">
        <el-radio-group v-model="type">
          <el-radio :label="1">{{ $t('单接口') }}</el-radio>
          <el-radio :label="2">{{ $t('多接口') }}</el-radio>
        </el-radio-group>
        <div v-if="type === 1" style="margin: 10px 0">
          <span style="display: inline-block; margin-right: 5px">{{ $t('配单公司') }}</span>
          <el-select>
            <el-option
              v-for="item in dockingList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <div v-if="type === 1" style="margin: 10px 0">
          <span style="display: inline-block; margin-right: 5px">{{ $t('渠道代码') }}</span>
          <el-select> </el-select>
        </div>
        <div v-if="type === 2">
          <div style="display: flex; justify-content: flex-end; margin: 10px 0">
            <el-button class="btn-main" @click="onAdd">{{ $t('添加') }}</el-button>
          </div>
          <el-table border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="" :label="$t('推送条件')"></el-table-column>
            <el-table-column prop="" :label="$t('配单公司')"></el-table-column>
            <el-table-column prop="" :label="$t('代码')"></el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button class="btn-main" @click="onEdit(scope.row.id)">{{
                  $t('编辑')
                }}</el-button>
                <el-button class="btn-light-red" @click="onDelete(scope.row.id)">{{
                  $t('删除')
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="saveDocking">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import dialog from '@/components/dialog'
export default {
  data() {
    return {
      landing: {
        docking_type: '',
        channel_code: '',
        push_type: 1,
        third_push_now: 0
      },
      type: 1,
      dockingList: [],
      channelList: []
    }
  },
  created() {
    this.getDocking()
    this.dockData()
    this.getList()
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
          this.landing.push_type = res.data.push_type
          this.landing.third_push_now = res.data.third_push_now
        }
      })
    },
    getList() {
      this.$request.dockingList({ express_line_id: this.$route.params.id }).then(res => {
        console.log(res)
      })
    },
    onAdd() {
      // dialog({
      //   type: 'addEditAbutment',
      //   express_id: this.$route.params.id
      // })
    },
    onEdit(id) {
      console.log(id)
      // dialog({
      //   type: 'addEditAbutment',
      //   id,
      //   express_id: this.$route.params.id
      // })
    },
    onDelete(id) {
      console.log(id)
      // this.$request.delDocking(id).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       title: this.$t('操作成功'),
      //       message: res.msg,
      //       type: 'success'
      //     })
      //   } else {
      //     this.$notify({
      //       title: this.$t('操作失败'),
      //       message: res.msg,
      //       type: 'warning'
      //     })
      //   }
      // })
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
<style lang="scss" scoped>
.icon-info {
  color: #74b34f;
  font-size: 18px;
  position: relative;
  top: 2px;
  right: 5px;
  cursor: pointer;
}
</style>
