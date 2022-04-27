<template>
  <el-dialog :title="id ? $t('修改补款单') : $t('创建补款单')" :visible.sync="show" @close="clear">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item :label="$t('关联订单号')" prop="order_sn">
        <span v-if="id">{{ form.order_sn }}</span>
        <el-input v-else v-model="form.order_sn" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('补款类型')" prop="type_id">
        <el-select v-model="form.type_id" :placeholder="$t('请选择')">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('订单保价价值')" prop="amount" v-if="form.type_id === 1">
        <el-input v-model="form.order_value"></el-input>
      </el-form-item>
      <el-form-item :label="$t('保险金额')" prop="order_value" v-if="form.type_id === 1">
        <el-input v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item :label="$t('补款金额')" prop="amount" v-if="form.type_id !== 1">
        <el-input v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item :label="$t('备注')" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入备注')"
          v-model="form.remark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="$store.state.btnLoading" @click="submit">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        order_sn: '',
        type_id: '',
        amount: '',
        remark: '',
        order_value: ''
      },
      id: '',
      order_sn: '',
      options: [
        {
          id: 1,
          name: this.$t('保险费用')
        },
        {
          id: 2,
          name: this.$t('运费补差')
        },
        {
          id: 3,
          name: this.$t('其他费用')
        }
      ]
    }
  },
  methods: {
    init() {
      this.getSupplementDetail()
    },
    getSupplementDetail() {
      this.$request.getReplenishDeatil(this.id).then(res => {
        console.log(res)
        this.options.forEach(item => {
          if (item.name === res.data.type_name) {
            this.form.type_id = item.id
          }
        })
        this.form.order_sn = res.data.order_sn
        this.form.amount = res.data.amount
        this.form.remark = res.data.remark
        this.form.order_value = res.data.order_value
      })
    },
    submit() {
      if (this.id) {
        this.$request.updateReplenish(this.id, this.form).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.createReplenish(this.form).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    clear() {
      this.id = ''
      this.form.order_sn = ''
      this.form.type_id = ''
      this.form.amount = ''
      this.form.remark = ''
      this.form.order_value = ''
    }
  }
}
</script>

<style lang="scss">
.el-dialog__header {
  background-color: #0e102a;
}
.el-dialog__title {
  font-size: 14px;
  color: #fff;
}
.el-dialog__close {
  color: #fff;
}
</style>
