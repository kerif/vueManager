<template>
  <div class="notice-add-container">
    <el-form label-position="top">
      <el-form-item :label="$t('标题')">
        <el-row>
          <el-col :span="10"
            ><el-input :placeholder="$t('请输入内容')" v-model="params.title"></el-input
          ></el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('文章分类')">
        <el-row>
          <el-col :span="10">
            <el-radio-group v-model="params.type_id" class="type-sty">
              <el-radio v-for="item in updateProp" :key="item.id" :label="item.id"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-col>
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
            <span class="suggest-btn">{{ $t('建议尺寸') }}:160px*80px</span>
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
import dialog from '@/components/dialog'
import editor from '@/components/editor.vue'
export default {
  components: { editor },
  data() {
    return {
      params: {
        title: '',
        type_id: '',
        cover: [],
        content: ''
      },
      customerList: [],
      updateProp: [],
      editor: null
    }
  },
  created() {
    this.getTypes()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getNoticeDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.params.title = res.data.title
          this.params.content = res.data.content
          res.data.cover && (this.customerList[0] = res.data.cover)
          this.params.type_id = res.data.type
        }
      })
    },
    getTypes() {
      this.$request.getArticlesType().then(res => {
        if (res.ret) {
          this.updateProp = res.data
        }
      })
    },
    saveNotice(data) {
      this.params.content = data
      if (this.customerList[0]) {
        this.params.cover = this.customerList[0]
      } else {
        this.params.cover = []
      }
      if (!this.$route.params.id) {
        // 如果是新增状态
        this.$request.saveNotice(this.params).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.$router.push({ name: 'noticelist' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        // 如果是编辑状态
        this.$request.saveNoticeDetails(this.$route.params.id, this.params).then(res => {
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
.notice-add-container {
  background-color: #fff !important;
  .type-sty {
    .el-radio {
      margin-bottom: 10px;
    }
  }
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
