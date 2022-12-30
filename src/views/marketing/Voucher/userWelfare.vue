<template>
  <div class="user-welfare-container">
    <h4>{{ $t('新用户福利') }}</h4>
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <el-tab-pane :label="$t('全部')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('未开始')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('进行中')" name="3"></el-tab-pane>
      <el-tab-pane :label="$t('已失效')" name="4"></el-tab-pane>
    </el-tabs>
    <div class="flex-item">
      <div>
        <el-button class="btn-main" @click="exportList">{{ $t('导出清单') }}</el-button>
      </div>
      <search-group
        :placeholder="$t('请输入关键字')"
        v-model="page_params.keyword"
        @search="goSearch"
      ></search-group>
    </div>
    <el-table
      class="data-list"
      border
      stripe
      v-loading="tableLoading"
      height="calc(100vh - 270px)"
      ref="table"
      :data="voucherData"
    >
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('用户')">
        <template slot-scope="scope">
          <span v-if="scope.row.user">{{ scope.row.user.id }}-- {{ scope.row.user.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('优惠券名称')" prop="name"></el-table-column>
      <el-table-column
        :label="$t('金额') + this.localization.currency_unit"
        prop="amount"
        width="120"
      >
      </el-table-column>
      <el-table-column :label="$t('状态')" prop="status" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">{{ $t('未开始') }}</span>
          <span v-if="scope.row.status === 2">{{ $t('进行中') }}</span>
          <span v-if="scope.row.status === 3">{{ $t('已失效') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('使用范围')" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-for="item in scope.row.usable_lines" :key="item.id"> {{ item.name }}&nbsp; </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('最低消费金额')" prop="threshold" width="120"></el-table-column>
      <el-table-column :label="$t('失效时间')" prop="expired_at" width="160"></el-table-column>
      <el-table-column :label="$t('使用数量')" width="80">
        <template slot-scope="scope">
          <span v-bind:style="{ color: scope.row.used_count > 0 ? 'blue' : '' }">{{
            scope.row.used_count
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="item.name"
        v-for="item in formatLangData"
        :key="item.id"
        align="center"
        width="130"
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
      <el-table-column :label="$t('操作')" width="200px" fixed="right">
        <template slot-scope="scope">
          <!-- 作废 -->
          <el-button
            class="btn-deep-blue detailsBtn"
            v-if="
              (activeName === '1' || activeName === '2' || activeName === '3') &&
              scope.row.status !== 3
            "
            @click="obsolete(scope.row.id)"
            >{{ $t('作废') }}</el-button
          >
          <!-- 删除 -->
          <el-button
            class="btn-light-red detailsBtn"
            v-if="scope.row.used_count === 0"
            @click="onDelete(scope.row.id)"
            >{{ $t('删除') }}</el-button
          >
          <!-- 记录 -->
          <el-button size="small" class="btn-dark-green detailsBtn" @click="recoding(scope.row)">{{
            $t('详情')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import { SearchGroup } from '@/components/searchs'
import dialog from '@/components/dialog'
export default {
  components: {
    NlePagination,
    SearchGroup
  },
  mixins: [pagination],
  data() {
    return {
      activeName: '1',
      voucherData: [],
      localization: {},
      languageData: [],
      tableLoading: false,
      status: ''
    }
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  created() {
    // if (this.$route.query.type) {
    //   this.type = this.$route.query.type
    // }
    this.getList()
    this.getLanguageList()
  },
  methods: {
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
    },
    getList() {
      this.tableLoading = true
      this.voucherData = []
      this.$request
        .getCouponList({
          status: this.status,
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          type: 2,
          template_id: this.$route.query.type === '2' ? this.$route.query.id : ''
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.voucherData = res.data
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.table.doLayout()
              })
            }, 300)
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
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    recoding(couponInfo) {
      dialog({ type: 'couponDetail', couponInfo, param: 2 }, () => {})
    },
    obsolete(id) {
      this.$confirm(this.$t('确定要作废优惠券吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.disableCoupons(id).then(res => {
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
    onDelete(id) {
      this.$confirm(this.$t('确定要删除优惠券吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCoupon(id).then(res => {
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
    exportList() {
      this.$request
        .exportCoupon({
          status: this.status,
          keyword: this.page_params.keyword,
          type: 2,
          template_id: this.$route.query.type === '2' ? this.$route.query.id : ''
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
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    }
  }
}
</script>

<style lang="scss">
.user-welfare-container {
  .flex-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>
