<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="50%"
    @close="clearn"
    class="dialog-container"
  >
    <el-form :model="baseForm">
      <el-form-item :label="$t('产品名称')">
        <el-input v-model="baseForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('成长值')">
        <el-input v-model="baseForm.growth_value"></el-input>
      </el-form-item>
      <el-form-item :label="$t('价格')">
        <el-input v-model="baseForm.price"></el-input>
      </el-form-item>
      <el-form-item :label="$t('产品说明')">
        <el-input v-model="baseForm.illustrate"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      type: '',
      baseId: '',
      baseForm: {
        name: '',
        growth_value: '',
        price: '',
        illustrate: ''
      },
      title: ''
    }
  },
  methods: {
    async submit() {
      let res = {}
      if (this.type === 'addBaseTable') {
        res = await this.$request.addBaseTable({ ...this.baseForm })
      } else if (this.type === 'editBaseTable') {
        res = await this.$request.editBaseTable(this.baseId, { ...this.baseForm })
      }
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
    },
    getBaseTableDetails() {
      this.$request.getBaseTableDetails(this.baseId).then(res => {
        if (res.ret) {
          this.baseForm = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clearn() {
      this.baseForm.name = ''
      this.baseForm.growth_value = ''
      this.baseForm.price = ''
      this.baseForm.illustrate = ''
    },
    init() {
      if (this.type === 'editBaseTable') {
        this.title = this.$t('编辑基础价格')
        this.getBaseTableDetails()
      } else {
        this.title = this.$t('新增基础价格')
      }
    }
  }
}
</script>
<style scoped lang="scss"></style>
