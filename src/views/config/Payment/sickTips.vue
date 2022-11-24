<template>
  <div class="sick-tips-container">
    <el-form label-position="top">
      <el-form-item :label="$t('标题')">
        <el-row>
          <el-col :span="10"
            ><el-input
              :placeholder="$t('请输入内容')"
              v-model="params.risk_warning_title"
            ></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('内容')">
        <el-row>
          <el-col :span="20">
            <editor :content="params.content" @submit="saveNotice" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import editor from '@/components/editor.vue'
export default {
  components: { editor },
  data() {
    return {
      params: {
        risk_warning_title: '',
        risk_warning_content: ''
      },
      editor: null
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getRiskDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.risk_warning_title = res.data.risk_warning_title
          this.params.content = res.data.risk_warning_content
          this.editor.txt.html(this.params.risk_warning_content)
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText() {
      this.$emit('input', this.editor.txt.html())
    },
    saveNotice(data) {
      this.params.risk_warning_content = data
      if (!this.$route.params.id) {
        // 如果是新增状态
        this.$request.saveNotice(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            // this.$router.push({ name: 'noticelist' })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        // 如果是编辑状态
        this.$request.updateRiskDetails(this.$route.params.id, this.params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
            // this.$router.push({ name: 'payment',
            //   query: {
            //     activeName: '7'
            //   } })
            this.$router.go(-1)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.sick-tips-container {
  background-color: #fff !important;
}
</style>
