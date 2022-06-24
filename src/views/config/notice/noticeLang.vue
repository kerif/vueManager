<template>
  <div class="notice-lang">
    <div class="lang-sty">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('请注意以下内容请输入对应的') + '【' + this.lang.name + '】' + $t('信息') }}
      </p>
    </div>
    <el-form label-position="top" :model="params" ref="ruleForm" class="demo-ruleForm">
      <el-form-item :label="$t('标题')">
        <el-row>
          <el-col :span="10">
            <el-input :placeholder="$t('请输入内容')" v-model="params.title"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('封面图')" class="updateChe">
        <el-row>
          <el-col :span="6">
            <span class="img-item" v-for="(item, index) in customerList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
              <span class="model-box"></span>
              <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                <i class="el-icon-delete" @click="onDeleteCus(index)"></i>
              </span>
            </span>
            <el-upload
              v-show="customerList.length < 1"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadCustomer"
              :show-file-list="false"
            >
              <i class="el-icon-plus"> </i> </el-upload
            ><br />
          </el-col>
        </el-row>
      </el-form-item>
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
import dialog from '@/components/dialog'
export default {
  components: { editor },
  data() {
    return {
      params: {
        title: '',
        content: '',
        cover: [],
        language: ''
      },
      editor: null,
      customerList: [],
      line: {
        id: '',
        name: ''
      },
      lang: {
        name: '',
        language_code: ''
      },
      transCode: ''
    }
  },
  created() {
    this.line = JSON.parse(this.$route.params.line)
    this.lang = JSON.parse(this.$route.params.lang)
    this.transCode = this.$route.params.transCode
    this.params.language = this.lang.language_code
    if (this.transCode === 1) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request
        .noticeLang(this.line.id, {
          lang: this.params.language
        })
        .then(res => {
          if (res.ret) {
            this.params.title = res.data.title
            this.params.content = res.data.content
            res.data.cover && (this.customerList[0] = res.data.cover)
          }
        })
    },
    saveNotice(data) {
      this.params.content = data
      if (this.params.title === '') {
        return this.$message.error(this.$t('请输入标题'))
      } else if (this.params.content === '') {
        return this.$message.error(this.$t('请输入内容'))
      }
      if (this.customerList[0]) {
        this.params.cover = this.customerList[0]
      } else {
        this.params.cover = []
      }
      this.$request.updateNoticeLang(this.line.id, this.params).then(res => {
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
    },
    // 上传小程序预报页图
    uploadCustomer(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.customerList.push(item.path)
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
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除小程序预报页图
    onDeleteCus(index) {
      this.customerList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.notice-lang {
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
</style>

<style lang="scss">
.notice-lang {
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      width: 500px !important;
    }
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
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
  .suggest-btn {
    color: gray;
    font-size: 12px;
  }
}
</style>
