<template>
  <el-drawer
    :title="$t('编辑默认模板')"
    class="inner-container"
    :size="size"
    :visible.sync="editTmpDrawer"
    :before-close="close"
    @opened="open()"
  >
    <el-form class="inner-form">
      <el-form-item :label="$t('模板名称')" style="margin-left: 20px">
        <el-input
          v-model="ruleForm.name"
          :placeholder="$t('请输入模板名称')"
          class="input-sty"
          style="width: 40%"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('模板备注')" style="margin-left: 20px">
        <el-input
          v-model="ruleForm.remark"
          :placeholder="$t('请输入模板备注')"
          class="input-sty"
          style="width: 40%"
        ></el-input>
      </el-form-item>
      <el-collapse v-model="activeNames" @change="handleChange" style="margin: 20px">
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
      <el-form-item style="margin-left: 20px" :label="$t('同时导出附表')">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="禁用" disabled></el-checkbox>
          <el-checkbox label="选中且禁用" disabled></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div style="float: right">
        <el-button>{{ $t('保存模板') }}</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        remark: ''
      },
      size: '50%'
    }
  },
  props: {
    editTmpDrawer: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {
    open() {},
    close() {
      this.$emit('receiveInner', false)
    }
  }
}
</script>

<style lang="scss">
.inner-container {
}
</style>
