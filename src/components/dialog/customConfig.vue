<template>
  <el-dialog :visible.sync="show" :title="$t('自定义配置')" @close="clear">
    <el-form label-position="left" :model="form" label-width="150px">
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
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="sortCode">
        <el-input v-model="form.sortCode" class="input-sty"></el-input>
      </el-form-item>
      <el-form-item label="destinationSiteCode">
        <el-input v-model="form.destinationSiteCode" class="input-sty"></el-input>
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
        shipType: '',
        sortCode: '',
        destinationSiteCode: ''
      }
    }
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.$request.updateSelectData(this.id).then(res => {
        if (res.ret) {
          this.config = res.data
          if (
            res.data.deliveryType ||
            res.data.expressType ||
            res.data.packageType ||
            res.data.payType ||
            res.data.shipType
          ) {
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
                id: Number(item),
                name: packages[item]
              }
            })
            this.payData = Object.keys(pay).map(item => {
              return {
                value: item,
                label: pay[item]
              }
            })
            if (Array.isArray(ship)) {
              this.shipData = ship.map((item, index) => {
                return {
                  id: Number(index),
                  name: item
                }
              })
            } else {
              this.shipData = Object.keys(ship).map(item => {
                return {
                  id: Number(item),
                  name: ship[item]
                }
              })
            }
            this.getSelectData()
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
        this.form.shipType = Number(res.data.shipType)
        this.form.packageType = Number(res.data.packageType) ? Number(res.data.packageType) : ''
        this.form.deliveryType = res.data.deliveryType
        this.form.expressType = res.data.expressType
        this.form.payType = res.data.payType
        this.form.sortCode = res.data.sortCode
        this.form.destinationSiteCode = res.data.destinationSiteCode
      })
    },
    onConfirm() {
      let params = {
        ...this.form
      }
      this.$request.updateCustomData(this.id, params).then(res => {
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
      this.form.sortCode = ''
      this.form.destinationSiteCode = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.input-sty {
  width: 45%;
}
</style>
