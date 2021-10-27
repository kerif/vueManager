<template>
  <el-dialog :visible.sync="show" :title="$t('规则设置')" @close="clear" class="dialog-addRule">
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
      <!-- 规则名称 -->
      <el-form-item :label="$t('规则名称')">
        <el-input
          v-model="ruleForm.ruleName"
          style="width: 40%"
          :placeholder="$t('请输入规则名称,最多60个字')"
        >
        </el-input>
      </el-form-item>
      <!-- 关键词 -->
      <div v-for="(item, index) in ruleForm.dynamicItem" :key="index">
        <el-form-item :label="$t('关键词')">
          <el-select v-model="item.match" style="width: 20%" :placeholder="$t('半匹配')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input v-model="item.keyword" style="width: 50%" :placeholder="$t('请输入关键词')">
          </el-input>
          <i class="el-icon-circle-plus-outline" @click="addItem"></i>
          <i class="el-icon-remove-outline" @click="deleteItem(item)" v-if="index !== 0"></i>
        </el-form-item>
      </div>
      <!-- 回复内容 -->
      <div v-for="(item, index) in ruleForm.replyList" :key="'info-' + index">
        <el-form-item :label="$t('回复内容')">
          <el-radio-group v-model="item.form">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            :rows="5"
            :placeholder="$t('请输入内容')"
            v-model="item.content"
            v-if="item.form === 1"
          >
          </el-input>
          <div v-else>
            <span class="img-item" v-if="item.image">
              <img :src="$baseUrl.IMAGE_URL + item.image" alt="" class="goods-img" />
              <span class="model-box"></span>
              <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item.image)"></i>
                <i class="el-icon-delete" @click="onDeleteImg"></i>
              </span>
            </span>
            <el-upload
              v-show="!item.image"
              class="avatar-uploader"
              action=""
              list-type="picture-card"
              :http-request="uploadBaleImg"
              :show-file-list="false"
            >
              <i class="el-icon-plus"> </i>
            </el-upload>
          </div>
          <i class="el-icon-circle-plus-outline" @click="addContent"></i>
          <i class="el-icon-remove-outline" @click="deleteContent(item)" v-if="index !== 0"></i>
        </el-form-item>
      </div>
      <!-- 回复方式 -->
      <el-form-item :label="$t('回复方式')">
        <el-radio-group v-model="ruleForm.reply_type">
          <el-radio :label="1">{{ $t('随机一条') }}</el-radio>
          <el-radio :label="2">{{ $t('回复全部') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button style="background-color: #3540a5; color: #fff" @click="confirm">{{
        $t('保存')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        ruleName: '',
        reply_type: 1,
        dynamicItem: [
          {
            match: '',
            keyword: ''
          }
        ],
        replyList: [
          {
            form: '',
            content: '',
            image: ''
          }
        ]
      },
      options: [
        {
          value: '0',
          label: '半匹配'
        },
        {
          value: '1',
          label: '全匹配'
        }
      ],
      show: false,
      types: '',
      image: '',
      id: ''
    }
  },
  created() {},
  methods: {
    addItem() {
      this.ruleForm.dynamicItem.push({
        match: '',
        keyword: ''
      })
    },
    deleteItem(item) {
      var index = this.ruleForm.dynamicItem.indexOf(item)
      if (index !== -1) {
        this.ruleForm.dynamicItem.splice(index, 1)
      }
    },
    addContent() {
      this.ruleForm.replyList.push({
        form: '',
        content: '',
        image: ''
      })
    },
    deleteContent(item) {
      var index = this.ruleForm.replyList.indexOf(item)
      if (index !== -1) {
        this.ruleForm.replyList.splice(index, 1)
      }
    },
    getMsgDetail() {
      this.$request.replyMessageDetail(this.id).then(res => {
        console.log(res.data)
        this.ruleForm.ruleName = res.data.name
        this.ruleForm.dynamicItem = res.data.keywords
        this.ruleForm.reply_type = res.data.reply_type
        this.ruleForm.replyList = res.data.contents
      })
    },
    init() {
      if (this.state === 'edit') {
        this.getMsgDetail()
      }
    },
    confirm() {
      let param = {
        type: this.types,
        reply_type: this.ruleForm.reply_type,
        name: this.ruleForm.ruleName,
        keywords: this.ruleForm.dynamicItem,
        contents: this.ruleForm.replyList
        // image: this.image
      }
      if (this.state === 'add') {
        this.$request.addReplyMessage(param).then(res => {
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
        this.$request.updateReplyMessage(this.id, param).then(res => {
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
    },
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDeleteImg() {
      this.ruleForm.replyList[0].image = ''
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          // this.image = res.data[0].path
          res.data.forEach(item => {
            this.ruleForm.replyList[0].image = item.path
          })
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
    clear() {
      this.ruleForm.ruleName = ''
      this.ruleForm.dynamicItem = [{ match: '', keyword: '' }]
      this.ruleForm.replyList = [{ form: '', content: '' }]
      this.image = ''
    }
  }
}
</script>

<style lang="scss">
.dialog-addRule {
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
  .el-textarea__inner {
    width: 70%;
  }
  .el-icon-circle-plus-outline:before {
    font-size: 24px;
    cursor: pointer;
  }
  .el-icon-remove-outline:before {
    font-size: 24px;
    cursor: pointer;
  }
}
</style>
