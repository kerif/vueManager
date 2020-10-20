<template>
  <el-dialog :visible.sync="show" :title="this.name + $t('的个人信息')" class="edit-info-dialog" @close="clear">
    <el-form label-width="80" :model="form">
    <el-row :gutter="20">
      <el-col :span="10">
         <el-form-item :label="$t('用户ID')">
           <span>{{form.user_id}}</span>
          <!-- <el-input v-model="form.receiver_name"></el-input> -->
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label="$t('国家/地区')">
        <span>{{form.country_name}}</span>
          <!-- <el-select
            v-model="form.country_id"
            filterable
            class="country-select"
            :placeholder="$t('请选择国家/地区')">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> -->
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
       <el-form-item :label="$t('收件人')">
         <span>{{form.receiver_name}}</span>
          <!-- <el-input v-model="form.wechat_id"></el-input> -->
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label="'*' + $t('城市')">
          <span>{{form.city}}</span>
          <!-- <el-input v-model="form.city"></el-input> -->
        </el-form-item>
      </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="('联系电话')">
            <span>{{form.phone}}</span>
            <!-- <el-input v-model="form.street"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('街道')">
            <span>{{form.street}}</span>
            <!-- <el-input v-model="form.door_no"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('身份证号码')">
            <span>{{form.id_card}}</span>
            <!-- <el-input v-model="form.postcode"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="'*' + $t('门派号')">
            <!-- <el-input v-model="form.phone"></el-input> -->
            <span>{{form.door_no}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('微信号')">
            <span>{{form.wechat_id}}</span>
            <!-- <el-input v-model="form.address"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('邮编')">
            <span>{{form.postcode}}</span>
            <!-- <el-input v-model="form.area"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('确定')}}</el-button>
    </div> -->
  </el-dialog>
</template>
<script>
// import countryList from '@/lib/country'
export default {
  data () {
    return {
      form: {
        user_id: '',
        receiver_name: '',
        phone: '',
        timezone: '',
        country_name: '',
        door_no: '',
        city: '',
        postcode: '',
        street: '',
        address: '',
        wechat_id: '',
        clearance_code: '',
        id_card: '',
        area: ''
      },
      supplierId: '',
      options: [],
      id: '',
      name: ''
    }
  },
  methods: {
    getList () {
      this.$request.checkVipInfo(this.id).then(res => {
        if (res.ret) {
          this.form = res.data
          this.form.usre_id = res.data.user_id
          this.form.receiver_name = res.data.receiver_name
          this.form.phone = res.data.phone
          this.form.timezone = res.data.timezone
          this.form.country_name = res.data.country_name
          this.form.door_no = res.data.door_no
          this.form.city = res.data.city
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
    submit () {
      if (this.form.country_id === '') {
        return this.$message.error(this.$t('请选择国家/地区'))
      } else if (this.form.city === '') {
        return this.$message.error(this.$t('请输入城市'))
      } else if (this.form.receiver_name === '') {
        return this.$message.error(this.$t('请输入收件人'))
      } else if (this.form.street === '') {
        return this.$message.error(this.$t('请输入街道'))
      } else if (this.form.phone === '') {
        return this.$message.error(this.$t('请输入联系电话'))
      }
      this.$request.updateSingleAddress(this.id, this.form).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    },
    // 获取支持国家数据
    searchCountry () {
      console.log('111')
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
    clear () {
    },
    init () {
      this.getList()
      // this.searchCountry()
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
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }

  .el-dialog__close {
    color: #FFF;
  }
  .country-select {
    width: 100%;
  }
}
</style>
