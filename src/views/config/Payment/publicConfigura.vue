<template>
  <div class="setPublic-container">
    <el-form
      :model="setForm"
      ref="setForm"
      class="demo-ruleForm"
      label-width="150px"
      label-position="left"
    >
      <el-form-item label="AppId">
        <el-input v-model="setForm.app_id"> </el-input>
      </el-form-item>
      <el-form-item :label="`AppSecret${$t('密钥')}`">
        <el-input v-model="setForm.secret"> </el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="setForm.token"> </el-input>
      </el-form-item>
      <el-form-item label="aes_key">
        <el-input v-model="setForm.aes_key"> </el-input>
      </el-form-item>
      <el-form-item :label="$t('公众号二维码')" class="updateChe">
        <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="baleImgList.length < 1"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('自定义菜单')">
        <el-switch
          :active-text="$t('开启')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关闭')"
          active-color="#13ce66"
          inactive-color="gray"
          v-model="setForm.menu"
          @change="changeMenu('menu')"
        >
        </el-switch>
        <el-button class="configBtn" @click="goCustomMenu">{{ $t('配置') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('自动回复')">
        <el-switch
          :active-text="$t('开启')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关闭')"
          active-color="#13ce66"
          inactive-color="gray"
          v-model="setForm.message"
          @change="changeMenu('message')"
        >
        </el-switch>
        <el-button class="configBtn" @click="goReplyConfiguration">{{ $t('配置') }}</el-button>
      </el-form-item>
    </el-form>
    <el-button :loading="$store.state.btnLoading" class="save-btn" @click="editOthers">{{
      $t('保存')
    }}</el-button>
    <el-table :data="messageData" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column :label="$t('模版类型')" prop="type_name"> </el-table-column>
      <el-table-column :label="$t('模版标示')">
        <template slot-scope="scope">
          <template>
            <el-input v-model="scope.row.template_id"></el-input>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="btn-light-red detailsBtn"
            @click="saveLogistics(scope.row)"
            >{{ $t('保存') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      setForm: {
        image: '',
        secret: '',
        token: '',
        aes_key: '',
        app_id: '',
        menu: false,
        message: false
      },
      visibleOauth: false,
      baleImgList: [],
      tableLoading: false,
      messageData: []
    }
  },
  created() {
    this.getOthers()
    this.getPubTemplate()
  },
  methods: {
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 获取公众号消息模板
    getPubTemplate() {
      this.tableLoading = true
      this.$request.getPubTemplate().then(res => {
        if (res.ret) {
          this.messageData = Object.values(res.data)
          this.tableLoading = false
        }
      })
    },
    // 设置功能状态
    changeMenu(type) {
      this.$request.setFunctionStatus(type, this.setForm[type]).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('保存成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 保存
    saveLogistics(row) {
      if (!row.template_id) {
        return this.$message.error(this.$t('请输入模版标示'))
      }
      this.$request
        .updatePubTemplate({
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
            this.getPubTemplate()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 获取公众号配置
    getOthers() {
      this.$request.getWechatOa().then(res => {
        this.setForm.app_id = res.data.app_id
        this.setForm.secret = res.data.secret
        this.setForm.token = res.data.token
        this.setForm.aes_key = res.data.aes_key
        res.data.image && (this.baleImgList[0] = res.data.image)
        // this.$set(this.baleImgList, 0, res.data.image)
      })
    },
    // 修改公众号配置
    editOthers() {
      if (this.baleImgList[0]) {
        this.setForm.image = this.baleImgList[0]
      } else {
        this.setForm.image = []
      }
      this.$request.updateWechatOa(this.setForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getOthers()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        }
      })
    },
    // 删除小程序码
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    uploadLogo(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.LogoImgList.push(item.path)
          })
        }
      })
    },
    // 跳转到自动回复页面
    goReplyConfiguration() {
      this.$router.push({ name: 'autoReply' })
    },
    // 跳转到自定义菜单页面
    goCustomMenu() {
      this.$router.push({ name: 'customMenu' })
    }
  }
}
</script>
<style lang="scss">
.setPublic-container {
  .save-btn {
    color: #fff;
    background-color: #3540a5;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .configBtn {
    margin-left: 20px;
  }
}
</style>
