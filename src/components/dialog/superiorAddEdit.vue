<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? $t('新增') : $t('编辑')" class="dialog-superior-addEdit" width="50%"
  @close="clear">
    <el-form :model="ruleForm" ref="user" class="demo-ruleForm"
    label-position="top">
    <!-- 字符串 -->
    <el-form-item :label="$t('*国家')">
      <el-select v-model="ruleForm.country_id" :placeholder="$t('请选择国家')"
        filterable @change="changeCountry">
        <el-option
          v-for="item in country"
          :key="item.id"
          :label="item.cn_name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('区域')">
      <el-select v-model="ruleForm.parent_id" :placeholder="$t('请选择区域')"
        filterable :disabled="!ruleForm.country_id">
        <el-option
          v-for="item in childData"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('*中文名称')">
       <el-input v-model="ruleForm.name" class="input-sty"></el-input>
    </el-form-item>
    <el-form-item :label="$t('*邮编')">
       <el-input v-model="ruleForm.postcode" class="input-sty"></el-input>
    </el-form-item>
    <el-form-item :label="$t('区域代码')">
       <el-input v-model="ruleForm.code" class="input-sty"></el-input>
    </el-form-item>
    <el-form-item :label="$t('API值')">
       <el-input v-model="ruleForm.api_code" class="input-sty"></el-input>
       <el-checkbox v-model="ruleForm.some_with_name" style="margin-left: 20px">{{$t('与中文名称相同')}}</el-checkbox>
      <div class="tips-sty">{{$t('主要用于第三方API的需要，如果不清楚请默认填写与中文一致')}}</div>
    </el-form-item>
    <el-form-item v-for="item in stringData" :key="item.id" :label="item.name">
        <!-- <span></span> -->
        <el-input v-model="item.value" type="textarea" :rows="2" :placeholder="$t('请输入内容')"></el-input>
    </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      user: {
        key: '',
        source: '',
        translation: {}
      },
      expressData: [],
      stringData: [],
      localization: {},
      state: '',
      id: '',
      areaData: [],
      country: [],
      childData: [],
      ruleForm: {
        country_id: '',
        parent_id: '',
        name: '',
        postcode: '',
        code: '',
        api_code: '',
        some_with_name: ''
      }
    }
  },
  methods: {
    // 获取全部支持语言
    getString () {
      this.$request.getString().then(res => {
        if (res.ret) {
          this.stringData = res.data
          if (this.id) {
            this.getList()
          }
        }
      })
    },
    // 获取支持的上级区域
    // this.warehouseList = res.data.map(item => {
    //   return {
    //     value: item.id,
    //     label: item.name,
    //     children: item.areas.map(item => {
    //       return {
    //         value: item.id,
    //         label: item.name,
    //         children: item.areas.map(item => {
    //           return {
    //             value: item.id,
    //             label: item.name
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
    // 获取国家数据
    getCountry () {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.country = res.data
        }
      })
    },
    // 切换国家
    changeCountry () {
      this.ruleForm.parent_id = ''
      this.childData = []
      if (this.ruleForm.country_id) {
        this.getAreas()
      }
    },
    // 获取区域数据
    getAreas () {
      this.$request.superiorArea(this.ruleForm.country_id).then(res => {
        if (res.ret) {
          this.childData = res.data
        }
      })
    },
    // 获取详细
    getList () {
      this.$request.detailsAreas(this.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.ruleForm.some_with_name = Boolean(res.data.some_with_name)
          this.stringData = this.stringData.map(item => {
            const value = res.data.name_translations[item.language_code]
            console.log(value, 'value')
            return {
              ...item,
              value
            }
          })
          if (res.data.country_id) {
            this.$request.superiorArea(res.data.country_id).then(res => {
              if (res.ret) {
                this.childData = res.data
              }
            })
          }
          console.log(this.stringData, 'this.stringData')
        }
      })
    },
    confirm () {
      if (!this.ruleForm.country_id) {
        return this.$message.error(this.$t('国家不能为空'))
      } else if (!this.ruleForm.name) {
        return this.$message.error(this.$t('中文名称不能为空'))
      } else if (!this.ruleForm.postcode) {
        return this.$message.error(this.$t('邮编不能为空'))
      }
      let translation = {}
      this.stringData.forEach(item => {
        translation[item.language_code] = item.value
      })
      if (this.state === 'add') {
        this.$request.newAreas({
          ...this.ruleForm,
          name_translations: translation,
          some_with_name: Number(this.ruleForm.some_with_name)
        }).then(res => {
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
          this.show = false
        })
      } else {
        this.$request.updateDetailsAreas(this.id, {
          ...this.ruleForm,
          name_translations: translation,
          some_with_name: Number(this.ruleForm.some_with_name)
        }).then(res => {
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
          this.show = false
        })
      }
      console.log(translation, 'translation')
      // let method = this.state === 'add' ? 'newAreas' : 'updateString'
    },
    clear () {
      this.ruleForm.country_id = ''
      this.ruleForm.parent_id = ''
      this.ruleForm.name = ''
      this.ruleForm.postcode = ''
      this.ruleForm.code = ''
      this.ruleForm.api_code = ''
      this.ruleForm.some_with_name = ''
      this.ruleForm.name_translations = ''
      this.country = []
      this.childData = []
      this.state = ''
    },
    init () {
      this.getString()
      this.getCountry()
      console.log(this.state, 'sate')
    }
  }
}
</script>
<style lang="scss">
.dialog-superior-addEdit {
  .el-input {
    // width: 300px !important;
    margin-left: 50px;
  }
  .el-textarea {
    width: 350px !important;
    margin-left: 50px;
  }
  .el-form-item__label {
    width: 100px;
  }
  .el-form-item__error {
    margin-left: 100px !important;
  }
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
  .input-sty {
    width: 350px !important;
  }
  .tips-sty {
    margin-left: 40px;
    color: gray;
  }
}
</style>
