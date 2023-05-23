<template>
  <el-dialog :visible.sync="show" width="30%" :title="$t('更新物流状态')" @close="clear">
    <el-form label-position="top" :model="form" ref="form">
      <el-form-item :label="$t('物流状态')">
        <el-select
          v-model="form.logistics_type_id"
          filterable
          allow-create
          default-first-option
          class="country-select"
          :placeholder="$t('请选择')"
        >
          <el-option v-for="item in modeData" :key="item.id" :label="item.context" :value="item.id">
          </el-option>
        </el-select>
        <el-button class="type-sty" @click="goMore">{{ $t('管理') }}</el-button>
      </el-form-item>
      <el-form-item
        v-if="
          this.form.logistics_type_id &&
          !this.modeData.map(item => item.id).includes(this.form.logistics_type_id)
        "
      >
        <el-checkbox v-model="is_member">{{ $t('是否记住') }}</el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('时间')">
        <el-date-picker
          v-model="created_at"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('选择日期时间')"
        >
        </el-date-picker>
        <span style="color: red; margin-left: 5px">{{ $t('不选则默认是当前时间') }}</span>
      </el-form-item>
      <el-form-item :label="$t('备注')">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入内容')"
          v-model="logisticsRemark"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="trackDialog = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="$store.state.btnLoading" @click="changeStatus">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      trackDialog: false,
      form: {
        logistics_type_id: ''
      },
      modeData: [],
      created_at: '',
      logisticsRemark: '',
      is_member: false
    }
  },
  methods: {
    init() {
      this.getType()
    },
    clear() {
      this.form.logistics_type_id = ''
      this.logisticsRemark = ''
      this.created_at = ''
    },
    // 获取全部物流状态
    getType() {
      this.$request.getOrderStatus().then(res => {
        if (res.ret) {
          this.modeData = res.data
        }
      })
    },
    // 弹窗 管理
    goMore() {
      this.show = false
      this.close()
      this.$router.push({
        name: 'configurationMore',
        query: {
          activeName: '4',
          secondTab4: '4'
        }
      })
    },
    // 更改物流状态
    changeStatus() {
      let params = {
        order_ids: [this.orderId],
        is_member: Number(this.is_member),
        remark: this.logisticsRemark,
        created_at: this.created_at
      }
      if (this.modeData.map(item => item.id).includes(this.form.logistics_type_id)) {
        params.logistics_type_id = this.form.logistics_type_id
      } else {
        params.context = this.form.logistics_type_id
      }
      this.$request.changeOrderStatus(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.success()
          this.show = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.add-company {
  .input-select {
    width: 40%;
  }
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
  .el-select {
    width: 40%;
  }
  .express-btn {
    margin-left: 10px;
  }
}
</style>
