<template>
  <el-dialog :visible.sync="show" :title="$t('自定义配置')" @close="clear">
    <el-form label-position="left" :model="form">
      <el-form-item label="deliveryType" v-if="this.config.deliveryType">
        <el-select v-model="form.deliveryType">
          <el-option
            v-for="item in deliveryData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="expressType" v-if="this.config.expressType">
        <el-select v-model="form.expressType">
          <el-option
            v-for="item in expressData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="packageType" v-if="this.config.packageType">
        <el-select v-model="form.packageType">
          <el-option
            v-for="item in packageData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="payType" v-if="this.config.payType">
        <el-select v-model="form.payType">
          <el-option
            v-for="item in payData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="shipType" v-if="this.config.shipType">
        <el-select v-model="form.shipType">
          <el-option
            v-for="item in shipData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('保存') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      config: {},
      deliveryData: [],
      expressData: [],
      packageData: [],
      payData: [],
      shipData: [],
      form: {
        deliveryType: '',
        expressType: '',
        packageType: '',
        payType: '',
        shipType: ''
      }
    }
  },
  methods: {
    init() {
      this.getList()
      if (this.id) {
        this.getSelectData()
      }
    },
    getList() {
      this.$request.updateSelectData(this.id).then(res => {
        if (res.ret) {
          this.config = res.data
          if (this.config) {
            console.log(res)
            let deliver = res.data.deliveryType
            let express = res.data.expressType
            let packages = res.data.packageType
            let pay = res.data.payType
            let ship = res.data.shipType
            this.deliveryData = Object.keys(deliver).map(item => {
              return {
                value: item,
                label: deliver[item]
              }
            })
            this.expressData = Object.keys(express).map(item => {
              return {
                value: item,
                label: express[item]
              }
            })
            this.packageData = Object.keys(packages).map(item => {
              return {
                value: +item,
                label: packages[item]
              }
            })
            this.payData = Object.keys(pay).map(item => {
              return {
                value: item,
                label: pay[item]
              }
            })
            this.shipData = Object.keys(ship).map(item => {
              return {
                value: +item,
                label: ship[item]
              }
            })
          }
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getSelectData() {
      this.$request.customData(this.id).then(res => {
        this.shipData.forEach(item => {
          if (item.value === +res.data.shipType) {
            this.form.shipType = item.label
          }
        })
        this.packageData.forEach(item => {
          if (item.value === +res.data.packageType) {
            this.form.packageType = item.label
          }
        })
        this.form.deliveryType = res.data.deliveryType
        this.form.expressType = res.data.expressType
        this.form.payType = res.data.payType
      })
    },
    onConfirm() {
      this.$request.updateCustomData(this.id, this.form).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    clear() {
      this.form.deliveryType = ''
      this.form.expressType = ''
      this.form.packageType = ''
      this.form.payType = ''
      this.form.shipType = ''
    }
  }
}
</script>

<style></style>
