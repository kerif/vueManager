<template>
  <el-dialog :visible.sync="show" :title="id ? $t('编辑') : $t('添加')" width="80%" @close="clear">
    <el-form label-position="top" :model="ruleForm">
      <el-form-item :label="$t('推送条件')">
        <el-row :gutter="20">
          <el-input
            v-model="ruleForm.first_num"
            style="width: 20%"
            :placeholder="$t('请输入')"
          ></el-input>
          <el-select v-model="ruleForm.first_condition" style="width: 10%; margin: 0 2px">
            <el-option
              v-for="(item, index) in symbolData"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
          <el-select v-model="ruleForm.type" style="width: 20%; margin: 0 2px">
            <el-option
              v-for="item in modelData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="ruleForm.second_condition" style="width: 10%; margin: 0 2px">
            <el-option
              v-for="(item, index) in symbolData"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
          <el-input
            v-model="ruleForm.second_num"
            style="width: 20%"
            :placeholder="$t('请输入')"
          ></el-input>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('配单公司')">
        <el-select
          v-model="ruleForm.docking_type"
          filterable
          allow-create
          default-first-option
          @change="getChannel"
        >
          <el-option
            v-for="item in dockingList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('渠道代码')">
        <el-select v-model="ruleForm.channel_code" filterable allow-create default-first-option>
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :value="item.code"
            :label="item.code + '----' + item.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onSubmit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      symbolData: [
        {
          label: '<'
        },
        {
          label: '<='
        }
      ],
      modelData: [
        {
          id: 1,
          name: this.$t('订单计费重量')
        },
        {
          id: 2,
          name: this.$t('订单实际重量')
        }
      ],
      ruleForm: {
        first_num: '',
        first_condition: '',
        type: '',
        second_condition: '',
        second_num: '',
        docking_type: '',
        channel_code: ''
      },
      dockingList: [],
      channelList: [],
      express_id: '',
      id: ''
    }
  },
  methods: {
    init() {
      this.getDocking()
      if (this.id) {
        this.getDockingDetail()
      }
    },
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
      this.$request.channelCode(this.ruleForm.docking_type).then(res => {
        if (res.ret) {
          this.channelList = res.data
        }
      })
    },
    getDockingDetail() {
      this.$request.dockingDetail(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.getChannel()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onSubmit() {
      if (this.id) {
        this.$request.editDockingMethod(this.id, this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.success()
            this.show = false
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        let params = {
          ...this.ruleForm
        }
        params.express_line_id = this.express_id
        this.$request.dockingMethod(params).then(res => {
          console.log(res)
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    clear() {
      this.id = ''
      this.express_id = ''
      this.ruleForm.first_num = ''
      this.ruleForm.first_condition = ''
      this.ruleForm.type = ''
      this.ruleForm.second_condition = ''
      this.ruleForm.second_num = ''
      this.ruleForm.docking_type = ''
      this.ruleForm.channel_code = ''
    }
  }
}
</script>

<style></style>
