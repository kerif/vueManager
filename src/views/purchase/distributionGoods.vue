<template>
  <div>
    <h3>{{ $t('采购单详细') }}</h3>
    <div class="purchase-title">
      <div style="width: 50%">
        <h4>{{ $t('基本信息') }}</h4>
      </div>
      <div style="width: 50%">
        <div>
          <h4 style="display: inline-block">{{ $t('发货信息') }}</h4>
        </div>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item"><span class="icon">*</span>{{ $t('PO单号') }}</span
          ><span>po123456</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span class="purchase-item">{{ $t('发货公司') }}</span
          ><span>{{ $t('无') }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item"><span class="icon">*</span>{{ $t('PO单号名称') }}</span
          ><span>{{ $t('电饭煲采购单') }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <span class="purchase-item">{{ $t('物流单号') }}</span
          ><span>{{ $t('无') }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item"><span class="icon">*</span>{{ $t('采购总金额') }}</span
          ><span>9999.00</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <span class="purchase-item">{{ $t('采购备注') }}</span
          ><span>{{ $t('电饭煲采购单') }}</span>
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
  methods: {}
}
</script>

<style></style>
