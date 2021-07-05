<template>
  <div class="panel-container">
    <!-- 本月统计数据 -->
    <el-row>
      <el-col :span="6">
        <div class="addCustomer add-line blue-sty" @click="goToOtherPage(301, 'viplist')">
          <div class="box-header">
            <el-row>
              <el-col :span="20">
                <div>{{ $t('当月新增客户') }}</div>
                <div class="bold-box">{{ user.current_month }}</div>
              </el-col>
              <el-col :span="4">
                <div class="icon-sty">
                  <i class="iconfont icon-gerenzhongxin icons-first"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer">
            <span>{{ $t('总用户') }}</span>
            <span class="count">{{ user.total }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="addCustomer add-line yellow-sty" @click="goToOtherPage(401, 'orderlist')">
          <div class="box-header">
            <el-row :gutter="20">
              <el-col :span="20">
                <div>{{ $t('本月预报包裹') }}</div>
                <div class="bold-box">{{ packages.current_month }}</div>
              </el-col>
              <el-col :span="4">
                <div class="icon-packages">
                  <i class="iconfont icon-hezi icons"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer">
            <span>{{ $t('总包裹量') }}</span>
            <span class="count">{{ packages.total }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="addCustomer add-line green-sty" @click="goToOtherPage(402, 'wayBillList')">
          <div class="box-header">
            <el-row :gutter="20">
              <el-col :span="20">
                <div>{{ $t('本月新增订单') }}</div>
                <div class="bold-box">{{ order.current_month }}</div>
              </el-col>
              <el-col :span="4">
                <div class="icon-order">
                  <i class="iconfont icon-ziliao icons-second"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer">
            <span>{{ $t('总运单') }}</span>
            <span class="count">{{ order.total }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="addCustomer light-blue">
          <div class="box-header" @click="$router.push({ name: 'linelist' })">
            <el-row :gutter="20">
              <el-col :span="20">
                <div>{{ $t('系统开放线路') }}</div>
                <div class="bold-box">{{ expressCount }}</div>
              </el-col>
              <el-col :span="4">
                <div class="icon-express">
                  <i class="iconfont icon-ditu icons-third"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box-footer" @click="goToOtherPage(502, 'shipContainer')">
            <span>{{ $t('支持收货地址') }}</span>
            <span class="count">{{ shipment.total }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top: 10px">
      <el-row :gutter="20">
        <el-col :span="12" style="padding-right: 5px">
          <div class="wait-content">
            <div
              style="cursor: pointer"
              @click="$router.push({ name: 'orderlist', query: { activeName: '1' } })"
            >
              <div class="wait-sty">
                <i class="iconfont icon-icon_rukou"></i>
                <span class="wait-font">{{ $t('待入库包裹') }}</span>
              </div>
              <span class="number">{{ count.package_wait_in_storage }}</span>
            </div>
            <div
              style="cursor: pointer"
              @click="$router.push({ name: 'wayBillList', query: { activeName: '1' } })"
            >
              <div class="wait-sty">
                <i class="iconfont icon-huowudui"></i>
                <span class="wait-font">{{ $t('待打包订单') }}</span>
              </div>
              <span class="number">{{ count.order_wait_pick }}</span>
            </div>
            <div
              style="cursor: pointer"
              @click="$router.push({ name: 'wayBillList', query: { activeName: '3' } })"
            >
              <div class="wait-sty">
                <i class="iconfont icon-huowudui"></i>
                <span class="wait-font">{{ $t('待发货订单') }}</span>
              </div>
              <span class="number">{{ count.order_wait_ship }}</span>
            </div>
            <div
              style="cursor: pointer"
              @click="$router.push({ name: 'orderReview', query: { activeName: '0' } })"
            >
              <div class="wait-sty">
                <i class="iconfont icon-huowudui"></i>
                <span class="wait-font">{{ $t('待审核付款') }}</span>
              </div>
              <span class="number">{{ count.order_wait_audit }}</span>
            </div>
            <div style="cursor: pointer" @click="$router.push({ name: 'suggestlist' })">
              <div style="margin-bottom: 5px">
                <i class="iconfont icon-huowudui"></i>
                <span class="wait-font">{{ $t('待处理投诉') }}</span>
              </div>
              <span class="number">{{ count.suggestion_wait_deal }}</span>
            </div>
            <!-- package_wait_in_storage
          order_wait_pick
          order_wait_ship
          order_wait_audit
          suggestion_wait_deal -->
          </div>
        </el-col>
        <el-col :span="12">
          <div class="order-search">
            <div class="order-main">
              <div class="search-sty">
                <el-select v-model="expressType" :placeholder="$t('请选择')">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <el-input
                class="input-button"
                v-if="expressType"
                v-model="expressNumber"
                @keyup.enter.native="goExpress"
              >
                <el-button type="primary" slot="append" @click.native="goExpress">{{
                  $t('物流查询')
                }}</el-button>
              </el-input>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" class="package-chart" type="flex">
      <el-col :span="13" style="height: 100%">
        <!-- 面板数据 -->
        <div class="panel-box main-item">
          <div class="show-box">
            <div class="show-list">
              <span class="package-text">{{
                status === 2 ? $t('已入库包裹') : status === 3 ? $t('已拣货包裹') : $t('已发货包裹')
              }}</span>
              <el-select v-model="scope" @change="getDatas" :placeholder="$t('请选择')">
                <el-option :value="1" :label="$t('近一周')"></el-option>
                <el-option :value="2" :label="$t('近一月')"></el-option>
                <el-option :value="3" :label="$t('近半年')"></el-option>
                <el-option :value="4" :label="$t('全年')"></el-option>
              </el-select>
            </div>
            <div class="echarts" id="myChart"></div>
            <div class="type-list">
              <div :class="['type-item', status === 2 ? 'select' : '']" @click="onStatus(2)">
                {{ $t('已入库包裹') }}
              </div>
              <div :class="['type-item', status === 3 ? 'select' : '']" @click="onStatus(3)">
                {{ $t('已拣货包裹') }}
              </div>
              <div :class="['type-item', status === 5 ? 'select' : '']" @click="onStatus(5)">
                {{ $t('已发货包裹') }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="11" style="height: 100%">
        <div class="package-main">
          <div class="show-list">
            <span class="package-text">{{ $t('订单概览') }}</span>
            <el-select v-model="days" @change="getPie" :placeholder="$t('请选择')">
              <el-option :value="1" :label="$t('今天')"></el-option>
              <el-option :value="7" :label="$t('近7天')"></el-option>
              <el-option :value="30" :label="$t('近30天')"></el-option>
            </el-select>
          </div>
          <ul>
            <li v-for="(item, index) in pieData" :key="index" class="main-first">
              <div v-if="item.name === 'all'">
                <p>{{ $t('全部') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'wait_pack'">
                <p class="no-warehouse">{{ $t('待处理') }}</p>
                <p class="no-warehouse">
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'wait_payment'">
                <p>{{ $t('待支付') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'wait_shipped'">
                <p class="no-warehouse">{{ $t('待发货') }}</p>
                <p class="no-warehouse">
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'shipped'">
                <p>{{ $t('已发货') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'received'">
                <p>{{ $t('已签收') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
              <div v-if="item.name === 'invalid'">
                <p>{{ $t('作废订单') }}</p>
                <p>
                  <strong>{{ item.counts }}</strong>
                </p>
              </div>
            </li>
          </ul>
          <div class="charts-content">
            <div class="charts-left" id="chartsFirst"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="bottom">
      <el-col :span="8">
        <div class="process">
          <span class="title">操作流程</span>
          <div class="process-content">
            <div>
              <img src="../../assets/1.png" alt="" />
              <p>包裹预报</p>
            </div>
            <span class="line"></span>
            <div>
              <img src="../../assets/2.png" alt="" />
              <p>包裹入库</p>
            </div>
            <span class="line"></span>
            <div>
              <img src="../../assets/4.png" alt="" />
              <p>订单打包</p>
            </div>
            <span class="line"></span>
            <div>
              <img src="../../assets/5.png" alt="" />
              <p>订单发货</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="other">
          <div class="process-content user-actions">
            <div @click="$router.push({ name: 'newUser' })" style="cursor: pointer">
              <img src="../../assets/用户福利.png" alt="" />
              <p>{{ $t('用户福利') }}</p>
            </div>
            <div @click="$router.push({ name: 'Public' })" style="cursor: pointer">
              <img src="../../assets/公告管理.png" alt="" />
              <p>{{ $t('公告管理') }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="help-center">
          <span class="title">帮助中心</span>
          <div class="process-content">
            <div @click="goManual('help')" style="cursor: pointer">
              <img src="../../assets/操作手册.png" alt="" />
              <p>{{ $t('操作手册') }}</p>
            </div>
            <div @click="goManual('software')" style="cursor: pointer">
              <img src="../../assets/软件下载.png" alt="" />
              <p>{{ $t('软件下载') }}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="system">
          <span class="title">系统通知</span>
          <div class="system-notice">
            <ul class="notice">
              <li
                style="cursor: pointer"
                @click="$router.push({ name: 'systemNotice', params: { id: item.id } })"
                v-for="item in items"
                :key="item.id"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="showTips"
      :title="$t('系统配置助手')"
      class="dialog-start-loading"
      width="45%"
    >
      <div class="loading-top">
        <span>{{ $t('亲爱的用户') }}</span
        ><br />
        <span>{{ $t('首次系统使用需要完成以下配置才能正常上线运营') }}</span>
      </div>
      <div class="loading-bottom">
        <div v-for="item in updateProp" :key="item.type_id" class="service">
          <div class="serviceLeft">
            <el-checkbox v-model="item.is_finished">{{ item.content }}</el-checkbox>
          </div>
          <div class="serviceRight" @click="goRouter(item.type_id, item.route)">
            <!-- <span>{{item.route}}</span> -->
            <!-- <router-link :to="`/${item.route}`" class="chooseOrder" @click="finishedGuides(item.type_id)">去配置</router-link> -->
            {{ $t('去配置') }}
          </div>
        </div>
      </div>
      <div class="not-btn">
        <el-button @click="notMind" class="btn-light-red">{{ $t('不再提示') }}</el-button>
      </div>
    </el-dialog>
    <!-- 查询物流 -->
    <el-dialog :visible.sync="trackingVisible" class="express-dialog-container" size="small">
      <div class="express-content" v-loading="$store.state.btnLoading">
        <div v-if="TrackingData.length">
          <div class="content-top">
            <div class="time">{{ $t('时间') }}</div>
            <div style="padding-left: 2em">{{ $t('跟踪进度') }}</div>
          </div>
          <ul class="result-list">
            <li
              :class="{ 'last-finish': index === 0 }"
              v-for="(item, index) in TrackingData"
              :key="index"
            >
              <div class="time">{{ item.ftime }}</div>
              <div class="dot">
                <span class="out-dot dot-box"> </span>
                <span class="in-dot dot-box"></span>
              </div>
              <div class="text">{{ item.context }}</div>
            </li>
          </ul>
        </div>
        <div class="empty-box" v-else>
          <img src="../../assets/empty.png" />
          <div>{{ $t('暂无物流消息') }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 操作手册下载 -->
    <el-dialog :visible.sync="helpVisible" :title="$t('操作手册下载')" width="60%">
      <div
        v-for="(item, index) in helpData"
        :key="index"
        class="book-sty"
        @click="chooseManual(item)"
        @mouseover="changeSty($event)"
        @mouseleave="removeSty($event)"
      >
        <div>
          <div>
            <img src="../../assets/book.jpg" />
          </div>
          <div>
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <div class="file-sty">{{ item.filename }}</div>
        <span>{{ item.updated_at }}</span>
      </div>
    </el-dialog>
    <!-- 软件下载 -->
    <el-dialog :visible.sync="appVisible" :title="$t('软件下载')" width="60%">
      <div
        class="book-sty"
        @click="uploadDesktop"
        @mouseover="changeSty($event)"
        @mouseleave="removeSty($event)"
      >
        <p>{{ $t('集运系统仓库桌面软件') }}</p>
        <div>
          <div>
            <i class="iconfont icon-diannaofuben desktop-sty"></i>
            <!-- <img src="../../assets/book.jpg" /> -->
          </div>
          <div style="margin-top: 10px">
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <span>{{ $t('前往下载') }}</span>
      </div>
      <div
        class="book-sty"
        @click="uploadAndroid"
        @mouseover="changeApp($event)"
        @mouseleave="removeSty($event)"
      >
        <p>{{ $t('集运系统运营APP（安卓版）') }}</p>
        <div>
          <div>
            <i class="iconfont icon-anzhuo anzhuo-sty"></i>
            <!-- <img src="../../assets/book.jpg" /> -->
          </div>
          <div style="margin-top: 10px">
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <span>{{ $t('前往下载') }}</span>
      </div>
      <div
        class="book-sty"
        @click="uploadIos"
        @mouseover="changeSty($event)"
        @mouseleave="removeSty($event)"
      >
        <p>{{ $t('集运系统运营APP（iOS版）') }}</p>
        <div>
          <div>
            <i class="iconfont icon-pingguo ios-sty"></i>
            <!-- <img src="../../assets/book.jpg" /> -->
          </div>
          <div style="margin-top: 10px">
            <i class="iconfont icon-xiazai upload-sty"></i>
          </div>
        </div>
        <span>{{ $t('前往下载') }}</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts'
import dialog from '@/components/dialog'
import { formatWeek, formatMonth } from '@/utils'
export default {
  name: 'panel',
  data() {
    return {
      user: {
        current_month: 0,
        total: 0
      },
      shipment: {
        current_month: 0,
        total: 0
      },
      packages: {
        current_month: 0,
        total: 0
      },
      order: {
        current_month: 0,
        total: 0
      },
      waitInStorage: 0,
      waitPack: 0,
      upaid: 0,
      scope: 1,
      myChart: '',
      status: 2,
      option: '',
      cakeOption: '',
      showTips: false,
      updateProp: [],
      types: [],
      moreTips: '',
      items: [],
      cakeChart: '',
      pieData: [],
      days: 7,
      begin: '',
      end: '',
      trackingVisible: false,
      TrackingData: [],
      options: [
        {
          id: 1,
          name: this.$t('订单号')
        },
        {
          id: 2,
          name: this.$t('物流单号')
        }
      ],
      expressType: 1,
      expressNumber: '',
      expressCount: '',
      count: {},
      helpVisible: false,
      optionStatus: '',
      helpData: [],
      optionsHelp: {},
      appVisible: false
      // systemData: []
    }
  },
  created() {
    this.getNumbers()
    this.getDatas()
    this.getStatus() // 获取是否显示弹窗
    this.getSystem()
    this.getPie()
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById('myChart'))
    // window.onresize = this.myChart.resize
    this.option = {
      // legend: {
      //   left: 0,
      //   width: '100%'
      // },
      // 提示框
      tooltip: {
        trigger: 'axis'
        // axisPointer: {
        //   type: 'cross',
        //   label: {
        //     backgroundColor: '#6a7985'
        //   }
        // }
      },
      // toolbox: {
      //   show: false
      // },
      // grid: {
      //   left: '3%',
      //   right: '4%',
      //   bottom: '3%',
      //   containLabel: true
      // },
      yAxis: [
        {
          type: 'value',
          // minInterval: 1
          boundaryGap: [0, '30%'],
          splitLine: {
            lineStyle: {
              type: 'dashed' // y轴分割线类型
            }
          }
        }
      ]
      // color: ['#E5E7FB'],
      // textStyle: {
      //   fontWeight: 'bold'
      // }
    }
    // 包裹饼图
    this.cakeChart = echarts.init(document.getElementById('chartsFirst'))
    // window.onresize = this.cakeChart.resize
    this.cakeOption = {
      backgroundColor: '#ffffff',
      color: ['#9969BD', '#6495F9', '#E96C5B', '#62DAAB', '#F6C022', '#74CBED'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      }
    }
    window.addEventListener('resize', () => {
      this.myChart.resize()
      this.cakeChart.resize()
    })
  },
  computed: {
    isPermissionFilterArr() {
      return this.$store.state.isPermissionFilterArr
    },
    systemData() {
      return this.items.slice(0, 10)
    }
  },
  methods: {
    // 获取上面的统计数据
    getNumbers() {
      this.$request.getIndexNumber().then(res => {
        if (res.ret) {
          this.count = res.data
          this.user = res.data.user
          this.shipment = res.data.shipment
          this.packages = res.data.package
          this.expressCount = res.data.express_line_count
          this.order = res.data.order
          this.waitInStorage = res.data.package_wait_in_storage
          this.waitPack = res.data.order_wait_pick
          this.upaid = res.data.order_unpaid
        }
      })
    },
    // 选择包裹类型
    onStatus(status) {
      this.status = status
      this.getDatas()
    },
    // 客户端下载
    checkAbout() {
      dialog({ type: 'aboutCheck' })
    },
    // 获取系统通知
    getSystem() {
      this.$request.getSystem().then(res => {
        if (res.ret) {
          this.items = res.data
        }
      })
    },
    checkSystem(id) {
      this.$router.push({
        name: 'systemNotice',
        params: {
          id: id
        }
      })
    },
    // 获取图表数据
    getDatas() {
      this.$request
        .getIndexData({
          scope: this.scope,
          status: this.status
        })
        .then(res => {
          if (res.ret) {
            // 横坐标显示数据
            let xData = res.data.map(item => {
              if (this.scope === 1 || this.scope === 2) {
                return formatWeek(item.days)
              } else {
                return formatMonth(item.months)
              }
            })
            // 纵坐标显示数据
            let yData = res.data.map(item => item.count)
            this.option.xAxis = [
              {
                type: 'category',
                boundaryGap: false,
                data: xData
              }
            ]
            this.option.series = [
              {
                type: 'line',
                stack: this.$t('总量'),
                symbol: 'none',
                // areaStyle: {},
                smooth: true,
                data: yData,
                lineStyle: {
                  color: '#223CC5',
                  width: 3
                  // normal: {
                  // }
                },
                areaStyle: {
                  normal: {
                    color: '#DFE2FF'
                  }
                }
                // itemStyle: {
                //   normal: {
                //     borderColor: '#9FA4D5'
                //   }
                // }
              }
            ]
            this.myChart.setOption(this.option)
          }
        })
    },
    // 包裹饼图数据
    getPie() {
      let params = {
        days: this.days
      }
      this.begin && (params.begin = this.begin)
      this.end && (params.end = this.end)
      this.$request.getOrderPie(params).then(res => {
        if (res.ret) {
          this.pieData = res.data
          const obj = {
            wait_pack: this.$t('待处理'),
            wait_payment: this.$t('待支付'),
            wait_shipped: this.$t('待发货'),
            shipped: this.$t('已发货'),
            received: this.$t('已签收'),
            invalid: this.$t('作废订单')
          }
          let pieOrderList = res.data
            .filter(item => {
              return item.name !== 'all'
            })
            .map(item => {
              return {
                value: item.counts,
                name: obj[item.name]
              }
            })
          this.cakeOption.legend = {
            orient: 'vertical',
            left: 10,
            data: [
              this.$t('待处理'),
              this.$t('待支付'),
              this.$t('待发货'),
              this.$t('已发货'),
              this.$t('已签收'),
              this.$t('作废订单')
            ]
          }
          this.cakeOption.series = [
            {
              name: '包裹概览',
              type: 'pie',
              radius: ['50%', '70%'],
              label: {
                formatter: ' {d}% '
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: pieOrderList
            }
          ]
          this.cakeChart.setOption(this.cakeOption)
        }
      })
    },
    goToOtherPage(permissionNumber, routerName, query = {}) {
      if (!this.isPermissionFilterArr.includes(permissionNumber)) {
        this.$message({
          type: 'error',
          message: this.$t('当前操作暂无权限！')
        })
      } else {
        this.$router.push({ name: routerName, query: query })
      }
    },
    // 查询运费
    goFreight() {
      this.$router.push({ name: 'freight' })
    },
    // 获取是否显示弹窗
    getStatus() {
      this.$request.tipStatus().then(res => {
        if (res.ret) {
          this.moreTips = res.data.no_more_tips
          console.log(this.moreTips, 'moreTips')
          if (this.moreTips === 0) {
            this.showTips = true
            this.getGuides() // 获取弹窗数据
          }
        }
      })
    },
    goExpress() {
      console.log(this.expressNumber, 'expressNumber')
      if (this.expressType === 1) {
        this.$request
          .goTracking({
            order_sn: this.expressNumber
          })
          .then(res => {
            if (res.ret) {
              this.trackingVisible = true
              this.TrackingData = res.data.data
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
      } else if (this.expressType === 2) {
        this.$request
          .goTracking({
            track_no: this.expressNumber
          })
          .then(res => {
            if (res.ret) {
              this.trackingVisible = true
              console.log(res.data.data, 'res.data.data')
              this.TrackingData = res.data.data
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
    // 获取弹窗数据
    getGuides() {
      this.$request.getGuides().then(res => {
        if (res.ret) {
          res.data.forEach(items => {
            items.is_finished = !!items.is_finished
          })
          this.updateProp = res.data
        }
      })
    },
    finishedGuides(id) {
      console.log(id, 'type_id')
    },
    goRouter(id, route) {
      this.$request.updateGuides(id)
      this.$router.push(`/${route}`)
    },
    // 弹窗 不再提示
    notMind() {
      this.$request.noTips().then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.showTips = false
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 帮助中心
    goManual(status) {
      this.optionStatus = status
      if (status === 'help') {
        this.helpVisible = true
        this.getHelp()
      } else {
        this.appVisible = true
      }
    },
    // 获取操作手册数据
    getHelp() {
      this.$request.optionsManual().then(res => {
        if (res.ret) {
          this.helpData = res.data
        }
      })
    },
    chooseManual(item) {
      // this.optionsHelp = item
      window.open(item.url)
    },
    changeSty($event) {
      $event.currentTarget.className = 'book-sty boxShadow'
    },
    removeSty($event) {
      $event.currentTarget.className = 'book-sty'
    },
    uploadDesktop() {
      let url = 'http://des-update.nle-tech.com/jiyun/update.html'
      window.open(url)
    },
    uploadAndroid() {
      let url = 'https://jiyun-app-1302976036.cos.ap-hongkong.myqcloud.com/app-release-latest.apk'
      window.open(url)
    },
    uploadIos() {
      let url = 'https://apps.apple.com/cn/app/id1492557133'
      window.open(url)
    },
    changeApp($event) {
      $event.currentTarget.className = 'book-sty boxShadow'
    },
    changeSoftware(status) {
      console.log(status, 'status')
    }
  }
}
</script>
<style lang="scss">
.panel-container {
  .main-item {
    background-color: #fff;
  }
  .right-item {
    padding: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 35px;
  }
  .addCustomer {
    // background: #E5E7FB;
    border-radius: 4px;
    cursor: pointer;
  }
  .add-line {
    margin-right: 5px;
  }
  .blue-sty {
    background-color: #d6f5e3;
  }
  .yellow-sty {
    background-color: #ffeae0;
  }
  .green-sty {
    background-color: #e2eaff;
  }
  .light-blue {
    background-color: #dfe2ff;
  }
  .panel-right {
    box-sizing: border-box;
    padding-left: 20px;
  }
  .count {
    padding-left: 20px;
  }
  .waitMsg {
    background-color: #3540a5;
    color: #ccc;
    line-height: 35px;
    font-size: 14px;
    padding-left: 20px;
  }
  // ul {
  //   padding: 0 10px 30px 10px;
  //   margin: 0;
  //   list-style-type: none;
  //   border: 1px solid #ccc;
  //   li {
  //     line-height: 40px;
  //     padding: 0 10px;
  //     border-bottom: 1px solid #ccc;
  //     &::before {
  //       content: '·';
  //       color: #3540A5;
  //       font-weight: bold;
  //       font-size: 22px;
  //     }
  //   }
  // }
  .main-box {
    cursor: pointer;
  }
  .msg-right {
    float: right;
    color: red;
  }
  .main {
    border: 1px solid #ccc;
    margin-top: 15px;
    line-height: 70px;
    padding: 0 20px;
    text-align: center;
  }
  .box-header,
  .box-footer {
    padding: 0 10px;
    line-height: 35px;
  }
  .box-header {
    border-bottom: 1px solid #ccc;
    padding-top: 5px;
  }
  .bold-box {
    padding-top: 10px;
    font-weight: bold;
    font-size: 24px;
  }
  .tip-img {
    margin-right: 10px;
    position: relative;
    top: 12px;
  }
  .panel-box {
    border: 1px solid #e8e9eb;
  }
  .show-box {
    padding: 30px 20px;
  }
  .show-list {
    width: 80%;
    text-align: right;
    line-height: 40px;
  }
  .package-text {
    float: left;
  }
  .echarts {
    width: 80%;
    height: 440px;
    display: inline-block;
  }
  .type-list {
    display: inline-block;
    // margin-left: 30px;
    position: absolute;
    bottom: 100px;
  }
  .type-item {
    padding: 5px 10px;
    border: 1px solid #e5e7fb;
    color: #3540a5;
    margin-bottom: 10px;
    cursor: pointer;
    &.select {
      background-color: #3540a5;
      color: #fff;
    }
  }
  li {
    // cursor: pointer;
  }
  .dialog-start-loading {
    .el-input {
      width: 40% !important;
      margin-left: 50px;
    }
    .el-textarea {
      width: 40% !important;
      margin-left: 50px;
    }
    .el-form-item__label {
      width: 200px;
    }
    .el-form-item__error {
      margin-left: 250px !important;
    }
    .el-dialog__header {
      background-color: #0e102a;
    }
    .el-dialog__title {
      font-size: 14px;
      color: #fff;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
  .loading-top {
    margin-bottom: 20px;
    font-size: 15px;
  }
  .service {
    overflow: hidden;
    line-height: 40px;
    .el-input__inner {
      line-height: 40px !important;
      margin-bottom: 10px;
    }
    .serviceLeft {
      display: inline-block;
      float: left;
    }
    .serviceRight {
      cursor: pointer;
      color: blue;
      display: inline-block;
      float: right;
    }
  }
  .not-btn {
    margin-top: 20px;
  }
  .system-sty {
    // height: 400px;
  }
  .check-sty {
    cursor: pointer;
  }
  .express-sty {
    color: red;
  }
  .search-sty {
    margin-bottom: 20px;
    display: inline-block;
  }
  .express-dialog-container {
    .dot-box {
      display: inline-block;
      border-radius: 50%;
    }
    .out-dot {
      width: 16px;
      height: 16px;
      background-color: #bcbcbc;
      opacity: 0.4;
      margin-top: 2px;
    }
    .in-dot {
      width: 10px;
      height: 10px;
      background-color: #bcbcbc;
      position: absolute;
      left: 3px;
      top: 5px;
    }
    .content-top {
      display: flex;
    }
    .express-content {
      font-size: 14px;
    }
    .time {
      width: 155px;
    }
    .result-list {
      padding: 0;
      li {
        display: flex;
        padding-bottom: 30px;
        &:not(:last-child) {
          .text::before {
            content: '';
            position: absolute;
            left: -8px;
            border-left: 1px solid #a8b7bf;
            height: calc(100% + 10px);
            top: 20px;
          }
        }
      }
      .last-finish {
        .out-dot {
          background-color: #35a581;
        }
        .in-dot {
          background-color: #35a581;
        }
      }
    }
    .text {
      padding-left: 10px;
      position: relative;
      flex: 1;
    }
    .dot {
      position: relative;
      width: 16px;
      height: 16px;
    }
  }
  .empty-box {
    text-align: center;
    img {
      width: 150px;
    }
  }
  .main-top {
    background-color: #f5f5f5;
  }
  .about-sty {
    cursor: pointer;
  }
  .icon-sty,
  .icon-packages,
  .icon-order,
  .icon-express {
    position: relative;
    top: 10px;
    text-align: center;
    border-radius: 50%;
  }
  .icon-sty {
    border: 1px solid #d6f5e3;
    background-color: #c5e7d3;
  }
  .icon-packages {
    border: 1px solid #ffeae0;
    background-color: #ffba98;
  }
  .icon-order {
    border: 1px solid #b3c7ff;
    background-color: #e2eaff;
  }
  .icon-express {
    border: 1px solid #dfe2ff;
    background-color: #9fa7f5;
  }
  .icons-third {
    color: #c0c5ee !important;
  }
  .icons-second {
    color: #8e98f1 !important;
  }
  .icons-first {
    color: #69a482 !important;
  }
  .icons {
    color: #ffa072 !important;
  }
  .wait-content {
    padding: 30px 20px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(5, 1fr);
    color: #8b8b8b;
    background-color: #fff;
    .wait-sty {
      border-right: 1px solid#E8E9EB;
      padding-right: 10px;
      margin-bottom: 5px;
    }
    .number {
      color: #2c2c2c;
      font-weight: bold;
    }
    .wait-font {
      font-size: 14px;
    }
  }
  .order-search {
    background-color: #fff;
    height: 109px;
    padding-left: 10px;
    .input-button {
      width: 55%;
    }
    .order-main {
      position: relative;
      top: 30px;
    }
  }
  .package-chart {
    margin-top: 20px;
  }
  .package-main {
    padding: 40px 20px;
    background-color: #fff;
    ul {
      display: flex;
      justify-content: space-between;
      padding: 0;
      list-style: none;
      li {
        padding: 0 20px;
        text-align: center;
        border-right: 1px solid #e8e9eb;
        p {
          font-size: 14px;
        }
      }
      li:last-child {
        border-right: none;
      }
    }
    .charts-left {
      display: inline-block;
      width: 100%;
      height: 300px;
    }
  }
  .bottom {
    margin-top: 20px;
    .process,
    .other,
    .help-center,
    .system {
      padding: 20px;
      height: 150px;
      background-color: #fff;
      overflow: auto;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .process-content {
        padding: 5px 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .line {
          width: 25px;
          height: 2px;
          background-color: #e5e7fb;
          position: relative;
          bottom: 35px;
        }
      }
      .system-notice {
        padding: 5px 0;
        background-color: #fff;
        .notice {
          margin: 0;
          padding: 0;
          li {
            padding: 10px;
            list-style: none;
            font-size: 14px;
            border-bottom: 1px solid #f6f6f6;
          }
        }
      }
      .user-actions {
        padding-top: 25px;
      }
    }
  }
  .book-sty {
    display: inline-block;
    width: 25%;
    // box-shadow: 3px 3px 3px 3px #f5f5f5;
    text-align: center;
    // padding-top: 40px;
    // padding-bottom: 20px;
    margin-right: 30px;
    cursor: pointer;
    .upload-sty {
      font-size: 30px;
      color: #30359a;
    }
    .file-sty {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
  .desktop-sty,
  .anzhuo-sty,
  .ios-sty {
    font-size: 45px;
  }
  .desktop-sty {
    color: #30359a;
  }
  .anzhuo-sty {
    color: #52cc35;
  }
  .ios-sty {
    color: #c6c6c6;
  }
  .boxShadow {
    border: 2px solid #30359a;
  }
}
@media screen and (max-width: 1370px) {
  .order-search {
    height: 131px !important;
  }
}
@media screen and (max-width: 1596px) {
  .echarts {
    height: 460px !important;
  }
}
@media screen and (max-width: 1396px) {
  .echarts {
    height: 480px !important;
  }
}
</style>
