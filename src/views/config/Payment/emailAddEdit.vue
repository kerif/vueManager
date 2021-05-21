<template>
  <div class="email-add-container">
    <el-form label-position="top">
      <el-form-item :label="$t('*模版类型')" class="email-tmp">
        <el-row>
          <el-col :span="10">
            <el-select v-model="params.type" :placeholder="$t('请选择')" clearable>
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('邮件标题')">
        <el-row>
          <el-col :span="10"
            ><el-input :placeholder="$t('请输入内容')" v-model="params.title"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('邮件内容')">
        <el-row>
          <el-col :span="20">
            <div id="editor" :value="params.content" @input="changeText"></div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('转义符号')">
        <el-row>
          <!-- <el-col :span="10">
          </el-col> -->
          <!-- <p v-text="'{{code}} = 验证码， {{created}} = 创建时间，{{email}} = 收件人邮箱'"></p> -->
          <p
            v-text="
              '{{code}} = ' +
              $t('验证码') +
              '{{email}} = ' +
              $t('收件人邮箱') +
              '{{time}} = ' +
              $t('时间') +
              '{{user_name}} = ' +
              $t('会员名') +
              '{{user_id}} = ' +
              $t('会员ID') +
              '{{order_sn}} '
            "
          ></p>
          <p
            v-text="
              $t('订单号') +
              '{{package_number}} = ' +
              $t('包裹单号') +
              '{{package_weight}} = ' +
              $t('包裹重量') +
              '{{amount}} = ' +
              $t('交易金额')
            "
          ></p>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="saveNotice"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Wangeditor from 'wangeditor'
import baseApi from '@/lib/axios/baseApi'
export default {
  data() {
    return {
      params: {
        title: '',
        type: '',
        content: ''
      },
      options: [],
      editor: null
    }
  },
  mounted() {
    this.editor = new Wangeditor('#editor')
    this.editor.customConfig.menus = [
      'head',
      'fontSize',
      'fontName',
      'bold',
      'italic',
      'underline',
      'strikeThrough',
      'foreColor',
      'backColor',
      'link',
      'list',
      'justify',
      'quote',
      'video',
      'image',
      'table'
    ]
    this.editor.customConfig.onchange = html => {
      this.params.content = html
    }
    this.editor.customConfig.uploadImgServer = `${baseApi.BASE_API_URL}/upload/images`
    this.editor.customConfig.uploadImgParams = {}
    this.editor.customConfig.uploadImgHeaders = {
      Authorization: this.$store.state.token
    }
    this.editor.customConfig.uploadFileName = `images[${0}][file]`
    this.editor.customConfig.uploadImgHooks = {
      customInsert: (insertImg, result) => {
        console.log(result)
        if (result.ret === 1) {
          this.$message.success(this.$t('上传成功'))
          let url = `${baseApi.IMAGE_URL}${result.data[0].path}`
          insertImg(url)
        }
      }
    }
    this.editor.customConfig.zIndex = 500
    this.editor.customConfig.showLinkImg = true
    this.editor.create()
    console.log(this.editor, 'this.editor')
  },
  created() {
    this.getType()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getAloneEmail(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          this.params.type = res.data.type
          this.editor.txt.html(this.params.content)
        }
      })
    },
    // 获取模版类型
    getType() {
      this.$request.emailType().then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    // 判断是新增 还是 编辑
    changeText() {
      this.$emit('input', this.editor.txt.html())
    },
    saveNotice() {
      if (!this.$route.params.id) {
        // 如果是新增状态
        if (this.params.type === '') {
          return this.$message.error(this.$t('请选择模版类型'))
        }
        this.$request.addEmail(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.go(-1)
            // this.$router.push({ name: 'payment' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        // 如果是编辑状态
        this.$request.updateAloneEmail(this.$route.params.id, this.params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.tips,
              type: 'success'
            })
            // this.$router.push({ name: 'noticelist' })
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

<style lang="scss" scope>
.el-select-dropdown {
  z-index: 11111 !important;
}
.email-add-container {
  background-color: #fff !important;
}
</style>
