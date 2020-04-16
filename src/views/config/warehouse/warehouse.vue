<template>
  <div class="warehouse-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div>
    <div class="select-box">
      <add-btn router="warehouseAdd">添加仓库</add-btn>
    </div>
    <el-table :data="vipGroupList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="仓库名字" prop="warehouse_name"></el-table-column>
      <el-table-column label="自动货位功能">
        <template slot-scope="scope">
          <span v-if="scope.row.auto_location === 0">关闭</span>
          <span v-if="scope.row.auto_location === 1">开启</span>
        </template>
      </el-table-column>
      <el-table-column label="收件人姓名" prop="receiver_name"></el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <el-table-column label="邮编" prop="postcode"></el-table-column>
      <el-table-column label="地址" prop="address" :show-overflow-tooltip="true" width="150"></el-table-column>
      <el-table-column label="支持国家" :show-overflow-tooltip="true" width="150" prop="countries">
      </el-table-column>
      <el-table-column :label="item.name" v-for="item in formatLangData" :key="item.id" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row['trans_' + item.language_code]" class="el-icon-check icon-sty" @click="onLang(scope.row, item)"></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editWarehouse(scope.row.id)">修改仓库</el-button>
          <el-button class="btn-deep-purple" @click="positionAdd(scope.row.id, scope.row.warehouse_name)">仓位管理</el-button>
          <el-button class="btn-light-red" @click="deleteWarehouse(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  name: 'vipGroupList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      vipGroupList: [],
      tableLoading: false,
      deleteNum: [],
      languageData: [],
      transCode: ''
    }
  },
  created () {
    this.getList()
    this.getLanguageList() // 获取支持语言
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.getWarehouseAddress({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.vipGroupList = res.data.map(item => {
            let arr = item.support_countries.map(item => item.name)
            return {
              ...item,
              countries: arr.join(' ')
            }
          })
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 修改仓库
    editWarehouse (id) {
      this.$router.push({ name: 'warehouseEdit',
        params: {
          id: id
        } }
      )
    },
    // 获取支持语言
    getLanguageList () {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 仓位管理
    positionAdd (id, warehouseName) {
      this.$router.push({ name: 'position',
        params: {
          id: id,
          warehouseName: warehouseName
        } }
      )
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteWarehouse (id) {
      this.$confirm(`您真的要删除此仓库吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteWarehouseAddress(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 修改语言
    onLang (line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'warehouseLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    }
  },
  computed: {
    formatLangData () {
      return this.languageData.filter(item => !item.is_default)
    }
  }
}
</script>
<style lang="scss">
.warehouse-container {
  .select-box {
    overflow: hidden;
  }
  .country-box {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .add-btn-container {
    margin-left: 10px;
  }
  .icon-sty {
    cursor: pointer;
    // padding-left: 20px;
    font-weight: 700;
    color: black;
  }
}
</style>
