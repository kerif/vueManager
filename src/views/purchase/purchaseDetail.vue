<template>
  <div class="purchaseDetail-container">
    <div class="purchase-top">
      <h3>{{ $t('采购单详细') }}</h3>
      <div style="margin-left: 30px">
        <span>{{ $t('状态') + ':' }}</span
        ><span style="font-weight: bold; font-size: 24px">{{ ruleForm.status_name }}</span>
      </div>
    </div>
    <div v-if="ruleForm.status === 1">
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
                :placeholder="$t('单号仅限字母、数字、或下划线，长度限制15个字符')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('发货公司')" prop="logistics_company">
              <el-select
                :placeholder="$t('请选择发货公司')"
                v-model="ruleForm.logistics_company"
                style="width: 50%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
      <div class="purchase-title">
        <div style="width: 50%">
          <h4>{{ $t('基本信息') }}</h4>
        </div>
        <div style="width: 50%">
          <div>
            <h4 style="display: inline-block">{{ $t('发货信息') }}</h4>
            <el-button
              size="small"
              v-if="ruleForm.status === 2"
              class="btn-deep-blue"
              style="margin-left: 40px"
              >{{ $t('添加') }}</el-button
            >
            <el-button
              size="small"
              v-if="ruleForm.status === 3"
              class="btn-deep-blue"
              style="margin-left: 40px"
              >{{ $t('修改') }}</el-button
            >
          </div>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <span class="purchase-item"><span class="icon">*</span>{{ $t('PO单号') }}</span
            ><span>{{ ruleForm.sn }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span class="purchase-item">{{ $t('发货公司') }}</span
            ><span>{{ ruleForm.logistics_company }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <span class="purchase-item"><span class="icon">*</span>{{ $t('PO单号名称') }}</span
            ><span>{{ ruleForm.name }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <span class="purchase-item">{{ $t('物流单号') }}</span
            ><span>{{ ruleForm.logistics_sn }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <span class="purchase-item"><span class="icon">*</span>{{ $t('采购总金额') }}</span
            ><span>{{ ruleForm.amount }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <span class="purchase-item">{{ $t('采购备注') }}</span
            ><span>{{ ruleForm.remark }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h4>{{ $t('采购清单') }}</h4>
        <el-button type="primary" size="small" @click="addGoods">{{ $t('添加') }}</el-button>
      </div>
      <el-table :data="ruleForm.goods" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
            <el-button class="btn-main">{{ $t('编辑') }}</el-button>
            <el-button class="btn-deep-blue" @click="editDetail(scope.row.id)">{{
              $t('详情')
            }}</el-button>
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
            <img :src="$baseUrl.IMAGE_URL + scope.row.image" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      style="margin-top: 20px"
      v-if="ruleForm.status === 5 || ruleForm.status === 10 || ruleForm.status === ''"
    >
      <h4>{{ $t('分货清单') }}</h4>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column :label="$t('操作')">
          <template>
            <el-button size="small" @click="viewDetail">{{ $t('详情') }}</el-button>
            <el-button size="small" @click="viewDetail">{{ $t('恢复') }}</el-button>
            <el-button size="small" @click="viewDetail">{{ $t('删除') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="number" :label="$t('打包单号')"> </el-table-column>
        <el-table-column prop="address" :label="$t('转运单状态')"> </el-table-column>
        <el-table-column prop="address" :label="$t('商品数量')"></el-table-column>
        <el-table-column prop="address" :label="$t('总价值')"></el-table-column>
        <el-table-column prop="address" :label="$t('目的地')"></el-table-column>
        <el-table-column prop="address" :label="$t('收件人')"></el-table-column>
        <el-table-column prop="address" :label="$t('下单渠道')"></el-table-column>
        <el-table-column prop="address" :label="$t('付款方式')"></el-table-column>
        <el-table-column prop="address" :label="$t('创建时间')"></el-table-column>
        <el-tabel-column prop="address" :label="$t('创建人')"></el-tabel-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <h4>{{ $t('操作日志') }}</h4>
      <el-table :data="ruleForm.logs" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="action_name" :label="$t('行为')"> </el-table-column>
        <el-table-column prop="created_at" :label="$t('日期')"> </el-table-column>
      </el-table>
    </div>
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
        :loading="$store.state.btnLoading"
        >{{ $t('保存') }}</el-button
      >
      <el-button
        size="small"
        v-if="ruleForm.status === 0"
        class="btn-deep-blue"
        :loading="$store.state.btnLoading"
        >{{ $t('保存并提交') }}</el-button
      >
      <el-button size="small" v-if="ruleForm.status === 1" class="btn-deep-purple">{{
        $t('添加发货信息')
      }}</el-button>
      <el-button size="small" v-if="ruleForm.status === 2" class="btn-blue-green">{{
        $t('入库')
      }}</el-button>
      <el-button size="small" v-if="ruleForm.status === 2" class="btn-green">{{
        $t('修改发货信息')
      }}</el-button>
      <el-button
        size="small"
        v-if="ruleForm.status === 3 || ruleForm.status === 4"
        class="btn-light-red"
        @click="onInvalid"
        >{{ $t('作废') }}</el-button
      >
      <el-button size="small" v-if="ruleForm.status === 3" class="btn-blue-green">{{
        $t('入库信息')
      }}</el-button>
      <el-button size="small" v-if="ruleForm.status === 3" class="btn-green">{{
        $t('分货')
      }}</el-button>
      <el-button
        size="small"
        v-if="ruleForm.status === 4"
        @click="editDistributionGoods"
        class="btn-green"
        >{{ $t('编辑分货') }}</el-button
      >
      <el-button size="small" v-if="ruleForm.status === 4" class="btn-green">{{
        $t('提交为转运单')
      }}</el-button>
      <el-button size="small" v-if="ruleForm.status === 10" class="btn-main">{{
        $t('恢复')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      tableData: [],
      ruleForm: {
        sn: '',
        logistics_company: '',
        amount: '',
        name: '',
        remark: '',
        logs: [],
        goods: []
      },
      rules: {
        sn: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }]
      },
      showGoods: false
    }
  },
  components: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.purchaseDetail(this.$route.params.id).then(res => {
        console.log(res)
        this.ruleForm = res.data
      })
    },
    viewDetail() {
      this.$router.push({
        name: 'distributeDetail'
      })
    },
    editDistributionGoods() {
      this.$router.push({
        name: 'distributionGoods'
      })
    },
    editDetail(id) {
      console.log(id)
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
    addGoods() {
      dialog({
        type: 'addGoods'
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
