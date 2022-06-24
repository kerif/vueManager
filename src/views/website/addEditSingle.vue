<template>
  <div class="public-add-container">
    <el-form label-position="top">
      <!-- 标题 -->
      <el-form-item :label="$t('标题')">
        <el-row>
          <el-col :span="10"
            ><el-input :placeholder="$t('公告标题不超过30个字')" v-model="params.title"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('标签')">
        <el-row>
          <el-col :span="10"
            ><el-input :placeholder="$t('请输入标签')" v-model="params.tags"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <!-- 单页详情 -->
      <el-form-item :label="$t('单页详情')">
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
        title: '',
        content: '',
        tags: ''
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
      this.$request.singlePageData(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.tags = res.data.tags
        }
      })
    },
    saveNotice(data) {
      this.params.content = data
      if (!this.params.title) {
        return this.$message.error(this.$t('请输入标题'))
      } else if (!this.params.tags) {
        return this.$message.error(this.$t('请输入标签'))
      }
      if (!this.$route.params.id) {
        // 如果是新增状态
        this.$request.singlePageAdd(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
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
        this.$request.singlePageEdit(this.$route.params.id, this.params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
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
.public-add-container {
  background-color: #fff !important;
}
</style>
