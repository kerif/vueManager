<template>
  <el-dialog :visible.sync="show" :title="$t('添加物流信息')" class="add-batch"
  width="45%" @close="clear">
    <el-form ref="form" :model="company" label-width="140px">
        <el-form-item :label="$t('*转运快递单号：')">
            <el-input v-model="company.sn" class="input-select"></el-input>
            <el-button @click.native="goExpress" class="express-btn">{{$t('管理发货快递公司')}}</el-button>
        </el-form-item>
        <el-form-item :label="$t('*转运快递公司：')">
            <!-- <el-input v-model="company.company"></el-input> -->
             <el-select v-model="company.company" clearable
             allow-create default-first-option :placeholder="$t('请选择')">
                <el-option
                    v-for="item in companyList"
                    :key="item.id"
                    :value="item.code"
                    :label="item.name">
                </el-option>
             </el-select>
        </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      company: {
        sn: '',
        company: ''
      },
      companyList: []
    }
  },
  methods: {
    // 根据转运快递单号的值拉取相对应的转运快递公司
    getCompany () {
      this.$request.shipmentCompanies().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.companyList = res.data
            if (this.company.company === '') {
              this.company.company = this.companyList[0].code
            }
          }
        }
      })
    },
    confirm () {
      // console.log(this.company.company, 'this.company.company')
      if (this.company.sn === '') {
        return this.$message.error(this.$t('请输入转运快递单号'))
      } else if (this.company.company === '') {
        return this.$message.error(this.$t('请输入转运快递公司'))
      }
      this.$request.confirmExpress(this.id, {
        logistics_sn: this.company.sn,
        logistics_company: this.company.company
      }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('保存成功'),
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
        this.show = false
      })
    },
    goExpress () {
      this.show = false
      this.$router.push({ name: 'payment', query: { activeName: '9' } })
    },
    clear () {
      this.company.sn = ''
      this.company.company = ''
    },
    init () {
      this.getCompany()
      this.company.sn = this.logistics_sn
      this.company.company = this.logistics_company
    }
  }
}
</script>
<style lang="scss" scope>
.add-batch {
  .input-select {
    width: 40%;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .el-dialog__close {
    color: #FFF;
  }
  .el-select {
    width: 40%;
  }
  .express-btn {
    margin-left: 10px;
  }
}
</style>
