<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="50%"
    @close="clearn"
    class="dialog-container"
  >
    <div class="lang-sty" v-if="lang.id">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息') }}
      </p>
    </div>
    <el-form :model="baseForm">
      <el-form-item :label="$t('产品名称')">
        <el-input v-model="baseForm.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('成长值')" v-if="type !== 'transBaseTable'">
        <el-input v-model="baseForm.growth_value"></el-input>
      </el-form-item>
      <el-form-item :label="$t('价格')" v-if="type !== 'transBaseTable'">
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
      title: '',
      line: '',
      lang: '',
      status: ''
    }
  },
  methods: {
    async submit() {
      let res = {}
      if (this.type === 'addBaseTable') {
        res = await this.$request.addBaseTable({ ...this.baseForm })
      } else if (this.type === 'editBaseTable') {
        res = await this.$request.editBaseTable(this.baseId, { ...this.baseForm })
      } else if (this.type === 'transBaseTable') {
        this.baseForm.language = this.lang.language_code
        res = await this.$request.editBaseTableTrans(this.line.id, { ...this.baseForm })
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
    //获取基础表详情
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
    // 获取翻译详情
    getBaseTableTrans() {
      this.$request
        .getBaseTableDetails(this.line.id, { lang: this.lang.language_code })
        .then(res => {
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
      } else if (this.type === 'transBaseTable') {
        this.title = this.$t('翻译内容')
        if (this.status === 'edit') {
          this.getBaseTableTrans()
        }
      } else {
        this.title = this.$t('新增基础价格')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.lang-sty {
  line-height: 40px;
  color: #e6a344;
  p {
    background-color: #fdf6ed;
  }
}
</style>
