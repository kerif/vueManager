<template>
  <el-drawer
    :title="$t('导出订单详情')"
    :visible.sync="showTmpDrawer"
    class="exportTmp-container"
    :before-close="close"
    @opened="open()"
  >
    <div style="margin-top: 20px">
      <el-button>{{ $t('新增模板') }}</el-button> <el-button>{{ $t('确定导出') }}</el-button>
    </div>
    <el-row style="background: #ccc" :gutter="20">
      <el-col>
        <div>模板名称</div>
      </el-col>
      <el-row>
        <el-col :span="18">模板名称模板名称模板名称模板名称模板名称模板名称模板名称</el-col>
        <el-col :span="6">
          <el-button @click="editTmpDrawer = true">编辑</el-button>
          <el-button @click="deleteTmpDrawer">删除</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-drawer
      :title="$t('编辑默认模板')"
      class="inner"
      :size="size"
      :visible.sync="editTmpDrawer"
      :append-to-body="true"
    >
      <el-form>
        <el-form-item :label="$t('模板名称')">
          <el-input :placeholder="$t('请输入模板名称')" class="input-sty"></el-input>
        </el-form-item>
        <el-form-item :label="$t('模板备注')">
          <el-input :placeholder="$t('请输入模板名称')" class="input-sty"></el-input>
        </el-form-item>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="$t('订单信息')" name="1">
            <el-radio-group v-model="order">
              <el-radio :label="1">用户ID</el-radio>
              <el-radio :label="2">用户昵称</el-radio>
              <el-radio :label="3">订单号</el-radio>
              <el-radio :label="4">渠道名称</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item :title="$t('收件信息')" name="1">
            <el-radio-group v-model="order">
              <el-radio :label="1">收货人</el-radio>
              <el-radio :label="2">联系方式</el-radio>
              <el-radio :label="3">收获方式</el-radio>
              <el-radio :label="4">国家地区</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item :title="$t('入库信息')" name="1">
            <div>总计</div>
            <el-radio-group v-model="order">
              <el-radio :label="1">收货人</el-radio>
              <el-radio :label="2">联系方式</el-radio>
              <el-radio :label="3">收获方式</el-radio>
              <el-radio :label="4">国家地区</el-radio>
            </el-radio-group>
            <div>分箱</div>
            <el-radio-group v-model="order">
              <el-radio :label="1">申报价值</el-radio>
              <el-radio :label="2">商品数量</el-radio>
              <el-radio :label="3">入库件数</el-radio>
              <el-radio :label="4">入库实重</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item :title="$t('出库信息')" name="1">
            <div>总计</div>
            <el-radio-group v-model="order">
              <el-radio :label="1">出库箱数</el-radio>
              <el-radio :label="2">计费重量</el-radio>
              <el-radio :label="3">出库实重</el-radio>
              <el-radio :label="4">出库体积重</el-radio>
            </el-radio-group>
            <div>分箱</div>
            <el-radio-group v-model="order">
              <el-radio :label="1">计费重量</el-radio>
              <el-radio :label="2">出库实重</el-radio>
              <el-radio :label="3">出库尺寸</el-radio>
              <el-radio :label="4">出库体积重</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item :title="$t('支付信息')" name="1">
            <el-radio-group v-model="order">
              <el-radio :label="1">支付方式</el-radio>
              <el-radio :label="2">支付状态</el-radio>
              <el-radio :label="3">应付金额</el-radio>
              <el-radio :label="4">实付金额</el-radio>
            </el-radio-group>
            <div>其他费用明细</div>
            <el-radio-group v-model="order">
              <el-radio :label="1">仓储费</el-radio>
              <el-radio :label="2">保险服务</el-radio>
              <el-radio :label="3">关税服务</el-radio>
              <el-radio :label="4">增值费用</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item :title="$t('发货信息')" name="1">
            <el-radio-group v-model="order">
              <el-radio :label="1">发货单号</el-radio>
              <el-radio :label="2">发货单名称</el-radio>
              <el-radio :label="3">发货单目的地</el-radio>
              <el-radio :label="4">发货状态</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item :title="$t('操作信息')" name="1">
            <el-radio-group v-model="order">
              <el-radio :label="1">提交时间</el-radio>
              <el-radio :label="2">打包时间</el-radio>
              <el-radio :label="3">支付时间</el-radio>
              <el-radio :label="4">发货时间</el-radio>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item :title="$t('其他客户信息')" name="1">
            <el-radio-group v-model="order">
              <el-radio :label="1">绑定手机号</el-radio>
              <el-radio :label="2">绑定邮箱</el-radio>
              <el-radio :label="3">微信号</el-radio>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-drawer>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      editTmpDrawer: false,
      activeNames: ['1'],
      order: 1,
      size: '40%'
    }
  },
  props: {
    showTmpDrawer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('receiveTmp', false)
    },
    open() {},
    handleChange(val) {
      console.log(val)
    },
    deleteTmpDrawer() {}
  }
}
</script>

<style lang="scss">
.exportTmp-container {
  /deep/.inner .el-drawer__open .el-drawer.rtl {
    width: 40% !important;
  }
  .el-drawer.rtl {
    overflow: scroll;
  }
  .el-drawer__header {
    margin-bottom: 0;
  }
  /deep/.el-input {
    width: 40% !important;
    margin-left: 50px;
  }
  /deep/.el-form-item__label {
    width: 200px !important;
  }
}
</style>
