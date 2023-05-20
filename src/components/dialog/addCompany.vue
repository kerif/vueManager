<template>
  <el-dialog
    :visible.sync="show"
    :title="this.state === 'add' ? $t('添加物流信息') : $t('修改物流信息')"
    class="add-company"
    width="45%"
    @close="clear"
  >
    <el-form ref="form" :model="company" label-width="160px">
      <el-form-item :label="$t('*转运快递公司-二程：')">
        <el-select
          v-model="company.company"
          clearable
          allow-create
          default-first-option
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in companyList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          >
          </el-option>
        </el-select>
        <el-button @click.native="goExpress" class="express-btn">{{
          $t('管理发货快递公司')
        }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('*转运快递单号-二程：')" v-if="state == 'edit'">
        <el-input v-model="company.sn" class="input-select" @input="companySn"></el-input>
      </el-form-item>
      <div v-else>
        <div v-if="boxType === 1">
          <el-form-item :label="$t(`*快递转运单号：`)">
            <span>{{ orderSn }}</span>
            <el-input v-model="company.sn"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item v-for="item in box" :key="item.id" :label="$t(`*快递转运单号：`)">
            <span>{{ item.sn }}</span>
            <el-input v-model="item.logistics_sn"></el-input>
          </el-form-item>
        </div>
      </div>
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
      orderId: '',
      companyList: [],
      state: '',
      orderSn: '',
      box: [],
      boxType: ''
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
    companySn() {
      this.company.sn = this.company.sn.replace(/\s+/g, '')
    },
    getOrderDetails() {
      this.$request.getOrderDetails(this.orderId).then(res => {
        if (res.ret) {
          this.orderSn = res.data.order_sn
          this.boxType = res.data.box_type
          if (this.boxType === 1) {
            this.company.company = res.data.logistics_company_code
            this.company.sn = res.data.logistics_sn
          } else {
            this.company.company = res.data.box[0].logistics_company_code
            this.box = res.data.box.map(item => {
              return {
                id: item.id,
                sn: item.sn,
                logistics_sn: item.logistics_sn
              }
            })
          }
          //   res.data.box.length
          //     ? (this.box = res.data.box.map(item => {
          //         return {
          //           id: item.id,
          //           sn: item.sn,
          //           logistics_sn: item.logistics_sn
          //         }
          //       }))
          //     : (this.company.sn = res.data.logistics_sn)
        }
      })
    },
    async confirm() {
      if (!this.company.company) {
        return this.$message.error(this.$t('请输入转运快递公司二程'))
      }
      if (this.state === 'multiBox') {
        if (this.boxType === 1 && !this.company.sn)
          return this.$message.error(this.$t('请输入转运快递单号二程'))
        this.box.forEach(item => {
          if (!item.logistics_sn) {
            // return this.$message.error(this.$t('请输入转运快递单号'))
          }
        })
      } else {
        if (!this.company.sn) return this.$message.error(this.$t('请输入转运快递单号二程'))
      }
      let res = {}
      if (this.state === 'multiBox') {
        if (this.boxType === 1) {
          res = await this.$request.updateLogistics([
            {
              id: this.orderId,
              sn: this.company.sn,
              company: this.company.company
            }
          ])
        } else {
          let box = this.box.map(item => {
            return {
              id: item.id,
              logistics_sn: item.logistics_sn,
              company: this.company.company
            }
          })
          res = await this.$request.updateMultiLogistics(box)
        }
      } else {
        res = await this.$request.updateLogistics(
          this.id.map(i => ({
            id: i,
            sn: this.company.sn,
            company: this.company.company
          }))
        )
      }
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
    },
    goExpress() {
      this.show = false
      this.close()
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
      this.box = []
    },
    init() {
      this.getCompany()
      if (this.state === 'multiBox') {
        this.getOrderDetails()
      }
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
