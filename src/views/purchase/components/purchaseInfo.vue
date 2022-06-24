<template>
  <div>
    <div class="purchase-title">
      <div style="width: 50%">
        <h4>{{ $t('基本信息') }}</h4>
      </div>
      <div style="width: 50%">
        <div>
          <h4 style="display: inline-block">{{ $t('发货信息') }}</h4>
          <slot name="btn"></slot>
        </div>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item"><span class="icon">*</span>{{ $t('PO单号') }}</span
          ><span>{{ form.sn }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span class="purchase-item">{{ $t('发货公司') }}</span
          ><span>{{ form.logistics_company }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item"><span class="icon">*</span>{{ $t('PO单号名称') }}</span
          ><span>{{ form.name }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span class="purchase-item">{{ $t('物流单号') }}</span
          ><span>{{ form.logistics_sn }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item"><span class="icon">*</span>{{ $t('采购总金额') }}</span
          ><span>{{ form.amount }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span class="purchase-item">{{ $t('收货仓库') }}</span>
          <span v-if="form.warehouse_name">{{ form.warehouse_name }}</span>
          <span v-else>{{ $t('暂无') }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item">{{ $t('采购备注') }}</span
          ><span>{{ form.remark }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    form: Object
  }
}
</script>

<style lang="scss">
.purchase-title {
  display: flex;
}
.el-row {
  margin: 10px 0;
}
.purchase-item {
  display: inline-block;
  width: 120px;
}
.icon {
  color: red;
  display: inline-block;
  margin-right: 5px;
}
</style>
