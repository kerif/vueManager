<template>
  <div class="email-add-container">
    <el-form label-position="top">
      <el-form-item :label="$t('模版类型')" class="email-tmp">
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
            <editor :content="params.content" @submit="saveNotice" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('转义符号')">
        <el-row>
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
        type: '',
        content: ''
      },
      options: [],
      editor: null
    }
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
    saveNotice(data) {
      this.params.content = data
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
