<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('编辑客户') + this.userId + $t('的个人地址')"
    class="address-edit-dialog"
    @close="clear"
  >
    <el-form label-width="80" :model="form">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="'*' + $t('收件人')">
            <el-input v-model="form.receiver_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="'*' + $t('国家地区')">
            <el-cascader
              v-model="form.country_id"
              :options="options"
              :props="{ checkStrictly: true }"
              clearable
              class="country-select"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="form.is_cn_address == 1">
        <el-col :span="10">
          <el-form-item :label="$t('省份')">
            <el-input v-model="form.province"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('区')">
            <el-input v-model="form.district"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('微信号')">
            <el-input v-model="form.wechat_id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('城市')">
            <el-input v-model="form.city"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('街道')">
            <el-input v-model="form.street"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('门牌号')">
            <el-input v-model="form.door_no"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('邮编')">
            <el-input v-model="form.postcode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="'*' + $t('联系电话')">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('附加地址')">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('区域')">
            <el-input v-model="form.address_area"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('清关编码')">
            <el-input v-model="form.clearance_code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('身份证号码')">
            <el-input v-model="form.id_card"></el-input>
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
        country_id: [],
        door_no: '',
        province: '',
        district: '',
        city: '',
        postcode: '',
        street: '',
        address: '',
        wechat_id: '',
        clearance_code: '',
        id_card: '',
        address_area: ''
      },
      supplierId: '',
      options: [],
      countryList: [],
      id: '',
      userId: ''
    }
  },
  methods: {
    getList() {
      this.$request.singleAddress(this.id).then(res => {
        if (res.ret) {
          this.form = res.data
          this.form.receiver_name = res.data.receiver_name
          this.form.phone = res.data.phone
          this.form.timezone = res.data.timezone
          this.form.country_id = [res.data.country.id, res.data.area_id, res.data.sub_area_id]
          console.log(this.form.country_id, 'this.form.country_id')
          this.form.door_no = res.data.door_no
          this.form.province = res.data.province
          this.form.city = res.data.city
          this.form.district = res.data.district
          this.form.postcode = res.data.postcode
          this.form.street = res.data.street
          this.form.address = res.data.address
          this.form.wechat_id = res.data.wechat_id
          this.form.clearance_code = res.data.clearance_code
          this.form.id_card = res.data.id_card
          this.form.area = res.data.area
        }
      })
    },
    submit() {
      if (this.form.receiver_name === '') {
        return this.$message.error(this.$t('请输入收件人'))
      } else if (this.form.phone === '') {
        return this.$message.error(this.$t('请输入联系电话'))
      }
      let param = {
        ...this.form,
        country_id: this.form.country_id[0],
        area_id: this.form.country_id[1] || '',
        sub_area_id: this.form.country_id[2] || ''
      }
      this.$request.updateSingleAddress(this.id, param).then(res => {
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
        // this.show = false
      })
    },
    // 获取支持国家数据
    searchCountry() {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.options = res.data.map(item => {
            return {
              value: item.id,
              label: item.name,
              children: item.areas.length
                ? item.areas.map(item2 => {
                    return {
                      value: item2.id,
                      label: item2.name,
                      children: item2.areas.length
                        ? item2.areas.map(item3 => {
                            return {
                              value: item3.id,
                              label: item3.name
                            }
                          })
                        : []
                    }
                  })
                : []
            }
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {},
    init() {
      this.getList()
      this.searchCountry()
    }
  }
}
</script>
<style lang="scss" scope>
.el-autocomplete-suggestion {
  z-index: 4000 !important;
}
.address-edit-dialog {
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
    width: 100%;
  }
}
</style>
