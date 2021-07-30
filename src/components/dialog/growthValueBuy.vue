<template>
  <el-dialog :title="$t('成长值购买')" :visible.sync="show" width="70%" class="growth-value-buy">
    <div>
      <div class="title">{{ $t('购买设置') + ':' }}</div>
      <el-form ref="form" :model="form" label-width="230px" label-position="left">
        <el-form-item :label="$t('成长值到账之日起计算，有效期为')">
          <el-select v-model="form.valid_time">
            <el-option
              v-for="item in validTimeList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('该消费可累计积分')"
          ><el-switch v-model="form.increase_point" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item :label="$t('可用余额支付购买')"
          ><el-switch v-model="form.balance_buy" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="title">
        <span class="sub-title">{{ $t('基础价格表') + ':' }}</span>
        <el-button size="mini" @click="explain">{{ $t('说明') }}</el-button>
        <el-button size="mini" type="primary" @click="addBaseTable">{{ $t('新增') }}</el-button>
        <span class="tips">{{ '*' + $t('最多添加10条') }}</span>
      </div>
      <el-table :data="basePriceTable" border style="width: 100%">
        <el-table-column type="index" label="#" width="40"> </el-table-column>
        <el-table-column prop="name" :label="$t('产品名称')"> </el-table-column>
        <el-table-column prop="illustrate" :label="$t('产品说明')"> </el-table-column>
        <el-table-column prop="growth_value" :label="$t('成长值')"> </el-table-column>
        <el-table-column prop="price" :label="$t('价格')"> </el-table-column>
        <!-- <el-table-column prop="name" :label="$t('产品名称')"> </el-table-column> -->
        <el-table-column :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editBaseTable(scope.row.id)">{{ $t('编辑') }}</el-button>
            <el-button size="mini" @click="deleteBaseTable(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_paramss"></nle-pagination>
    </div>
    <div>
      <div class="title">
        <span class="sub-title"> {{ $t('优惠价格表') + ':' }}</span>
        <el-button size="mini" type="primary" @click="addDiscountTable">{{ $t('新增') }}</el-button>
      </div>
      <el-table :data="discountPriceTable" border style="width: 100%">
        <el-table-column type="index" label="#" width="40"> </el-table-column>
        <el-table-column prop="base_name" :label="$t('产品名称')"> </el-table-column>
        <el-table-column prop="price" :label="$t('活动价')"> </el-table-column>
        <el-table-column :label="$t('适用类型')">
          <template slot-scope="scope">
            <span v-if="scope.row.applicable_mode === 0">{{ $t('所有客户') }}</span>
            <span v-if="scope.row.applicable_mode === 1">{{ $t('客户组') }}</span>
            <span v-if="scope.row.applicable_mode === 2">{{ $t('会员组') }}</span>
            <span v-if="scope.row.applicable_mode === 3">{{ $t('个别客户') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" :label="$t('生效时间')" width="160"> </el-table-column>
        <el-table-column prop="end_time" :label="$t('失效时间')" width="160"> </el-table-column>
        <el-table-column prop="valid_name" :label="$t('生效状态')"> </el-table-column>
        <el-table-column prop="enabled" :label="$t('开启')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
              @change="updateDiscountEnabled(scope.row.id, scope.row.enabled)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('操作')" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editDiscountTable(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <el-button size="mini" @click="deleteDiscountTable(scope.row.id)">{{
              $t('删除')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      languageList: [],
      validTimeList: [],
      form: {
        valid_time: '',
        increase_point: 0,
        balance_buy: 0,
        illustrate: []
      },
      basePriceTable: [],
      discountPriceTable: []
    }
  },
  methods: {
    // 获取支持语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageList = res.data
        }
      })
    },
    //获取初始化信息
    getGrowthValueBuy() {
      this.$request.getGrowthValueBuy().then(res => {
        if (res.ret) {
          this.validTimeList = res.data.valid_time_list
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 获取详情
    getGrowthValueBuyDetails() {
      this.$request.getGrowthValueBuyDetails().then(res => {
        if (res.ret) {
          this.form.increase_point = res.data.increase_point
          this.form.balance_buy = res.data.balance_buy
          this.form.valid_time = res.data.valid_time
          this.form.illustrate = res.data.illustrate
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 说明
    explain() {
      dialog({ type: 'explain', illustrateData: this.form.illustrate }, data => {
        this.form.illustrate = data
      })
    },
    // 获取基础价格表
    getBaseTable() {
      this.$request
        .getBaseTable({
          page: this.page_paramss.page,
          size: this.page_paramss.size
        })
        .then(res => {
          if (res.ret) {
            this.basePriceTable = res.data
            this.page_paramss.page = res.meta.current_page
            this.page_paramss.total = res.meta.total
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 新增基础表
    addBaseTable() {
      dialog({ type: 'addBaseTable' }, () => {
        this.getBaseTable()
      })
    },
    // 编辑基础表
    editBaseTable(baseId) {
      dialog({ type: 'editBaseTable', baseId }, () => {
        this.getBaseTable()
      })
    },
    // 删除基础表
    deleteBaseTable(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteBaseTable(id).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getBaseTable()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    //获取优惠价格表
    getDiscountTable() {
      this.$request
        .getDiscountTable({
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.discountPriceTable = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    updateDiscountEnabled(id, enabled) {
      this.$request.updateDiscountEnabled(id, { enabled }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getDiscountTable()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 新增优惠价格表
    addDiscountTable() {
      dialog({ type: 'addDiscountTable' }, () => {
        this.getDiscountTable()
      })
    },
    // 编辑优惠价格表
    editDiscountTable(id) {
      dialog({ type: 'editDiscountTable', priceId: id }, () => {
        this.getDiscountTable()
      })
    },
    // 删除优惠价格表
    deleteDiscountTable(id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteDiscountTable(id).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getDiscountTable()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    },
    submit() {
      this.$request.updateGrowthValueBuy({ ...this.form }).then(res => {
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
      })
    },
    init() {
      this.getLanguageList()
      this.getGrowthValueBuy()
      this.getGrowthValueBuyDetails()
      this.getBaseTable()
      this.getDiscountTable()
    }
  }
}
</script>
<style scoped lang="scss">
.growth-value-buy {
  .title {
    padding: 20px 0;
  }
  .sub-title {
    padding-right: 10px;
  }
  .tips {
    color: #ccc;
    padding-left: 10px;
  }
}
</style>
