<template>
  <div class="since-add-container">
    <el-form :model="form" ref="form">
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>{{ $t('*自提点名称') }}</div>
            <el-input :placeholder="$t('请输入自提点名称')" v-model="form.name"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>{{ $t('自提点编号') }}</div>
            <el-input :placeholder="$t('请输入自提点编号')" v-model="form.code"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <div>{{ $t('所属国家地区') }}</div>
          <el-col :span="5">
            <el-select
              v-model="form.country_id"
              @change="changeCountry"
              @blur="trigger"
              filterable
              :disabled="!!this.$route.params.id && !hasStore"
              class="country-select"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in countryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5" v-show="newWarehouseList.length !== 0 && form.country_id">
            <el-cascader
              filterable
              :props="{ checkStrictly: true }"
              :key="keyValue"
              class="country-select"
              :disabled="!!this.$route.params.id && !hasStore"
              v-model="areaData"
              :options="newWarehouseList"
              @change="handleChange"
            >
            </el-cascader>
          </el-col>
          <!-- <el-col :span="5">
            <el-select
              v-model="form.country_id"
              @change="changeCountry"
              filterable
              :disabled="!!this.$route.params.id && !hasStore"
              class="country-select"
              :placeholder="$t('请选择')">
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            </el-col>
            <el-col :span="5">
              <el-select size="small"
                v-if="form.country_id === 19"
                v-model="form.area_id"
                placeholder="请选择"
                v-on:change="getCity($event)">
                <el-option
                  v-for="item in areas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select size="small"
                v-if="form.country_id === 19"
                v-model="form.sub_area_id"
                placeholder="请选择"
                v-on:change="getArea($event)">
                <el-option
                  v-for="item in citys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col> -->
        </el-row>
      </el-form-item>
      <!-- 详细地址 -->
      <el-form-item>
        <div>{{ $t('详细地址') }}</div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input v-model="form.address" :placeholder="$t('请输入')"></el-input>
          </el-col>
          <el-col :span="5" v-if="form.area_id && form.country_id === this.timezoneId">
            <el-button type="primary" plain @click="onShowLocation">{{ $t('地图选点') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-show="form.area_id && form.country_id === this.timezoneId">
        <el-row :gutter="20">
          <el-col :span="5">
            <div>{{ $t('经度') }}</div>
            <el-input v-model="lng" disabled></el-input>
          </el-col>
          <el-col :span="5">
            <div>{{ $t('纬度') }}</div>
            <el-input v-model="lat" disabled></el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" plain class="clear-btn" @click="onClearMap">{{
              $t('清除')
            }}</el-button>
          </el-col>
        </el-row>
        <div id="map" class="map-box"></div>
      </el-form-item>
      <!-- 联系人 -->
      <el-form-item>
        <div>{{ $t('联系人') }}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.contactor" :placeholder="$t('请输入')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 联系电话 -->
      <el-form-item>
        <div>{{ $t('联系电话') }}</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.contact_info" :placeholder="$t('请输入')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>
          <span>{{ $t('自提点规则') }}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('申请集包时如超过限制条件则无法选择该自提点不填写则不启用')"
            placement="top"
          >
            <span class="el-icon-question icon-info"></span>
          </el-tooltip>
        </div>
        <div style="margin-bottom: 10px">
          {{ $t('单箱限长')
          }}<el-input
            class="input-sty"
            v-model="form.limit_length"
            :placeholder="`${localization.length_unit ? localization.length_unit : ''}`"
          ></el-input>
        </div>
        <div style="margin-bottom: 10px">
          {{ $t('单箱限重')
          }}<el-input
            class="input-sty"
            v-model="form.limit_one_weight"
            :placeholder="`${localization.weight_unit ? localization.weight_unit : ''}`"
          ></el-input>
        </div>
        <div style="margin-bottom: 10px">
          {{ $t('整票限重')
          }}<el-input
            class="input-sty"
            v-model="form.limit_many_weight"
            :placeholder="`${localization.weight_unit ? localization.weight_unit : ''}`"
          ></el-input>
        </div>
      </el-form-item>
      <!--<el-form-item>
          {{ $t('允许所有订单入库') }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="
              $t('开启时,可签收所有订单;关闭时,筛选仅签收目的地为本自提点的订单,其他订单自动忽略')
            "
            placement="top"
          >
            <span class="el-icon-warning-outline icon-info"></span>
          </el-tooltip>
          <el-switch v-model="warehouse" :active-text="$t('开启')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关闭')"
          active-color="#13ce66"
          inactive-color="gray">
          </el-switch>
        </el-form-item>
        <el-form-item>
          {{ $t('入库即触发取件通知') }}
          <el-tooltip
            class="item"
            effect="dark"
            :content="
              $t(
                '开启时,订单入库即触发取件信息;关闭时,需要匹配当前自提点为客户选择自提点才会推送取件通知'
              )
            "
            placement="top"
          >
            <span class="el-icon-warning-outline icon-info"></span>
          </el-tooltip>
          <el-switch v-model="pick" :active-text="$t('开启')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('关闭')"
          active-color="#13ce66"
          inactive-color="gray"> </el-switch>
        </el-form-item> -->

      <div>
        <el-form-item>
          <div>{{ $t('支持线路') }}</div>
          <el-col :span="16">
            <div class="add-row">
              <el-button @click="addRow" class="btn-deep-purple">{{ $t('新增') }}</el-button>
            </div>
            <el-table :data="form.expressLines" style="width: 100%" border>
              <el-table-column :label="$t('线路名称')">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('操作')">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, form.expressLines)"
                    class="btn-light-red"
                    >{{ $t('移除') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
      </div>
      <el-form-item>
        <div>{{ $t('计佣方式') }}</div>
        <el-row>
          <el-col :span="10">
            <el-select
              clearable
              v-model="form.rule_id"
              class="country-select"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in rulesData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button @click="editSet" class="notice-sty">{{ $t('公告设置') }}</el-button>
        <el-switch
          v-model="form.edit_notice_jurisdiction"
          :active-text="$t('允许自提点页面编辑公告')"
          :active-value="1"
          :inactive-value="0"
          :inactive-text="$t('')"
          active-color="#13ce66"
          inactive-color="gray"
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="sava-btn"
          :loading="$store.state.btnLoading"
          @click="saveLine"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="lineVisible" size="small" @close="clear">
      <div class="line-sty">{{ $t('支持线路') }}</div>
      <el-row>
        <el-col :span="16">
          <el-select
            v-model="lineIds"
            multiple
            filterable
            class="country-select"
            :placeholder="$t('请选择')"
          >
            <el-option v-for="item in lineData" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="lineVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmLines">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <!-- 公告设置 -->
    <el-dialog
      close="clearAnnouncement"
      :visible.sync="announcementDailog"
      :title="$t('自提点公告设置')"
      class="props-dialog"
      width="45%"
    >
      <span>{{ $t('营业时间') }}</span>
      <el-input
        v-model="announcementData.opening_hours"
        type="textarea"
        :rows="4"
        :placeholder="$t('例周一至周六08002000')"
      >
      </el-input>
      <span>{{ $t('公告') }}</span>
      <el-input
        v-model="announcementData.announcement"
        type="textarea"
        :rows="4"
        :placeholder="
          $t('例：本自提点免费保存两日，逾期收费2¥/日。重量限制：40KG。长度限制：180CM')
        "
      >
      </el-input>
      <div slot="footer">
        <el-button @click="announcementDailog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="updateAnnoucement">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TMap from 'TMap'
import { jsonp } from 'vue-jsonp'
export default {
  data() {
    return {
      form: {
        name: '',
        code: '',
        country_id: '',
        area_id: '',
        sub_area_id: '',
        address: '',
        contact_info: '',
        limit_many_weight: '',
        limit_length: '',
        limit_one_weight: '',
        edit_notice_jurisdiction: 0,
        rule_id: '',
        contactor: '',
        expressLines: [],
        announcement: '',
        opening_hours: ''
      },
      areaData: null,
      referenceTime: {
        minTime: '',
        maxTime: '',
        symbol: '工作日'
      },
      countryList: [], // 获取全部国家
      newWarehouseList: [],
      typeList: [],
      localization: {},
      warehouseIds: [], // 保存支持仓库的id
      imgVisible: false,
      imgSrc: '',
      icon: {},
      itemArr: {},
      lineVisible: false,
      lineData: [],
      lineIds: [],
      countryId: '',
      hasStore: false,
      areas: [],
      citys: [],
      rulesData: [],
      isLocation: false,
      map: null,
      marker: null,
      lng: '', // 经度
      lat: '', // 纬度
      announcementDailog: false,
      announcementData: {
        opening_hours: '',
        announcement: ''
      },
      keyValue: 0,
      timezoneId: ''
    }
  },
  created() {
    this.getWarehouse()
    this.getRules()
  },
  mounted() {
    this.initMap()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    // 初始化地图信息
    initMap() {
      let point = new TMap.LatLng(22.307387, 114.187179)
      const map = new TMap.Map(document.getElementById('map'), {
        center: point,
        zoom: 11,
        draggableCursor: 'crosshair'
      })
      this.map = map
      TMap.event.addListener(this.map, 'click', this.onPoint)
    },
    // 选取地图上的点
    onPoint(e) {
      this.lng = e.latLng.lng
      this.lat = e.latLng.lat
      if (!this.marker) {
        this.marker = new TMap.Marker({
          position: e.latLng,
          map: this.map
        })
      } else {
        this.marker.setPosition(e.latLng)
      }
    },
    // 清除地址选点
    onClearMap() {
      this.lat = ''
      this.lng = ''
      this.marker.setPosition(null)
    },
    // 根据客户填写地址标点
    onShowLocation() {
      let topArea = ''
      let subArea = ''
      if (this.areaData && this.areaData.length) {
        this.newWarehouseList.forEach(item => {
          if (item.value === this.areaData[0]) {
            topArea = item.label
            item.children.forEach(ele => {
              if (ele.value === this.areaData[1]) {
                subArea = ele.label
              }
            })
          }
        })
      }
      const address = `${topArea}${subArea}${this.form.address}`
      jsonp('https://apis.map.qq.com/ws/geocoder/v1', {
        address,
        key: 'ZMOBZ-QDU3P-XGMDH-L7IB2-JWWUO-X5BPG',
        output: 'jsonp'
      })
        .then(res => {
          this.lng = res.result.location.lng
          this.lat = res.result.location.lat
          let point = new TMap.LatLng(this.lat, this.lng)
          if (!this.marker) {
            this.marker = new TMap.Marker({
              position: point,
              map: this.map
            })
          } else {
            this.marker.setPosition(point)
          }
          this.map.panTo(point)
          this.map.setZoom(13)
        })
        .catch(err => {
          console.log('error', err)
        })
    },
    // 编辑时拉取的数据
    getList() {
      this.$request.getOneSelf(this.$route.params.id).then(res => {
        // const warehouses = res.data.warehouses.map(item => item.id)
        // this.form = res.data
        this.form.country_id = res.data.country_id
        this.form.name = res.data.name
        this.form.code = res.data.code
        this.form.announcement = res.data.announcement
        this.form.opening_hours = res.data.opening_hours
        this.form.edit_notice_jurisdiction = res.data.edit_notice_jurisdiction
        if (res.data.area_id) {
          this.areaData = res.data.sub_area_id
            ? [res.data.area_id, res.data.sub_area_id]
            : [res.data.area_id]
          console.log(this.areaData, '111')
          this.form.area_id = res.data.area_id || ''
          this.form.sub_area_id = res.data.sub_area_id || ''
        }
        if (res.data.lat) {
          this.lat = res.data.lat
          this.lng = res.data.lon
          if (!this.marker) {
            this.marker = new TMap.Marker({
              position: new TMap.LatLng(this.lat, this.lng),
              map: this.map
            })
          } else {
            this.marker.setPosition(new TMap.LatLng(this.lat, this.lng))
          }
        }
        // console.log(this.areaData111, 'areaData')
        // this.form.country_id = res.data.sub_area_id ? res.data.sub_area_id : res.data.country.id
        this.form.address = res.data.address
        this.form.contactor = res.data.contactor
        if (res.data.rule) {
          this.form.rule_id = res.data.rule.id
        }
        this.form.contact_info = res.data.contact_info
        this.form.limit_one_weight = res.data.limit_one_weight
        this.form.limit_many_weight = res.data.limit_many_weight
        this.form.limit_length = res.data.limit_length
        this.form.expressLines = res.data.expressLines.map(item => {
          return {
            name: item.name,
            id: item.id
          }
        })
        console.log(this.form.expressLines, 'this.form.expressLines')
      })
    },
    // 切换国家
    changeCountry() {
      console.log(this.form.country_id, 'form.country_id')
      this.areaData = []
      ++this.keyValue
      this.form.expressLines = []
      const selectList = this.countryList.find(item => item.value === this.form.country_id)
      this.newWarehouseList = selectList ? selectList.children : []
      console.log(this.newWarehouseList)
      console.log(this.areas, 'this.areas')
    },
    trigger() {},
    editSet() {
      this.announcementDailog = true
      this.announcementData.opening_hours = this.form.opening_hours
      this.announcementData.announcement = this.form.announcement
    },
    // 更新 公告设置
    updateAnnoucement() {
      this.form.opening_hours = this.announcementData.opening_hours
      this.form.announcement = this.announcementData.announcement
      this.announcementDailog = false
    },
    clearAnnouncement() {
      this.announcementData.opening_hours = ''
      this.announcementData.announcement = ''
    },
    // 获取所属国家地区
    getWarehouse() {
      this.$request.countryLocation().then(res => {
        this.countryList = res.data.map(item => {
          return {
            value: item.id,
            label: item.name,
            children: item.areas.map(item => {
              return {
                value: item.id,
                label: item.name,
                children: item.areas.map(item => {
                  return {
                    value: item.id,
                    label: item.name
                  }
                })
              }
            })
          }
        })
        res.data.forEach(item => {
          if (item.timezone === '0852') {
            console.log(item.timezone, item.id, 'timezone')
            this.timezoneId = item.id
          }
        })
        if (this.$route.params.id) {
          const selectList = this.countryList.find(item => item.value === this.form.country_id)
          console.log(selectList, 'selectList')
          this.newWarehouseList = selectList ? selectList.children : []
        } else {
          const mapWarehouseList = res.data.find(item => item.areas.length) || { areas: [] }
          console.log(mapWarehouseList, 'mapWarehouseList')
          this.newWarehouseList = mapWarehouseList.areas.map(item => {
            return {
              value: item.id,
              label: item.name,
              children: item.areas.map(item => {
                return {
                  value: item.id,
                  label: item.name
                }
              })
            }
          })
        }
        console.log(this.newWarehouseList, 'this.newWarehouseList')
      })
    },
    // 获取支持线路弹窗数据
    getLines() {
      this.$request
        .getStations({
          country_id: this.countryId,
          area_id: this.form.area_id || '',
          sub_area_id: this.form.sub_area_id || ''
        })
        .then(res => {
          this.lineData = res.data
          console.log(this.lineData, 'lineData')
        })
    },
    // 获取计佣方式
    getRules() {
      this.$request.pickRules().then(res => {
        if (res.ret) {
          this.rulesData = res.data
          this.localization = res.localization
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirmLines() {
      this.lineVisible = false
      console.log(this.lineIds, 'lineIds')
      let selectIds = this.form.expressLines.map(item => item.id)
      let selectLine = this.lineData.filter(item => {
        return this.lineIds.includes(item.id) && !selectIds.includes(item.id)
      })
      this.form.expressLines = this.form.expressLines.concat(selectLine)
      console.log(selectLine)
      console.log(this.form.expressLines)
    },
    clear() {
      this.lineIds = []
    },
    // 新增行
    addRow() {
      if (this.form.country_id) {
        this.lineVisible = true
        this.countryId = this.form.country_id
        this.getLines()
      } else {
        return this.$message.error(this.$t('请先选择所属国家地区'))
      }
      // console.log(this.form.expressLines, 'this.form.expressLines')
      // this.form.expressLines.push({
      //   id: ''
      // })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    handleChange() {
      // if (this.areaData) {
      //   this.newWarehouseList.forEach(item => {
      //     if (item.label && !item.children) {
      //       item.checkStrictly = true
      //     }
      //   })
      // }
      this.form.area_id = this.areaData[0]
      this.form.sub_area_id = this.areaData[1]
    },
    getCity() {},
    getArea() {},
    saveLine() {
      if (!this.form.name) {
        return this.$message.error(this.$t('请输入自提点名称'))
      } else if (!this.form.country_id) {
        return this.$message.error(this.$t('请选择所属国家地区'))
      } else if (!this.form.address) {
        return this.$message.error(this.$t('请输入详细地址'))
      } else if (!this.form.contact_info) {
        return this.$message.error(this.$t('请输入联系电话'))
      } else if (!this.form.contactor) {
        return this.$message.error(this.$t('请输入联系人'))
      }
      if (this.$route.params.id) {
        // 编辑状态
        this.$request
          .updateOneSelf(this.$route.params.id, {
            ...this.form,
            lon: this.lng,
            lat: this.lat
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.hasStore = true
              this.$router.go(-1)
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      } else {
        // 新建状态
        this.$request
          .addSelf({
            ...this.form,
            lon: this.lng,
            lat: this.lat
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.hasStore = true
              this.$router.go(-1)
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      }
    }
  }
}
</script>
<style lang="scss" scope>
.since-add-container {
  background-color: #fff !important;
  .country-select {
    width: 100%;
  }
  .clear-btn {
    margin-top: 40px;
  }
  .map-box {
    width: 100%;
    height: 400px;
    margin-top: 15px;
  }
  .sava-btn {
    min-width: 100px;
  }
  .icon-info {
    color: #74b34f;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .max-time {
    position: relative;
    &::before {
      content: '—';
      position: absolute;
      left: -22px;
    }
  }
  .select-box {
    width: 100%;
  }
  .country-btn {
    margin-top: 40px;
    .el-button--primary {
      background-color: #eaecf5;
      border-color: #eaecf5;
      color: #3540a5;
    }
  }
  .el-tag.el-tag--info {
    border-color: #3540a5;
    color: #3540a5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540a5;
    background-color: #fff;
  }
  .icon-img {
    width: 100px;
    img {
      width: 100%;
    }
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .line-sty {
    margin-bottom: 15px;
  }
  .notice-sty {
    margin-right: 20px;
  }
  .input-sty {
    margin-left: 10px;
    width: 10% !important;
  }
}
</style>
