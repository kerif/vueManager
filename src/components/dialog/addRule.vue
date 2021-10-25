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
          <el-select v-model="item.key" style="width: 20%" :placeholder="$t('半匹配')">
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
          <i
            class="el-icon-remove-outline"
            @click="deleteItem"
            v-if="ruleForm.dynamicItem.length === 2"
          ></i>
        </el-form-item>
      </div>
      <!-- 回复内容 -->
      <div v-for="(item, index) in ruleForm.replyList" :key="'info-' + index">
        <el-form-item :label="$t('回复内容')">
          <el-radio-group v-model="item.ansContent">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            :rows="5"
            :placeholder="$t('请输入内容')"
            v-model="item.content"
            v-if="item.ansContent === 1"
          >
          </el-input>
          <div v-else>
            <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
              <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
              <span class="model-box"></span>
              <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
                <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
              </span>
            </span>
            <el-upload
              v-show="baleImgList.length < 3"
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
          <i
            class="el-icon-remove-outline"
            @click="deleteContent"
            v-if="ruleForm.replyList.length === 2"
          ></i>
        </el-form-item>
      </div>
      <!-- 回复方式 -->
      <el-form-item :label="$t('回复方式')">
        <el-radio-group v-model="ruleForm.ansMethod">
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
        ansMethod: 1,
        dynamicItem: [
          {
            key: '',
            keyword: ''
          }
        ],
        replyList: [
          {
            ansContent: 1,
            content: ''
          }
        ]
      },
      baleImgList: [],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ],
      show: false
    }
  },
  created() {},
  methods: {
    addItem() {
      this.ruleForm.dynamicItem.push({
        key: '',
        keyword: ''
      })
    },
    deleteItem(item, index) {
      this.ruleForm.dynamicItem.splice(index, 1)
      console.log(this.ruleForm.dynamicItem, '删除')
    },
    addContent() {
      this.ruleForm.dynamic.push({
        ansContent: '',
        content: ''
      })
    },
    deleteContent(item, index) {
      this.ruleForm.dynamic.splice(index, 1)
      console.log(this.ruleForm.dynamic, '删除')
    },
    confirm() {
      let param = {
        type: this.activeName,
        reply_type: this.megType,
        ...this.ruleForm
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
        this.$request.updateReplyMessage().then(res => {
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
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
            console.log(item)
          })
        }
      })
    },
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
      console.log(index)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clear() {
      this.ruleForm.ruleName = ''
      this.ruleForm.keyword = ''
      this.ruleForm.ansContent = ''
      this.ruleForm.ansMethod = ''
      this.ruleForm.value = ''
      this.baleImgList = []
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
  }
  .el-icon-remove-outline:before {
    font-size: 24px;
  }
}
</style>
