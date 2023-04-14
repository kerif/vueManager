<template>
  <el-drawer
    title=""
    :visible.sync="showCargoDetail"
    direction="rtl"
    :withHeader="false"
    :before-close="close"
    @opened="open"
    size="60%"
  >
    <div class="area-detail">
      <div class="detail-top">
        <div class="top-left">
          <div class="top">
            <div class="cargo-code">
              <span>{{ $t('货区') }}：</span>
              <span class="code">{{ selectCargoArea.number }}</span>
              <span class="cargo-type">{{$t('普通货区')}}</span>
            </div>
            <div class="cargo-tip">
              <span v-if="selectCargoArea.reusable === 0"
                >{{$t('优先推荐同一/相邻货位(受货位容量限制)')}}</span
              >
              <span v-if="selectCargoArea.reusable === 1">{{$t('专用货位(不受货位容量限制)')}}</span>
              <span v-if="selectCargoArea.reusable === 2">{{$t('专用货位(受货位容量限制)')}}</span>
            </div>
          </div>
        </div>
        <div class="cargo-info">
          <div class="cargo-quantity">
            <div class="data">{{ selectCargoArea.counts }}</div>
            <div class="tip">{{$t('仓位数量')}}</div>
          </div>
          <div class="cargo-quantity">
            <div class="data">{{ selectCargoArea.max_count }}</div>
            <div class="tip">{{$t('货位容量')}}</div>
          </div>
          <div class="package-quantity">
            <div class="data">{{ selectCargoArea.packages_count }}</div>
            <div class="tip">{{$t('包裹量')}}</div>
          </div>
        </div>
      </div>
      <div class="area-info">
        <div :class="showPackageDetails ? 'allocation-info flexaa' : 'allocation-info'">
          <el-input
            :placeholder="$t('请输入货位号')"
            @keyup.enter.native="getAllocationList"
            v-model="allocation_keyword"
          >
            <template slot="suffix">
              <div class="search-icon" @click="getAllocationList">
                <i class="el-icon-search"></i>
              </div>
            </template>
          </el-input>
          <div class="allocation-tab">
            <el-table
              :data="allocationList"
              height="calc(100vh - 180px)"
              :header-cell-style="{ 'text-align': 'center' }"
              border
            >
              <el-table-column align="center" prop="date" label="操作" width="80">
                <template slot-scope="scope">
                  <span class="opearte" @click="goDetail(scope.row)">{{$t('查看')}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="code" :label="$t('货位号')"> </el-table-column>
              <el-table-column align="center" prop="count" :label="$t('容量')"> </el-table-column>
              <el-table-column align="center" prop="is_used" :label="$t('包裹数量')"> </el-table-column>
            </el-table>
          </div>
        </div>
        <div
          :class="showPackageDetails ? 'package-info flexaa' : 'package-info'"
          v-show="showPackageDetails"
        >
          <el-input
            :placeholder="$t('请输入包裹单号或客户ID')"
            @keyup.enter.native="goPackageDetails"
            v-model="package_keyword"
            style="margin-bottom: 16px"
          >
            <template slot="suffix">
              <div class="search-icon" @click="goPackageDetails">
                <i class="el-icon-search"></i>
              </div>
            </template>
          </el-input>
          <div class="package-list">
            <div class="package-box" v-for="item in packageList">
              <div class="top">
                <div class="cargo-code">
                  <span class="code">{{ item.express_num }}</span>
                </div>
                <div class="cargo-type"></div>
              </div>
              <div class="first-line">
                <span class="name">{{ item.user_name }}</span>
                <span class="weight">{{ item.package_weight }}{{localization.weight_unit}}</span>
              </div>
              <div class="second-line">
                <span class="goods">{{ item.package_name }}*{{ item.qty }}</span>
                <span class="volume">{{ item.length }}*{{ item.width }}*{{ item.height }}{{localization.length_unit}}</span>
              </div>
              <div class="third-line">
                <span class="time">{{$t('上架时间')}}：{{ item.shelf_up_at }}</span>
                <span class="storage-time">{{$t('已存放天')}}：<span>{{ item.storage_time }}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'cargoAreaDetail',
  props: ['showCargoDetail', 'selectCargoArea'],
  data() {
    return {
      show: true,
      allocation_keyword: null,
      allocationList: [],
      showPackageDetails: false,
      package_keyword: null,
      packageList: [],
      allocation_id: null,
      localization: null
    }
  },
  mounted() {},
  methods: {
    //查看
    goDetail(item) {
      this.allocation_id = item.id
      this.goPackageDetails()
    },
    //计算保存时间
    calcTime(time) {
      const t2 = Math.floor(new Date().getTime() / 1000) // 第二种，推荐
      console.log('当前时间时间戳', t2)
      const stringTime = time
      console.log(stringTime)
      let timestamp2 = Date.parse(new Date(stringTime))
      timestamp2 = timestamp2 / 1000
      console.log('目标时间戳', timestamp2)
      console.log(t2 - timestamp2)
      // 总秒数
      let second = Math.floor(t2 - timestamp2)
      // 天数
      let day = Math.floor(second / 3600 / 24)
      console.log('天数', day)
      return day
    },
    //获取货位里的包裹信息
    goPackageDetails() {
      this.showPackageDetails = true
      console.log('hahaha', this.calcTime('2023-03-16 12:05:53'))
      this.$request
        .getPackageListInfo(this.allocation_id, { keyword: this.package_keyword })
        .then(res => {
          this.packageList = res.data
          this.localization = res.localization
          this.packageList.map(item => {
            item.storage_time = this.calcTime(item.shelf_up_at)
          })
        })
    },
    //获取货位信息
    getAllocationList() {
      this.$request
        .getAllocationList(this.selectCargoArea.warehouse_id, this.selectCargoArea.id, {
          keyword: this.allocation_keyword
        })
        .then(res => {
          this.allocationList = res.data
        })
    },
    open() {
      console.log(this.selectCargoArea)
      this.getAllocationList()
      this.showPackageDetails = false
    },
    close() {
      this.$emit('receive', false)
      this.allocation_keyword = null
      this.package_keyword = null
    }
  }
}
</script>

