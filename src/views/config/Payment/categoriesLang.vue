<template>
  <el-dialog
    :visible.sync="show"
    :title="params.name + $t('分类翻译')"
    :before-close="close"
    class="dialog-categories-lang"
    @close="clear"
  >
    <div class="categories-lang" v-loading="loading">
      <div class="lang-sty">
        <p>
          <span class="el-icon-warning icon-info"></span>
          {{ $t('请注意以下内容请输入对应的') + '【' + this.currentLang.name + '】' + $t('信息') }}
        </p>
      </div>
      <el-form label-position="top" :model="params" ref="ruleForm" class="demo-ruleForm">
        <el-form-item :label="$t('分类名称')">
          <el-row>
            <el-col :span="10">
              <el-input :placeholder="$t('请输入内容')" v-model="params.name"></el-input
            ></el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('分类分组')">
          <el-row>
            <el-col :span="10">
              <el-input :placeholder="$t('请输入内容')" v-model="params.group_name"></el-input
            ></el-col>
          </el-row>
        </el-form-item>
        <!-- 风险提示 -->
        <el-form-item :label="$t('风险提示 标题')">
          <el-row>
            <el-col :span="10">
              <el-input
                :placeholder="$t('请输入内容')"
                v-model="params.risk_warning_title"
              ></el-input
            ></el-col>
          </el-row>
        </el-form-item>
        <!-- 邮件内容 -->
        <el-form-item :label="$t('风险提示 内容')">
          <el-row>
            <el-col :span="20">
              <editor :content="params.risk_warning_content" @submit="saveNotice" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import editor from '@/components/editor.vue'
export default {
  components: { editor },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    initData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    initData() {
      this.categoryId = this.initData.id
      this.currentLang = this.initData.lang
      this.loadData()
    }
  },
  data() {
    return {
      loading: false,
      params: {
        name: '',
        risk_warning_title: '',
        risk_warning_content: '',
        language: '',
        group_name: ''
      },
      editor: null,
      categoryId: 0,
      currentLang: ''
    }
  },
  methods: {
    close() {
      this.$emit('onClose')
    },
    clear() {},
    loadData() {
      this.loading = true
      this.$request
        .categoriesLang(this.categoryId, {
          lang: this.currentLang.language_code
        })
        .then(res => {
          if (res.ret) {
            this.params.language = this.currentLang.language_code
            if (res.data['trans_' + this.currentLang.language_code] === 1) {
              this.params.name = res.data.name
              this.params.group_name = res.data.group_name
              this.params.risk_warning_title = res.data.risk_warning_title
              this.params.risk_warning_content = res.data.risk_warning_content
            } else {
              this.params.name = ''
              this.params.group_name = ''
              this.params.risk_warning_title = ''
              this.params.risk_warning_content = ''
            }
            this.loading = false
          }
        })
    },
    saveNotice(data) {
      this.params.risk_warning_content = data
      if (this.params.name === '') {
        return this.$message.error(this.$t('请输入一级分类名称'))
      }
      this.$request.updateCategoriesLang(this.categoryId, this.params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.tips,
            type: 'success'
          })
          this.$emit('onSuccess')
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
</script>

<style lang="scss">
.dialog-categories-lang {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
  .categories-lang {
    background-color: #fff !important;
    .lang-sty {
      line-height: 40px;
      color: #e6a344;
      // margin-left: 80px;
      width: 66%;
      p {
        background-color: #fdf6ed;
      }
    }
    .icon-info {
      color: #e6a344;
      font-size: 18px;
      margin-left: 15px;
      position: relative;
      top: 2px;
      cursor: pointer;
    }
  }
}
</style>
