<template>
  <div class="channel-container">
    <div class="select-box">
      <add-btn router="addChannel">{{ $t('添加') }}</add-btn>
      <div class="searchGroup">
        <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
      </div>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        :data="vipGroupList"
        stripe
        border
        height="calc(100vh - 270px)"
        class="data-list"
        ref="table"
        v-loading="tableLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <!-- 渠道号 -->
        <el-table-column :label="$t('渠道号')" prop="id"></el-table-column>
        <!-- 渠道中文名 -->
        <el-table-column :label="$t('渠道中文名')" prop="channel_name"></el-table-column>
        <!-- 结算方式 -->
        <el-table-column :label="$t('结算方式')">
          <template slot-scope="scope">
            <!-- 注册个数 -->
            <span v-if="scope.row.settlement_method === 1">{{ $t('注册个数') }}</span>
          </template>
        </el-table-column>
        <!-- 渠道单价 -->
        <el-table-column
          :label="$t('渠道单价') + localization.currency_unit"
          prop="channel_price"
        ></el-table-column>
        <!-- 备注 -->
        <el-table-column
          :label="$t('备注')"
          prop="remark"
          :show-overflow-tooltip="true"
          width="150"
        ></el-table-column>
        <!-- 创建日期 -->
        <el-table-column :label="$t('创建日期')" prop="created_at"></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="260">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button class="btn-green" @click="editChannel(scope.row.id)">{{
              $t('修改')
            }}</el-button>
            <!-- 删除 -->
            <el-button class="btn-light-red" @click="deleteChannel(scope.row.id)">{{
              $t('删除')
            }}</el-button>
            <!-- 引流列表 -->
            <el-button class="btn-deep-purple" @click="drainage(scope.row.id)">{{
              $t('引流列表')
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
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
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
      localization: {},
      tableLoading: false,
      deleteNum: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getChannel({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.vipGroupList = res.data
            this.localization = res.localization
            // this.vipGroupList = res.data.map(item => {
            //   let arr = item.support_countries.map(item => item.cn_name)
            //   return {
            //     ...item,
            //     countries: arr.join(' ')
            //   }
            // })
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
    // 修改渠道
    editChannel(id) {
      this.$router.push({
        name: 'editChannel',
        params: {
          id: id
        }
      })
    },
    deleteChannel(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteChannel(id).then(res => {
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
    // 仓位管理
    drainage(id) {
      this.$router.push({
        name: 'drainageList',
        params: {
          id: id
        }
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteWarehouse(id) {
      this.$confirm(this.$t('您真的要删除此仓库吗？'), this.$t('提示'), {
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
    }
  }
}
</script>
<style lang="scss">
.channel-container {
  overflow: hidden;
  .searchGroup {
    width: 21.2%;
    float: right;
    margin-left: 10px;
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
}
</style>
