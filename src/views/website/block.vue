<template>
  <div class="block-container">
    <!-- <div class="select-box">
      <add-btn router="addSingle">{{$t('添加')}}</add-btn>
    </div> -->
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <!-- 原版官网 -->
      <!-- <el-tab-pane :label="$t('原版官网')" name="5"></el-tab-pane> -->
      <!-- 网站 -->
      <el-tab-pane :label="$t('网站')" name="1"></el-tab-pane>
      <!-- 首页 -->
      <el-tab-pane :label="$t('首页')" name="2"></el-tab-pane>
      <!-- 底栏 -->
      <el-tab-pane :label="$t('底栏')" name="3"></el-tab-pane>
      <!-- 关于我们 -->
      <el-tab-pane :label="$t('关于我们')" name="4"></el-tab-pane>
    </el-tabs>
    <div class="headerList">
      <div class="import-list">
        <el-button size="small" @click="blockDescription">{{ $t('区块说明') }}</el-button>
      </div>
      <div class="headr-r">
        <div class="searchGroup">
          <search-group
            :placeholder="$t('请输入关键字')"
            v-model="keyword"
            @keyup.enter.native="getList"
            @click="getList"
          ></search-group>
        </div>
      </div>
    </div>
    <el-table
      :data="blockList"
      stripe
      border
      class="data-list"
      v-loading="tableLoading"
      @selection-change="selectionChange"
      height="calc(100vh - 270px)"
    >
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <!-- 说明 -->
      <el-table-column :label="$t('区块说明')" prop="description"> </el-table-column>
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
            @click="onLang(scope.row, item, scope.row.type)"
          ></span>
          <span
            v-else
            class="el-icon-plus icon-sty"
            @click="onLang(scope.row, item, scope.row.type)"
          ></span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            v-if="activeName === '5'"
            class="btn-deep-purple optionBtn"
            @click="editBlock(scope.row.id, 'origin')"
            >{{ $t('编辑') }}</el-button
          >
          <el-button
            @click="editBlock(scope.row.id, 'others')"
            v-if="scope.row.type === 1 && activeName !== '5'"
            class="btn-green"
            >{{ $t('编辑') }}</el-button
          >
          <el-button
            @click="editImages(scope.row.id)"
            v-if="scope.row.type === 9 && activeName !== '5'"
            class="btn-green"
            >{{ $t('编辑') }}</el-button
          >
          <el-button
            v-if="scope.row.type === 2 && activeName !== '5'"
            class="btn-yellow"
            @click="editFeatures(scope.row.id, 'image')"
            >{{ $t('编辑图片') }}</el-button
          >
          <el-button
            v-if="scope.row.type === 3 && activeName !== '5'"
            class="btn-blue-green"
            @click="editFeatures(scope.row.id, 'color')"
            >{{ $t('编辑颜色') }}</el-button
          >
          <el-button
            v-if="scope.row.type === 4 && activeName !== '5'"
            class="btn-deep-blue"
            @click="editFeatures(scope.row.id, 'location')"
            >{{ $t('编辑位置') }}</el-button
          >
          <el-button
            v-if="scope.row.type === 5 && activeName !== '5'"
            class="btn-pink"
            @click="editLink(scope.row.id)"
            >{{ $t('编辑链接') }}</el-button
          >
          <el-button
            @click="editString(scope.row.id)"
            class="btn-deep-purple optionBtn"
            v-if="[6, 7, 8].includes(scope.row.type) && activeName !== '5'"
            >{{ $t('编辑') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
  </div>
</template>
<script>
// import dialog from '@/components/dialog'
import { SearchGroup } from '@/components/searchs'
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
      keyword: '',
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
    SearchGroup
    // NlePagination,
    // AddBtn
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  created() {
    if (this.$route.query.active) {
      this.activeName = this.$route.query.active
      console.log(this.activeName, '1111')
    }
    this.getList()
    this.getLanguageList()
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
    blockDescription() {
      const href = `${this.$baseUrl.BLOCK_URL}`
      console.log(href, 'href')
      window.open(href)
      // this.$request.blockExplain().then(res => {
      //   if (res.ret) {
      //     console.log(res, 'res')
      //   }
      // })
    },
    getList() {
      console.log(this.activeName, '我在传值')
      this.blockList = []
      this.tableLoading = true
      let params = {
        part: this.activeName,
        keyword: this.keyword
      }
      this.$request.getBlocks(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.blockList = res.data
          this.localization = res.localization
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
    onLang(line, lang, type) {
      if (type === 6 || type === 7 || type === 8) {
        this.transCode = line['trans_' + lang.language_code]
        this.$router.push({
          name: 'blockOthersLang',
          params: {
            line: JSON.stringify(line),
            lang: JSON.stringify(lang),
            transCode: this.transCode
          },
          query: {
            type
          }
        })
      } else if (type === 2 || type === 5) {
        console.log('1111')
        this.transCode = line['trans_' + lang.language_code]
        this.$router.push({
          name: 'urlLangEdit',
          params: {
            line: JSON.stringify(line),
            lang: JSON.stringify(lang),
            transCode: this.transCode
          },
          query: {
            type
          }
        })
      } else if (type === 9) {
        this.transCode = line['trans_' + lang.language_code]
        this.$router.push({
          name: 'imgLangEdit',
          params: {
            line: JSON.stringify(line),
            lang: JSON.stringify(lang),
            transCode: this.transCode
          },
          query: {
            type
          }
        })
      } else {
        const status = this.activeName === '5' ? 'origin' : 'others'
        this.transCode = line['trans_' + lang.language_code]
        this.$router.push({
          name: 'blockLang',
          params: {
            line: JSON.stringify(line),
            lang: JSON.stringify(lang),
            transCode: this.transCode
          },
          query: {
            status
          }
        })
      }
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
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
    editBlock(id, status) {
      this.$router.push({
        name: 'blockEdit',
        params: {
          id,
          status
        }
      })
    },
    // 编辑图片
    editImages(id) {
      const activeName = this.activeName
      this.$router.push({
        name: 'editImages',
        params: {
          id
        },
        query: {
          activeName
        }
      })
    },
    // 编辑图片、位置、颜色
    editFeatures(id, type) {
      const activeName = this.activeName
      this.$router.push({
        name: 'editOthersBlocks',
        params: {
          id,
          type
        },
        query: {
          activeName
        }
      })
    },
    // 编辑链接
    editLink(id) {
      this.$router.push({
        name: 'editLink',
        params: {
          id
        }
      })
    },
    // 编辑字符串
    editString(id) {
      this.$router.push({
        name: 'editString',
        params: {
          id
        }
      })
    },
    onTabChange(tab) {
      this.$router.push({ path: this.$route.path, query: { active: tab.name } })
      switch (tab.name) {
        case '5':
          this.status = 5
          break
        case '1':
          this.status = 1
          break
        case '2':
          this.status = 2
          break
        case '3':
          this.status = 3
          break
        case '4':
          this.status = 4
          break
      }
      // this.page_params.page = 1
      // this.page_params.handleQueryChange('page', 1)
      // this.page_params.handleQueryChange('activeName', tab.name)
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.block-container {
  background-color: #fff;
  padding: 15px;
  .tabLength {
    width: 450px !important;
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
  .headerList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headr-r {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .searchGroup {
        width: 25%;
        margin-right: 10px;
      }
    }
  }
}
</style>
