<template>
  <div class="block-container">
    <!-- <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
    </div>
    <div class="select-box">
      <add-btn router="addSingle">{{$t('添加')}}</add-btn>
    </div> -->
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <!-- 全部 -->
      <el-tab-pane :label="$t('全部')" name="院"></el-tab-pane>
      <!-- 未开始 -->
      <el-tab-pane :label="$t('未开始')" name="2"></el-tab-pane>
      <!-- 进行中 -->
      <el-tab-pane :label="$t('进行中')" name="3"></el-tab-pane>
      <!-- 已失效 -->
      <el-tab-pane :label="$t('已失效')" name="4"></el-tab-pane>
    </el-tabs>
    <el-table
      :data="blockList"
      stripe
      border
      class="data-list"
      v-loading="tableLoading"
      @selection-change="selectionChange"
      height="550"
    >
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <!-- 区块名 -->
      <el-table-column :label="$t('区块名')" prop="name"> </el-table-column>
      <!-- 说明 -->
      <el-table-column :label="$t('说明')" prop="description"> </el-table-column>
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
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-deep-purple optionBtn" @click="editBlock(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
  </div>
</template>
<script>
// import dialog from '@/components/dialog'
// import { SearchGroup } from '@/components/searchs'
// import NlePagination from '@/components/pagination'
// import { pagination } from '@/mixin'
// import AddBtn from '@/components/addBtn'
export default {
  data() {
    return {
      blockList: [],
      activeName: '1',
      localization: {},
      tableLoading: false,
      timeList: [],
      begin_date: '',
      end_date: '',
      type: '',
      section: '',
      deleteNum: [],
      languageData: [],
      statusList: [
        {
          id: 0,
          name: this.$t('待审核')
        },
        {
          id: 1,
          name: this.$t('审核通过')
        },
        {
          id: 2,
          name: this.$t('审核拒绝')
        }
      ]
    }
  },
  // mixins: [pagination],
  name: 'blockList',
  components: {
    // SearchGroup,
    // NlePagination,
    // AddBtn
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  created() {
    this.getList()
    this.getLanguageList()
    // if (this.$route.query.serial_number) {
    //   this.page_params.keyword = this.$route.query.serial_number
    // }
    // if (this.$route.query.times) {
    //   this.timeList = this.$route.query.times.split(' ')
    //   this.begin_date = this.timeList[0]
    //   this.end_date = this.timeList[1]
    // }
  },
  methods: {
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    getList() {
      this.tableLoading = true
      // let params = {
      //   page: this.page_params.page,
      //   size: this.page_params.size,
      //   section: this.section
      // }
      // this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.$request.getBlocks().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.blockList = res.data
          this.localization = res.localization
          // this.page_params.page = res.meta.current_page
          // this.page_params.total = res.meta.total
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
    // 修改语言
    onLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      this.$router.push({
        name: 'pageLang',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.transCode
        }
      })
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        console.log(this.deleteNum, '2222')
        this.$request
          .deletePage({
            ids: this.deleteNum
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
    // 详情
    editBlock(id) {
      this.$router.push({
        name: 'blockEdit',
        params: {
          id: id
        }
      })
    },
    onTabChange(tab) {
      switch (tab.name) {
        case '1': // 全部
          this.status = ''
          break
        case '2': // 未开始
          this.status = 1
          break
        case '3': // 进行中
          this.status = 2
          break
        case '4': // 已失效
          this.status = 3
          break
      }
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.block-container {
  .tabLength {
    width: 350px !important;
  }
  .changeVou {
    margin-left: 20px;
  }
  .timeStyle {
    margin-right: 10px;
    width: 276px !important;
  }
  .chooseStatus {
    margin-left: 10px;
    width: 150px;
    display: inline-block;
  }
  .select-box {
    overflow: hidden;
  }
}
</style>
