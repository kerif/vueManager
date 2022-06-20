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
          <el-form-item :label="$t('PO单号')">
            <el-input
              v-model="ruleForm.sn"
              maxlength="30"
              style="width: 50%"
              :placeholder="$t('请输入')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('发货公司')" prop="logistics_company_code">
            <el-select
              v-model="ruleForm.logistics_company_code"
              :placeholder="$t('请选择发货公司')"
              style="width: 50%"
              @change="changeCode"
            >
              <el-option
                v-for="item in companyList"
                :key="item.num"
                :label="item.name"
                :value="item.num"
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
              maxlength="30"
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
        <el-col :span="12">
          <el-form-item :label="$t('收货仓库')" prop="warehouse_id">
            <el-select
              v-model="ruleForm.warehouse_id"
              style="width: 50%"
              clearable
              :placeholder="$t('请选择')"
            >
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
    <div style="margin-top: 20px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('采购清单') }}</span>
          <el-button
            class="btn-main"
            style="float: right; margin-left: 5px"
            @click="addGood('add')"
            >{{ $t('添加') }}</el-button
          >
          <el-button class="btn-light-red" style="float: right" @click="onImport(1)">{{
            $t('批量导入')
          }}</el-button>
        </div>
        <el-table :data="ruleForm.goods" border style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="date" :label="$t('操作')" width="150">
            <template slot-scope="scope">
              <el-button class="btn-light-red" @click="delGoods(scope.$index, ruleForm.goods)">{{
                $t('删除')
              }}</el-button>
              <el-button class="btn-main" @click="editGoods(scope.$index, scope.row, 'edit')">{{
                $t('编辑')
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="number" :label="$t('编号')"></el-table-column>
          <el-table-column prop="cn_name" :label="$t('物品中文名称')"> </el-table-column>
          <el-table-column prop="en_name" :label="$t('物品英文名称')"> </el-table-column>
          <el-table-column prop="material" :label="$t('材质')"></el-table-column>
          <el-table-column prop="casing" :label="$t('包装')"></el-table-column>
          <el-table-column prop="color" :label="$t('颜色')"></el-table-column>
          <el-table-column prop="purchase_price" :label="$t('物品单价')"></el-table-column>
          <el-table-column prop="quantity" :label="$t('物品明细数量')"></el-table-column>
          <el-table-column prop="box_count" :label="$t('物品总箱数')"></el-table-column>
          <el-table-column prop="barcode" label="barcode"></el-table-column>
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
    <div style="margin-top: 20px">
      <el-button type="primary" size="small" :loading="$store.state.btnLoading" @click="onSave">{{
        $t('保存')
      }}</el-button>
      <el-button type="primary" size="small" :loading="$store.state.btnLoading" @click="onSubmit">{{
        $t('保存并提交')
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
export default {
  data() {
    return {
      ruleForm: {
        sn: '',
        logistics_sn: '',
        logitics_company_code: '',
        warehouse_id: '',
        name: '',
        remark: '',
        amount: '',
        goods: []
      },
      agentData: [],
      companyList: [],
      imgVisible: false,
      imgSrc: '',
      state: '',
      rules: {
        sn: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        amount: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCompany()
    this.getWarehouse()
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
      this.$request.getExpressData().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.companyList = res.data
          }
        }
      })
    },
    getWarehouse() {
      this.$request.getSimpleWarehouse().then(res => {
        this.agentData = res.data
      })
    },
    changeCode(val) {
      console.log(val)
    },
    checkImg(url) {
      this.imgVisible = true
      this.imgSrc = this.$baseUrl.IMAGE_URL + url
    },
    editGoods(index, row, state) {
      console.log(row)
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
    delGoods(index, rows) {
      rows.splice(index, 1)
    },
    onImport(mode) {
      dialog(
        {
          type: 'distributeScheme',
          mode
        },
        goodsData => {
          this.ruleForm.goods.push(...goodsData)
        }
      )
    },
    onSave() {
      console.log(this.ruleForm.logitics_company_code)
      let params = {
        ...this.ruleForm,
        is_approved: 0
      }
      if (!this.$route.params.id) {
        this.$request.addPurchase(params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.push({ name: 'purchaseOrder' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.editPurchase(this.$route.params.id, params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.push({ name: 'purchaseOrder' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    onSubmit() {
      let params = { ...this.ruleForm, is_approved: 1 }
      if (!this.$route.params.id) {
        this.$request.addPurchase(params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.push({ name: 'purchaseOrder', query: { activeName: this.status++ } })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.editPurchase(this.$route.params.id, params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.push({ name: 'purchaseOrder' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    addGood(state) {
      dialog(
        {
          type: 'addGoods',
          state
        },
        data => {
          console.log(data)
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
  min-height: calc(100vh - 150px);
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
</style>
