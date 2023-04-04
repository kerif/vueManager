<template>
  <div class="notice-list-container">
    <div class="headerList">
      <div class="bottom-sty">
        <el-button size="small" @click="deleteData">{{ $t('删除') }}</el-button>
      </div>
      <add-btn router="noticeadd">{{ $t('添加') }} </add-btn>
      <div class="changeVou">
        <el-select
          v-model="type"
          @change="onVocherTypeChange"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option v-for="item in updateProp" :key="item.id" :value="item.id" :label="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="clear"></div>
    </div>
    <div style="height: calc(100vh - 275px)">
      <el-table
        class="data-list"
        stripe
        border
        :data="noticeList"
        @selection-change="selectionChange"
        ref="table"
        v-loading="tableLoading"
        height="calc(100vh - 275px)"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column :label="$t('标题')" prop="title" width="500">
          <template slot-scope="scope">
            <div
              :title="scope.row.url + '?id=' + scope.row.id"
              class="copy-sty"
              @click="copyUrl(scope.row.url, scope.row.id)"
            >
              <span>{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('小程序链接')" prop="type" width="100">
          <template slot-scope="scope">
            <div
              :title="scope.row.url + '?id=' + scope.row.id"
              class="copy-sty"
              @click="copyUrl(scope.row.url, scope.row.id)"
            >
              <i class="el-icon-copy-document"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('类型')" prop="type">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('常见问题') }}</span>
            <span v-if="scope.row.type === 2">{{ $t('违禁品') }}</span>
            <span v-if="scope.row.type === 3">{{ $t('入门教程') }}</span>
            <span v-if="scope.row.type === 4">{{ $t('行业资讯') }}</span>
            <span v-if="scope.row.type === 5">{{ $t('关于我们') }}</span>
            <span v-if="scope.row.type === 6">{{ $t('新闻') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('创建人')" prop="creator"></el-table-column>
        <!-- 创建时间 -->
        <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
        <el-table-column
          :label="item.name"
          v-for="item in formatLangData"
          :key="item.id"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row['trans_' + item.language_code]"
              class="el-icon-check icon-sty"
              @click="onLang(scope.row, item)"
            ></span>
            <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-green" @click="noticeEdit(scope.row.id)">{{
              $t('修改')
            }}</el-button>
          </template>
        </el-table-column>
        <!-- <template slot="append">
        <div class="append-box">
        </div>
      </template> -->
      </el-table>
    </div>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
  </div>
</template>
<script>
import AddBtn from '@/components/addBtn'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  mixins: [pagination],
  components: {
    AddBtn,
    NlePagination
  },
  name: 'noticeList',
  data() {
    return {
      noticeList: [],
      tableLoading: false,
      deleteNum: [],
      languageData: [],
      transCode: '',
      type: '',
      updateProp: []
    }
  },
  created() {
    this.getList()
    this.getType() // 获取筛选数据
    this.getLanguageList() // 获取支持语言
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getNotice({
          page: this.page_params.page,
          size: this.page_params.size,
          type: this.type
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.noticeList = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 获取全部筛选数据
    getType() {
      this.$request.getArticlesType().then(res => {
        if (res.ret) {
          this.updateProp = res.data
        }
      })
    },
    noticeEdit(id) {
      this.$router.push({
        name: 'noticeEdit',
        params: {
          id: id
        }
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    copyUrl(url, id) {
      const href = `${url}?id=${id}`
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', href)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    // 删除
    deleteData() {
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .deleteNotice({
            DELETE: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 筛选
    onVocherTypeChange() {
      this.page_params.page = 1
      this.page_params.handleQueryChange('type', this.type)
      this.getList()
    },
    // 修改语言
    onLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      this.$router.push({
        name: 'noticeLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.transCode
        }
      })
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>

<style lang="scss">
.notice-list-container {
  padding: 10px 15px;
  background-color: #fff !important;
  .copy-sty {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  .icon-sty {
    cursor: pointer;
    // padding-left: 20px;
    font-weight: 700;
    color: black;
  }
  .headerList {
    position: relative;
    .changeVou {
      float: right;
      margin-right: 10px;
      // margin-bottom: 15px;
      .el-input {
        width: 98%;
      }
    }
    .bottom-sty {
      display: inline-block;
      vertical-align: middle;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .clear {
      clear: both;
    }
  }
}
</style>
