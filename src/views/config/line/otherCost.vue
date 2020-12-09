<template>
  <div class="others-cost-container">
    <el-form ref="params" :model="user" label-width="140px" label-position="left">
        <!-- 增值服务 -->
        <el-row :gutter="20">
            <el-col>
            <el-form-item :label="$t('增值服务')">
                <div v-for="item in updateProp" :key="item.id" class="service">
                <div class="serviceLeft">
                <el-checkbox v-model="item.selected">{{item.name}}</el-checkbox>
                </div>
                <div class="middle">
                   <el-select v-model="item.type" :placeholder="$t('请选择')">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                    </el-option>
                  </el-select>
                </div>
                <div class="serviceRight">
                <span>{{localization.currency_unit}}</span>
                <el-input v-model="item.price" class="add-value-ipt"></el-input>
                </div>
                </div>
            </el-form-item>
            </el-col>
          <!-- 保存 -->
          <el-col>
          <el-form-item>
            <el-button @click="savePacked" type="primary" :loading="$store.state.btnLoading">{{$t('保存')}}</el-button>
            <el-button type="success" @click="addCost" class="add-cost">{{$t('新增费用')}}</el-button>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      user: {},
      checked: false,
      tableLoading: false,
      updateProp: [],
      localization: {},
      options: [
        {
          id: 0,
          name: this.$t('按固定数值金额')
        },
        {
          id: 1,
          name: this.$t('按计算的运费比例')
        }
      ]
    }
  },
  created () {
    if (this.$route.params.id) {
      this.getProp()
    }
  },
  methods: {
    // 获取多选框
    getProp (arr) {
      this.$request.getCosts(this.$route.params.id).then(res => {
        if (res.ret) {
          this.localization = res.localization
          let ids = this.updateProp.map(item => item.id)
          res.data.forEach(items => {
            let selected = !!items.selected
            if (ids.includes(items.id)) {
              let ele = this.updateProp.filter(item => item.id === items.id)[0]
              if (ele) {
                selected = ele.selected
                items.price = ele.price
                items.type = ele.type
              }
            }
            items.selected = selected
          })
          this.updateProp = res.data
        }
      })
    },
    // 新增费用
    addCost () {
      dialog({ type: 'costAdd' }, (data) => {
        console.log('data', data)
        this.getProp()
      })
    },
    savePacked () {
      const params = this.updateProp.filter(item => item.selected).map(item => ({ id: item.id, price: item.price, type: item.type }))
      this.$request.updateCosts(this.$route.params.id, params).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
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
</script>

<style lang="scss">
.others-cost-container {
  background-color: #fff !important;
  .service {
    width: 500px;
    overflow: hidden;
    .el-input__inner {
      line-height: 40px !important;
      margin-bottom: 10px;
    }
    .serviceLeft {
      display: inline-block;
      float: left;
      width: 100px;
      // margin-right: 20px;
    }
    .serviceRight {
      display: inline-block;
      float: right;
    }
    .middle {
      display: inline-block;
    }
  }
  .add-value-ipt {
    width: calc(100% - 20px);
    margin-left: 5px;
  }
  .add-cost {
    margin-left: 10px;
  }
}
</style>
