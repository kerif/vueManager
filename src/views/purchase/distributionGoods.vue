<template>
  <div class="goods-container">
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
    <h3>{{ $t('采购清单') }}</h3>
    <el-table :data="ruleForm.goods" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column :label="$t('操作')"> </el-table-column>
      <el-table-column prop="cn_name" :label="$t('物品中文名称')"> </el-table-column>
      <el-table-column prop="en_name" :label="$t('物品英文名称')"> </el-table-column>
      <el-table-column prop="brand" :label="$t('品牌')"></el-table-column>
      <el-table-column prop="category_id" :label="$t('商品分类')"></el-table-column>
      <el-table-column prop="purchase_price" :label="$t('物品单价')"></el-table-column>
      <el-table-column prop="quantity" :label="$t('物品明细数量')"></el-table-column>
      <el-table-column prop="quantity" :label="$t('剩余可拆数量')"></el-table-column>
      <el-table-column prop="box_count" :label="$t('物品总箱数')"></el-table-column>
      <el-table-column prop="box_spec" :label="$t('物品箱规')"></el-table-column>
      <el-table-column prop="barcode" :label="$t('条码')"></el-table-column>
      <el-table-column prop="image" :label="$t('物品照片')"></el-table-column>
    </el-table>
    <div style="width: 800px; margin: 20px auto">
      <el-steps :active="1" finish-status="success">
        <el-step
          :title="$t('分拆订单')"
          :description="$t('根据要拆分的生成的订单选择商品')"
        ></el-step>
        <el-step
          :title="$t('填写收件及渠道信息')"
          :description="$t('根据分拆订单选择收件地址和下单渠道')"
        >
        </el-step>
        <el-step :title="$t('仓库打包操作')" :description="$t('等待仓库打包操作')"></el-step>
      </el-steps>
    </div>
    <h3>{{ $t('分货') }}</h3>
    <div class="distribution">
      <div>
        <el-form :inline="true" size="small">
          <el-form-item :label="$t('拆单数量')">
            <el-input v-model="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onConfirm">{{ $t('确定') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="number">
        <div>{{ $t('商品总数量') }}</div>
        <div>{{ $t('未分货数量') }}</div>
      </div>
    </div>
    <div class="goods" v-for="(item, index) in goodData" :key="index">
      <div class="left-box">
        <div style="font-size: 24px; font-weight: bold">#1</div>
        <div style="margin-top: 80px">
          <el-button type="text" @click="delbox(index)">{{ $t('删除') }}</el-button>
        </div>
      </div>
      <div class="right-box">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>{{ $t('选择商品') }}</div>
          <div>
            <el-button size="small">{{ $t('选择...') }}</el-button>
          </div>
        </div>
        <el-form :inline="true" size="small" v-if="!item.tableData">
          <el-form-item>
            <el-input v-model="code" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">{{ $t('确定') }}</el-button>
          </el-form-item>
        </el-form>
        <div v-else style="margin-top: 10px">
          <el-table :data="item.tableData" border style="width: 100%">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="date" :label="$t('操作')">
              <template>
                <el-button type="text">{{ $t('移除') }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('物品中文名称')"> </el-table-column>
            <el-table-column prop="address" :label="$t('品牌')"> </el-table-column>
            <el-table-column prop="address" :label="$t('装箱数量')"> </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 10px">
      <el-button type="primary" size="small">{{ $t('下一步') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        goods: []
      },
      number: '',
      code: '',
      nextStep: false,
      goodData: []
    }
  },
  methods: {
    onConfirm() {
      for (let i = 1; i <= this.number; i++) {
        this.goodData.push({
          tableData: []
        })
      }
    },
    delbox(index) {
      this.goodData.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.goods-container {
  background: #fff !important;
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
.distribution {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .number {
    display: flex;
  }
}
.goods {
  display: flex;
  border: 1px solid #eee;
  padding: 20px;
  width: 1200px;
  margin: 10px auto;
  .left-box {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-right: 1px solid #eee;
    padding: 0 20px;
  }
  .right-box {
    padding: 20px;
    flex: 1;
  }
}
</style>
