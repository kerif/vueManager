<template>
  <div class="app-configure-container">
    <el-row>
      <el-col :span="11">
        <div class="applet-left">
          <h4>{{ $t('开发者id') }}</h4>
          <el-form
            :model="appletForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            label-position="top"
          >
            <el-form-item :label="$t('AppId(小程序ID)')" prop="app_id">
              <el-input :placeholder="$t('请输入AppId')" v-model="appletForm.app_id"></el-input>
            </el-form-item>
            <el-form-item :label="$t('AppSecret(小程序密钥)')" prop="secret">
              <el-input
                class="input-sty"
                placeholder="请输入AppSecret"
                v-model="appletForm.secret"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('小程序token')">
              <el-input
                class="input-sty"
                :placeholder="$t('请输入小程序token')"
                v-model="appletForm.token"
              ></el-input>
            </el-form-item>
            <el-form-item label="aes_key">
              <el-input
                class="input-sty"
                :placeholder="$t('请输入aes_key')"
                v-model="appletForm.aes_key"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button class="save-btn" @click="saveDev('ruleForm')">{{ $t('保存') }}</el-button>
        </div>
      </el-col>
      <el-col :span="12" :offset="1">
        <div class="right-server">
          <h4>{{ $t('服务器域名') }}</h4>
          <el-table class="data-list" border stripe :data="severData" v-loading="tableLoading">
            <el-table-column :label="$t('服务器配置')">{{ $t('request合法域名') }}</el-table-column>
            <el-table-column :label="$t('域名')" prop="server_url"></el-table-column>
          </el-table>
          <h4>{{ $t('业务域名') }}</h4>
          <el-table class="data-list" border stripe :data="severData" v-loading="tableLoading">
            <el-table-column :label="$t('配置信息')">{{ $t('request合法域名') }}</el-table-column>
            <el-table-column :label="$t('信息')" prop="server_url"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <h4>{{ $t('消息模板') }}</h4>
    <el-table :data="messageData" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column label="id" prop="type" width="100"></el-table-column>
      <el-table-column :label="$t('模版类型')" prop="type_name"> </el-table-column>
      <el-table-column :label="$t('模版标示')">
        <template slot-scope="scope">
          <template>
            <el-input v-model="scope.row.template_id" :disabled="scope.row.disabled"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="edit(scope.row)" v-if="scope.row.disabled">{{
            $t('编辑')
          }}</el-button>
          <el-button
            size="small"
            class="btn-light-red detailsBtn"
            v-show="!scope.row.disabled"
            @click="saveLogistics(scope.row)"
            >{{ $t('保存') }}</el-button
          >
          <el-button
            size="small"
            class="btn-blue detailsBtn"
            v-show="!scope.row.disabled"
            @click="cancel(scope.row)"
            >{{ $t('取消') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      appletForm: {
        app_id: '',
        secret: '',
        token: '',
        aes_key: ''
      },
      rules: {
        app_id: [{ required: true, message: this.$t('请输入AppId'), trigger: 'change' }],
        secret: [{ required: true, message: this.$t('请输入AppSecret'), trigger: 'change' }]
      },
      severData: [],
      tableLoading: false,
      messageData: []
    }
  },
  created() {
    this.getList()
    this.getPick()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request.getMini().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.appletForm = res.data
          this.severData = [res.data]
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getPick() {
      this.tableLoading = true
      this.$request.getTemplate().then(res => {
        this.tableLoading = false
        if (res.ret) {
          console.log('data', res.data)
          res.data.forEach(item => {
            item.disabled = true
            item.copySN = item.template_id
          })
          this.messageData = res.data
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    saveDev(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request.updateMini(this.appletForm).then(res => {
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
        } else {
          return false
        }
      })
    },
    // 添加转运快递单号
    edit(row) {
      row.disabled = !row.disabled
    },
    // 保存添加转运快递单号
    saveLogistics(row) {
      console.log(row, 'row')
      if (!row.template_id) {
        return this.$message.error(this.$t('请输入模版标示'))
      }
      this.$request
        .updateTemplate({
          type: row.type,
          template_id: row.template_id
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            row.copySN = row.template_id
            row.disabled = true
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 取消
    cancel(row) {
      row.template_id = row.copySN
      row.disabled = true
    }
  }
}
</script>
<style lang="scss" scoped>
.app-configure-container {
  .applet-left {
    background-color: #fff !important;
  }
  .save-btn {
    color: #fff;
    background-color: #3540a5;
  }
}
</style>
