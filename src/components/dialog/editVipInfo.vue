<template>
  <el-dialog
    :visible.sync="show"
    :title="this.name + $t('的个人信息')"
    class="edit-info-dialog"
    @close="clear"
  >
    <el-form :model="form">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('用户ID')" class="label-sty">
            <span>{{ userId }}</span>
            <!-- <el-input v-model="form.receiver_name"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('国家地区')" class="label-sty">
            <!-- <span>{{form.country_name}}</span> -->
            <el-select
              v-model="form.country_id"
              filterable
              class="country-select"
              :placeholder="$t('请选择国家地区')"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('收件人')" class="label-sty">
            <!-- <span>{{form.receiver_name}}</span> -->
            <el-input class="input-sty" v-model="form.receiver_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('城市')" class="label-sty">
            <!-- <span>{{form.city}}</span> -->
            <el-input class="input-sty" v-model="form.city"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('联系电话')" class="label-sty">
            <!-- <span>{{form.phone}}</span> -->
            <el-input class="input-sty" v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('街道')" class="label-sty">
            <!-- <span>{{form.street}}</span> -->
            <el-input class="input-sty" v-model="form.street"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('身份证号码')" class="label-sty">
            <!-- <span>{{form.id_card}}</span> -->
            <el-input class="input-sty" v-model="form.id_card"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('门牌号')" class="label-sty">
            <!-- <span>{{form.door_no}}</span> -->
            <el-input class="input-sty" v-model="form.door_no"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('微信号')" class="label-sty">
            <!-- <span>{{form.wechat_id}}</span> -->
            <el-input class="input-sty" v-model="form.wechat_id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('邮编')" class="label-sty">
            <!-- <span>{{form.postcode}}</span> -->
            <el-input class="input-sty" v-model="form.postcode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('邀请人')" prop="invitorId" class="label-sty">
            <!-- <el-input v-model="ruleForm.name_cn"
          placeholder="请输入用户id"></el-input> -->
            <el-autocomplete
              class="input-sty"
              :fetch-suggestions="queryCNSearch"
              @select="handleSelect"
              :placeholder="$t('请输入邀请人ID')"
              v-model="invitorId"
            >
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item class="label-sty">
            <span>{{ $t('会员识别码') }}</span>
            <el-tooltip
              class="item code-sty"
              effect="dark"
              :content="
                $t(
                  '修改会员识别码后，将会替换系统中注册的客户昵称。如要使用初始注册用户名，请清空内容。'
                )
              "
              placement="top"
            >
              <span class="el-icon-question icon-info"></span>
            </el-tooltip>
            <el-input v-model="remarkName" class="input-sty"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <span class="red-sty">*{{ $t('修改邀请人的操作将会被日志记录,请谨慎操作') }}</span>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('备注')" class="label-sty">
            <el-input
              type="textarea"
              :rows="3"
              class="input-sty"
              :placeholder="$t('请输入备注')"
              v-model="form.remark"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('客户标签')" class="label-sty">
            <el-select v-model="tag_ids" @change="changeLabel($event)" multiple clearable>
              <el-option
                v-for="item in labelData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import countryList from '@/lib/country'
export default {
  data() {
    return {
      form: {
        receiver_name: '',
        phone: '',
        timezone: '',
        country_id: '',
        door_no: '',
        city: '',
        postcode: '',
        street: '',
        address: '',
        wechat_id: '',
        clearance_code: '',
        id_card: '',
        area: '',
        remark: ''
      },
      remarkName: '',
      invitorId: '',
      supplierId: '',
      options: [],
      id: '',
      userId: '',
      name: '',
      tag_ids: [],
      labelData: []
    }
  },
  methods: {
    getList() {
      this.$request.checkVipInfo(this.id).then(res => {
        if (res.ret) {
          this.form = res.data.profile
          this.userId = res.data.id
          this.form.receiver_name = res.data.profile && res.data.profile.receiver_name
          this.form.phone = res.data.profile && res.data.profile.phone
          this.form.timezone = res.data.profile && res.data.profile.timezone
          this.form.country_id = res.data.profile && res.data.profile.country_id
          this.form.door_no = res.data.profile && res.data.profile.door_no
          this.form.city = res.data.profile && res.data.profile.city
          this.form.postcode = res.data.profile && res.data.profile.postcode
          this.form.street = res.data.profile && res.data.profile.street
          this.form.address = res.data.profile && res.data.profile.address
          this.form.wechat_id = res.data.profile && res.data.profile.wechat_id
          this.form.clearance_code = res.data.profile && res.data.profile.clearance_code
          this.form.id_card = res.data.profile && res.data.profile.id_card
          this.form.area = res.data.profile && res.data.profile.area
          this.remarkName = res.data.remark_name
          this.invitorId = res.data.invitor_id.toString()
          console.log(typeof this.invitorId, 'this.invitorId')
          this.form.remark = res.data.profile && res.data.profile.remark
        }
      })
    },
    queryCNSearch(queryString, callback) {
      console.log(this.invitorId)
      var list = [{}]
      this.$request
        .noUsers({
          keyword: this.invitorId
        })
        .then(res => {
          for (let i of res.data) {
            // i.value = i.id
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback(list)
        })
    },
    handleSelect(item) {
      this.supplierId = item.id
      this.supplierName = item.name
    },
    getUserLabel() {
      this.$request.userTag().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.labelData = res.data
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    changeLabel(e) {
      console.log(e)
      this.$request.makeTag({ tag_ids: this.tag_ids }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.success()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    submit() {
      this.$request
        .updateVipInfo(this.id, {
          ...this.form,
          invitor_id: this.supplierId ? this.supplierId : this.invitorId,
          remark_name: this.remarkName
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
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
    },
    // 获取支持国家数据
    searchCountry() {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.options = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.supplierId = ''
    },
    init() {
      this.getList()
      this.searchCountry()
      this.getUserLabel()
    }
  }
}
</script>
<style lang="scss" scope>
.el-autocomplete-suggestion {
  z-index: 4000 !important;
}
.edit-info-dialog {
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
  .country-select {
    width: 60%;
  }
  .input-sty {
    width: 60%;
  }
  .red-sty {
    color: red;
  }
  .code-sty {
    padding-right: 5px;
  }
  .label-sty {
    .el-form-item__label {
      width: 85px;
    }
  }
}
</style>
