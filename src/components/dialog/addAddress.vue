<template>
  <el-dialog :visible.sync="show" :title="$t('新建收货地址')" width="45%" @close="clear">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item :label="$t('客户ID')">
            <el-autocomplete
              :fetch-suggestions="queryCNSearch"
              :placeholder="$t('请输入客户ID')"
              v-model="ruleForm.user_id"
            >
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('国家')">
            <!-- <el-select v-model="ruleForm.country_id" :placeholder="$t('请选择国家')" filterable>
              <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.cn_name"
                :value="item.id"
              >
              </el-option>
            </el-select> -->
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
        user_id: '',
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
      },
      props: { checkStrictly: true }
    }
  },
  methods: {
    init() {
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
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$request
          //   .addReceiveAddress({
          //     ...this.ruleForm,
          //     user_id: this.ruleForm.user_id.substring(0, 6),
          //     country_id: this.ruleForm.country_id[0],
          //     area_id: this.ruleForm.country_id[1] ? this.ruleForm.country_id[1] : '',
          //     sub_area_id: this.ruleForm.country_id[2] ? this.ruleForm.country_id[2] : ''
          //   })
          //   .then(res => {
          //     console.log(res)
          //     if (res.ret) {
          //       this.$notify({
          //         title: this.$t('操作成功'),
          //         message: res.msg,
          //         type: 'success'
          //       })
          //       this.show = false
          //       this.success()
          //     } else {
          //       this.$notify({
          //         title: this.$t('操作失败'),
          //         message: res.msg,
          //         type: 'warning'
          //       })
          //     }
          //   })
        } else {
          return false
        }
      })
    },
    clear() {
      this.ruleForm.user_id = ''
      this.ruleForm.receiver_name = ''
      this.ruleForm.phone = ''
      this.ruleForm.timezone = ''
      this.ruleForm.country_id = ''
      this.ruleForm.door_no = ''
      this.ruleForm.city = ''
      this.ruleForm.postcode = ''
      this.ruleForm.street = ''
      this.ruleForm.address = ''
    }
  }
}
</script>

<style></style>
