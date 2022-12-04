<template>
  <div class="how-container">
    <div class="title">
      {{ $t('注：配置内容将会显示在客户端“预报包裹”页面，客户须阅读勾选') }}
    </div>
    <el-form label-position="top">
      <el-form-item :label="$t('选择语言')">
        <el-select v-model="params.language" placeholder="请选择" @change="changeLang">
          <el-option
            v-for="item in options"
            :key="item.language_code"
            :label="item.name"
            :value="item.language_code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('标题')">
        <el-input class="input-sty" v-model="params.title"></el-input>
      </el-form-item>
      <!-- 如何下单 -->
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
        title: '',
        language: '',
        content: ''
      },
      options: []
    }
  },
  created() {
    this.getHowOrder()
    this.getLanguage()
  },
  methods: {
    // 获取语言列表
    getLanguage() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    // 切换语言
    changeLang() {
      this.$request
        .getTranshipment({
          lang: this.params.language
        })
        .then(res => {
          if (res.ret) {
            this.params.title = res.data.title
            this.params.content = res.data.content
            this.params.language = res.data.language
            this.editor.txt.html(this.params.content)
          }
        })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 获取如何下单
    getHowOrder() {
      this.$request.getTranshipment().then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.language = res.data.language
        }
      })
    },
    // 保存如何下单
    saveNotice(data) {
      this.params.content = data
      this.$request.updateTranshipment(this.params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getHowOrder()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.title {
  color: orange;
  background: #fce6c9;
  padding: 10px;
  border-radius: 2px;
}
</style>
