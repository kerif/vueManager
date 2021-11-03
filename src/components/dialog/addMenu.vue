<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('菜单设置') : $t('修改菜单设置')"
    @close="clear"
    class="dialog-addMenu"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px" :rules="rules">
      <!-- 菜单名称 -->
      <el-form-item :label="$t('菜单名称')">
        <el-input
          v-model="ruleForm.menuName"
          style="width: 50%"
          :placeholder="$t('仅支持中英文和数字,字数不超过4个汉字或8个字母')"
        >
        </el-input>
      </el-form-item>
      <!-- 菜单类型 -->
      <el-form-item :label="$t('菜单类型')">
        <el-radio-group v-model="ruleForm.radio">
          <el-radio :label="1">{{ $t('发送文字消息') }}</el-radio>
          <el-radio :label="2">{{ $t('发送图片消息') }}</el-radio>
          <el-radio :label="3">{{ $t('跳转网页') }}</el-radio>
          <el-radio :label="4">{{ $t('跳转小程序') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="this.ruleForm.radio === 1">
        <el-input
          type="textarea"
          style="width: 80%"
          :rows="5"
          :placeholder="$t('请输入内容')"
          v-model="ruleForm.content"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('转义符号')" v-if="this.ruleForm.radio === 1">
        <p v-text="'{{user_id}} = ' + $t('用户id')" style="margin-top: 0px"></p>
      </el-form-item>
      <!-- 图片 -->
      <el-form-item class="updateChe" v-if="this.ruleForm.radio === 2">
        <span class="img-item" v-if="this.image">
          <img :src="$baseUrl.IMAGE_URL + image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg"></i>
          </span>
        </span>
        <el-upload
          v-show="!this.image"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <div>{{ $t('*仅能上传1张图片,大小不超过10M') }}</div>
      </el-form-item>
      <!-- 网页 -->
      <div v-if="this.ruleForm.radio === 3">
        <div style="margin-left: 120px; margin-bottom: 20px">
          {{ $t('订阅者点击菜单会跳到以下链接') }}
        </div>
        <el-form-item :label="$t('页面地址')" style="margin-left: 70px">
          <el-input v-model="ruleForm.pageAddress" style="width: 50%"> </el-input>
        </el-form-item>
      </div>
      <!-- 小程序 -->
      <div v-if="this.ruleForm.radio === 4">
        <div style="margin-left: 120px; margin-bottom: 20px">
          {{ $t('订阅者点击该子菜单会跳到以下小程序') }}
        </div>
        <el-form-item :label="$t('小程序')" style="margin-left: 70px" prop="appid">
          <el-input
            v-model="ruleForm.appid"
            style="width: 50%"
            :placeholder="$t('请输入小程序的appid')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('小程序路径')" style="margin-left: 70px" prop="appPath">
          <el-input
            v-model="ruleForm.appPath"
            style="width: 50%"
            :placeholder="$t('请输入小程序的页面路径')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('备用网页')" style="margin-left: 70px" prop="webPage">
          <el-input
            v-model="ruleForm.webPage"
            style="width: 65%"
            :placeholder="$t('旧版微信客户端无法支持小程序,用户点击菜单时将会打开备用网页')"
          >
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer">
      <el-button
        style="text-align: left; background-color: #3540a5; color: #fff"
        @click="submit('ruleForm')"
        >{{ $t('保存') }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      show: false,
      state: '',
      id: '',
      image: '',
      ruleForm: {
        menuName: '',
        radio: 1,
        pageAddress: '',
        content: '',
        appid: '',
        appPath: '',
        webPage: ''
      },
      rules: {
        appid: [{ required: true, message: '请输入小程序的appid', trigger: 'blur' }],
        appPath: [{ required: true, message: '请输入小程序的页面路径', trigger: 'blur' }],
        webPage: [{ required: true, message: '请输入备用网页', trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDeleteImg() {
      this.image = ''
    },
    // 上传打包照片
    uploadBaleImg(item) {
      console.log(item)
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.image = res.data[0].path
          this.$message.success(this.$t('上传成功'))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    beforeUploadImg(file) {
      if (!/^image/.test(file.type)) {
        this.$message.info(this.$t('请上传图片类型文件'))
        return false
      } else if (file.size > 1024 * 1024 * 10) {
        this.$message.info(this.$t('上传图片大小不能超过10M'))
        return false
      }
      return true
    },
    init() {
      if (this.state === 'edit') {
        this.getMenuDetail()
      }
    },
    getMenuDetail() {
      this.$request.getMenuDetail(this.id).then(res => {
        console.log(res.data)
        this.ruleForm.menuName = res.data.name
        this.ruleForm.radio = res.data.type
        this.ruleForm.content = res.data.content
        this.ruleForm.appPath = res.data.page_path
        this.ruleForm.pageAddress = res.data.url
        this.ruleForm.webPage = res.data.url
        this.ruleForm.appid = res.data.appid
        this.image = res.data.image
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            name: this.ruleForm.menuName,
            content: this.ruleForm.content,
            appid: this.ruleForm.appid,
            page_path: this.ruleForm.appPath,
            parent_id: this.id,
            image: this.image
          }
          if (this.ruleForm.radio === 1) {
            param.type = 1
          } else if (this.ruleForm.radio === 2) {
            param.type = 2
          } else if (this.ruleForm.radio === 3) {
            param.type = 3
            param.url = this.ruleForm.pageAddress
          } else {
            param.type = 4
            param.url = this.ruleForm.webPage
          }
          if (this.state === 'add') {
            this.$request.getNewMenu(param).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.show = false
                this.success()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
          } else {
            let id = this.id
            this.$request.updateMenu(id, param).then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.show = false
                this.success()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.menuName = ''
      this.ruleForm.content = ''
      this.ruleForm.pageAddress = ''
      this.ruleForm.app = ''
      this.ruleForm.appPath = ''
      this.ruleForm.webPage = ''
      this.id = ''
      this.image = ''
    }
  }
}
</script>

<style lang="scss">
.dialog-addMenu {
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
