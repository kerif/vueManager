<template>
  <el-dialog :title="$t('问答累计积分')" :visible.sync="show" @close="clear">
    <el-form :model="form" label-position="top">
      <el-form-item :label="$t('字数(>=)')" prop="word_count">
        <el-input v-model="form.word_count" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('图片数(>=)')" prop="pic_count">
        <el-input v-model="form.pic_count" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('获得积分')" prop="point">
        <el-input v-model="form.point" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirmPoint">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      types: '',
      type: '',
      form: {
        word_count: '',
        pic_count: '',
        point: ''
      }
    }
  },
  methods: {
    init() {
      if (this.id) {
        this.getPointDetail()
      }
    },
    getPointDetail() {
      this.$request.getQaCumulativeDetail(this.id).then(res => {
        if (res.ret) {
          this.form.word_count = res.data.word_count
          this.form.pic_count = res.data.pic_count
          this.form.point = res.data.point
          this.type = res.data.type
        }
      })
    },
    confirmPoint() {
      if (this.id) {
        this.$request.editQa(this.id, this.form).then(res => {
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
      } else {
        this.$request.addQa({ ...this.form, type: this.types }).then(res => {
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
      }
    },
    clear() {
      this.id = ''
      this.form.word_count = ''
      this.form.pic_count = ''
      this.form.point = ''
    }
  }
}
</script>

<style></style>
