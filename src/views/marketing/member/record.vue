<template>
  <div class="record">
    <el-dialog
      :title="$t('添加')"
      :visible.sync="addDialog"
      width="40%"
      @close="resetForm('form')"
      class="dialog-container"
    >
      <div>
        <el-form ref="form" :model="form" label-position="top">
          <el-form-item :label="$t('选择客户')" prop="customer">
            <div class="search">
              <el-autocomplete
                class="inline-input"
                v-model="selectUser"
                :fetch-suggestions="querySearchUser"
                value-key="name"
                clearable
                :placeholder="$t('请输入客户ID')"
                @select="handleSelect"
                style="width: 217px"
              >
                <template #default="{ item }">
                  <div class="name">{{ item.id }}---{{ item.name }}</div>
                </template>
              </el-autocomplete>
            </div>
            <!-- <el-select v-model="form.user_id">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item :label="$t('选择分类')" prop="radio1">
            <el-radio v-model="form.resource_type" label="1">{{ $t('成长值') }}</el-radio>
            <el-radio v-model="form.resource_type" label="2">{{ $t('积分') }}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('选择操作')" prop="radio2">
            <el-radio v-model="form.code" label="RECHARGE">{{ $t('充值') }}</el-radio>
            <el-radio v-model="form.code" label="DECREASE">{{ $t('扣款') }}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('值')" prop="value">
            <el-input v-model="form.value" style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item :label="$t('到账之日起计算，有效期为')">
            <el-select v-model="form.valid_time">
              <el-option
                v-for="item in validTimeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('关联订单号')" prop="value">
            <el-input v-model="form.order_sn" style="width: 217px"></el-input>
          </el-form-item>
          <el-form-item :label="$t('备注')" prop="value">
            <el-input v-model="form.remark" type="textarea" :row="10"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="detailsDialog"
      width="30%"
      @close="resetForm('detailsForm')"
      class="dialog-container"
    >
      <el-form ref="detailsForm" :model="detailsForm">
        <el-form-item :label="$t('流水号') + ':'" prop="serial_no">{{
          detailsForm.serial_no
        }}</el-form-item>
        <el-form-item :label="$t('关联订单号') + ':'" prop="order_sn">{{
          detailsForm.order_sn
        }}</el-form-item>
        <el-form-item :label="$t('客户ID') + ':'" prop="user_id">{{
          detailsForm.user_id
        }}</el-form-item>
        <el-form-item :label="$t('分类') + ':'" prop="resource_type_name">{{
          detailsForm.resource_type_name
        }}</el-form-item>
        <el-form-item :label="$t('收支类型') + ':'" prop="type_name">{{
          detailsForm.type_name
        }}</el-form-item>
        <el-form-item :label="$t('收支规则') + ':'" prop="income_outlay_rule_name">{{
          detailsForm.income_outlay_rule_name
        }}</el-form-item>
        <el-form-item :label="$t('到账时间') + ':'" prop="created_at">{{
          detailsForm.created_at
        }}</el-form-item>
        <el-form-item :label="$t('支出时间') + ':'" prop="created_at" v-if="title === '支出详情'">{{
          detailsForm.created_at
        }}</el-form-item>
        <el-form-item :label="$t('有效期') + ':'" prop="valid_time" v-if="title === '收入详情'">{{
          detailsForm.valid_time
        }}</el-form-item>
        <el-form-item :label="$t('操作人') + ':'" prop="operator">{{
          detailsForm.operator
        }}</el-form-item>
        <el-form-item :label="$t('备注') + ':'" prop="remark">{{
          detailsForm.remark
        }}</el-form-item>
      </el-form>
    </el-dialog>
    <div class="search">
      <div class="searcg-l">
        <search-group
          :placeholder="$t('请输入关键字')"
          v-model="page_params.keyword"
          @search="getList"
        >
        </search-group>
        <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
          <el-button size="mini" type="primary" @click="addDialog = true">{{
            $t('添加')
          }}</el-button>
        </div>
      </div>
      <div class="screen" v-show="hasFilterCondition">
        <el-date-picker
          size="mini"
          class="timeStyle"
          v-model="timeList"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('至')"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
        <el-select
          size="mini"
          clearable
          :placeholder="$t('请选择分类')"
          v-model="page_params.resource_type"
        >
          <el-option
            v-for="item in classifyOpiton"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          size="mini"
          clearable
          :placeholder="$t('请选择收支类型')"
          v-model="page_params.type"
        >
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option
        ></el-select>
        <el-select
          size="mini"
          clearable
          :placeholder="$t('请选择收支规则')"
          v-model="page_params.rule_code"
        >
          <el-option
            v-for="item in ruleOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option
        ></el-select>
        <div class="submit">
          <el-button type="primary" plain size="small" @click="search">{{ $t('搜索') }}</el-button>
          <el-button size="small" @click="resetFormSearch">{{ $t('重置') }}</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%; margin-bottom: 10px">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="user_id" :label="$t('客户ID')"> </el-table-column>
        <el-table-column prop="resource_type_name" :label="$t('分类')"> </el-table-column>
        <el-table-column prop="type_name" :label="$t('收支类型')"> </el-table-column>
        <el-table-column :label="$t('金额') + localization.currency_unit">
          <template slot-scope="scope">
            <span v-bind:style="{ color: scope.row.type === 1 ? 'red' : 'green' }">{{
              scope.row.amount
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" :label="$t('明细')"> </el-table-column>
        <el-table-column prop="income_outlay_rule_name" :label="$t('收支规则')"> </el-table-column>
        <el-table-column prop="order_sn" :label="$t('相关订单')"></el-table-column>
        <el-table-column prop="serial_no" :label="$t('流水号')"> </el-table-column>
        <el-table-column prop="updated_at" :label="$t('时间')" width="220"></el-table-column>
        <el-table-column :label="$t('操作')" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="btn-deep-purple"
              @click="getRecordDetails(scope.row.id, scope.row.type)"
              >{{ $t('详情') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import { SearchGroup } from '@/components/searchs'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      hasFilterCondition: false,
      addDialog: false,
      detailsDialog: false,
      classify: '',
      type: '',
      rule: '',
      timeList: [],
      tableData: [],
      userList: [],
      selectUser: '',
      validTimeList: [],
      form: {
        user_id: '',
        resource_type: '',
        code: '',
        value: '',
        order_sn: '',
        valid_time: 0,
        remark: ''
      },
      detailsForm: {},
      title: '',
      localization: {},
      page_params: {
        resource_type: '',
        type: '',
        rule_code: '',
        begin_date: '',
        end_date: ''
      },
      classifyOpiton: [
        {
          value: 1,
          label: this.$t('成长值')
        },
        {
          value: 2,
          label: this.$t('积分')
        }
      ],
      typeOption: [
        {
          value: 1,
          label: this.$t('收入')
        },
        {
          value: 2,
          label: this.$t('支出')
        }
      ],
      ruleOption: []
    }
  },
  created() {
    this.getList()
    this.getRecordDefault()
  },
  methods: {
    // 获取初始化
    getRecordDefault() {
      this.$request.getRecordDefault().then(res => {
        if (res.data) {
          this.validTimeList = res.data.valid_time_list
          this.ruleOption = res.data.rule_list.map(item => {
            let value = item.id
            let label = item.name
            return {
              value,
              label
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
    //获取列表
    getList() {
      this.$request
        .getInOutRecord({
          ...this.page_params
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.localization = res.localization
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    //获取客户列表
    querySearchUser(keyword, cb) {
      this.$request
        .getUsers({ keyword })
        .then(res => {
          if (res.ret) {
            cb(res.data)
          } else {
            cb([])
          }
        })
        .catch(() => cb([]))
    },
    // 选择客户
    handleSelect(item) {
      this.form.user_id = item.id
    },
    //详情
    getRecordDetails(id, type) {
      if (type === 1) {
        this.title = '收入详情'
      } else {
        this.title = '支出详情'
      }
      this.detailsDialog = true
      this.$request.getRecordDetails(id).then(res => {
        if (res.ret) {
          this.detailsForm = res.data
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 添加
    confirm() {
      this.$request.addInOutRecord({ ...this.form }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.addDialog = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    search() {
      this.page_params.begin_date = this.timeList[0]
      this.page_params.end_date = this.timeList[1]
      this.getList()
    },
    resetFormSearch() {
      this.page_params.resource_type = ''
      this.page_params.type = ''
      this.page_params.rule_code = ''
      this.page_params.begin_date = ''
      this.page_params.end_date = ''
      this.getList()
    },
    // 重置表单
    resetForm(form) {
      this.timeList = []
      if (form) {
        this.$refs[form].resetFields()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.record {
  .search {
    padding-bottom: 20px;
  }
  .screen {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
  }
  .searcg-l {
    display: flex;
    gap: 20px;
  }
  .search-group {
    width: 22.5%;
  }
}
</style>
