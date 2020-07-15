<template>
  <div class="boxing-container">
    <div class="apply-main">
      <p class="choose-sty">{{$t('您本次选择')}}
        <span class="apply-number">{{packageData.length}}</span>
        {{$t('个包裹')}}</p>
      <ul>
        <li class="main-sty" v-for="item in packageData" :key="item.id">
          <div class="apply-express">
            <div class="express-left">
              <p><strong>{{item.express_num}}</strong></p>
              <p v-for="val in item.props" :key="val.id">{{val.name}}</p>
            </div>
            <div class="express-left express-right">
              <p>{{item.destination_country && item.destination_country.name}}</p>
              <p><strong>{{item.package_weight}}{{localization.weight_unit}}</strong></p>
            </div>
          </div>
        </li>
      </ul>
      <div class="recipient-address apply-express">
        <h3>{{$t('收件地址')}}</h3>
        <div class="address-main">
          <div class="express-left">
                <p>{{$t('收件地址')}}</p>
            </div>
            <div class="express-left express-right" v-if="this.userData.id">
              <p>{{userData.street}}&nbsp;{{userData.door_no}}&nbsp;{{userData.city}}&nbsp;
                <!-- <span v-if="user.address">({{user.address}})</span> -->
              </p>
            </div>
            <div class="express-left express-right" v-else>
              <p class="express-sty" @click="chooseUser">{{$t('请选择')}} ></p>
            </div>
            <div class="line-sty"></div>
            <div class="express-left">
                <p>{{$t('快递方式')}}</p>
            </div>
            <div class="express-left express-right radio-sty">
              <!-- <p>请选择快递方式</p> -->
                <el-select v-model="value" :placeholder="$t('请选择')">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="line-sty"></div>
            <div class="express-left">
              <p>{{$t('收货形式')}}</p>
            </div>
            <div class="express-left express-right radio-sty">
               <el-radio-group v-model="radio">
                  <el-radio :label="1">{{$t('送货上门')}}</el-radio>
                  <el-radio :label="2">{{$t('自提点提货')}}</el-radio>
              </el-radio-group>
            </div>
            <div class="line-sty"></div>
            <div class="express-left">
              <p>{{$t('送货上门地址')}}</p>
            </div>
            <div class="express-left express-right">
              <p class="express-sty">{{$t('请选择')}} ></p>
            </div>
        </div>
      </div>
      <div class="recipient-address">
      <h3>{{$t('增值服务')}}</h3>
         <div class="express-left">
            <span>{{$t('保险服务')}}</span>
              <el-tooltip class="item" effect="dark" :content="$t('开启表示需要提供收件人清关编码。')" placement="top">
                <span class="el-icon-warning-outline icon-info"></span>
            </el-tooltip><br/>
            <el-radio-group v-model="radio" class="radio-select-sty">
              <el-radio :label="1" class="radio-main">{{$t('送货上门')}}</el-radio>
              <el-radio :label="2" class="radio-main">{{$t('自提点提货')}}</el-radio>
              <el-radio :label="1" class="radio-main">{{$t('送货上门')}}</el-radio>
              <el-radio :label="2" class="radio-main">{{$t('自提点提货')}}</el-radio>
            </el-radio-group>
          </div>
          <div class="express-left express-right">
            <el-switch
              v-model="need_clearance_code"
              :active-text="$t('开')"
              :active-value="1"
              :inactive-value="0"
              :inactive-text="$t('关')"
              active-color="#13ce66"
              inactive-color="gray">
            </el-switch>
          </div>
      </div>
      <div class="recipient-address">
      <h3>{{$t('付款方式')}}</h3>
         <div class="express-left">
            <!-- <span>{{$t('保险服务')}}</span>
              <el-tooltip class="item" effect="dark" :content="$t('开启表示需要提供收件人清关编码。')" placement="top">
                <span class="el-icon-warning-outline icon-info"></span>
            </el-tooltip><br/> -->
            <el-radio-group v-model="radio" class="radio-select-sty">
              <el-radio :label="1" class="radio-main">{{$t('送货上门')}}</el-radio>
              <el-radio :label="2" class="radio-main">{{$t('自提点提货')}}</el-radio>
            </el-radio-group>
          </div>
      </div>
      <div class="save-main">
        <el-button type="primary" class="sava-btn" :loading="$store.state. btnLoading" @click="saveBoxing">{{$t('提交')}}</el-button>
        <p class="save-tips">{{$t('在仓库打包完成后再进行支付')}}</p>
      </div>
    </div>
  <el-dialog :visible.sync="boxDialog" :title="$t('收件地址列表')" @close="clear">
    <el-table
      :data="tableData"
      border
      @row-click="onRowChange"
      style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
        </template>
       </el-table-column>
      <!-- 国家 -->
      <el-table-column
        prop="country.cn_name"
        :label="$t('国家')">
      </el-table-column>
      <!-- 收件人 -->
        <el-table-column
        prop="receiver_name"
        :label="$t('收件人')">
      </el-table-column>
      <!-- 收件电话 -->
        <el-table-column
        :label="$t('收件电话')">
        <template slot-scope="scope">
          <span>{{scope.row.timezone}}-{{scope.row.phone}}</span>
        </template>
        </el-table-column>
        <!-- 详细地址 -->
        <el-table-column
        :label="$t('详细地址')">
        <template slot-scope="scope">
          <span>{{scope.row.street}}&nbsp;{{scope.row.door_no}}&nbsp;{{scope.row.city}}
            <span v-if="scope.row.address">({{scope.row.address}})</span>
          </span>
        </template>
        </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="boxDialog = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: '',
      value: '',
      need_clearance_code: 0,
      options: [],
      boxDialog: false,
      tableData: [],
      chooseId: 0,
      user: {},
      packageId: [],
      packageData: [],
      userId: '',
      userData: {},
      optionsId: [],
      localization: {}
    }
  },
  created () {
    if (this.$route.query.id) {
      this.packageId = this.$route.query.id
      console.log(this.packageId, 'this.packageId')
      this.getList()
    }
  },
  methods: {
    getList () {
      this.$request.preview({
        package_ids: this.packageId
      }).then(res => {
        if (res.ret) {
          this.packageData = res.data
          this.userId = res.data[0].user_id
          this.optionsId = res.data.map(item => item.id)
          console.log(this.optionsId, 'optionsId')
          this.localization = res.localization
          this.getExpress()
        }
      })
    },
    // 获取快递方式
    getExpress () {
      this.$request.usableLines({
        package_ids: this.optionsId
      }).then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    // 获取地址数据
    getAddressDialog () {
      this.$request.previewAddress({
        user_id: this.userId
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    chooseUser () {
      this.boxDialog = true
      if (this.userId) {
        this.getAddressDialog()
      }
    },
    saveBoxing () {},
    confirm (val) {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择客户'))
      }
      console.log(this.user, 'user')
      this.userData = this.user
      this.boxDialog = false
    },
    onRowChange (row) {
      this.chooseId = row.id
      this.user = row
    },
    clear () {
      this.chooseId = ''
      this.user = {}
    }
  }
}
</script>

<style lang="scss">
.boxing-container {
  .apply-main {
    background-color: #fff;
    padding: 20px;
  }
  ul {
    list-style:none;
    padding: 0;
    margin-top: 0;
  }
  .express-left {
    display: inline-block;
  }
  .express-right {
    float: right;
  }
  .apply-express {
    overflow: hidden;
  }
  .main-sty {
    border: 1px solid #f5f5f5;
    padding: 10px;
    margin-bottom: 10px;
  }
  .apply-number {
    color:#f5ab53;
    font-weight: 700;
  }
  .choose-sty {
    color: #b6b6b6;
  }
  .top-sty {
    padding-bottom: 20px;
  }
  .recipient-address {
    margin-top: 80px;
  }
  .address-main {
    padding-left: 10px;
  }
  .line-sty {
    border: 1px solid #fbfbfb;
  }
  .radio-sty {
    margin-top: 10px;
  }
  .express-sty {
    cursor: pointer;
  }
  .icon-info {
    color: #f4a323;
    padding-left: 10px;
  }
  .radio-select-sty {
    width: 200px;
    margin-top: 20px;
    .radio-main {
      margin-bottom: 10px;
    }
  }
  .sava-btn {
    min-width: 300px;
    margin-top: 20px;
  }
  .save-main {
    text-align: right;
  }
  .save-tips {
    color: #b6b6b6;
    font-size: 14px;
    margin-right: 40px;
  }
}
</style>
