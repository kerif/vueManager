<template>
  <el-dialog :visible.sync="show" :title="$t('新建收货地址')" width="45%" @close="clear">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('客户ID')">
            <span>{{ user.id }} -- {{ user.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('国家')">
            <el-cascader
              v-model="ruleForm.country_id"
              :options="countryOptions"
              ref="country"
              :props="props"
              collapse-tags
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('省份')">
            <el-input
              v-model="ruleForm.province"
              :placeholder="$t('请输入省份')"
              class="inner-textarea"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('区')">
            <el-input
              v-model="ruleForm.district"
              :placeholder="$t('请输入区')"
              class="inner-textarea"
            ></el-input>
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
        <el-col :span="10">
          <el-form-item :label="$t('邮箱')">
            <el-input
              v-model="ruleForm.email"
              class="inner-textarea"
              :placeholder="$t('请输入邮箱')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" :loading="$store.state.btnLoading" @click="confirm('ruleForm')">{{
        $t('确定')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      countryData: [],
      countryOptions: [],
      ruleForm: {
        receiver_name: '',
        phone: '',
        timezone: '',
        country_id: '',
        door_no: '',
        city: '',
        postcode: '',
        street: '',
        address: '',
        province: '',
        district: '',
        email: ''
      },
      rules: {
        country_id: [{ required: true, message: this.$t('请选择国家'), trigger: 'blur' }],
        phone: [{ required: true, message: this.$t('请输入电话'), trigger: 'blur' }],
        receiver_name: [{ required: true, message: this.$t('请输入收件人'), trigger: 'blur' }],
        city: [{ required: true, message: this.$t('请输入城市'), trigger: 'blur' }]
      },
      props: { checkStrictly: true },
      user: {}
    }
  },
  methods: {
    init() {
      console.log(this.user)
      this.getCountry()
    },
    getCountry() {
      this.$request.getCountry().then(res => {
        this.countryData = res.data
        this.countryOptions = res.data.map(item => {
          return {
            value: item.id,
            label: item.name,
            children:
              item.areas < 1
                ? undefined
                : item.areas.map(item => {
                    return {
                      value: item.id,
                      label: item.name,
                      children:
                        item.areas < 1
                          ? undefined
                          : item.areas.map(item => {
                              return {
                                value: item.id,
                                label: item.name
                              }
                            })
                    }
                  })
          }
        })
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$request
            .addReceiveAddress({
              ...this.ruleForm,
              user_id: this.user.id,
              country_id: this.ruleForm.country_id[0],
              area_id: this.ruleForm.country_id[1] ? this.ruleForm.country_id[1] : '',
              sub_area_id: this.ruleForm.country_id[2] ? this.ruleForm.country_id[2] : ''
            })
            .then(res => {
              console.log(res)
              if (res.ret) {
                this.$notify({
                  title: this.$t('操作成功'),
                  message: res.msg,
                  type: 'success'
                })
                this.show = false
                this.success()
              } else {
                this.$notify({
                  title: this.$t('操作失败'),
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.receiver_name = ''
      this.ruleForm.phone = ''
      this.ruleForm.timezone = ''
      this.ruleForm.country_id = ''
      this.ruleForm.door_no = ''
      this.ruleForm.city = ''
      this.ruleForm.postcode = ''
      this.ruleForm.street = ''
      this.ruleForm.address = ''
      this.ruleForm.province = ''
      this.ruleForm.district = ''
      this.ruleForm.email = ''
    }
  }
}
</script>

<style></style>
