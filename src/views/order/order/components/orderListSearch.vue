<template>
  <div class="order-list-search">
    <el-form
      class="search-form"
      :model="searchFieldData"
      ref="searchForm"
      size="mini"
      label-width="110px"
    >
      <el-row :gutter="20">
        <el-col :span="4" :xl="10">
          <!--包裹号搜索-->
          <el-form-item prop="express_num" label-width="0">
            <el-input
              v-model="searchFieldData.express_num"
              :autosize="{ minRows: 4, maxRows: 5 }"
              type="textarea"
              :placeholder="$t('请输入快递单号搜索多个单号请用回车区分')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xl="6">
          <!--时间搜索-->
          <el-form-item :label="$t('时间')" prop="date_type">
            <el-select v-model="searchFieldData.date_type" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in timeOptions"
                :key="item.id"
                :value="item.value"
                :label="item.name"
              >
              </el-option>
            </el-select>
            <el-form-item prop="date" style="margin: 0">
              <el-date-picker
                v-model="searchFieldData.date"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
              >
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <!--物品价值搜索-->
          <el-form-item :label="$t('物品价值区间')" prop="value_start">
            <el-input
              class="number"
              :placeholder="$t('请输入起始价格')"
              v-model="searchFieldData.value_start"
              clearable
              onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
            ></el-input>
            -
            <el-input
              class="number"
              :placeholder="$t('请输入结束价格')"
              v-model="searchFieldData.value_end"
              clearable
              onkeypress="return( /[\d.]/.test(String.fromCharCode(event.keyCode) ) )"
            ></el-input>
          </el-form-item>
          <!-- 物品属性 -->
          <el-form-item :label="$t('物品属性')" prop="prop">
            <el-select v-model="searchFieldData.prop" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in propList"
                :key="item.id"
                :value="item.id"
                :label="item.cn_name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :xl="6">
          <!--包裹号搜索-->
          <el-form-item :label="$t('仓库')" prop="warehouse">
            <el-select v-model="searchFieldData.warehouse" clearable :placeholder="$t('请选择')">
              <el-option
                v-for="item in simpleList"
                :key="item.id"
                :value="item.id"
                :label="item.warehouse_name"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="is_warning">
            <!-- v-if="['0', '1'].includes(activeName)" -->
            <el-checkbox
              class="dialog-sty"
              v-model="searchFieldData.is_warning"
              :true-label="1"
              :false-label="0"
            >
              {{ $t('包裹预警') }}
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="3" :xl="2">
          <div class="submit">
            <el-button type="primary" plain size="small" @click="submitForm">{{
              $t('搜索')
            }}</el-button>
            <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'orderListSearch',
  props: {
    searchFieldData: {
      type: Object
    }
  },
  data() {
    return {
      timeOptions: [
        { value: 'created_at', name: '提交时间' },
        { value: 'in_storage_at', name: '称重时间' }
      ],
      paymentStatusData: [
        {
          id: 1,
          name: this.$t('全部货到付款')
        },
        {
          id: 2,
          name: this.$t('未支付')
        },
        {
          id: 3,
          name: this.$t('已支付')
        },
        {
          id: 11,
          name: this.$t('待审核')
        },
        {
          id: 12,
          name: this.$t('审核拒绝')
        }
      ],
      simpleList: [],
      propList: []
    }
  },
  created() {
    this.initQuery()
    this.getSimpleList()
    this.getPropList()
  },
  activated() {
    this.initQuery()
  },
  methods: {
    initQuery() {},
    submitForm() {
      this.$emit('submit')
    },
    resetForm() {
      this.$refs.searchForm.resetFields()
      this.searchFieldData.start = ''
      this.searchFieldData.end = ''
      this.searchFieldData.agent = ''
      this.searchFieldData.value_end = ''
    },
    getSimpleList() {
      this.$request.getSimpleList().then(res => {
        this.simpleList = res.data
      })
    },
    getPropList() {
      this.$request.getProps().then(res => {
        this.propList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list-search {
  margin: 10px 0;
  .search-form {
    background-color: #fff;
    padding: 10px;
    // align-items: center;
    .el-select,
    .el-cascader,
    .el-input,
    .el-date-editor {
      margin: 0 3px;
    }
    .number ::v-deep .el-input__inner {
      text-align: center;
    }
    .el-form-item--mini.el-form-item {
      margin-bottom: 10px;
      height: 28px;
    }
    ::v-deep .el-input {
      width: 168px;
    }
    ::v-deep .el-form-item__content {
      display: flex;
    }
    .submit {
      padding-top: 50px;
      text-align: right;
    }
  }
}
</style>
