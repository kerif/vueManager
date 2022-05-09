<template>
  <div class="purchaseDetail-container">
    <div class="purchase-top">
      <h3>{{ $t('采购单详细') }}</h3>
      <div style="margin-left: 30px">
        <span>{{ $t('状态') + ':' }}</span
        ><span style="font-weight: bold; font-size: 24px">{{ ruleForm.status_name }}</span>
      </div>
    </div>
    <div v-if="ruleForm.status === 0">
      <el-row :gutter="20">
        <el-col :span="12">
          <h4>{{ $t('基本信息') }}</h4>
        </el-col>
        <el-col :span="12">
          <h4>{{ $t('发货信息') }}</h4>
        </el-col>
      </el-row>
      <el-form label-width="120px" :model="ruleForm" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('PO单号')" prop="sn">
              <el-input
                v-model="ruleForm.sn"
                style="width: 50%"
                maxlength="15"
                onkeyup="ruleForm.sn = ruleForm.sn.replace(/[^_A-Za-z0-9-]/,'')"
                disabled
                :placeholder="$t('单号仅限字母、数字、或下划线，长度限制15个字符')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('发货公司')" prop="logitics_company_code">
              <el-select
                :placeholder="$t('请选择发货公司')"
                v-model="ruleForm.logitics_company_code"
                style="width: 50%"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('PO单号名称')" prop="name">
              <el-input
                v-model="ruleForm.name"
                style="width: 50%"
                maxlength="30"
                disabled
                :placeholder="$t('长度限制30个字符')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('物流单号')" prop="logistics_sn">
              <el-input
                v-model="ruleForm.logistics_sn"
                style="width: 50%"
                :placeholder="$t('请输入物流单号')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('采购总金额')" prop="amount">
              <el-input
                v-model="ruleForm.amount"
                style="width: 50%"
                :placeholder="$t('请输入')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('收货仓库')" prop="warehouse_id">
              <el-select v-model="ruleForm.warehouse_id" clearable :placeholder="$t('请选择')">
                <el-option
                  v-for="item in agentData"
                  :key="item.id"
                  :value="item.id"
                  :label="item.warehouse_name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('采购备注')" prop="remark">
              <el-input
                v-model="ruleForm.remark"
                type="textarea"
                style="width: 50%"
                :placeholder="$t('请输入')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-else>
      <purchase-info :form="ruleForm">
        <template v-slot:btn>
          <el-button
            size="small"
            class="btn-deep-blue"
            v-if="ruleForm.status === 1"
            @click="addShipInfo"
            style="margin-left: 40px"
            >{{ $t('添加') }}</el-button
          >
        </template>
      </purchase-info>
    </div>
    <div style="margin-top: 20px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('采购清单') }}</span>
          <el-button
            class="btn-main"
            v-if="ruleForm.status === 0"
            style="float: right"
            @click="addGood('add')"
            >{{ $t('添加') }}</el-button
          >
        </div>
        <el-table :data="ruleForm.goods" border style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column :label="$t('操作')" width="180">
            <template slot-scope="scope">
              <el-button class="btn-light-red" v-if="ruleForm.status === 0">{{
                $t('删除')
              }}</el-button>
              <el-button
                class="btn-main"
                @click="editGoods(scope.$index, scope.row, 'edit')"
                v-if="ruleForm.status === 0"
                >{{ $t('编辑') }}</el-button
              >
              <el-button
                class="btn-deep-blue"
                v-if="ruleForm.status !== 0"
                @click="editDetail(scope.row)"
                >{{ $t('详情') }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="cn_name" :label="$t('物品中文名称')"> </el-table-column>
          <el-table-column prop="en_name" :label="$t('物品英文名称')"> </el-table-column>
          <el-table-column prop="brand" :label="$t('品牌')"></el-table-column>
          <el-table-column prop="category_name" :label="$t('商品分类')"></el-table-column>
          <el-table-column prop="prop_name" :label="$t('属性')"></el-table-column>
          <el-table-column prop="purchase_price" :label="$t('物品单价')"></el-table-column>
          <el-table-column prop="quantity" :label="$t('物品明细数量')"></el-table-column>
          <el-table-column prop="box_count" :label="$t('物品总箱数')"></el-table-column>
          <el-table-column prop="box_spec" :label="$t('物品箱规')"></el-table-column>
          <el-table-column prop="barcode" :label="$t('条码')"></el-table-column>
          <el-table-column prop="image" :label="$t('物品照片')">
            <template slot-scope="scope">
              <img
                :src="$baseUrl.IMAGE_URL + scope.row.image"
                @click="checkImg(scope.row.image)"
                class="img"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div
      style="margin-top: 20px"
      v-if="ruleForm.status === 4 || ruleForm.status === 5 || ruleForm.status === 10"
    >
      <h4>{{ $t('分货清单') }}</h4>
      <el-table :data="ruleForm.orders" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button size="small" class="btn-main" @click="viewDetail(scope.row)">{{
              $t('详情')
            }}</el-button>
            <el-button
              size="small"
              v-if="scope.row.status === 19"
              class="btn-light-green"
              @click="viewDetail"
              >{{ $t('恢复') }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" :label="$t('打包单号')">
          <template slot-scope="scope">
            <span class="choose-order" @click="orderDetail(scope.row.id)">{{
              scope.row.order_sn
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('转运单状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{ $t('待处理') }}</span>
            <span v-if="scope.row.status === 2">{{ $t('待支付') }}</span>
            <span v-if="scope.row.status === 3">{{ $t('待发货') }}</span>
            <span v-if="scope.row.status === 4">{{ $t('已发货') }}</span>
            <span v-if="scope.row.status === 5">{{ $t('已签收') }}</span>
            <span v-if="scope.row.status === 19">{{ $t('已作废') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qty" :label="$t('商品数量')"></el-table-column>
        <el-table-column prop="declare_value" :label="$t('总价值')"></el-table-column>
        <el-table-column prop="country_name" :label="$t('目的地')">
          <template slot-scope="scope">
            {{ scope.row.address && scope.row.address.country_name }}
          </template>
        </el-table-column>
        <el-table-column prop="receiver_name" :label="$t('收件人')">
          <template slot-scope="scope">
            {{ scope.row.address && scope.row.address.receiver_name }}
          </template>
        </el-table-column>
        <el-table-column prop="express_line.name" :label="$t('下单渠道')"></el-table-column>
        <el-table-column prop="payment_mode" :label="$t('付款方式')">
          <template slot-scope="scope">
            <span class="payment-sty" v-if="scope.row.payment_mode === 2">{{
              $t('货到付款')
            }}</span>
            <span v-else>{{ $t('预付') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('创建时间')"></el-table-column>
        <el-table-column prop="customer_name" :label="$t('创建人')"></el-table-column>
      </el-table>
    </div>
    <operate-log :logs="ruleForm.logs"></operate-log>
    <div style="margin-top: 20px">
      <el-button
        size="small"
        v-if="ruleForm.status === 0 || ruleForm.status === 1 || ruleForm.status === 2"
        class="btn-light-red"
        @click="onDelete"
        >{{ $t('删除') }}</el-button
      >
      <el-button
        size="small"
        v-if="ruleForm.status === 0"
        class="btn-deep-blue"
        @click="saveGoods"
        :loading="$store.state.btnLoading"
        >{{ $t('保存') }}</el-button
      >
      <el-button
        size="small"
        v-if="ruleForm.status === 0"
        class="btn-deep-blue"
        @click="onSubmit"
        :loading="$store.state.btnLoading"
        >{{ $t('保存并提交') }}</el-button
      >
      <el-button
        size="small"
        @click="addShipInfo"
        v-if="ruleForm.status === 1"
        class="btn-deep-purple"
        >{{ $t('添加发货信息') }}</el-button
      >
      <el-button
        size="small"
        @click="storage"
        v-if="ruleForm.status === 2"
        class="btn-blue-green"
        >{{ $t('入库') }}</el-button
      >
      <el-button
        size="small"
        v-if="ruleForm.status === 3"
        class="btn-light-red"
        @click="onInvalid"
        >{{ $t('作废') }}</el-button
      >
      <el-button size="small" v-if="ruleForm.status === 3" class="btn-blue-green">{{
        $t('入库信息')
      }}</el-button>
      <el-button
        size="small"
        v-if="ruleForm.status === 3"
        class="btn-green"
        @click="editDistributionGoods"
        >{{ $t('分货') }}</el-button
      >
      <el-button size="small" v-if="ruleForm.status === 10" class="btn-main">{{
        $t('恢复')
      }}</el-button>
    </div>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import purchaseInfo from './components/purchaseInfo.vue'
import operateLog from './components/operateLog.vue'
export default {
  data() {
    return {
      ruleForm: {
        sn: '',
        logistics_sn: '',
        logitics_company_code: '',
        warehouse_id: '',
        amount: '',
        name: '',
        remark: '',
        logs: [],
        goods: [],
        orders: []
      },
      rules: {
        sn: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }]
      },
      ids: '',
      showGoods: false,
      companyList: [],
      agentData: [],
      imgVisible: false,
      imgSrc: ''
    }
  },
  components: {
    purchaseInfo,
    operateLog
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
    this.getCompany()
    this.getWarehouse()
  },
  methods: {
    getList() {
      this.$request.purchaseDetail(this.$route.params.id).then(res => {
        console.log(res)
        this.ruleForm = res.data
        this.ids = res.data.package.id
      })
    },
    checkImg(url) {
      this.imgVisible = true
      this.imgSrc = this.$baseUrl.IMAGE_URL + url
    },
    getWarehouse() {
      this.$request.getSimpleWarehouse().then(res => {
        this.agentData = res.data
      })
    },
    storage() {
      this.$router.push({
        name: 'editStorage',
        params: { id: this.ids },
        query: { sn: this.ruleForm.logistics_sn }
      })
    },
    viewDetail(row) {
      console.log(row)
      dialog({
        type: 'distributionDetail',
        row
      })
    },
    deleteTable(index, rows) {
      rows.splice(index, 1)
    },
    orderDetail(id) {
      this.$router.push({
        name: 'billDetails',
        params: {
          id
        }
      })
    },
    saveGoods() {
      delete this.ruleForm.logs
      let params = { ...this.ruleForm, is_approved: 0 }
      console.log(params)
      this.$request.editPurchase(this.$route.params.id, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    saveInfo() {
      delete this.ruleForm.logs
      let params = { ...this.ruleForm, is_approved: 1 }
      console.log(params)
      this.$request.editPurchase(this.$route.params.id, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    editDistributionGoods() {
      this.$router.push({
        name: 'distributionGoods',
        params: { id: this.$route.params.id }
      })
    },
    editDetail(row) {
      console.log(row)
      dialog({
        type: 'purchaseDetails',
        row
      })
    },
    getCompany() {
      this.$request.getExpressData().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.companyList = res.data
          }
        }
      })
    },
    editGoods(index, row, state) {
      dialog(
        {
          type: 'addGoods',
          purchase: JSON.parse(JSON.stringify(row)),
          state
        },
        data => {
          console.log(data)
          this.ruleForm.goods[index] = data
          this.$set(this.ruleForm.goods, index, data)
        }
      )
    },
    onDelete() {
      this.$request.deletPurchase(this.$route.params.id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onInvalid() {
      this.$request.invalidPurchase(this.$route.params.id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    addGood(state) {
      dialog(
        {
          type: 'addGoods',
          state
        },
        data => {
          this.ruleForm.goods.push({ ...data })
        }
      )
    },
    onSubmit() {
      this.$request.submitPurchase(this.$route.params.id).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    addShipInfo() {
      dialog({
        type: 'addShip',
        id: this.$route.params.id
      })
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
  .choose-order {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .img {
    width: 30px;
    cursor: pointer;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
}
</style>
