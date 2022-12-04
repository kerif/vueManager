<template>
  <el-dialog :visible.sync="show" :title="$t('包裹变更')" @close="clear" width="60%">
    <el-form :model="ruleForm" label-width="100px" ref="ruleForm" :rules="rules">
      <el-form-item :label="$t('快递单号')">
        <div>{{ ruleForm.express_num }}</div>
      </el-form-item>
      <el-form-item :label="$t('客户')">
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          :placeholder="$t('请输入客户ID')"
          v-model="ruleForm.user_id"
        >
        </el-autocomplete>
      </el-form-item>
      <el-form-item :label="$t('仓库')">
        <el-select v-model="ruleForm.warehouse_id" :placeholder="$t('请选择仓库')">
          <el-option
            v-for="item in warehouseData"
            :key="item.id"
            :label="item.warehouse_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      warehouseData: [],
      ruleForm: {
        warehouse_id: '',
        user_id: '',
        express_num: ''
      },
      packageData: [],
      rules: {
        user_id: [{ required: true, message: this.$t('请输入客户ID'), trigger: 'blur' }],
        warehouse_id: [{ required: true, message: this.$t('请选择仓库'), trigger: 'change' }]
      }
    }
  },
  methods: {
    init() {
      this.getWarehouse()
      if (this.packageData) {
        this.ruleForm.express_num = this.packageData.map(item => item.express_num).join(',')
      }
    },
    getWarehouse() {
      this.$request.getSimpleWarehouse().then(res => {
        this.warehouseData = res.data
      })
    },
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .Automatic({
          keyword: this.ruleForm.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback && callback(list)
        })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.ruleForm.express_num = this.packageData.map(item => item.express_num).join(',')
          let params = {
            user_id: this.ruleForm.user_id.substring(0, 6),
            warehouse_id: this.ruleForm.warehouse_id,
            ids: this.packageData.map(item => item.id)
          }
          this.$request.batchAffilication(params).then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.show = false
              this.success()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.express_num = ''
      this.ruleForm.user_id = ''
      this.ruleForm.warehouse_id = ''
    }
  }
}
</script>

<style></style>
