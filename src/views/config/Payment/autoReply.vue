<template>
  <div class="autoReply-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('关键词回复')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('被关注回复')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('收到消息回复')" name="3"></el-tab-pane>
    </el-tabs>
    <div v-if="this.activeName === '1'">
      <div class="main-top">
        <div class="number-sty">{{ $t('规则名称') }}:</div>
        <el-input v-model="expressName" class="input-sty"> </el-input>
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
            <span v-if="scope.row.reply_type === 0">{{ $t('全部') }}</span>
            <span v-if="scope.row.reply_type === 1">{{ $t('随机') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <el-button class="btn-dark-green btn-margin" @click="editRule(scope.row.id)">{{
            $t('修改')
          }}</el-button>
          <el-button class="btn-light-red" @click="deleteMsg(scope.row.id)">{{
            $t('删除')
          }}</el-button>
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
        <el-form-item :label="$t('消息类型')">
          <el-radio-group v-model="megType">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            style="margin-left: 65px"
            :rows="5"
            :placeholder="$t('请输入内容')"
            v-model="textarea"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('消息类型')">
          <el-radio-group v-model="megType">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            style="margin-left: 65px"
            :rows="5"
            :placeholder="$t('请输入内容')"
            v-model="textarea"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 回复内容 -->
    <el-form v-if="this.activeName === '3'">
      <el-form-item :label="$t('回复内容')">
        <el-radio-group v-model="ansContent">
          <el-radio :label="1">{{ $t('文字') }}</el-radio>
          <el-radio :label="2">{{ $t('图片') }}</el-radio>
        </el-radio-group>
        <el-input
          type="textarea"
          style="margin-left: 65px"
          :rows="5"
          :placeholder="$t('请输入内容')"
          v-model="textarea"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="this.activeName !== '1'">
      <el-button style="background-color: #3540a5; color: #fff">{{ $t('保存') }}</el-button>
      <el-button>{{ $t('删除回复') }}</el-button>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      activeName: '1',
      megType: 1,
      textarea: '',
      expressName: '',
      baleImgList: [],
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    addNewRule() {
      dialog({ type: 'addRule', state: 'add' }, () => {
        this.getList()
      })
    },
    editRule(id) {
      dialog({ type: 'addRule', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    save() {},
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
      this.baleImgList.splice(index, 1)
      console.log(index)
    },
    // 上传打包照片
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
    search() {},
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
  }
  .el-icon-remove-outline:before {
    font-size: 24px;
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
}
</style>
