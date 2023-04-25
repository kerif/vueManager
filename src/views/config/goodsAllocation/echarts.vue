<template>
  <div class="goodsAllocation">
    <el-tabs v-model="activeName" class="warhouse-tabs" @tab-click="handleClick">
      <el-tab-pane
        v-for="tab in warehouseTabs"
        :label="tab.warehouse_name"
        :name="tab.id + ''"
        :key="tab.id"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="cargo-list">
      <div v-for="item in cargoAreaList" :key="item.id" @click="showDetail(item)" class="cargo-box">
        <div class="top">
          <div class="cargo-code">
            <span>{{ $t('货区') }}：</span>
            <span class="code">{{ item.number }}</span>
          </div>
          <div class="cargo-type" v-if='item.for_big===1'>{{ $t('大货专区') }}</div>
          <div class="cargo-type" v-else-if='item.no_throw_condition===1'>{{ $t('无人认领专区') }}</div>
          <div class="cargo-type" v-else>{{ $t('普通货区') }}</div>
        </div>
        <div class="cargo-info">
          <div class="cargo-quantity">
            <div class="data">{{ item.counts }}</div>
            <div class="tip">{{ $t('仓位数量') }}</div>
          </div>
          <div class="cargo-quantity">
            <div class="data">{{ item.max_count }}</div>
            <div class="tip">{{ $t('货位容量') }}</div>
          </div>
          <div class="package-quantity">
            <div class="data">{{ item.packages_count }}</div>
            <div class="tip">{{ $t('包裹量') }}</div>
          </div>
        </div>
        <div class="bottom">
          <span v-if="item.reusable === 0">{{ $t('优先推荐同一/相邻货位(受货位容量限制)') }}</span>
          <span v-if="item.reusable === 1">{{ $t('专用货位(不受货位容量限制)') }}</span>
          <span v-if="item.reusable === 2">{{ $t('专用货位(受货位容量限制)') }}</span>
        </div>
      </div>
      <div v-if="cargoAreaList.length === 0" class="no-data">
        <el-empty :description="$t('暂无数据')"></el-empty>
      </div>
    </div>
    <Detail
      :showCargoDetail="showCargoDetail"
      :selectCargoArea="selectCargoArea"
      @receive="receive"
    />
    <nle-pagination
      v-if="cargoAreaList.length > 0"
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
      saveSize="package"
    >
    </nle-pagination>
  </div>
</template>
<script>
import Detail from './components/cargoAreaDetail'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    Detail,
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      activeName: '1',
      showCargoDetail: false,
      warehouseTabs: [],
      cargoAreaList: [],
      selectCargoArea: {}
    }
  },
  mounted() {
    this.getWarehouseTabs()
  },
  methods: {
    receive() {
      this.showCargoDetail = false
    },
    //仓库列表
    getWarehouseTabs() {
      this.$request.getWarehouseTabs().then(res => {
        console.log(res.data)
        this.warehouseTabs = res.data
        this.activeName = this.warehouseTabs[0].id + ''
        this.getCargoAreaList()
      })
    },
    getList() {
      this.getCargoAreaList()
    },
    //通过仓库ID货区仓库货区列表
    getCargoAreaList() {
      this.$request.getCargoAreaList(this.activeName, this.page_params).then(res => {
        console.log(res.data)
        this.cargoAreaList = res.data
        this.page_params.total = res.meta.total
      })
    },
    handleClick() {
      console.log(this.activeName)
      this.getCargoAreaList()
    },
    //点击查看货区详情
    showDetail(item) {
      this.selectCargoArea = item
      this.showCargoDetail = true
    },
    detail() {
      this.$router.push({
        name: 'placeDetail'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.goodsAllocation {
  background-color: white;
  min-height: calc(100% - 32px);
  padding: 16px;

  .cargo-list {
    display: flex;
    flex-wrap: wrap;
    //height: calc(100% - 54px);
    overflow-y: auto;
    .no-data {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .cargo-box {
      width: calc(25% - 20px);
      border: 1px solid #c8c8c8;
      height: 200px;
      margin-bottom: 16px;
      margin-right: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      .top {
        margin: 8px;
        padding-bottom: 8px;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #c8c8c8;
        .cargo-code {
          .code {
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
      .cargo-info {
        padding: 8px;
        display: flex;
        justify-content: space-around;
        text-align: center;

        .cargo-quantity {
          margin-right: 32px;
          .data {
            font-size: 26px;
            font-weight: bold;
          }
          .tip {
            font-size: 14px;
            margin-top: 8px;
            color: #b9b9b9;
          }
        }
        .package-quantity {
          .data {
            font-size: 26px;
            font-weight: bold;
            color: #d70031;
          }
          .tip {
            font-size: 14px;
            margin-top: 8px;
            color: #b9b9b9;
          }
        }
      }
      .bottom {
        margin: 16px 0;
        font-size: 14px;
        color: #626262;
        text-align: center;
        width: 100%;
      }
    }
  }
}
</style>
