<template>
  <div class="picking-list-container">
    <div class="searchGroup">
      <search-group
        :placeholder="$t('请输入关键字')"
        v-model="page_params.keyword"
        @search="goSearch"
      ></search-group>
    </div>
    <div class="clear"></div>
    <el-tabs v-model="activeName" class="tabLength" @tab-click="handleClick">
      <!-- 入库日志 -->
      <el-tab-pane :label="$t('入库日志')" name="1"></el-tab-pane>
      <!-- 拣货日志 -->
      <el-tab-pane :label="$t('拣货日志')" name="2"></el-tab-pane>
    </el-tabs>
    <div style="height: calc(100vh - 270px)">
      <el-table
        border
        stripe
        class="waybill-data-list"
        ref="table"
        v-if="oderData.length"
        v-loading="tableLoading"
        :data="oderData"
        height="calc(100vh - 275px)"
      >
        <!-- 操作人 -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('操作人')" prop="operator" width="155"></el-table-column>
        <!-- 操作时间 -->
        <el-table-column :label="$t('操作时间')" prop="created_at" width="155"></el-table-column>
        <!-- 具体操作 -->
        <el-table-column :label="$t('具体操作')" v-if="activeName === '1'">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ $t('包裹入库') }}</span>
            <span v-if="scope.row.type === 2">{{ $t('退回未入库') }}</span>
            <span v-if="scope.row.type === 3">{{ $t('弃件') }}</span>
            <span v-if="scope.row.type === 4">{{ $t('彻底删除') }}</span>
            <span v-if="scope.row.type === 5">{{ $t('恢复') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('操作货位')"
          v-if="activeName === '1'"
          prop="location"
        ></el-table-column>
        <!-- 快递单号 -->
        <el-table-column
          :label="$t('快递单号')"
          prop="express_num"
          v-if="activeName === '1'"
          width="155"
        ></el-table-column>
        <!-- 订单号 -->
        <el-table-column
          :label="$t('订单号')"
          v-if="activeName === '2'"
          prop="order_sn"
        ></el-table-column>
        <!-- 重量kg -->
        <el-table-column
          :label="'重量' + this.localization.weight_unit"
          prop="weight"
        ></el-table-column>
        <!-- 长宽高cm -->
        <el-table-column
          :label="$t('长宽高') + this.localization.length_unit"
          prop="dimension"
        ></el-table-column>
        <!-- 物品属性 -->
        <el-table-column
          :label="$t('物品属性')"
          v-if="activeName === '1'"
          prop="props"
          width="155"
        ></el-table-column>
        <!-- 备注 -->
        <el-table-column :label="$t('备注')" prop="remark" width="200"></el-table-column>
        <!-- 打包图片 -->
        <el-table-column :label="$t('打包图片')" v-if="activeName === '2'" prop="pictures">
          <template slot-scope="scope">
            <span
              v-for="item in scope.row.pictures"
              :key="item.id"
              style="cursor: pointer"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${item.url}`), (imgVisible = true)"
            >
              <img
                :src="`${$baseUrl.IMAGE_URL}${item.url}`"
                style="width: 40px; margin-right: 5px"
              />
            </span>
          </template>
        </el-table-column>
        <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small">删除</el-button>
        </div>
      </template> -->
      </el-table>
      <nle-pagination
        style="margin-top: 5px"
        :pageParams="page_params"
        :notNeedInitQuery="false"
      ></nle-pagination>
    </div>
    <!-- <div v-else class="noDate">{{$t('暂无数据')}}</div> -->
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  name: 'pickingContainer',
  data() {
    return {
      activeName: '1',
      oderData: [],
      imgVisible: false,
      imgSrc: '',
      tableLoading: false,
      localization: {}
    }
  },
  methods: {
    handleClick() {
      this.page_params.page = 1
      const { name, params, query } = this.$route
      this.$router.replace({
        name,
        params,
        query: {
          ...query,
          page: 1
        }
      })
      this.getList()
    },
    // 入库日志
    getList() {
      if (this.activeName === '1') {
        this.getOrder()
      } else {
        this.getPick()
      }
    },
    // 入库日志
    getOrder() {
      this.tableLoading = true
      this.oderData = []
      this.$request
        .getStorage({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.oderData = res.data
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
    // 拣货日志
    getPick() {
      this.tableLoading = true
      this.oderData = []
      this.$request
        .getPick({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.oderData = res.data
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
    }
  },
  created() {
    if (this.$route.query.active) {
      this.activeName = this.$route.query.active
    }
    if (this.$route.query.keyword) {
      this.page_params.keyword = this.$route.query.keyword
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss">
.picking-list-container {
  .waybill-data-list {
    background-color: inherit;
    overflow-y: auto !important;
  }
  .tabLength {
    width: 200px !important;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .searchGroup {
    width: 21.5%;
    float: right;
  }
  .clear {
    clear: both;
  }
}
</style>
