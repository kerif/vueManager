<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('添加申报商品') : $t('修改申报商品')"
    class="abnormalLog-container"
    @close="clear"
  >
    <div style="width: 70%; margin: auto">
      <el-form label-width="80px" :model="ruleForm">
        <el-form-item :label="$t('所属分类')">
          <el-cascader
            :options="options"
            v-model="ruleForm.parent_id"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('中文名称')">
          <el-input v-model="ruleForm.name" class="inner-textarea"></el-input>
        </el-form-item>
        <el-form-item :label="$t('英文名称')">
          <el-input v-model="ruleForm.en_name" class="inner-textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">{{ $t('提交') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        parent_id: '',
        name: '',
        en_name: ''
      },
      state: '',
      options: [],
      props: {
        checkStrictly: true,
        value: 'id',
        label: 'name',
        children: 'children',
        emitPath: false
      }
    }
  },
  methods: {
    clear() {
      this.ruleForm.name = ''
      this.ruleForm.parent_id = ''
      this.ruleForm.en_name = ''
    },
    getList() {
      this.$request.getParticulars(this.id).then(res => {
        if (res.ret) {
          Object.keys(this.ruleForm).forEach(item => {
            this.ruleForm[item] = res.data[item]
          })
        }
      })
    },
    getTrade() {
      this.$request.getTradeName().then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    async confirm() {
      let res = {}
      if (this.id) {
        res = await this.$request.amendProduct(this.id, { ...this.ruleForm })
      } else {
        res = await this.$request.addProduct(this.ruleForm)
      }
      if (res.ret) {
        this.$notify({
          title: this.$t('操作成功'),
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
    init() {
      this.getTrade()
      if (this.id) {
        this.getList()
      }
    }
  }
}
</script>
<style scoped>
.inner-textarea {
  width: 300px;
}
</style>
