<template>
  <div class="purchaseDetail-container">
    <div style="display: flex; justify-content: flex-start; align-items: center">
      <h3>{{ $t('采购单详细') }}</h3>
      <div style="margin-left: 30px">
        <span>状态:未发货</span>
      </div>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="12"
          ><h4>{{ $t('基本信息') }}</h4>
        </el-col>
        <el-col :span="6"
          ><h4>{{ $t('发货信息') }}</h4></el-col
        >
        <el-col :span="6">
          <el-button size="small">{{ $t('添加') }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <span class="purchase-item">{{ $t('PO单号') }}</span
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
            <span class="purchase-item">{{ $t('PO单号名称') }}</span
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
            <span class="purchase-item">{{ $t('采购总金额') }}</span
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
    <div style="margin-top: 20px">
      <h4>{{ $t('采购清单') }}</h4>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="date" :label="$t('操作')"> </el-table-column>
        <el-table-column prop="name" :label="$t('物品中文名称')"> </el-table-column>
        <el-table-column prop="address" :label="$t('物品英文名称')"> </el-table-column>
        <el-table-column :label="$t('品牌')"></el-table-column>
        <el-table-column label="商品分类"></el-table-column>
        <el-table-column label="属性"></el-table-column>
        <el-table-column label="物品单价"></el-table-column>
        <el-table-column label="物品明细数量"></el-table-column>
        <el-table-column label="物品总箱数"></el-table-column>
        <el-table-column label="物品箱规"></el-table-column>
        <el-table-column label="条码"></el-table-column>
        <el-table-column label="物品照片"></el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <h4>分货清单</h4>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="date" label="操作">
          <template>
            <el-button @click="viewDetail">{{ $t('详情') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="打包单号"> </el-table-column>
        <el-table-column prop="address" label="转运单状态"> </el-table-column>
        <el-table-column label="商品数量"></el-table-column>
        <el-table-column label="总价值"></el-table-column>
        <el-table-column label="目的地"></el-table-column>
        <el-table-column label="收件人"></el-table-column>
        <el-table-column label="下单渠道"></el-table-column>
        <el-table-column label="付款方式"></el-table-column>
        <el-table-column label="创建时间"></el-table-column>
        <el-tabel-column label="创建人"></el-tabel-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <h4>操作日志</h4>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="date" label="行为"> </el-table-column>
        <el-table-column prop="name" label="日期"> </el-table-column>
        <el-table-column prop="address" label="操作人"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.purchaseDetail-container {
  background: #fff !important;
  .el-row {
    margin: 20px 0;
  }
  .purchase-item {
    display: inline-block;
    width: 120px;
  }
}
</style>
