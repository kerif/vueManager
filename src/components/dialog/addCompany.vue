<template>
  <el-dialog
    :visible.sync="show"
    :title="this.state === 'add' ? $t('添加物流信息') : $t('修改物流信息')"
    class="add-company"
    width="45%"
    @close="clear"
  >
    <el-form ref="form" :model="company" label-width="160px">
      <el-form-item :label="$t('*转运快递单号-二程：')">
        <el-input v-model="company.sn" class="input-select"></el-input>
        <el-button @click.native="goExpress" class="express-btn">{{
          $t('管理发货快递公司')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('*转运快递公司-二程：')">
        <!-- <el-input v-model="company.company"></el-input> -->
        <el-select
          v-model="company.company"
          clearable
          allow-create
          default-first-option
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :value="item.code"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      company: {
        sn: '',
        company: ''
      },
      companyList: [],
      state: ''
    }
  },
  methods: {
    // 根据转运快递单号的值拉取相对应的转运快递公司
    getCompany() {
      this.$request.getCompanies().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.companyList = res.data
            if (this.company.company === '') {
              this.company.company = this.companyList[0].code
              console.log(this.company.company, 'this.company.company')
            }
          }
        }
      })
    },
    // 获取当前值
    getList() {
      this.$request.getInfo(this.id).then(res => {
        if (res.ret) {
          this.company.sn = res.data.logistics_sn
          this.company.company = res.data.code
        }
      })
    },
    confirm() {
      if (this.company.sn === '') {
        return this.$message.error(this.$t('请输入转运快递单号二程'))
      } else if (this.company.company === '') {
        return this.$message.error(this.$t('请输入转运快递公司二程'))
      }
      this.$request
        .updateLogistics(
          this.id.map(i => ({
            id: i,
            sn: this.company.sn,
            company: this.company.company
          }))
        )
        .then(res => {
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
    goExpress() {
      this.show = false
      this.$router.push({
        name: 'configurationMore',
        query: {
          activeName: '4',
          secondTab4: '3'
        }
      })
    },
    clear() {
      this.company.sn = ''
      this.company.company = ''
    },
    init() {
      this.getCompany()
      // this.getList()
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
