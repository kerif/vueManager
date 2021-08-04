<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'edit' ? $t('修改广告图') : $t('添加广告图')"
    class="dialog-banner"
    @close="clear"
    width="85%"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
          <!-- 广告图名称 -->
          <el-form-item :label="$t('*广告图名称')">
            <el-input
              v-model="ruleForm.picture_name"
              :placeholder="$t('请输入广告图名称')"
              class="banner-sty"
            ></el-input>
          </el-form-item>
          <!-- 显示位置 -->
          <el-form-item :label="$t('*显示位置')">
            <el-select
              v-model="ruleForm.position"
              :placeholder="$t('请选择显示位置')"
              clearable
              class="banner-sty"
            >
              <el-option
                v-for="item in positionData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 所属应用 -->
          <el-form-item :label="$t('*所属应用')">
            <el-select
              v-model="ruleForm.source"
              :placeholder="$t('请选择所属应用')"
              clearable
              class="banner-sty"
            >
              <el-option
                v-for="item in sourceData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 广告类型 -->
          <el-form-item :label="$t('*广告类型')">
            <el-select
              v-model="ruleForm.type"
              :placeholder="$t('请选择广告类型')"
              clearable
              class="banner-sty"
            >
              <el-option
                v-for="item in typeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 跳转方式 -->
          <el-form-item :label="$t('*跳转方式')">
            <el-select
              v-model="ruleForm.link_type"
              :placeholder="$t('请选择跳转方式')"
              clearable
              class="banner-sty"
              @change="getType"
            >
              <el-option
                v-for="item in linkData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 内部跳转 -->
          <el-form-item :label="$t('内部跳转')" v-if="this.ruleForm.link_type === 1">
            <el-select
              v-model="linkPath"
              :placeholder="$t('请选择内部跳转')"
              clearable
              @change="changePath"
              class="banner-sty"
            >
              <el-option
                v-for="item in pathData"
                :key="item.link_type"
                :label="item.name"
                :value="item.link_path"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 内部跳转时 可编辑url -->
          <el-form-item :label="$t('*内部url')" v-if="this.ruleForm.link_type === 1">
            <el-input v-model="ruleForm.link_path" class="banner-sty"></el-input>
          </el-form-item>
          <!-- 外部url -->
          <el-form-item :label="$t('*外部url')" v-if="this.ruleForm.link_type === 2">
            <el-input
              v-model="ruleForm.link_path"
              :placeholder="$t('请输入外部url')"
              class="banner-sty"
            ></el-input>
          </el-form-item>
          <!-- 外部url -->
          <el-form-item :label="$t('*公众号文章url')" v-if="this.ruleForm.link_type === 3">
            <el-input
              v-model="ruleForm.link_path"
              :placeholder="$t('请输入外部url')"
              class="banner-sty"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <p>{{ $t('*上传广告图') }}</p>
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
        <p class="px-sty" v-if="ruleForm.type === 1">{{ $t('建议尺寸：355px * 160px') }}</p>
        <p class="px-sty" v-if="ruleForm.type === 2">{{ $t('建议尺寸：690px * 168px') }}</p>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="cancelDialog">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        picture_name: '',
        position: '',
        source: '',
        type: '',
        link_type: '',
        link_path: '',
        picture_path: []
      },
      state: '',
      positionData: [],
      sourceData: [],
      typeData: [],
      linkData: [],
      pathData: [],
      baleImgList: [],
      linkPath: ''
    }
  },
  methods: {
    // 获取全部下拉框数据
    getLeftData() {
      this.$request.getLeftData().then(res => {
        this.positionData = res.data.position
        this.sourceData = res.data.applications
        this.typeData = res.data.ads_types
        this.linkData = res.data.link_types
        this.pathData = res.data.inner_paths // 内部跳转的值
        if (this.state === 'edit') {
          this.getList()
        }
        // console.log(this.employeeGroup, 'this.employeeGroup')
      })
    },
    getType() {
      console.log(this.ruleForm.link_type, 'ruleForm.link_type')
      console.log(this.ruleForm, 'ruleForm')
      this.linkPath = ''
      this.ruleForm.link_path = ''
    },
    // 获取详情
    getList() {
      this.$request.aloneBanner(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.linkPath = this.pathData.find(item => item.link_path === res.data.link_path)
            ? res.data.link_path
            : ''
          console.log(this.link_)
          console.log(this.ruleForm, 'this.ruleForm')
          res.data.picture_path && (this.baleImgList[0] = res.data.picture_path)
        }
      })
    },
    changePath() {
      console.log(this.linkPath, 'ruleForm.link_path')
      this.ruleForm.link_path = this.linkPath
    },
    confirm() {
      if (this.baleImgList[0]) {
        this.ruleForm.picture_path = this.baleImgList[0]
      } else {
        return this.$message.error(this.$t('请上传广告图'))
      }
      if (this.ruleForm.picture_name === '') {
        return this.$message.error(this.$t('请输入广告图名称'))
      } else if (this.ruleForm.position === '') {
        return this.$message.error(this.$t('请选择显示位置'))
      } else if (this.ruleForm.source === '') {
        return this.$message.error(this.$t('请选择所属应用'))
      } else if (this.ruleForm.type === '') {
        return this.$message.error(this.$t('请选择广告类型'))
      } else if (this.ruleForm.link_type === '') {
        return this.$message.error(this.$t('请选择跳转方式'))
      }
      if (this.ruleForm.link_type === 1 && this.ruleForm.link_path === '') {
        return this.$message.error(this.$t('请输入内部url'))
      } else if (this.ruleForm.link_type === 2 && this.ruleForm.link_path === '') {
        return this.$message.error(this.$t('请输入外部url'))
      }
      if (this.id) {
        // 如果是编辑状态
        this.$request.updateBanner(this.id, this.ruleForm).then(res => {
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
          this.show = false
        })
      } else {
        // 如果是添加状态
        // if (this.ruleForm.link_type === 1 && this.ruleForm.link_path === '') {
        //   return this.$message.error('请选择内部跳转')
        // } else if (this.ruleForm.link_type === 2 && this.ruleForm.link_path === '') {
        //   return this.$message.error('请输入外部url')
        // }
        this.$request.addBanner(this.ruleForm).then(res => {
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
          this.show = false
        })
      }
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clear() {
      this.ruleForm.picture_name = ''
      this.ruleForm.position = ''
      this.ruleForm.source = ''
      this.ruleForm.type = ''
      this.ruleForm.link_type = ''
      this.ruleForm.link_path = ''
      this.baleImgList = []
      this.linkPath = ''
      this.state = ''
      this.id = ''
    },
    cancelDialog() {
      this.ruleForm.picture_name = ''
      this.ruleForm.position = ''
      this.ruleForm.source = ''
      this.linkPath = ''
      this.state = ''
      this.id = ''
      this.ruleForm.type = ''
      this.ruleForm.link_type = ''
      this.ruleForm.link_path = ''
      this.baleImgList = []
      this.show = false
    },
    init() {
      this.getLeftData()
    }
  }
}
</script>
<style lang="scss">
.dialog-banner {
  .banner-sty {
    width: 45% !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 200px;
  }
  .el-form-item__error {
    margin-left: 250px !important;
  }
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
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
    margin-left: 50px;
  }
  .img-item {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 148px;
    height: 148px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .model-box,
      .operat-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .operat-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    i {
      font-size: 20px;
      color: #fff;
      margin-right: 10px;
    }
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .px-sty {
    margin-left: 40px;
    color: #ccc;
  }
}
</style>
