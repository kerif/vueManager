<template>
  <div>
    <el-form :model="form" label-width="200px">
      <el-form-item :label="$t('允许后台删除收件人地址')">
        <el-switch
          v-model="form.allow_delete"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
          @change="onUpdateConfig"
        >
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('开启收件人地址审核')">
        <el-switch
          v-model="form.audit_required"
          :active-text="$t('开')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关')"
          active-color="#13ce66"
          inactive-color="gray"
          @change="onUpdateConfig"
        >
        </el-switch>
        <div class="red-warn">
          {{ $t('开启后,下单用户收件地址需要后台管理人员审核后才会显示出来') }}
        </div>
        <el-table :data="form.tableData" border v-if="form.audit_required === 1" style="width: 60%">
          <el-table-column
            :label="item.name"
            v-for="item in formatLangData"
            :key="item.id"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row['trans_' + item.language_code]"
                class="el-icon-check icon-sty"
                @click="onLang(scope.row, item)"
              ></span>
              <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-dialog :title="$t('翻译')" :visible.sync="showLang" @close="clear">
      <el-form>
        <el-form-item :label="$t('提示信息')" label-position="left">
          <el-input
            v-model="audit_message"
            :placeholder="$t('请输入')"
            style="width: 35%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showLang = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        allow_delete: 0,
        audit_required: 0,
        tableData: []
      },
      languageData: [],
      showLang: false,
      audit_message: '',
      language: '',
      transCode: ''
    }
  },
  created() {
    this.getList()
    this.getLanguageList()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList() {
      this.$request.getAddressConfig().then(res => {
        if (res.ret) {
          this.form = res.data
          this.form.tableData = []
          this.form.tableData = [res.data]
        }
      })
    },
    getLangText() {
      this.$request
        .getAddressConfig({
          lang: this.language
        })
        .then(res => {
          this.audit_message = res.data.audit_message
        })
    },
    onUpdateConfig() {
      let params = {
        audit_required: this.form.audit_required,
        audit_message: this.audit_message,
        allow_delete: this.form.allow_delete
      }
      this.$request.updateAddressConfig(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    onLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      this.language = lang.language_code
      this.showLang = true
      if (this.transCode === 1) {
        this.getLangText()
      }
    },
    onConfirm() {
      let params = {
        audit_message: this.audit_message,
        language: this.language
      }
      this.$request.updateAddressTranslate(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.showLang = false
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    clear() {
      this.audit_message = ''
    }
  }
}
</script>

<style>
.red-warn {
  color: red;
  margin: 10px 0;
}
</style>
