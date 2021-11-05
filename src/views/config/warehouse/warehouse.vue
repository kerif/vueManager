<template>
  <div class="warehouse-container">
    <div class="headerList">
      <div class="sort-sty">
        *{{ $t('拖拽行可以进行排序') }}
        <el-button @click="rowUpdate" class="btn-deep-purple save-sort">{{
          $t('保存排序结果')
        }}</el-button>
      </div>
      <div class="header-right">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <div class="select-box">
          <add-btn router="warehouseAdd">{{ $t('添加仓库') }}</add-btn>
        </div>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        :data="vipGroupList"
        stripe
        border
        ref="table"
        height="calc(100vh - 270px)"
        class="data-list country"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column width="100px" align="center">
          <template>
            <i class="el-icon-sort icon-fonts"></i>
          </template>
        </el-table-column>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column
          :label="$t('仓库名字')"
          prop="warehouse_name"
          width="155"
        ></el-table-column>
        <el-table-column :label="$t('自动货位')">
          <template slot-scope="scope">
            <span v-if="scope.row.auto_location === 0">{{ $t('关闭') }}</span>
            <span v-if="scope.row.auto_location === 1">{{ $t('开启') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('收件人')" prop="receiver_name" width="120"></el-table-column>
        <el-table-column :label="$t('面单地址')" prop="short_address" width="200"></el-table-column>
        <el-table-column :label="$t('联系电话')" prop="phone" width="155"></el-table-column>
        <el-table-column :label="$t('邮编')" prop="postcode"></el-table-column>
        <el-table-column
          :label="$t('地址')"
          prop="address"
          :show-overflow-tooltip="true"
          width="150"
        ></el-table-column>
        <el-table-column :label="$t('支持国家')" :show-overflow-tooltip="true" width="150">
          <template slot-scope="scope">
            <span v-for="item in scope.row.support_countries" :key="item.id"
              >{{ item.name }}&nbsp;</span
            >
          </template>
        </el-table-column>
        <!-- 是否启用 -->
        <el-table-column :label="$t('是否启用')" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
              :active-text="$t('开')"
              :inactive-text="$t('关')"
              :active-value="1"
              :inactive-value="0"
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
              @click="onLang(scope.row, item)"
            ></span>
            <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" width="260" fixed="right">
          <template slot-scope="scope">
            <el-button class="btn-green" @click="editWarehouse(scope.row.id)">{{
              $t('修改仓库')
            }}</el-button>
            <el-button
              class="btn-deep-purple"
              @click="positionAdd(scope.row.id, scope.row.warehouse_name)"
              >{{ $t('仓位管理') }}</el-button
            >
            <el-button class="btn-light-red" @click="deleteWarehouse(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
        <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
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
import { SearchGroup } from '@/components/searchs'
import Sortable from 'sortablejs'
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
  data() {
    return {
      vipGroupList: [],
      tableLoading: false,
      deleteNum: [],
      languageData: [],
      transCode: '',
      countrySendData: []
    }
  },
  created() {
    this.getList()
    this.getLanguageList() // 获取支持语言
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getWarehouseAddress({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            // this.vipGroupList = res.data.map(item => {
            //   let arr = item.support_countries.map(item => item.name)
            //   return {
            //     ...item,
            //     enabled: Boolean(item.enabled),
            //     countries: arr.join(' ')
            //   }
            // })
            this.vipGroupList = res.data
            this.countrySendData = [...res.data]
            this.$nextTick(() => {
              this.rowDrop()
              this.$refs.table.doLayout()
            })

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
    // 修改开关
    changeTransfer(event, enabled, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.warehouseEnabled(id, Number(event)).then(res => {
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
    // 修改仓库
    editWarehouse(id) {
      this.$router.push({
        name: 'warehouseEdit',
        params: {
          id: id
        }
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
    // 仓位管理
    positionAdd(id, warehouseName) {
      this.$router.push({
        name: 'position',
        params: {
          id: id,
          warehouseName: warehouseName
        }
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除
    deleteWarehouse(id) {
      this.$confirm(this.$t('您真的要删除此仓库吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteWarehouseAddress(id).then(res => {
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
    },
    // 修改语言
    onLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'warehouseLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    },
    // 国家地区 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.country tbody')
      console.log(tbody, 'tbody')
      Sortable.create(tbody, {
        onEnd: ({ newIndex, oldIndex }) => {
          if (oldIndex === newIndex) return false
          console.log(oldIndex, newIndex)
          const oldItem = this.countrySendData.splice(oldIndex, 1)[0]
          this.countrySendData.splice(newIndex, 0, oldItem)
        }
      })
    },
    // 确定拖拽 国家地区
    rowUpdate() {
      // eslint-disable-next-line camelcase
      const ids = this.countrySendData.map(({ id, name }, index) => ({ id, index, name }))
      console.log(ids)
      this.vipGroupList = []
      this.$request.warehouseLocationIndex(ids).then(res => {
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
    }
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  }
}
</script>
<style lang="scss">
.warehouse-container {
  .headerList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .searchGroup {
      width: 27.1%;
    }
    .header-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
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
  .icon-fonts {
    font-size: 28px;
  }
  .save-sort {
    margin-left: 10px;
  }
}
</style>
