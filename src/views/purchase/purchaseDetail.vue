<template>
  <div class="purchaseDetail-container">
    <div class="purchase-top">
      <h3>{{ $t('采购单详细') }}</h3>
      <div style="margin-left: 30px"><span>状态:</span><span>未发货</span></div>
    </div>
    <div>
      <div class="purchase-title">
        <div style="width: 50%">
          <h4>{{ $t('基本信息') }}</h4>
        </div>
        <div style="width: 50%">
          <div>
            <h4 style="display: inline-block">{{ $t('发货信息') }}</h4>
            <el-button size="small" class="btn-deep-blue" style="margin-left: 40px">{{
              $t('修改')
            }}</el-button>
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
    <div style="margin-top: 20px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h4>{{ $t('采购清单') }}</h4>
        <el-button type="primary" size="small" @click="addGoods">{{ $t('添加') }}</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="date" :label="$t('操作')"> </el-table-column>
        <el-table-column prop="name" :label="$t('物品中文名称')"> </el-table-column>
        <el-table-column prop="address" :label="$t('物品英文名称')"> </el-table-column>
        <el-table-column :label="$t('品牌')"></el-table-column>
        <el-table-column :label="$t('商品分类')"></el-table-column>
        <el-table-column :label="$t('属性')"></el-table-column>
        <el-table-column :label="$t('物品单价')"></el-table-column>
        <el-table-column :label="$t('物品明细数量')"></el-table-column>
        <el-table-column :label="$t('物品总箱数')"></el-table-column>
        <el-table-column :label="$t('物品箱规')"></el-table-column>
        <el-table-column :label="$t('条码')"></el-table-column>
        <el-table-column :label="$t('物品照片')"></el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <h4>{{ $t('分货清单') }}</h4>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template>
            <el-button size="small" @click="viewDetail">{{ $t('详情') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="number" :label="$t('打包单号')"> </el-table-column>
        <el-table-column prop="address" :label="$t('转运单状态')"> </el-table-column>
        <el-table-column :label="$t('商品数量')"></el-table-column>
        <el-table-column :label="$t('总价值')"></el-table-column>
        <el-table-column :label="$t('目的地')"></el-table-column>
        <el-table-column :label="$t('收件人')"></el-table-column>
        <el-table-column :label="$t('下单渠道')"></el-table-column>
        <el-table-column :label="$t('付款方式')"></el-table-column>
        <el-table-column :label="$t('创建时间')"></el-table-column>
        <el-tabel-column :label="$t('创建人')"></el-tabel-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <h4>{{ $t('操作日志') }}</h4>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="date" :label="$t('行为')"> </el-table-column>
        <el-table-column prop="name" :label="$t('日期')"> </el-table-column>
        <el-table-column prop="address" :label="$t('操作人')"> </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <el-button size="small" class="btn-light-red">{{ $t('删除') }}</el-button>
      <el-button size="small" class="btn-deep-blue" :loading="$store.state.btnLoading">{{
        $t('保存')
      }}</el-button>
      <el-button size="small" class="btn-deep-blue" :loading="$store.state.btnLoading">{{
        $t('保存并提交')
      }}</el-button>
      <el-button size="small" class="btn-deep-purple">{{ $t('添加发货信息') }}</el-button>
      <el-button size="small" class="btn-blue-green">{{ $t('入库') }}</el-button>
      <el-button size="small" class="btn-green">{{ $t('修改发货信息') }}</el-button>
    </div>
    <add-goods :showGoods="showGoods" @passVal="passVal"></add-goods>
  </div>
</template>

<script>
import AddGoods from './components/addGoods.vue'
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          number: 1
        }
      ],
      showGoods: false
    }
  },
  components: {
    AddGoods
  },
  methods: {
    viewDetail() {
      this.$router.push({
        name: 'distributeDetail'
      })
    },
    addGoods() {
      this.showGoods = true
    },
    passVal() {
      this.showGoods = false
    }
  }
}
</script>

<style lang="scss">
.purchaseDetail-container {
  background: #fff !important;
  .purchase-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .purchase-title {
    display: flex;
  }
  .el-row {
    margin: 20px 0;
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
}
</style>
