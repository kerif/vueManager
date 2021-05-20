<template>
  <div class="add-edit-column">
    <el-form label-position="top" class="voucher-form" :model="ruleForm" ref="ruleForm">
      <!-- 上级栏目 -->
      <el-form-item :label="$t('上级栏目')" v-if="this.$route.params.state === 'second'">
        <el-select v-model="ruleForm.parent_id" :placeholder="$t('上级栏目')">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 排序 -->
      <el-form-item :label="$t('排序')">
        <el-input
          class="input-sty"
          :disabled="fixed === 1 ? true : false"
          :placeholder="$t('请输入排序')"
          v-model="ruleForm.sort_index"
        ></el-input>
      </el-form-item>
      <!-- 栏目名称 -->
      <el-form-item :label="'*' + $t('栏目名称')">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入栏目名称')"
          v-model="ruleForm.name"
        ></el-input>
      </el-form-item>
      <!-- 栏目图片 -->
      <el-form-item :label="$t('栏目图片')" class="updateChe">
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
          :http-request="customerImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('栏目类型')">
        <el-select
          v-model="ruleForm.type"
          :placeholder="$t('栏目类型')"
          @change="clearType"
          :disabled="fixed === 1 ? true : false"
        >
          <el-option v-for="item in columnType" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 文章类型 -->
      <el-form-item :label="$t('文章类型')" v-if="ruleForm.type === 1 || ruleForm.type === 4">
        <el-select v-model="ruleForm.article_type" :placeholder="$t('文章类型')">
          <el-option v-for="item in articleType" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('标题列表')" v-if="ruleForm.type === 1 || ruleForm.type === 3">
        <el-button class="btn-deep-blue" @click="chooseLine">{{ $t('选择标题') }}</el-button>
        <p>{{ ruleForm.title }}</p>
        <!-- <div class="display-line" v-if="this.lineName">
        </div> -->
      </el-form-item>
      <!-- 栏目URL -->
      <el-form-item :label="$t('栏目URL')" v-if="ruleForm.type === 2">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入栏目URL')"
          v-model="ruleForm.value"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      options: [],
      ruleForm: {
        name: '',
        article_type: '',
        value: '',
        parent_id: '',
        sort_index: '',
        title: '',
        image: []
      },
      columnType: [
        {
          id: 1,
          name: this.$t('单篇文章')
        },
        {
          id: 2,
          name: this.$t('链接')
        },
        {
          id: 3,
          name: this.$t('单页')
        },
        {
          id: 4,
          name: this.$t('多篇文章')
        }
      ],
      articleType: [],
      type: '',
      lineName: {}, // 保存获取到的路线
      customerList: []
    }
  },
  created() {
    this.getArticle()
    if (this.$route.params.id) {
      this.getList()
      this.fixed = this.$route.params.fixed
      console.log(this.fixed, 'this.fixed')
    }
    if (this.$route.params.state === 'second') {
      this.getParent()
    }
    if (this.$route.params.parent) {
      this.ruleForm.parent_id = this.$route.params.parent
    }
  },
  methods: {
    getList() {
      this.$request.getAloneWebsites(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          res.data.image && (this.customerList[0] = res.data.image)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取上级栏目数据
    getParent() {
      this.$request.parentData().then(res => {
        if (res.ret) {
          this.options = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取文章类型数据
    getArticle() {
      this.$request.articleData().then(res => {
        if (res.ret) {
          this.articleType = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 切换栏目类型清除数据
    clearType() {
      this.ruleForm.article_type = ''
    },
    // 选择标题
    chooseLine() {
      if (this.ruleForm.type === 1 && !this.ruleForm.article_type) {
        return this.$message.error(this.$t('请选择文章类型'))
      }
      // if (!this.ruleForm.article_type) {
      //   return this.$message.error(this.$t('请选择文章类型'))
      // }
      if (this.ruleForm.type === 1) {
        dialog({ type: 'columnChoose', id: this.ruleForm.article_type, state: 'article' }, data => {
          // console.log(data, '我是路线data')
          this.ruleForm.title = data.title
          console.log(this.lineName, 'this.lineName ')
          this.ruleForm.value = data.id
        })
      } else if (this.ruleForm.type === 3) {
        dialog({ type: 'columnChoose', state: 'page' }, data => {
          // console.log(data, '我是路线data')
          this.ruleForm.title = data.title
          console.log(this.lineName, 'this.lineName ')
          this.ruleForm.value = data.id
        })
      }
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除pc端二维码
    onDeleteCus(index) {
      this.customerList.splice(index, 1)
    },
    customerImg(item) {
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
    // 保存
    submit() {
      if (this.customerList[0]) {
        this.ruleForm.image = this.customerList[0]
      } else {
        this.ruleForm.image = []
      }
      if (!this.ruleForm.name) {
        return this.$message.error(this.$t('请输入栏目名称'))
      }
      // if (!this.customerList[0]) {
      //   return this.$message.error(this.$t('请上传pc端客户二维码'))
      // }
      if (this.$route.params.id) {
        // 编辑
        this.$request.editArticle(this.$route.params.id, this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        // 新建
        this.$request.addArticle(this.ruleForm).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.go(-1)
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.add-edit-column {
  background-color: #fff !important;
  padding: 20px;
  .voucher-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .input-sty {
    width: 40%;
  }
  .choose-btn {
    margin-bottom: 20px;
    // margin-left: 80px;
    .el-button {
      vertical-align: top;
    }
  }
  .display-line {
    display: inline-block;
    padding: 5px;
    width: 245px;
    margin-left: 15px;
    // line-height: 25px;
    background-color: #ccc;
    // margin-bottom: 20px;
    p {
      margin: 0;
    }
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
    // margin-left: 50px;
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
}
</style>
