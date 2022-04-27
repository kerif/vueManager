<template>
  <div class="addPurchase-container">
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
              :disabled="$route.params.id"
              style="width: 50%"
              :placeholder="$t('单号仅限字母、数字、或下划线，长度限制15个字符')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('发货公司')" prop="logistics_company">
            <el-select
              v-model="ruleForm.logistics_company"
              :placeholder="$t('请选择发货公司')"
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
              :disabled="$route.params.id"
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
      <el-form-item v-if="this.$route.params.id">
        <el-button size="small" type="primary" @click="saveInfo">{{ $t('保存') }}</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h4>{{ $t('采购清单') }}</h4>
        <el-button type="primary" size="small" @click="addGoods">{{ $t('添加') }}</el-button>
      </div>
      <el-table :data="ruleForm.goods" border style="width: 100%" @row-click="getRowData">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="date" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-light-red" @click="delGoods(scope.$index, ruleForm.goods)">{{
              $t('删除')
            }}</el-button>
            <el-button class="btn-main" @click="editGoods(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cn_name" :label="$t('物品中文名称')"> </el-table-column>
        <el-table-column prop="en_name" :label="$t('物品英文名称')"> </el-table-column>
        <el-table-column prop="brand" :label="$t('品牌')"></el-table-column>
        <el-table-column prop="category_id" :label="$t('商品分类')"></el-table-column>
        <el-table-column prop="prop_id" :label="$t('属性')"></el-table-column>
        <el-table-column prop="purchase_price" :label="$t('物品单价')"></el-table-column>
        <el-table-column prop="quantity" :label="$t('物品明细数量')"></el-table-column>
        <el-table-column prop="box_count" :label="$t('物品总箱数')"></el-table-column>
        <el-table-column prop="box_spec" :label="$t('物品箱规')"></el-table-column>
        <el-table-column prop="barcode" :label="$t('条码')"></el-table-column>
        <el-table-column prop="image" :label="$t('物品照片')">
          <template slot-scope="scope">
            <img :src="$baseUrl.IMAGE_URL + scope.row.image" class="img" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 20px">
      <el-button type="primary" size="small" :loading="$store.state.btnLoading" @click="onSave">{{
        $t('保存并提交')
      }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        sn: '',
        logistics_sn: '',
        logistics_company: '',
        name: '',
        remark: '',
        amount: '',
        goods: []
      },
      companyList: [],
      rules: {
        sn: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }]
      }
    }
  },
  components: {},
  created() {
    this.getCompany()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.purchaseDetail(this.$route.params.id).then(res => {
        console.log(res)
        this.ruleForm = res.data
      })
    },
    getCompany() {
      this.$request.getCompanies().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.companyList = res.data
          }
        }
      })
    },
    editGoods(id) {
      console.log(id)
      dialog(
        {
          type: 'addGoods',
          id
        },
        data => {
          console.log(data)
        }
      )
    },
    getRowData(row) {
      console.log(row)
    },
    delGoods(index, rows) {
      rows.splice(index, 1)
    },
    saveInfo() {
      delete this.ruleForm.goods
      let params = { ...this.ruleForm }
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
    onSave() {
      if (!this.$route.params.id) {
        this.$request.addPurchase(this.ruleForm).then(res => {
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
      }
    },
    addGoods() {
      dialog(
        {
          type: 'addGoods'
        },
        data => {
          this.ruleForm.goods.push({ ...data })
        }
      )
    }
  }
}
</script>

<style lang="scss">
.addPurchase-container {
  background: #fff !important;
}
.img {
  width: 30px;
}
</style>
