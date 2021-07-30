<template>
  <el-dialog
    :title="$t('评论奖励积分')"
    :visible.sync="show"
    width="30%"
    @close="clearn"
    class="dialog-container"
  >
    <el-form ref="form" :model="form">
      <el-form-item :label="$t('字数') + '>='">
        <el-input v-model="form.word_count"></el-input>
      </el-form-item>
      <el-form-item :label="$t('图片数') + '>='">
        <el-input v-model="form.pic_count"></el-input>
      </el-form-item>
      <el-form-item :label="$t('获得积分') + '>='">
        <el-input v-model="form.point"></el-input>
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
      form: {
        word_count: '',
        pic_count: '',
        point: ''
      },
      id: '',
      type: ''
    }
  },
  methods: {
    getTableDetails() {
      this.$request.getTableDetails(this.id).then(res => {
        if (res.ret) {
          this.form = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clearn() {
      this.id = ''
      this.form.word_count = ''
      this.form.pic_count = ''
      this.form.point = ''
    },
    async submit() {
      let res = {}
      if (this.id) {
        res = await this.$request.editTableDetails(this.id, { ...this.form })
      } else {
        res = await this.$request.addTable({ ...this.form })
      }
      if (res.ret) {
        this.$notify({
          type: 'success',
          title: this.$t('操作成功'),
          message: res.msg
        })
        this.success()
        this.show = false
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    init() {
      if (this.type === 'evaluationTable') {
        this.getTableDetails()
      }
    }
  }
}
</script>
<style scoped lang="scss"></style>
