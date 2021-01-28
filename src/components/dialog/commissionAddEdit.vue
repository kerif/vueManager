<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? $t('新增') : $t('编辑')"
  class="edit-info-dialog" @close="clear" width="75%">
    <el-form :model="form">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-form-item :label="$t('名称')" class="label-sty">
            <el-input class="input-sty" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="13">
          <el-form-item :label="$t('计佣方式')" class="label-sty">
            <el-select
             clearable
             @change="changeType"
              v-model="form.type"
              class="country-select"
              :placeholder="$t('请选择国家/地区')">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item class="label-sty">
            <el-tooltip class="item code-sty" effect="dark" :content="$t('勾选时，如一个订单为多箱发货，则以每箱计佣；不勾选时，则每个订单计佣')" placement="top">
            <span class="el-icon-question icon-info"></span>
            </el-tooltip>
            <el-checkbox v-model="form.multi_boxes">{{$t('开启多箱计佣')}}</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="form.type === 1">
        <el-col :span="13">
          <el-form-item :label="$t('*每单订单佣金数额') + currencyUnit" class="label-sty">
            <el-input class="input-sty" v-model="form.amount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="form.type === 2">
        <el-col :span="12">
          <el-form-item :label="$t('计重方式')" class="label-sty">
            <el-select
              clearable
              v-model="form.weight_type"
              class="country-select"
              :placeholder="$t('请选择')">
              <el-option
                v-for="item in weightData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="$t('首重') + currencyUnit">
            <el-input class="input-sty" v-model="form.first_weight"></el-input>
          </el-form-item>
          <el-form-item :label="$t('续重') + currencyUnit">
            <el-input class="input-sty" v-model="form.next_weight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label="$t('首重佣金') + weightUnit">
            <el-input class="input-sty" v-model="form.first_money"></el-input>
          </el-form-item>
          <el-form-item :label="$t('续重佣金') + weightUnit">
            <el-input class="input-sty" v-model="form.next_money"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import countryList from '@/lib/country'
export default {
  data () {
    return {
      form: {
        name: '',
        amount: '',
        weight_type: '',
        multi_boxes: '',
        type: '',
        first_weight: '',
        first_money: '',
        next_weight: '',
        next_money: ''
      },
      remarkName: '',
      invitorId: '',
      supplierId: '',
      id: '',
      userId: '',
      name: '',
      options: [
        {
          id: 1,
          name: this.$t('每单固定金额')
        },
        {
          id: 2,
          name: this.$t('按重量或体积重量')
        }
      ],
      weightData: [
        {
          id: 1,
          name: this.$t('重量')
        },
        {
          id: 2,
          name: this.$t('体积重量')
        },
        {
          id: 3,
          name: this.$t('重量与体积重量比大')
        }
      ],
      state: '',
      weightUnit: '',
      currencyUnit: ''
    }
  },
  methods: {
    getList () {
      this.$request.getPickDetails(this.id).then(res => {
        if (res.ret) {
          this.form = res.data
          this.form.multi_boxes = Boolean(res.data.multi_boxes)
        }
      })
    },
    changeType () {
      if (this.form.type === 1) {
        this.form.weight_type = ''
        this.form.first_weight = ''
        this.form.next_weight = ''
        this.form.first_money = ''
        this.form.next_money = ''
      } else if (this.form.type === 2) {
        this.form.amount = ''
      }
    },
    submit () {
      if (this.form.type === 1 && !this.form.amount) {
        return this.$message.error(this.$t('请输入订单佣金数额'))
      }
      if (this.state === 'add') {
        this.$request.addPickRules({
          ...this.form,
          multi_boxes: Number(this.form.multi_boxes)
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
      } else if (this.state === 'edit') {
        this.$request.updatePickRules(this.id, {
          ...this.form,
          multi_boxes: Number(this.form.multi_boxes)
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
    },
    clear () {
      this.form.name = ''
      this.form.amount = ''
      this.form.weight_type = ''
      this.form.multi_boxes = ''
      this.form.first_weight = ''
      this.form.first_money = ''
      this.form.next_weight = ''
      this.form.next_money = ''
      this.form.type = ''
    },
    init () {
      if (this.state === 'edit') {
        this.getList()
      }
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
    // width: 40%;
  }
  .red-sty {
    color: red;
  }
  .code-sty {
    padding-right: 5px;
  }
  .label-sty {
    .el-form-item__label {
      width: 140px;
    }
  }
  .input-sty {
    // width: 40%;
  }
}
</style>