<style lang="scss" scoped>
div::-webkit-scrollbar {
  /*滚动条整体样式*/
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  width: 8px;
}

div::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: rgba(41, 109, 241, 0.1);
}

div::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: 0;
  border-radius: 0;
  background: #f0f2f5;
}
.area-detail {
  padding: 16px;
  height: 100%;
  .flexaa {
    width: 50% !important;
  }
  .detail-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-left {
      .top {
        font-size: 16px;
        .cargo-code {
          margin-right: 40px;
          .code {
            font-size: 20px;
            font-weight: bold;
            margin-right: 40px;
          }
        }
        .cargo-tip {
          font-size: 14px;
          margin-top: 8px;
        }
      }
    }
    .cargo-info {
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
  }
  .area-info {
    height: calc(100% - 80px);
    margin-top: 8px;
    display: flex;
    width: 100%;
    .allocation-info {
      width: 100%;
      height: 100%;
      background-color: #f9f9f9;
      padding: 8px;
      .search-icon {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin-right: 8px;
        height: 100%;
        cursor: pointer;
      }
      .allocation-tab {
        margin-top: 16px;
        .opearte {
          cursor: pointer;
          color: #0077ff;
        }
      }
    }
    .package-info {
      //flex: 1 !important;
      //width: 50%;
      height: 100%;
      margin-left: 16px;
      background-color: #f9f9f9;
      padding: 8px;
      .search-icon {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin-right: 8px;
        height: 100%;
        cursor: pointer;
      }
      .package-list {
        height: calc(100% - 70px);
        overflow-y: auto;
        .package-box {
          margin-bottom: 16px;
          width: 100%;
          background-color: #ffffff;
          padding: 16px 0;
          border-radius: 10px;
          .top {
            margin: 0 16px;
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
          .first-line {
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name {
              font-weight: bold;
              font-size: 28px;
            }
            .weight {
              color: red;
              font-size: 16px;
            }
          }
          .second-line {
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            .goods {
              color: #c8c8c8;
            }
            .volume {
              color: skyblue;
            }
          }
          .third-line {
            padding: 8px 16px 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            .time {
              color: #1f1f1f;
            }
            .storage-time {
              span {
                font-weight: bold;
              }
            }
          }
        }
        .package-box:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
