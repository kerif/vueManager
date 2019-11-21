<template>
  <el-dialog :visible.sync="show" title="添加物流信息" class="add-company"
  width="35%" @close="clear">
    <el-form ref="form" :model="company" label-width="100px">
        <el-form-item label="物流单号：">
            <el-input v-model="company.sn"></el-input>
        </el-form-item>
        <el-form-item label="物流公司：">
            <el-input v-model="company.company"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
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
      }
    }
  },
  methods: {
    confirm () {
      this.$request.updateLogistics([{
        id: this.id,
        sn: this.company.sn,
        company: this.company.company
      }]).then(res => {
        if (res.ret) {
          this.$notify({
            title: '保存成功',
            message: res.msg,
            type: 'success'
          })
          this.show = false
          this.success()
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
        this.show = false
      })
    },
    clear () {
      this.company.sn = ''
    },
    init () {
      this.company.sn = this.logistics_sn
    }
  }
}
</script>
<style lang="scss">
.add-company {
  .el-input {
   width: 60%;
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
}
</style>
