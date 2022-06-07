<template>
  <el-dialog :title="$t('邀新累计成长值')" :visible.sync="show" width="50%" @close="clear">
    <el-form :model="form">
      <h3>{{ $t('新用户注册') }}:</h3>
      <el-form-item :label="$t('每邀请一个新用户【注册】获得成长值:')">
        <el-input v-model="form.register_value" style="width: 35%"></el-input>
      </el-form-item>
      <h3>{{ $t('新用户下单') }}:</h3>
      <el-form-item :label="$t('新用户【首次下单并支付】获得成长值:')">
        <el-input v-model="form.first_order_value" style="width: 35%"></el-input>
      </el-form-item>
      <h3>{{ $t('成长值有效期') }}:</h3>
      <el-form-item :label="$t('成长值到账之日起计算,有效期为')">
        <el-select v-model="form.valid_time">
          <el-option
            v-for="item in timeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <h3>{{ $t('规则限制') }}:</h3>
      <el-form-item>
        <el-select v-model="form.frequency">
          <el-option
            v-for="item in dateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="growth">{{ $t('最高奖励成长值') }}</span>
        <el-input v-model="form.max_value" style="width: 35%"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-main" @click="setRule">{{ $t('设置规则说明') }}</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      timeList: [],
      dateList: [
        {
          id: 0,
          name: this.$t('永久')
        },
        {
          id: 1,
          name: this.$t('每天')
        },
        {
          id: 2,
          name: this.$t('每周')
        },
        {
          id: 3,
          name: this.$t('每月')
        },
        {
          id: 4,
          name: this.$t('每年')
        }
      ],
      form: {
        register_value: '',
        first_order_value: '',
        valid_time: '',
        frequency: '',
        max_value: '',
        illustrate: {}
      },
      langObj: {}
    }
  },
  methods: {
    init() {
      this.getInit()
      this.getDetail()
    },
    getInit() {
      this.$request.getInitInfo().then(res => {
        this.timeList = res.data.valid_time_list
      })
    },
    getDetail() {
      this.$request.showGrowth().then(res => {
        if (res.ret) {
          for (let key in this.form) {
            if (Object.hasOwnProperty.call(this.form, key)) {
              this.form[key] = res.data[key]
            }
          }
          this.langObj = res.data.illustrate ? res.data.illustrate : {}
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    setRule() {
      dialog(
        {
          type: 'growthExplain',
          langObj: this.langObj
        },
        data => {
          this.form.illustrate = data
        }
      )
    },
    onConfirm() {
      this.$request.createGrowth({ ...this.form }).then(res => {
        console.log(res)
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
      })
    },
    clear() {
      this.form.register_value = ''
      this.form.first_order_value = ''
      this.form.valid_time = ''
      this.form.frequency = ''
      this.form.max_value = ''
    }
  }
}
</script>

<style>
.growth {
  display: inline-block;
  margin: 0 10px;
}
</style>
