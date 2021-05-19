<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('添加链接') : $t('编辑链接')"
    class="link-add-edit-container"
    @close="clear"
  >
    <el-form label-position="top" class="voucher-form" :model="ruleForm" ref="ruleForm">
      <!-- 排序 -->
      <el-form-item :label="$t('排序')">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入排序')"
          v-model="ruleForm.sort_index"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('链接类型')">
        <el-select v-model="ruleForm.type" :placeholder="$t('链接类型')" @change="clearType">
          <el-option v-for="item in columnType" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 文章类型 -->
      <el-form-item :label="$t('文章类型')" v-if="ruleForm.type === 1">
        <el-select
          v-model="ruleForm.article_type"
          :placeholder="$t('文章类型')"
          @change="changeType"
        >
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
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirmShip">{{ $t('确定') }}</el-button>
    </div>
    <!-- 创建发货单 -->
    <el-dialog
      :visible.sync="innerVisible"
      :title="$t('选择标题')"
      class="dialog-choose-title"
      @close="clearTitle"
      width="60%"
      append-to-body
    >
      <div class="searchUser">
        <el-input :placeholder="$t('请输入关键字')" v-model="keyword" @keyup.enter.native="getList">
          <template slot="append">
            <span @click="getList" class="search-btn">{{ $t('搜索') }}</span>
          </template>
        </el-input>
      </div>
      <el-table :data="tableData" border @row-click="onRowChange" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <!-- 标题 -->
        <el-table-column prop="title" :label="$t('标题')"> </el-table-column>
      </el-table>
      <div class="pagination-box">
        <nle-pagination :pageParams="page_params"></nle-pagination>
      </div>
      <div slot="footer">
        <el-button @click="returnShip">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      innerVisible: false,
      invoice: {
        sn: ''
      },
      ruleForm: {
        article_type: '',
        value: '',
        parent_id: '',
        sort_index: '',
        title: ''
      },
      columnType: [
        {
          id: 1,
          name: this.$t('文章')
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
          name: this.$t('栏目')
        }
      ],
      state: '',
      chooseId: 0,
      user: {},
      tableData: [],
      keyword: '',
      articleType: []
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    // 切换栏目类型清除数据
    clearType() {
      this.ruleForm.article_type = ''
    },
    getName(val) {
      console.log(val)
    },
    confirmShip() {},
    getList() {
      if (this.ruleForm.type === 1) {
        this.getTitle()
      } else if (this.ruleForm.type === 3) {
        this.getPage()
      }
    },
    // 类型 文章
    getTitle() {
      this.$request
        .titleData(this.ruleForm.article_type, {
          keyword: this.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 类型 单页
    getPage() {
      this.$request
        .titlePageData({
          keyword: this.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
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
    // 选择标题
    chooseLine() {
      if (this.ruleForm.type === 1 && !this.ruleForm.article_type) {
        return this.$message.error(this.$t('请选择文章类型'))
      }
      this.innerVisible = true
      this.show = false
      this.getList()
      // if (!this.ruleForm.article_type) {
      //   return this.$message.error(this.$t('请选择文章类型'))
      // }
      if (this.ruleForm.type === 1) {
        // console.log(data, '我是路线data')
        // this.ruleForm.title = data.title
        console.log(this.lineName, 'this.lineName ')
        // this.ruleForm.value = data.id
        // dialog({ type: 'columnChoose', id: this.ruleForm.article_type, state: 'article' }, data => {
        // })
      } else if (this.ruleForm.type === 3) {
        // dialog({ type: 'columnChoose', state: 'page' }, data => {
        //   // console.log(data, '我是路线data')
        // })
        // this.ruleForm.title = data.title
        // console.log(this.lineName, 'this.lineName ')
        // this.ruleForm.value = data.id
      }
    },
    // 创建发货单 取消
    returnShip() {
      this.innerVisible = false
      this.show = true
    },
    onRowChange(row) {
      this.chooseId = row.id
      this.user = row
      // console.log(this.user, 'this.user')
    },
    changeType() {
      this.user = {}
      this.ruleForm.title = ''
      this.ruleForm.value = ''
    },
    // 确认加入发货单
    confirm() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      console.log(this.user, '1111')
      this.success(this.user)
      // console.log(data, '我是路线data')
      this.innerVisible = false
      this.show = true
      this.ruleForm.title = this.user.title
      // console.log(this.lineName, 'this.lineName ')
      this.ruleForm.value = this.user.id
      // this.$request.updateShipment(this.id, this.invoice.sn).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       type: 'success',
      //       title: '操作成功',
      //       message: res.msg
      //     })
      //     this.show = false
      //     this.success()
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      //   this.show = false
      // })
    },
    clear() {
      this.ruleForm.warehouse_id = ''
      this.ruleForm.name = ''
      this.ruleForm.remark = ''
      this.invoice.sn = ''
    },
    init() {
      this.getArticle()
    }
  }
}
</script>
<style lang="scss" scope>
.link-add-edit-container {
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
  .created-btn {
    margin-left: 5px;
  }
  .content-long {
    .el-scrollbar {
      width: 200px !important;
    }
  }
  .input-sty {
    width: 40%;
  }
}
.dialog-choose-title {
  .searchUser {
    width: 40%;
    text-align: right;
    margin: 10px 0;
  }
  .el-select {
    width: 60%;
  }
  .el-textarea {
    width: 250px !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 100px;
  }
  .el-form-item__error {
    margin-left: 100px !important;
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
}
.el-select-dropdown__item.hover {
  width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap; /*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
</style>
