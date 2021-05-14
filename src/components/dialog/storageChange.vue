<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('更改线路')"
    class="dialog-change-line"
    width="35%"
    @close="clear"
  >
    <el-form :model="user" ref="user" class="demo-ruleForm" label-position="top">
      <!-- 员工组中文名 -->
      <el-form-item>
        <el-select v-model="user.express_line_id" clearable :placeholder="$t('请选择')">
          <el-option
            v-for="item in expressData"
            :key="item.id"
            :value="item.id"
            :label="`${item.name}---${$t('限重')}${item.max_weight}` + localization.weight_unit"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm('user')">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      user: {
        express_line_id: '',
        name: '',
        max_weight: ''
      },
      expressData: [],
      localization: {}
    }
  },
  methods: {
    // 获取全部线路详情
    getExpress() {
      this.$request.getExpressLines(this.$route.params.id).then(res => {
        if (res.ret) {
          this.expressData = res.data
          this.localization = res.localization
        }
      })
    },
    confirm() {
      if (this.user.express_line_id === '') {
        return this.$message.error(this.$t('请选择线路'))
      } else {
        let user = this.expressData.filter(item => item.id === this.user.express_line_id)[0]
        this.success(user)
        this.show = false
      }
    },
    clear() {
      this.user.express_line_id = ''
    },
    init() {
      this.getExpress()
    }
  }
}
</script>
<style lang="scss">
.dialog-change-line {
  .el-input {
    // width: 300px !important;
    margin-left: 50px;
  }
  .el-textarea {
    width: 250px !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 100px;
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
}
</style>
