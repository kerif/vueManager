<template>
  <div class="public-list-container">
    <div class="searchGroup">
      <div class="search-box">
        <el-input class="searchfilter" :placeholder="$t('请输入关键字')" v-model="page_params.keyword"
          @search="goSearch"></el-input>
        <el-date-picker class="timeStyle" v-model="timeList" type="daterange" @change="onTime" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :range-separator="$t('至')" :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"></el-date-picker>
        <div class="submit">
          <el-button @click="getList()" class="searchBtn" type="primary" plain>
            {{ $t('搜索') }}
          </el-button>
        </div>
      </div>
      <div class="clear-box">
        <add-btn router="addPublic">{{ $t('新增') }}</add-btn>
      </div>
    </div>
    <div style="background-color: #f5f5f5;padding: 5px;"></div>
    <div style="background-color: #fff;padding:15px 20px">
      <div class="bottom-sty">
        <el-button @click="deleteData">{{ $t('删除') }}</el-button>
      </div>
      <div style="height: calc(100vh - 250px)">
        <el-table class="data-list" :data="transactionList" stripe border :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }" v-loading="tableLoading" ref="table" max-height="620"
          @selection-change="selectionChange">
          <el-table-column type="selection" width="55" fixed="left"></el-table-column>
          <!-- 公告标题 -->
          <el-table-column :label="$t('标题')" prop="title" width="400"></el-table-column>
          <el-table-column :label="$t('小程序链接')" prop="type" width="100">
            <template slot-scope="scope">
              <div class="copy-sty" @click="copyUrl('/pages/help/notice_detail/index', scope.row.id)">
                <i class="el-icon-copy-document"></i>
              </div>
            </template>
          </el-table-column>
          <!-- 发布人员 -->
          <el-table-column :label="$t('发布人员')" prop="operator"  min-width="200"> </el-table-column>
          <!-- 发布时间 -->
          <el-table-column :label="$t('发布时间')" prop="created_at"  min-width="170"> </el-table-column>
          <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty"
                @click="onLang(scope.row, item)"></span>
              <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" fixed="right" width="120px">
            <template slot-scope="scope">
              <el-button class="btn-deep-purple" @click="details(scope.row.id)">{{
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
      <nle-pagination style="margin-top: 5px" :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import AddBtn from '@/components/addBtn'
export default {
  data() {
    return {
      transactionList: [],
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: '',
      end_date: '',
      type: '',
      deleteNum: [],
      languageData: [],
      transCode: '',
      // voucherChange: []
    }
  },
  mixins: [pagination],
  name: 'transactionList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  // mounted(){
  //   this.$nextTick(() => {
  //     this.$refs.table.doLayout()
  //   })
  // },
  created() {
    this.getList()
    this.getLanguageList()
    if (this.$route.query.serial_number) {
      this.page_params.keyword = this.$route.query.serial_number
    }
    if (this.$route.query.times) {
      this.timeList = this.$route.query.times.split(' ')
      this.begin_date = this.timeList[0]
      this.end_date = this.timeList[1]
    }
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getAnnouncements(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transactionList = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
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
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .announcementsDelete({
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
    // 跳转到详情
    details(id) {
      this.$router.push({ name: 'editPublic', params: { id: id } })
    },
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 修改语言
    onLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      this.$router.push({
        name: 'publicLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.transCode
        }
      })
    }
    // 选择不同类型优惠券
    // onVocherTypeChange () {
    //   this.page_params.handleQueryChange('type', this.type)
    //   this.getList()
    // },
    // 获取下拉框
    // getTypes () {
    //   this.$request.getPaymentType().then(res => {
    //     if (res.ret) {
    //       this.voucherChange = res.data
    //     } else {
    //       this.$notify({
    //         title: '操作失败',
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss">
.el-dialog__wrapper {
  background: rgba(0, 0, 0, 0.3);
}

.public-list-container {
  background-color: #fff;

  .el-dialog__body {
    .img_box {
      text-align: center;

      img {
        width: 300px !important;
      }
    }
  }

  .add {
    display: none;
  }

  .searchGroup {
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 20px 15px;

    .search-box {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }

    .searchfilter {
      width: 30%;
    }

    .searchBtn {
      padding-left: 40px;
      padding-right: 40px;
      background-color: #fff !important;
      color: black;
      border: 1px solid #dcdfe6;

      &:hover {
        background: #3540a5 !important;
        color: #fff;
      }
    }

    .clear-box {
      float: right;

      .add-btn-container {
        background-color: #3b8ece !important;
        padding-left: 40px;
        padding-right: 40px;
      }
    }
  }

  .changeVou {
    margin-left: 20px;
  }

  .timeStyle {
    margin: 0 10px;
    width: 276px !important;
  }

  .bottom-sty {
    margin: 15px 0;
  }

  .bottom-sty button {
    font-weight: 600;
    padding: 10px 40px;
    color: #f56c6c;
    border-color: #f56c6c;

    &:hover {
      background: #f56c6c !important;
      color: #fff;
    }
  }

  .copy-sty {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
}
</style>
