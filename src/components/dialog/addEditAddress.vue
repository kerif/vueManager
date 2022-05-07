<template>
  <!-- 收件地址弹窗 -->
  <el-dialog :visible.sync="show" :title="$t('收件地址列表')" @close="clearAddress">
    <div class="add-box" width="80%">
      <el-button @click="goCreated">{{ $t('新增') }}</el-button>
    </div>
    <el-table :data="tableData" border @row-click="onRowChange" style="width: 100%">
      <el-table-column>
        <template slot-scope="scope">
          <el-radio v-model="chooseId" :label="scope.row.id"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="country.name" :label="$t('国家')">
        <template slot-scope="scope">
          {{ scope.row.country.name }}
        </template>
      </el-table-column>
      <el-table-column prop="postcode" :label="$t('邮编')"> </el-table-column>
      <el-table-column prop="timezone" :label="$t('区号')"> </el-table-column>
      <el-table-column prop="receiver_name" :label="$t('收件人')"> </el-table-column>
      <el-table-column :label="$t('收件电话')">
        <template slot-scope="scope">
          <span>{{ scope.row.timezone }}-{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('详细地址')">
        <template slot-scope="scope">
          <span
            >{{ scope.row.street }}&nbsp;{{ scope.row.door_no }}&nbsp;{{ scope.row.city }}
            <span v-if="scope.row.address">({{ scope.row.address }})</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="selectAddress">{{ $t('确定') }}</el-button>
    </div>
    <!-- 新建收货地址 -->
    <el-dialog
      :visible.sync="innerVisible"
      :title="$t('新建收货地址')"
      width="45%"
      @close="clearNewAddress"
      append-to-body
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item :label="$t('国家')">
              <el-select v-model="ruleForm.country_id" :placeholder="$t('请选择国家')" filterable>
                <el-option
                  v-for="item in countryData"
                  :key="item.id"
                  :label="item.cn_name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('收件电话')">
              <el-input
                v-model="ruleForm.phone"
                class="inner-textarea"
                :placeholder="$t('请输入收件电话')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('城市')">
              <el-input
                v-model="ruleForm.city"
                class="inner-textarea"
                :placeholder="$t('请输入城市')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('收件人')">
              <el-input
                v-model="ruleForm.receiver_name"
                class="inner-textarea"
                :placeholder="$t('请输入收件人')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('门牌号')">
              <el-input
                v-model="ruleForm.door_no"
                class="inner-textarea"
                :placeholder="$t('请输入门牌号')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('区号')">
              <el-select v-model="ruleForm.timezone" :placeholder="$t('请选择区号')" filterable>
                <el-option
                  v-for="item in countryData"
                  :key="item.id"
                  :label="item.timezone"
                  :value="item.timezone"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('邮编')">
              <el-input
                v-model="ruleForm.postcode"
                class="inner-textarea"
                :placeholder="$t('请输入邮编')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('附加地址')">
              <el-input
                v-model="ruleForm.address"
                class="inner-textarea"
                :placeholder="$t('请输入附加地址')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('街道')">
              <el-input
                v-model="ruleForm.street"
                class="inner-textarea"
                :placeholder="$t('请输入街道')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="returnShip">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirmCreated('ruleForm')">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      chooseId: 0,
      clientId: '',
      tableData: [],
      countryData: [],
      innerVisible: false,
      user: {},
      userData: {},
      box: {
        address_id: ''
      },
      counts: {},
      addressList: [],
      ruleForm: {
        receiver_name: '',
        phone: '',
        timezone: '',
        country_id: '',
        door_no: '',
        city: '',
        postcode: '',
        street: '',
        address: ''
      },
      rules: {
        country_id: [{ required: true, message: this.$t('请选择国家'), trigger: 'blur' }],
        phone: [{ required: true, message: this.$t('请输入电话'), trigger: 'blur' }],
        receiver_name: [{ required: true, message: this.$t('请输入收件人'), trigger: 'blur' }],
        city: [{ required: true, message: this.$t('请输入城市'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {
      console.log(this.clientId, 'client')
      if (this.clientId) {
        this.getAddressDialog()
      }
      this.getCountry()
    },
    // 获取地址数据
    getAddressDialog() {
      this.$request
        .previewAddress({
          user_id: this.clientId
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            console.log(res.data, 333)
            this.userData = this.tableData[0]
            if (this.userData) {
              this.box.address_id = this.userData.id
            }
          }
        })
    },
    goCreated() {
      this.innerVisible = true
      this.show = false
    },
    onRowChange(row) {
      this.chooseId = row.id
      this.box.address_id = this.chooseId
      this.user = row
    },
    // 确定 更改地址
    selectAddress() {
      if (!this.chooseId) {
        return this.$message.error(this.$t('请选择'))
      }
      let params = this.addressList.map(item => {
        if (item.user_id === this.counts.user_id) {
          return {
            address_id: this.chooseId,
            package_count: 1,
            user_id: item.user_id
          }
        }
        return {
          user_id: item.user_id,
          package_count: 1,
          address_id: item.address.id
        }
      })
      this.$request.confirmChangeAddress(params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('成功'),
            message: res.msg
          })
          this.show = false
          this.success(JSON.parse(JSON.stringify(res.data)))
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取所有可选择的国家
    getCountry() {
      this.$request.getCountry().then(res => {
        this.countryData = res.data
      })
    },
    // 确认新建地址
    confirmCreated(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .addAddress({
              ...this.ruleForm,
              user_id: this.clientId
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('成功'),
                  message: res.msg
                })
                this.innerVisible = false
                this.show = true
                this.getAddressDialog()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
        } else {
          return false
        }
      })
    },
    returnShip() {
      this.innerVisible = false
      this.show = true
    },
    clearAddress() {
      this.chooseId = ''
    },
    // 清除新建收货地址
    clearNewAddress() {
      this.ruleForm.country_id = ''
      this.ruleForm.phone = ''
      this.ruleForm.city = ''
      this.ruleForm.receiver_name = ''
      this.ruleForm.door_no = ''
      this.ruleForm.timezone = ''
      this.ruleForm.postcode = ''
      this.ruleForm.address = ''
      this.ruleForm.street = ''
    }
  }
}
</script>

<style>
.add-box {
  text-align: right;
  margin-bottom: 10px;
}
</style>
