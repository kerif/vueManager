<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('添加语言') : $t('编辑语言')"
    class="invoice-container"
    @close="clear"
  >
    <el-form :model="languageList" ref="ruleForm" class="demo-ruleForm" label-width="130px">
      <el-form-item :label="$t('*语言')">
        <el-select v-model="languageList.language_code" :placeholder="$t('请选择')">
          <el-option
            v-for="item in language"
            :key="item.language_code"
            :value="item.language_code"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 是否启用 -->
      <el-form-item :label="$t('是否启用')">
        <el-switch
          v-model="languageList.enabled"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      innerVisible: false,
      state: '',
      language: [],
      languageList: {
        language_code: '',
        enabled: 0
      }
    }
  },
  methods: {
    getList() {
      this.$request.singleLg(this.id).then(res => {
        if (res.ret) {
          this.languageList = res.data
        }
      })
    },
    confirm() {
      if (this.languageList.language_code === '') {
        return this.$message.error(this.$t('请选择语言'))
      }
      console.log(this.languageList, 'languageList')
      if (this.id) {
        // 编辑语言
        this.$request.updateLg(this.id, this.languageList).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        // 新增语言
        this.$request.addLg(this.languageList).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.show = false
            this.success()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    getLanguage() {
      this.$request.getLanguageCan().then(res => {
        if (res.ret) {
          this.language = res.data
        }
      })
    },
    clear() {
      this.languageList.language_code = ''
    },
    init() {
      // this.id = this.id
      if (this.id) {
        this.getList()
      }
      this.getLanguage()
    }
  }
}
</script>
<style lang="scss">
.invoice-container {
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
  .created-btn {
    margin-left: 5px;
  }
}
</style>
