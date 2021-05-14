<template>
  <el-dialog :visible.sync="show" :title="$t('新增授权')" class="dialog-group" @close="clear">
    <el-form :model="user" :rules="rules" ref="user" class="demo-ruleForm">
      <!-- 员工组中文名 -->
      <el-form-item :label="$t('客户ID')" prop="user_id">
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :placeholder="$t('请输入客户ID')"
          v-model="user.user_id"
        >
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div class="add-main" v-if="this.detailsData.id">
      <el-row :gutter="20">
        <el-col :span="10" class="main-padding">
          <span>{{ $t('客户ID') }}</span>
          <span class="main-left">{{ detailsData.id }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('客户昵称') }}</span>
          <span class="main-left">{{ detailsData.name }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('邮箱') }}</span>
          <span class="main-left">{{ detailsData.email }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('手机') }}</span>
          <span class="main-left">{{ detailsData.phone }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('余额') }}</span>
          <span class="main-left">{{ detailsData.balance }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('客户组') }}</span>
          <span class="main-left">{{
            detailsData.user_group && detailsData.user_group.name_cn
          }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('注册时间') }}</span>
          <span class="main-left">{{ detailsData.created_at }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('最后登录时间') }}</span>
          <span class="main-left">{{ detailsData.last_login_at }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('邀请人') }}</span>
          <span class="main-left">{{ detailsData.invitor }}</span>
        </el-col>
        <el-col :span="10" class="main-padding">
          <span>{{ $t('微信') }}</span>
          <span class="main-left">{{
            detailsData.addresses && detailsData.addresses.wechat_id
          }}</span>
        </el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button @click="cancelDialog('user')">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('user')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      user: {
        user_id: ''
      },
      staff: '',
      supplierId: '',
      id: '',
      detailsData: {},
      rules: {
        user_id: [{ required: true, message: this.$t('请输入客户ID'), trigger: 'change' }]
      }
    }
  },
  methods: {
    queryCNSearch(queryString, callback) {
      console.log(this.user.user_id)
      var list = [{}]
      this.$request
        .getClaimList({
          keyword: this.user.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            // i.value = i.id
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback(list)
        })
    },
    handleSelect(item) {
      this.supplierId = item.id
      console.log(this.supplierId, 'this.supplierId')
      if (this.supplierId) {
        this.getDetails()
      }
      this.supplierName = item.name
    },
    // 获取客户详细信息
    getDetails() {
      this.$request.getUserDetails(this.supplierId).then(res => {
        if (res.ret) {
          this.detailsData = res.data
          console.log(this.detailsData, '111')
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm(formName) {
      console.log('supplierId', this.supplierId)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .addConfiguration({
              user_id: this.supplierId
            })
            .then(res => {
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
              this.show = false
            })
        } else {
          return false
        }
      })
    },
    clear() {
      this.user.user_id = ''
      this.detailsData = {}
      this.$refs['user'].resetFields()
      this.$refs['user'].clearValidate()
      console.log(this.detailsData, 'detailsData')
    },
    cancelDialog(user) {
      this.$refs[user].resetFields()
      this.show = false
    },
    init() {}
  }
}
</script>
<style lang="scss">
.dialog-group {
  // .changeQuery {
  //   .el-autocomplete {
  //     width: 100%;
  //   }
  // }
  .el-form-item__label {
    // width: 200px;
  }
  .el-form-item__error {
    margin-left: 100px !important;
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
  .add-main {
    margin-left: 50px;
    margin-top: 40px;
  }
  .main-padding {
    margin-bottom: 15px;
  }
  .main-left {
    padding-left: 20px;
  }
}
</style>
