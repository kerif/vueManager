<template>
  <div class="how-container">
    <div class="titles">
      {{ $t('注：配置内容将会显示在客户端“已入库包裹”页面，客户须阅读勾选') }}
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
        language: '',
        title: '',
        content: ''
      },
      options: []
    }
  },
  created() {
    this.getLanguage()
    this.getList()
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
        .changeLangBoxRule({
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
    getList() {
      this.$request.multiBoxRule().then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.language = res.data.language
        }
      })
    },
    saveNotice(data) {
      this.params.content = data
      this.$request.updateMultiBoxRule(this.params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
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

<style lang="scss">
.titles {
 // color: orange;
  background: #fce6c9;
  padding: 10px;
  border-radius: 2px;
}
</style>
