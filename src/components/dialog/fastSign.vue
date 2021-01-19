<template>
  <el-dialog :visible.sync="show" :title="$t('快速签收')" class="fast-sign-container"
  @close="clear" width="85%">
    <el-row>
      <el-col :span="12">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8}"
        :placeholder="$t('多个包裹单号，请用回车分割')"
        v-model="textarea2">
      </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click.native="search">{{$t('查询')}}</el-button>
      </el-col>
    </el-row>
    <el-table
      class="table-sty"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        prop="username"
        :label="$t('客户ID')">
      </el-table-column>
      <!-- 转运单号 -->
      <el-table-column
        prop="username"
        :label="$t('转运单号')">
      </el-table-column>
      <!-- 收件人 -->
      <el-table-column
        prop="username"
        :label="$t('收件人')">
      </el-table-column>
      <!-- 联系电话 -->
      <el-table-column
        prop="username"
        :label="$t('联系电话')">
      </el-table-column>
      <!-- 到站时间 -->
      <el-table-column
        prop="username"
        :label="$t('到站时间')">
      </el-table-column>
      <!-- 箱数 -->
      <el-table-column
        prop="username"
        :label="$t('箱数')">
      </el-table-column>
      <!-- 重量 -->
      <el-table-column
        prop="username"
        :label="$t('重量')">
      </el-table-column>
      <!-- 尺寸/体积 -->
      <el-table-column
        prop="username"
        :label="$t('尺寸/体积')">
      </el-table-column>
      <!-- 所属发货单 -->
      <el-table-column
        prop="username"
        :label="$t('所属发货单')">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        :label="$t('操作')"
        width="190px">
        <template slot-scope="scope">
          <el-button class="btn-light-red" @click="delete(scope.row.id)">{{$t('删除')}}</el-button>
          <el-button class="btn-green" @click="goPhont">{{$t('添加签收照片')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-button class="created-btn" @click="goCreated">{{$t('创建发货单')}}</el-button> -->
    <div slot="footer">
      <!-- <el-button @click="show = false">{{$t('取消')}}</el-button> -->
      <el-button type="primary" @click="confirmShip">{{$t('确定签收')}}</el-button>
    </div>
      <!-- 创建发货单 -->
      <el-dialog :visible.sync="innerVisible" :title="$t('签收详情')" class="dialog-invoice"
      width="35%" @close="clear" append-to-body>
        <div class="receiverMSg msg-top">
        </div>
        <h4 class="change-sty">{{$t('收货人信息')}}</h4>
        <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
        label-position="right">
          <el-row class="container-center" :gutter="20">
            <!-- 客户ID -->
            <el-col :span="7">
              <span class="leftWidth">{{$t('客户ID')}}</span>
              <span>{{form.address && form.address.receiver_name}}</span>
            </el-col>
            <!-- 收件人 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('收件人')}}</span>
              <span>{{form.address &&form.address.timezone}}-{{form.address &&form.address.phone}}</span>
            </el-col>
            <!-- 邮编 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('邮编')}}</span>
              <span>{{form.address && form.address.country.cn_name}}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 电话 -->
            <el-col :span="7">
              <span class="leftWidth">{{$t('电话')}}</span>
              <span>{{form.address && form.address.receiver_name}}</span>
            </el-col>
            <!-- 收件人 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('地址')}}</span>
              <span>{{form.address &&form.address.timezone}}-{{form.address &&form.address.phone}}</span>
            </el-col>
            <!-- 邮编 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('线路类型')}}</span>
              <span>{{form.address && form.address.country.cn_name}}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 客户ID -->
            <el-col :span="7">
              <span class="leftWidth">{{$t('转运单号')}}</span>
              <span>{{form.address && form.address.receiver_name}}</span>
            </el-col>
            <!-- 收件人 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('发货时间')}}</span>
              <span>{{form.address &&form.address.timezone}}-{{form.address &&form.address.phone}}</span>
            </el-col>
            <!-- 邮编 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('自提点到货时间')}}</span>
              <span>{{form.address && form.address.country.cn_name}}</span>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button @click="returnShip">{{$t('取消')}}</el-button>
          <el-button type="primary" @click="confirmCreated('ruleForm')">{{$t('确定')}}</el-button>
        </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      innerVisible: false,
      invoiceList: [],
      invoice: {
        sn: ''
      },
      ruleForm: {
        country_id: '',
        name: '',
        remark: ''
      },
      country: [],
      tableData: [
        {
          username: 1
        }
      ],
      textarea2: '',
      form: {},
      rules: {
        country_id: [
          { required: true, message: this.$t('请输入目的地'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getName (val) {
      console.log(val)
    },
    // 创建发货单
    goPhont () {
      this.innerVisible = true
      this.show = false
    },
    // 创建发货单 取消
    returnShip () {
      this.innerVisible = false
      this.show = true
    },
    getUser () {
      this.$request.getInvoice().then(res => {
        this.invoiceList = res.data
      })
    },
    getCountry () {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    // 确认加入发货单
    confirmShip () {
      // this.textarea2.split(/[(\r\n)\r\n]+/)
      if (this.invoice.sn === '') {
        return this.$message.error(this.$t('请选择发货单'))
      }
      this.show = false
      this.success(this.invoice.sn)
      // this.$request.updateShipment(this.id, this.invoice.sn).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       type: 'success',
      //       title: '操作成功',
      //       message: res.msg
      //     })
      //     this.show = false
      //     this.success()
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      //   this.show = false
      // })
    },
    // 确认创建发货单
    confirmCreated (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$request.saveShip(this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.innerVisible = false
              this.show = true
              this.getUser()
              // this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            // this.innerVisible = false
          })
        } else {
          return false
        }
      })
    },
    delete () {},
    clear () {
      this.ruleForm.country_id = ''
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
      this.invoice.sn = ''
    },
    init () {
      this.getUser()
      this.getCountry()
    }
  }
}
</script>
<style lang="scss" scope>
.fast-sign-container{
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
  .created-btn {
    margin-left: 5px;
  }
  .content-long {
    .el-scrollbar {
      width: 200px !important;
    }
  }
  .table-sty {
    margin-top: 20px;
  }
  .container-center {
    margin-bottom: 20px;
  }
}
.el-select-dropdown__item.hover{
    width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap;/*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
</style>
