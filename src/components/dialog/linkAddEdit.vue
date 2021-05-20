<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'add' ? $t('添加链接') : $t('编辑链接')"
    class="link-add-edit-container"
    @close="clear"
  >
    <el-form label-position="top" class="voucher-form" :model="ruleForm" ref="ruleForm">
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 名称 -->
          <el-form-item :label="$t('名称')">
            <el-input :placeholder="$t('请输入名称')" v-model="ruleForm.linkName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('排序')">
            <el-input :placeholder="$t('请输入排序')" v-model="ruleForm.sort_index"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('链接类型')">
            <el-select v-model="ruleForm.type" :placeholder="$t('链接类型')" @change="clearType">
              <el-option
                v-for="item in columnType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="ruleForm.type === 1">
          <!-- 文章类型 -->
          <el-form-item :label="$t('文章类型')">
            <el-select
              v-model="ruleForm.article_type"
              :placeholder="$t('文章类型')"
              @change="changeType"
            >
              <el-option
                v-for="item in articleType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="ruleForm.type === 2">
          <!-- 栏目URL -->
          <el-form-item :label="$t('URL')">
            <el-input :placeholder="$t('请输入URL')" v-model="ruleForm.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('*标题列表')" v-if="ruleForm.type === 1 || ruleForm.type === 3">
        <el-button class="btn-deep-blue" @click="chooseLine">{{ $t('选择标题') }}</el-button>
        <p>{{ ruleForm.title }}</p>
        <!-- <div class="display-line" v-if="this.lineName">
        </div> -->
      </el-form-item>
      <el-row :gutter="20" v-if="ruleForm.type === 4">
        <el-col :span="10">
          <el-select v-model="onceType" :placeholder="$t('一级栏目')" @change="changecolumn">
            <el-option
              v-for="item in columnData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-select
            v-model="secondType"
            :placeholder="$t('二级栏目')"
            :disabled="onceType === '' ? true : false"
          >
            <el-option
              v-for="item in secondColumn"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-form-item v-for="item in stringData" :key="item.id" :label="item.name">
        <el-input
          v-model="item.value"
          type="textarea"
          class="input-sty"
          :rows="2"
          :placeholder="$t('请输入内容')"
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
        linkName: '',
        article_type: '',
        value: '',
        sort_index: '',
        title: '',
        type: ''
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
      articleType: [],
      stringData: [],
      columnData: [],
      secondColumn: [],
      onceType: '',
      secondType: '',
      columnId: ''
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  // computed: {
  //   formatLangData() {
  //     return this.stringData.filter(item => item.language_code !== 'zh_CN')
  //   }
  // },
  methods: {
    // 获取全部支持语言
    getString() {
      this.$request.getString().then(res => {
        if (res.ret) {
          this.stringData = res.data.filter(item => item.language_code !== 'zh_CN')
          console.log(this.stringData, '11111')
          if (this.state === 'edit') {
            this.getDetails()
          }
        }
      })
    },
    // 获取详细数据
    getDetails() {
      this.$request.linkDetails(this.id).then(res => {
        if (res.ret) {
          this.ruleForm.article_type = res.data.article_type
          this.ruleForm.linkName = res.data.name
          this.ruleForm.value = Number(res.data.value)
          console.log(typeof this.ruleForm.value, 'value')
          this.ruleForm.sort_index = res.data.sort_index
          this.ruleForm.title = res.data.title
          this.ruleForm.type = res.data.type
          console.log(typeof res.data.type, 'type1111')
          this.stringData = this.stringData.map(item => {
            const value = res.data.name_translations[item.language_code]
            return {
              ...item,
              value
            }
          })
        }
      })
    },
    // 获取一级栏目
    getColumn() {
      this.$request.getWebsites().then(res => {
        if (res.ret) {
          this.columnData = res.data
        }
      })
    },
    // 获取二级栏目
    getSecondColumn() {
      this.$request.getSecondWebsites(this.onceType).then(res => {
        if (res.ret) {
          this.secondColumn = res.data
        }
      })
    },
    changecolumn() {
      this.secondType = ''
      if (this.onceType) {
        this.getSecondColumn()
      }
    },
    // 切换栏目类型清除数据
    clearType() {
      console.log(this.ruleForm.type, 'ruleForm.type')
      this.ruleForm.article_type = ''
      this.onceType = ''
      this.secondType = ''
      if (this.ruleForm.type === 4) {
        this.getColumn()
      }
    },
    confirmShip() {
      console.log(this.ruleForm.value, '提交的value')
      let translation = {}
      this.stringData.forEach(item => {
        translation[item.language_code] = item.value
      })
      console.log(translation, 'translation')
      let method = this.state === 'add' ? 'newLinkDetails' : 'updateLinkDetails'
      this.$request[method](this.id, {
        ...this.ruleForm,
        article_type:
          this.ruleForm.type === 4
            ? this.secondType
              ? this.secondType
              : this.onceType
            : this.ruleForm.article_type,
        value:
          this.ruleForm.type === 4
            ? this.secondType
              ? this.secondType
              : this.onceType
            : this.ruleForm.value,
        name: this.ruleForm.linkName,
        name_translations: translation
      }).then(res => {
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
    },
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
      // this.show = false
      this.getList()
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
    },
    clear() {
      this.ruleForm.linkName = ''
      this.ruleForm.article_type = ''
      this.ruleForm.value = ''
      this.ruleForm.sort_index = ''
      this.ruleForm.title = ''
      this.user = {}
      this.state = ''
      this.ruleForm.type = ''
    },
    init() {
      this.getArticle()
      this.getString()
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
