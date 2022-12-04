<template>
  <el-dialog :visible.sync="show" :title="$t('修改客户组')" class="dialog-vip-group" @close="clear">
    <div>{{ $t('客户组中文名*') }}</div>
    <el-select v-model="user.name_cn" :placeholder="$t('请选择')">
      <el-option v-for="item in userList" :key="item.id" :value="item.id" :label="item.name_cn">
      </el-option>
    </el-select>
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
      userList: [],
      user: {
        name_cn: ''
      }
    }
  },
  methods: {
    getUser() {
      this.$request.getSimple().then(res => {
        this.userList = res.data
      })
    },
    confirm() {
      this.$request.changeUserList(this.id, this.user.name_cn).then(res => {
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
    },
    clear() {
      this.user.name_cn = ''
    },
    init() {
      this.getUser()
    }
  }
}
</script>
<style lang="scss">
.dialog-vip-group {
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
}
</style>
