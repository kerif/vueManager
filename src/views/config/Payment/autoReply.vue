<template>
  <div class="autoReply-container">
    <el-tabs v-model="activeName" @tab-click="onTabChange">
      <el-tab-pane :label="$t('关键词回复')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('被关注回复')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('收到消息回复')" name="3"></el-tab-pane>
    </el-tabs>
    <div v-if="this.activeName === '1'">
      <div class="main-top">
        <div class="number-sty">{{ $t('规则名称') }}:</div>
        <el-input v-model="expressName" class="input-sty" clearable> </el-input>
        <el-button @click="search">{{ $t('搜索') }}</el-button>
        <el-button @click="addNewRule" style="background-color: #3540a5; color: #fff">{{
          $t('添加新规则')
        }}</el-button>
      </div>
      <el-table :data="tableData" border style="width: 70%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="name" :label="$t('规则名称')"> </el-table-column>
        <el-table-column prop="keywords" :formatter="fileData" :label="$t('关键词')">
        </el-table-column>
        <el-table-column :label="$t('回复类型')">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('关键词回复') }}</span>
            <span v-if="scope.row.type === 2">{{ $t('被关注回复') }}</span>
            <span v-if="scope.row.type === 3">{{ $t('收到消息回复') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-dark-green btn-margin" @click="editRule(scope.row.id)">{{
              $t('修改')
            }}</el-button>
            <el-button class="btn-light-red" @click="deleteMsg(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="this.activeName === '2'">
      <div>
        <span>{{ $t('被关注回复') }}</span>
        <span>{{ $t('可以同时发两条消息') }}</span>
      </div>
      <el-form>
        <!-- 消息类型 -->
        <el-form-item
          :label="$t('消息类型')"
          v-for="(item, index) in replyList"
          :key="'reply-' + index"
        >
          <el-radio-group v-model="item.form">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            :rows="5"
            :placeholder="$t('请输入内容')"
            style="margin-left: 65px"
            v-model="item.content"
            v-if="item.form === 1"
          >
          </el-input>
          <div v-else style="margin-left: 65px">
            <span class="img-item" v-if="item.image">
              <img :src="$baseUrl.IMAGE_URL + item.image" alt="" class="goods-img" />
              <span class="model-box"></span>
              <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item.image)"></i>
                <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
              </span>
            </span>
            <el-upload
              v-show="!item.image"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="
                item => {
                  uploadBaleImg(index, item)
                }
              "
              :show-file-list="false"
            >
              <i class="el-icon-plus"> </i>
            </el-upload>
          </div>
          <i class="el-icon-circle-plus-outline" @click="addContent"></i>
          <i class="el-icon-remove-outline" @click="deleteContent(item)" v-if="index !== 0"></i>
        </el-form-item>
        <!-- <el-form-item :label="$t('消息类型')">
          <el-radio-group v-model="topMegType">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            style="margin-left: 65px"
            :rows="5"
            :placeholder="$t('请输入内容')"
            v-model="topMessage"
            v-if="this.topMegType === 1"
          >
          </el-input>
          <div v-else style="margin-left: 65px">
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
          </div>
        </el-form-item> -->
      </el-form>
    </div>
    <!-- 回复内容 -->
    <el-form v-if="this.activeName === '3'">
      <!-- <el-form-item :label="$t('回复内容')">
        <el-radio-group v-model="form">
          <el-radio :label="1">{{ $t('文字') }}</el-radio>
          <el-radio :label="2">{{ $t('图片') }}</el-radio>
        </el-radio-group>
        <el-input
          type="textarea"
          style="margin-left: 65px"
          :rows="5"
          :placeholder="$t('请输入内容')"
          v-model="content"
          v-if="this.form === 1"
        >
        </el-input>
        <div v-else style="margin-left: 65px">
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
        </div>
      </el-form-item> -->
      <el-form-item
        :label="$t('回复内容')"
        v-for="(item, index) in replyList"
        :key="'info-' + index"
      >
        <el-radio-group v-model="item.form">
          <el-radio :label="1">{{ $t('文字') }}</el-radio>
          <el-radio :label="2">{{ $t('图片') }}</el-radio>
        </el-radio-group>
        <el-input
          type="textarea"
          :rows="5"
          :placeholder="$t('请输入内容')"
          style="margin-left: 65px"
          v-model="item.content"
          v-if="item.form === 1"
        >
        </el-input>
        <div v-else style="margin-left: 65px">
          <span class="img-item" v-if="item.image">
            <img :src="$baseUrl.IMAGE_URL + item.image" alt="" class="goods-img" />
            <span class="model-box"></span>
            <span class="operat-box">
              <i class="el-icon-zoom-in" @click="onPreview(item.image)"></i>
              <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
            </span>
          </span>
          <el-upload
            v-show="!item.image"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="
              item => {
                uploadBaleImg(index, item)
              }
            "
            :show-file-list="false"
          >
            <i class="el-icon-plus"> </i>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="this.activeName !== '1'">
      <el-button style="background-color: #3540a5; color: #fff" @click="save">{{
        $t('保存')
      }}</el-button>
      <el-button @click="clear">{{ $t('删除回复') }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      activeName: '1',
      bottomMegType: 1,
      form: 1,
      content: '',
      expressName: '',
      tableData: [],
      image: '',
      replyList: [
        {
          form: '',
          content: '',
          image: ''
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    addNewRule() {
      dialog({ type: 'addRule', state: 'add', types: this.activeName }, () => {
        this.getList()
      })
    },
    editRule(id) {
      dialog({ type: 'addRule', state: 'edit', id: id, types: this.activeName }, () => {
        this.getList()
      })
    },
    addContent() {
      if (this.replyList.length >= 2) {
        return this.$message.error(this.$t('被关注回复最多只能同时发两条消息'))
      }
      this.replyList.push({
        form: '',
        content: '',
        image: ''
      })
    },
    deleteContent(item) {
      var index = this.replyList.indexOf(item)
      if (index !== -1) {
        this.replyList.splice(index, 1)
      }
    },
    save() {
      let param = {
        type: this.activeName,
        contents: this.replyList
      }
      this.$request.updateMsgReply(param).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          // this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    fileData(row) {
      let arr = []
      row.keywords.forEach((item, match) => {
        if (match > 2) {
          return
        }
        arr.push(item.keyword)
      })
      return arr.join(',')
    },
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDeleteImg(index) {
      this.replyList[index].image = ''
    },
    // 上传打包照片
    uploadBaleImg(index, item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          // res.data.forEach(item => {
          //   this.replyList[0].image = item.path
          // })
          this.replyList[index].image = res.data[0].path
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
    getList() {
      let param = {
        type: this.activeName,
        keyword: this.expressName
      }
      this.$request.replyMessageList(param).then(res => {
        this.tableData = res.data
        console.log(this.tableData)
      })
    },
    search() {
      this.getList()
    },
    clear() {
      this.image = ''
      this.replyList = [
        {
          form: 1,
          content: '',
          image: ''
        }
      ]
      this.content = ''
    },
    onTabChange(tab) {
      if (tab.name == 1) {
        this.getList(tab.name)
      } else {
        this.getMsgReply(tab.name)
      }
    },
    getMsgReply() {
      let param = {
        type: this.activeName
      }
      this.$request.getMsgReply(param).then(res => {
        console.log(res)
        this.replyList = res.data
      })
    },
    init() {
      this.getMsgReply()
    },
    deleteMsg(id) {
      this.$confirm(this.$t('您真的要删除此规则？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteReplyMessage(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
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
      })
    }
  }
}
</script>

<style lang="scss">
.autoReply-container {
  margin-left: 30px;
  font-size: 14px;
  background-color: #fff !important;
  .main-top {
    margin-top: 20px;
    margin-bottom: 20px;
    .number-sty {
      display: inline-block;
      margin-right: 10px;
    }
    .input-sty {
      width: 30%;
      margin-right: 10px;
    }
  }
  .el-textarea__inner {
    width: 70%;
  }
  .el-icon-circle-plus-outline:before {
    font-size: 24px;
    margin-left: 65px;
  }
  .el-icon-remove-outline:before {
    font-size: 24px;
    margin-left: 5px;
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
  .el-table tr th.is-leaf div {
    text-align: center;
  }
  .el-table td div {
    text-align: center;
  }
  .operat-box {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    opacity: 0;
  }
  .operat-box i {
    font-size: 20px;
    color: #fff;
    margin-right: 10px;
  }
}
</style>
