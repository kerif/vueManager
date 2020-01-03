<template>
  <div class="line-add-container">
    <el-form label-position="top" :model="form" ref="form">
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>线路名称</div>
            <el-input placeholder="请输入内容" v-model="form.cn_name"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <div>支持国家</div>
            <el-select
              v-model="form.countries"
              multiple
              class="country-select"
              placeholder="请选择国家">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.cn_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" class="country-btn">
            <el-button type="primary" @click="onAddCountry">+ 新增国家</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>参考时效</div>
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.reference_time" placeholder="例：5-12工作日/日"></el-input>
          </el-col>
          <!-- <el-col :span="4">
            <el-input v-model="referenceTime.minTime" placeholder="最小天数"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="referenceTime.maxTime" placeholder="最大天数" class="max-time"></el-input>
          </el-col>
          <el-col :span="4">
            <el-select class="select-box" v-model="referenceTime.symbol">
              <el-option label="工作日" value="工作日"></el-option>
              <el-option label="日" value="日"></el-option>
            </el-select>
          </el-col> -->
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>{{'首重' + this.localization.weight_unit}}</div>
            <el-input v-model="form.first_weight" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="10">
            <div>{{'首费' + this.localization.currency_unit}}</div>
            <el-input v-model="form.first_money" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>{{'续重' + this.localization.weight_unit}}</div>
            <el-input v-model="form.next_weight" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="10">
            <div>{{'续费' + this.localization.currency_unit}}</div>
            <el-input v-model="form.next_money" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <div>{{'最小重量' + this.localization.weight_unit}}</div>
            <el-input v-model="form.min_weight" placeholder="请输入内容"></el-input>
          </el-col>
           <el-col :span="10">
             <div>{{'最大重量' + this.localization.weight_unit}}</div>
            <el-input v-model="form.max_weight" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>
              <span>体积系数</span>
              <el-tooltip class="item" effect="dark" content="主要用于计算包裹体积重量（5000或6000），如：长*高*宽/系数" placement="top">
                <span class="el-icon-question icon-info"></span>
              </el-tooltip>
            </div>
            <el-input v-model="form.factor" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>线路类型</div>
            <el-checkbox-group v-model="form.types">
              <el-checkbox v-for="item in typeList" :key="item.id" :label="item.id">
                {{item.cn_name}}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="10">
            <div>备注</div>
            <el-input v-model="form.remark" placeholder="请输入内容" :rows="4" type="textarea"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="sava-btn" :loading="$store.state.btnLoading" @click="saveLine">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      form: {
        cn_name: '',
        countries: '',
        first_weight: '',
        first_money: '',
        next_weight: '',
        next_money: '',
        max_weight: '',
        factor: '',
        min_weight: '',
        reference_time: '',
        types: [],
        remark: ''
      },
      referenceTime: {
        minTime: '',
        maxTime: '',
        symbol: '工作日'
      },
      value: [],
      options: [],
      typeList: [],
      localization: {}
    }
  },
  created () {
    this.getProp()
    this.getCountry()
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    // 编辑时拉取的数据
    getList () {
      this.$request.getExpressLine(this.$route.params.id).then(res => {
        this.form = res.data
        this.form.types = res.data.types.map(item => item.id)
        this.form.countries = res.data.countries.map(item => item.id)
      })
    },
    // 添加国家
    onAddCountry () {
      dialog({
        type: 'addcountry'
      }, () => {
        this.getCountry()
      })
    },
    // 获取多选框
    getProp () {
      this.$request.getProps().then(res => {
        this.typeList = res.data
        this.localization = res.localization
        console.log(this.typeList)
      })
    },
    // 获取支持国家数据
    getCountry () {
      this.$request.getCountry().then(res => {
        this.options = res.data
      })
    },
    // 保存
    saveLine () {
      if (this.$route.params.id) { // 编辑状态
        this.$request.saveEditLine(this.$route.params.id, { ...this.form }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.$router.push({ name: 'linelist' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$request.updateLines(this.form).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
              message: res.msg
            })
            this.$router.push({ name: 'linelist' })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.line-add-container {
  background-color: #fff !important;
  .country-select {
    width: 100%;
  }
  .sava-btn {
    min-width: 100px;
  }
  .icon-info {
    color: #74B34F;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .max-time {
    position: relative;
    &::before {
      content: '—';
      position: absolute;
      left: -22px;
    }
  }
  .select-box {
    width: 100%;
  }
  .country-btn {
    margin-top: 40px;
    .el-button--primary {
      background-color: #EAECF5;
      border-color: #EAECF5;
      color: #3540A5;
    }
  }
  .el-input__inner{
    background-color: #F5F5F5;
  }
  .el-textarea__inner {
    background-color: #F5F5F5;
  }
  .el-checkbox__inner {
    background-color: #F5F5F5;
  }
  .el-tag.el-tag--info {
    border-color: #3540A5;
    color: #3540A5;
    background-color: #fff;
  }
  .el-tag.el-tag--info .el-tag__close {
    color: #3540A5;
    background-color: #fff;
  }
}
</style>
