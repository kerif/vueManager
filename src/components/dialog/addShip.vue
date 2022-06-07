<template>
  <el-dialog :visible.sync="show" :title="$t('添加发货信息')" @close="clear">
    <el-form :model="form">
      <el-form-item :label="$t('发货公司')">
        <el-select v-model="form.logistics_company_code" :placeholder="$t('请选择')">
          <el-option
            v-for="item in companyList"
            :key="item.num"
            :label="item.name"
            :value="item.num"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('物流单号')">
        <el-input v-model="form.logistics_sn" style="width: 45%"></el-input>
      </el-form-item>
      <el-form-item :label="$t('收货仓库')">
        <el-select v-model="form.warehouse_id" clearable :placeholder="$t('请选择')">
          <el-option
            v-for="item in agentData"
            :key="item.id"
            :value="item.id"
            :label="item.warehouse_name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确认发货') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      form: {
        logistics_company_code: '',
        logistics_sn: '',
        warehouse_id: ''
      },
      logistics_sn: '',
      logistics_company_code: '',
      warehouse_id: '',
      companyList: [],
      agentData: []
    }
  },
  methods: {
    init() {
      console.log(this.logistics_company_code, 111)
      this.form.logistics_sn = this.logistics_sn
      this.form.logistics_company_code = this.logistics_company_code
      this.form.warehouse_id = this.warehouse_id
      this.form.warehouse_id = this.warehouse_name
      this.getCompany()
      this.getWarehouse()
    },
    getWarehouse() {
      this.$request.getSimpleWarehouse().then(res => {
        this.agentData = res.data
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
    confirm() {
      this.$request.deliverGoods(this.id, this.form).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
          this.$router.push({ name: 'purchaseOrder' })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.id = ''
      this.form.logistics_company = ''
      this.form.logistics_sn = ''
      this.form.warehouse_id = ''
    }
  }
}
</script>

<style></style>
