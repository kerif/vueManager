<template>
  <el-dialog
    :visible.sync="show"
    :title="id ? $t('修改客户标签') : $t('新增客户标签')"
    @close="clear"
  >
    <el-form :model="ruleForm">
      <el-form-item :label="$t('标签名称')">
        <el-input v-model="ruleForm.name" :placeholder="$t('请输入标签名称')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('标签描述')">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入标签描述')"
          v-model="ruleForm.description"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onSubmit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      ruleForm: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    init() {
      if (this.id) {
        this.onDetail()
      }
    },
    onSubmit() {
      if (this.id) {
        this.$request.editTag(this.id, { ...this.ruleForm }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
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
        this.$request.addTag({ ...this.ruleForm }).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
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
    onDetail() {
      this.$request.tagDetail(this.id).then(res => {
        this.ruleForm = res.data
      })
    },
    clear() {
      this.id = ''
      this.ruleForm.name = ''
      this.ruleForm.description = ''
    }
  }
}
</script>

<style></style>
