<template>
  <el-drawer size="85%" :visible.sync="show" :title="$t('个人资料')" @close="clear">
    <div class="dialog-vip-profile">
      <el-row :gutter="20">
        <el-col :span="3">
          <br />
          <el-avatar
            shape="square"
            :size="100"
            :fit="fit"
            src="https://empty"
            @error="errorHandler"
          >
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
          <br />
          900001
        </el-col>
        <el-col :span="21">
          <el-descriptions title="测试用户" :column="4" border>
            <template slot="title">
              测试用户
              <el-tag>标签一</el-tag>
              <el-tag>标签一</el-tag>
            </template>
            <template slot="extra">
              <el-button type="primary" size="small">修改个人资料</el-button>
            </template>
            <el-descriptions-item label="邮箱">kooriookami</el-descriptions-item>
            <el-descriptions-item label="手机号">kooriookami</el-descriptions-item>
            <el-descriptions-item label="微信号">kooriookami</el-descriptions-item>
            <el-descriptions-item label="会员识别号">kooriookami</el-descriptions-item>
            <el-descriptions-item label="国家/地区">kooriookami</el-descriptions-item>
            <el-descriptions-item label="用户组">kooriookami</el-descriptions-item>
            <el-descriptions-item label="余额">kooriookami</el-descriptions-item>
            <el-descriptions-item label="积分">kooriookami</el-descriptions-item>
            <el-descriptions-item label="成长值">kooriookami</el-descriptions-item>
            <el-descriptions-item label="券包">kooriookami</el-descriptions-item>
            <el-descriptions-item label="邀请人">kooriookami</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
      <div class="btn-group">
        <el-button-group>
          <el-button type="primary" plain>修改用户组</el-button>
          <el-button type="primary" plain>修改标签</el-button>
          <el-button type="primary" plain>客户合并</el-button>
          <el-button type="primary" plain>修改密码</el-button>
          <el-button type="primary" plain>转为代理</el-button>
        </el-button-group>
      </div>
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="包裹列表(10)" name="parcel">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="快递单号" width="180"> </el-table-column>
            <el-table-column prop="name" label="状态" width="180"> </el-table-column>
            <el-table-column prop="address" label="物品名称"> </el-table-column>
            <el-table-column prop="address" label="物品价值"> </el-table-column>
            <el-table-column prop="address" label="物品属性"> </el-table-column>
            <el-table-column prop="address" label="仓库"> </el-table-column>
            <el-table-column prop="address" label="签收时间"> </el-table-column>
            <el-table-column prop="address" label="提交时间"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单列表(10)" name="order">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="订单号" width="180"> </el-table-column>
            <el-table-column prop="name" label="线路名称"> </el-table-column>
            <el-table-column prop="address" label="收件人"> </el-table-column>
            <el-table-column prop="address" label="收件国家/地区"> </el-table-column>
            <el-table-column prop="address" label="件数"> </el-table-column>
            <el-table-column prop="address" label="申报价值"> </el-table-column>
            <el-table-column prop="address" label="实际重量"> </el-table-column>
            <el-table-column prop="address" label="实际费用"> </el-table-column>
            <el-table-column prop="address" label="提交时间"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收件信息(10)" name="receiver">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="收件人" width="180"> </el-table-column>
            <el-table-column prop="name" label="地址类型"> </el-table-column>
            <el-table-column prop="address" label="联系电话"> </el-table-column>
            <el-table-column prop="address" label="收件国家/地区"> </el-table-column>
            <el-table-column prop="address" label="省/州"> </el-table-column>
            <el-table-column prop="address" label="区域"> </el-table-column>
            <el-table-column prop="address" label="城市"> </el-table-column>
            <el-table-column prop="address" label="街道"> </el-table-column>
            <el-table-column prop="address" label="门牌号"> </el-table-column>
            <el-table-column prop="address" label="邮编"> </el-table-column>
            <el-table-column prop="address" label="创建时间"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="成交流水记录(10)" name="paylogs">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="类型" width="180"> </el-table-column>
            <el-table-column prop="name" label="支付类型"> </el-table-column>
            <el-table-column prop="address" label="应付金额"> </el-table-column>
            <el-table-column prop="address" label="抵用券金额"> </el-table-column>
            <el-table-column prop="address" label="积分抵扣金额"> </el-table-column>
            <el-table-column prop="address" label="支付金额"> </el-table-column>
            <el-table-column prop="address" label="相关订单"> </el-table-column>
            <el-table-column prop="address" label="流水号"> </el-table-column>
            <el-table-column prop="address" label="外部交易单号"> </el-table-column>
            <el-table-column prop="address" label="支付订单"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="成长值记录(10)" name="growthlog">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="类型" width="180"> </el-table-column>
            <el-table-column prop="name" label="金额"> </el-table-column>
            <el-table-column prop="address" label="明细"> </el-table-column>
            <el-table-column prop="address" label="收支规则"> </el-table-column>
            <el-table-column prop="address" label="备注"> </el-table-column>
            <el-table-column prop="address" label="相关单号"> </el-table-column>
            <el-table-column prop="address" label="流水号"> </el-table-column>
            <el-table-column prop="address" label="创建时间"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="积分记录(10)" name="pointlog">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="类型" width="180"> </el-table-column>
            <el-table-column prop="name" label="金额"> </el-table-column>
            <el-table-column prop="address" label="明细"> </el-table-column>
            <el-table-column prop="address" label="收支规则"> </el-table-column>
            <el-table-column prop="address" label="备注"> </el-table-column>
            <el-table-column prop="address" label="相关单号"> </el-table-column>
            <el-table-column prop="address" label="流水号"> </el-table-column>
            <el-table-column prop="address" label="创建时间"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="券包列表(10)" name="coupou">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="券名称" width="180"> </el-table-column>
            <el-table-column prop="name" label="券码"> </el-table-column>
            <el-table-column prop="address" label="金额"> </el-table-column>
            <el-table-column prop="address" label="状态"> </el-table-column>
            <el-table-column prop="address" label="发放时间"> </el-table-column>
            <el-table-column prop="address" label="使用时间"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="邀请记录(10)" name="invite">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="date" label="客户ID" width="180"> </el-table-column>
            <el-table-column prop="name" label="客户昵称"> </el-table-column>
            <el-table-column prop="address" label="注册时间"> </el-table-column>
            <el-table-column prop="address" label="最后登录时间"> </el-table-column>
            <el-table-column prop="address" label="是否代理邀请"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        email: '',
        phone: '',
        name: '',
        password: ''
      },
      activeTabName: 'parcel'
    }
  },
  methods: {
    init() {
      this.show = true
    }
  }
}
</script>
<style lang="scss">
.dialog-vip-profile {
  padding: 20px;
  .btn-group {
    padding-top: 20px;
    text-align: right;
  }
}
</style>
