<template>
  <div>
    <div class="select-box">
      <add-btn @click.native="addClassify">{{ $t('添加商品分类') }}</add-btn>
      <el-button class="btn-light-red" @click="batchDelCategory()">{{ $t('批量删除') }}</el-button>
    </div>
    <el-table
      :data="CategoriesList"
      stripe
      ref="table"
      border
      class="data-list"
      @expand-change="onExpand"
      @selection-change="selectionChange"
      v-loading="tableLoading"
      height="calc(100vh - 360px)"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <!-- 二级分类列表 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.orders" @selection-change="handleSelection">
            <el-table-column type="selection"></el-table-column>
            <!-- 二级分类名称 -->
            <el-table-column :label="$t('二级分类名称')" prop="name"></el-table-column>
            <!-- 是否显示 -->
            <el-table-column :label="$t('是否显示')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  @change="changeShow($event, scope.row.id)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  active-color="#13ce66"
                  inactive-color="gray"
                >
                </el-switch>
              </template>
            </el-table-column>
            <!-- 是否开启风险提示 -->
            <el-table-column :label="$t('是否开启风险提示')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.risk_warning_enabled"
                  @change="changeRisk($event, scope.row.id)"
                  :active-text="$t('开')"
                  :inactive-text="$t('关')"
                  active-color="#13ce66"
                  inactive-color="gray"
                >
                </el-switch>
              </template>
            </el-table-column>
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
                  @click="onCategories(scope.row, item)"
                ></span>
                <span
                  v-else
                  class="el-icon-plus icon-sty"
                  @click="onCategories(scope.row, item)"
                ></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('操作')" width="300">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">{{
                  $t('编辑')
                }}</el-button>
                <!-- 风险提示 -->
                <el-button class="btn-main" @click="goSick(scope.row.id)">{{
                  $t('风险提示')
                }}</el-button>
                <!-- 删除 -->
                <el-button @click="deleteCategories(scope.row.id)" class="btn-light-red">{{
                  $t('删除')
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- 一级分类列表 -->
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 一级分类名称 -->
      <el-table-column :label="$t('一级分类名称')" prop="name"></el-table-column>
      <!-- 是否显示 -->
      <el-table-column :label="$t('是否显示')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeShow($event, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- 是否开启风险提示 -->
      <el-table-column :label="$t('是否开启风险提示')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.risk_warning_enabled"
            @change="changeRisk($event, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
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
            @click="onCategories(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="onCategories(scope.row, item)"></span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="300">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button class="btn-dark-green btn-margin" @click="editClassify(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
          <!-- 风险提示 -->
          <el-button class="btn-main" @click="goSick(scope.row.id)">{{ $t('风险提示') }}</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red btn-margin" @click="deleteCategories(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
import NlePagination from '@/components/pagination'
import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      tableLoading: false,
      languageData: [],
      selectNum: [],
      deleteNum: [],
      page_params: {
        type: ''
      },
      CategoriesList: [
        {
          enabled: true,
          risk_warning_enabled: true
        }
      ]
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  created() {
    this.page_params.page = 1
    this.getCategories()
    this.getLanguageList() // 获取支持语言
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList() {
      this.getCategories()
    },
    selectionChange(select) {
      this.selectNum = select.map(item => item.id)
    },
    handleSelection(sel) {
      this.deleteNum = sel.map(item => item.id)
    },
    batchDelCategory() {
      if (this.selectNum.length === 0 && this.deleteNum.length === 0) {
        return this.$message.error(this.$t('请选择'))
      }
      const num = this.selectNum.concat(this.deleteNum)
      this.$confirm(this.$t('您是否确认批量删除?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          this.$request.batchDeleteCategory({ ids: num }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.getCategories()
              this.deleteNum = []
              this.selectNum = []
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
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
    // 点开当前行，获取二级菜单数据
    onExpand(row) {
      // 如果当前货单已经获取了二级菜单数据，就不在获取
      if (row.orders.length) return
      let id = row.id
      this.$request.getSecondCategories(id).then(res => {
        if (res.ret) {
          row.orders = res.data.map(item => {
            return {
              ...item,
              enabled: Boolean(item.enabled),
              risk_warning_enabled: Boolean(item.risk_warning_enabled)
            }
          })
        }
      })
    },
    // 获取商品分类管理列表
    getCategories() {
      this.tableLoading = true
      this.$request
        .getCategories({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.CategoriesList = res.data.map(item => {
              return {
                ...item,
                enabled: Boolean(item.enabled),
                risk_warning_enabled: Boolean(item.risk_warning_enabled),
                orders: []
              }
            })
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.table.doLayout()
              })
            }, 300)
            this.localization = res.localization
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
    // 添加商品分类
    addClassify() {
      dialog({ type: 'classifyGroup', state: 'add', id: '' }, () => {
        this.getList()
      })
    },
    // 商品分类管理 开启或关闭 是否显示
    changeShow(event, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.closeCategories(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 商品分类管理 开启或关闭 风险提示
    changeRisk(event, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.closeRisk(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 商品分类管理 修改语言
    onCategories(line, lang) {
      this.categoriesCode = line['trans_' + lang.language_code]
      this.$router.push({
        name: 'categoriesLangAdd',
        params: {
          line: JSON.stringify(line),
          lang: JSON.stringify(lang),
          transCode: this.categoriesCode
        }
      })
    },
    // 编辑商品分类
    editClassify(id) {
      dialog({ type: 'classifyGroup', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    // 修改风险提示
    goSick(id) {
      this.$router.push({
        name: 'sickTips',
        params: {
          id: id
        }
      })
    },
    // 删除单条商品分类
    deleteCategories(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCategories(id).then(res => {
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
<style scoped></style>
