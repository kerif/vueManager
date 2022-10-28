<template>
  <el-dialog
    :visible.sync="show"
    :title="id ? $t('修改拼团') : $t('新增拼团')"
    width="60%"
    @close="clear"
  >
    <el-row :gutter="20">
      <el-form :model="ruleForm" label-width="120px">
        <el-col :span="17">
          <el-form-item :label="$t('发起拼团成员')">
            <el-autocomplete
              :fetch-suggestions="queryCNSearch"
              :placeholder="$t('请输入客户ID')"
              v-model="ruleForm.user_id"
            >
            </el-autocomplete>
          </el-form-item>
          <el-form-item :label="$t('拼团名称')">
            <el-input v-model="ruleForm.name" :placeholder="$t('请输入拼团名称')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('拼团仓库')">
            <el-select v-model="ruleForm.warehouse_id" :placeholder="$t('请选择')">
              <el-option
                v-for="item in warehouseData"
                :key="item.id"
                :value="item.id"
                :label="item.warehouse_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('收货地址')">
            <div class="select-boxs">
              <div class="flex-box">
                <div class="flex-item" v-if="ruleForm.user_id !== '' && ruleForm.address_id">
                  <div style="width: 80px; margin-right: 20px">
                    <img src="../../assets/receive.png" />
                  </div>
                  <div v-if="ruleForm.address">
                    <div class="font-bold black-text">
                      {{ ruleForm.address.country_name }}
                    </div>
                    <div>
                      {{ ruleForm.address && ruleForm.address.receiver_name }}&nbsp;{{
                        ruleForm.address.phone
                      }}
                    </div>
                    <div>
                      {{ ruleForm.address.country_name }}&nbsp;{{ ruleForm.address.city }}&nbsp;{{
                        ruleForm.address.province
                      }}&nbsp;{{ ruleForm.address.street }}&nbsp;{{ ruleForm.address.address }}
                    </div>
                  </div>
                </div>
                <div>
                  <el-button
                    class="btn-light-green"
                    :disabled="!ruleForm.user_id"
                    @click="changeAddress('address')"
                    >{{ $t('选择地址') }}</el-button
                  >
                  <el-button class="btn-main" :disabled="!ruleForm.user_id" @click="onAddAddress">{{
                    $t('新增地址')
                  }}</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('拼团渠道')">
            <div class="select-boxs">
              <div class="flex-box">
                <div class="flex-item" v-if="ruleForm.express_line_id">
                  <div style="width: 80px; margin-right: 20px" v-if="icon !== ''">
                    <img :src="$baseUrl.IMAGE_URL + icon" />
                  </div>
                  <div>
                    <div class="font-bold black-text">
                      {{ ruleForm.express_line && ruleForm.express_line.name }}
                    </div>
                    <div>{{ ruleForm.express_line && ruleForm.express_line.props }}</div>
                  </div>
                </div>
                <div>
                  <el-button class="btn-light-green" @click="selectLine">{{
                    $t('选择渠道')
                  }}</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('派送形式')">
            <el-radio-group v-model="ruleForm.is_delivery">
              <el-radio :label="0">{{ $t('送货上门') }}</el-radio>
              <el-radio :label="1">{{ $t('自提点收货') }}</el-radio>
            </el-radio-group>
            <div class="select-boxs" v-if="ruleForm.is_delivery === 1">
              <div class="flex-box">
                <div class="flex-item">
                  <div style="width: 80px; margin-right: 20px">
                    <img src="../../assets/station.png" />
                  </div>
                  <div>
                    <div class="font-bold black-text">
                      {{ $t('荷兰某某自提点A') }}
                    </div>
                    <div>{{ $t('0031-650207241') }}</div>
                    <div>
                      {{ $t('1336ZG  Almere  Mickey Mousestraat 79') }}
                    </div>
                  </div>
                </div>
                <div>
                  <el-button
                    class="btn-light-green"
                    :disabled="!ruleForm.user_id"
                    @click="changeAddress('pickup')"
                    >{{ $t('选择自提点') }}</el-button
                  >
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('支付方式')">
            <el-radio-group v-model="ruleForm.mode">
              <el-radio :label="0">{{ $t('团员自付') }}</el-radio>
              <el-radio :label="1">{{ $t('团长代付') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('拼团截止')">
            <el-input v-model="ruleForm.days" :placeholder="$t('选择日期时间')"> </el-input>
          </el-form-item>
          <el-form-item :label="$t('是否为公开拼团')">
            <el-switch
              v-model="ruleForm.is_public"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray"
            >
            </el-switch>
          </el-form-item>
          <el-form-item :label="$t('拼团介绍')">
            <el-input
              v-model="ruleForm.remark"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              :placeholder="$t('请输入拼团介绍')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <span class="img-item" v-for="(item, index) in ruleForm.images" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item" class="goods-img" />
            <span class="model-box"></span>
            <span class="operat-box">
              <i class="el-icon-zoom-in" @click="onPreview(item.path)"></i>
              <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
            </span>
          </span>
          <el-upload
            v-show="ruleForm.images.length < 1"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImg"
            :show-file-list="false"
          >
            <i class="el-icon-plus"> </i>
          </el-upload>
          <div class="upload-img">{{ $t('上传拼团封面图') }}</div>
        </el-col>
      </el-form>
    </el-row>
    <div slot="footer">
      <el-button type="primary" @click="confirm" :loading="$store.state.btnLoading">{{
        $t('保存')
      }}</el-button>
    </div>
    <div class="pagination-box" v-if="this.state === 'edit'">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <el-dialog
      :visible.sync="innerVisible"
      :title="status === 'address' ? $t('收件地址列表') : $t('自提点地址')"
      class="dialog-invoice"
      width="55%"
      @close="clearSecond"
      append-to-body
    >
      <el-table :data="addressData" style="100%" @row-click="onRowChange" border>
        <el-table-column>
          <template slot-scope="scope">
            <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column :label="$t('国家')" v-if="status === 'address'">
          <template slot-scope="scope">
            <span>{{ scope.row.country && scope.row.country.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('城市')"
          prop="city"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('收件人')"
          prop="receiver_name"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('收件电话')"
          prop="phone"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('详细地址')"
          prop="address"
          v-if="status === 'address'"
        ></el-table-column>
        <el-table-column
          :label="$t('自提点名称')"
          prop="name"
          v-if="status === 'pickup'"
        ></el-table-column>
        <el-table-column :label="$t('详细地址')" v-if="status === 'pickup'">
          <template slot-scope="scope">
            <span
              >{{ scope.row.country && scope.row.country.name }}&nbsp;
              {{ scope.row.address }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="innerVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" :loading="$store.state.btnLoading" @click="submitChoose">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showLine" :title="$t('渠道')" append-to-body @close="clearShowLine">
      <div
        class="flex-item dashed-line"
        v-for="item in lineList"
        :key="item.id"
        :class="['template-item', { active: ind === item.id }]"
        @click="activeFun(item)"
      >
        <div v-if="item.icon" style="margin-right: 60px">
          <img :src="$baseUrl.IMAGE_URL + item.icon.icon" class="icon-size" />
        </div>
        <div>
          <div style="margin-bottom: 10px" class="font-bold black-text">{{ item.name }}</div>
          <div style="margin-bottom: 10px">
            <span>{{ item.props }}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" :loading="$store.state.btnLoading" @click="onSaveLine">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        is_delivery: 0,
        mode: 0,
        user_id: '',
        address_id: '',
        station_id: '',
        warehouse_id: '',
        express_line_id: '',
        days: '',
        is_public: 0,
        region_id: '',
        images: [],
        country: '',
        remark: '',
        address: {},
        express_line: {}
      },
      innerVisible: false,
      showLine: false,
      chooseId: '',
      group: {},
      addressData: [],
      warehouseData: [],
      status: '',
      state: '',
      id: '',
      ind: 0,
      activeId: '',
      lineList: [],
      icon: ''
    }
  },
  methods: {
    init() {
      this.getWarehouse()
      if (this.id) {
        this.getDetails(this.id)
      }
    },
    getGroupLine() {
      this.$request.groupLineList().then(res => {
        if (res.ret) {
          this.lineList = res.data.map(item => {
            const props = item.props.map(ele => ele.name).join(',')
            return {
              ...item,
              props
            }
          })
        }
      })
    },
    getDetails(id) {
      this.$request.groupDetails(id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.ruleForm.express_line_id = res.data.express_line && res.data.express_line.id
          this.icon =
            res.data.express_line && res.data.express_line.icon && res.data.express_line.icon.icon
          this.ruleForm.express_line.props = res.data.express_line.props.map(item => item).join(',')
          this.ruleForm.user_id = res.data.members[0].id + '---' + res.data.members[0].name
          this.ruleForm.address_id = res.data.address && res.data.address.id
        }
      })
    },
    onAddAddress() {
      dialog({
        type: 'addGroupAddress',
        user: {
          id: this.ruleForm.user_id.substring(0, 6),
          name: this.ruleForm.user_id.split('---')[1]
        }
      })
    },
    // 客户id
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .Automatic({
          keyword: this.ruleForm.user_id.toString()
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback && callback(list)
        })
    },
    // 获取仓库数据
    getWarehouse() {
      this.$request.getShipWarehouse().then(res => {
        this.warehouseData = res.data
      })
    },
    // 更改地址 或 选择自提点
    changeAddress(status) {
      this.status = status
      this.innerVisible = true
      let userId = this.ruleForm.user_id.substring(0, 6)
      if (status === 'address') {
        this.$request.groupbuyAddress(userId).then(res => {
          if (res.ret) {
            this.addressData = res.data
          }
        })
      } else {
        this.$request.groupStation(userId).then(res => {
          if (res.ret) {
            this.addressData = res.data
          }
        })
      }
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.ruleForm.images = res.data.map(item => item.path)
        }
      })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      console.log(index)
      this.ruleForm.images.splice(index, 1)
    },
    onRowChange(row) {
      console.log(row)
      this.chooseId = row.id
      this.group = row
    },
    selectLine() {
      this.showLine = true
      this.getGroupLine()
    },
    submitChoose() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      if (this.status === 'address') {
        this.ruleForm.address.receiver_name = this.group && this.group.receiver_name
        this.ruleForm.address.phone = this.group && this.group.phone
        this.ruleForm.address.country_name = this.group && this.group.country.name
        this.ruleForm.address.city = this.group && this.group.city
        this.ruleForm.address.street = this.group && this.group.street
        this.ruleForm.address.province = this.group && this.group.province
        this.ruleForm.address.address = this.group && this.group.address
        this.ruleForm.address_id = this.group && this.group.id
      } else {
        this.stationName = this.group && this.group.name
        this.ruleForm.station_id = this.group.id
      }
      this.innerVisible = false
    },
    confirm() {
      delete this.ruleForm.address
      let params = {
        ...this.ruleForm
      }
      if (this.id) {
        this.$request.editGroupInfo(this.id, params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.createGroup(params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.show = false
            this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    activeFun(item) {
      this.ind = item.id
      this.activeId = item.id
      if (this.ruleForm.express_line) {
        this.ruleForm.express_line.id = item.id
        this.ruleForm.express_line.name = item.name
        this.ruleForm.express_line.props = item.props
        this.ruleForm.region_id = item.region && item.region.id
        this.ruleForm.express_line_id = item.id
        this.icon = item.icon && item.icon.icon
      }
    },
    onSaveLine() {
      this.showLine = false
    },
    clear() {
      this.show = false
      this.ruleForm = {
        name: '',
        is_delivery: 0,
        mode: 0,
        user_id: '',
        address_id: '',
        station_id: '',
        warehouse_id: '',
        express_line_id: '',
        days: '',
        is_public: 0,
        images: [],
        country: '',
        remark: ''
      }
    },
    clearSecond() {
      this.chooseId = ''
      this.addressData = []
      this.status = ''
    },
    clearShowLine() {
      this.showLine = false
    }
  }
}
</script>

<style>
.select-boxs {
  padding: 35px;
  border-radius: 5px;
  border: 1px dashed #000;
}
.flex-item {
  display: flex;
  align-items: center;
}
.flex-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.upload-img {
  margin-top: 10px;
  text-align: center;
}
.dashed-line {
  border: 2px dashed #3540a5;
  padding: 30px;
  width: 600px;
  border-radius: 5px;
  margin-top: 20px;
}
.font-bold {
  font-weight: bold;
}
.black-text {
  color: #000;
}
.template-item {
  cursor: pointer;
  transition: all 0.4s;
  border: 1px solid red;
  border-radius: 5px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.04);
  background: #fff;
}
.active {
  border: 2px solid #3540a5 !important;
}
.icon-size {
  width: 60px;
}
</style>
