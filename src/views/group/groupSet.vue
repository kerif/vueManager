<template>
  <div class="group-set-container">
    <el-tabs v-model="activeName" class="tabLength">
      <!-- 待审核 -->
      <el-tab-pane :label="$t('路线配置')" name="0">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"></search-group>
        </div>
        <div class="clear"></div>
        <div class="tips-sty">
          <span class="el-icon-warning-outline icon-info"></span>
          {{ $t('提示仅阶梯计价模式路线可开启拼团') }}
        </div>
        <el-table
          border
          stripe
          :data="addressList"
          class="data-list"
          v-loading="tableLoading"
          height="calc(100vh - 270px)"
          ref="table"
        >
          <el-table-column type="index" :index="1"></el-table-column>
          <el-table-column :label="$t('线路名称')" prop="name"></el-table-column>
          <el-table-column :label="$t('支持国家地区')" :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              <span v-for="item in scope.row.countries" :key="item.id">
                {{ item.name }}&nbsp;
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('支持仓库')" :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              <span v-for="item in scope.row.warehouses" :key="item.id">
                {{ item.warehouse_name }}&nbsp;
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('参考时效')" prop="reference_time"></el-table-column> -->
          <el-table-column :label="$t('最小重量')" prop="min_weight"></el-table-column>
          <el-table-column :label="$t('开启拼团')" width="110">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_group"
                @change="changeCountry($event, scope.row.is_group, scope.row.id)"
                :active-text="$t('开')"
                :inactive-text="$t('关')"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="gray"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')">
            <template slot-scope="scope">
              <el-button class="btn-green" @click="groupSet(scope.row.id)">{{
                $t('拼团配置')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
      </el-tab-pane>
      <!-- 审核拒绝 -->
      <el-tab-pane :label="$t('其他配置')" name="1">
        <span>{{ $t('默认支付模式') }}</span>
        <el-radio-group v-model="mode" style="margin-left: 20px">
          <el-radio :label="0" @change="changeRadio">{{ $t('团员自付') }}</el-radio>
          <el-radio :label="1" @change="changeRadio">{{ $t('团长代付') }}</el-radio>
        </el-radio-group>
        <br />
        <div style="margin-top: 10px"></div>
        <span>{{ $t('最小拼团人数') }}</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('当参团人数(包括团长)小于最小人数时, 团长无法提交拼团')"
          placement="top-start"
        >
          <i class="el-icon-warning-outline" style="font-size: 18px"></i>
        </el-tooltip>
        <el-input
          v-model="min_member"
          style="margin-left: 20px; width: 240px"
          :placeholder="$t('请输入最小拼团人数')"
        ></el-input>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="$t('拼团配置')"
      :visible.sync="dialogVisible"
      width="45%"
      @close="clearDialog"
    >
      <el-checkbox style="margin-right: 0px" v-model="group_raise">{{
        $t('设置门槛重量')
      }}</el-checkbox>
      <el-tooltip
        class="item"
        effect="dark"
        :content="
          $t(
            '开启门槛重量时，如某一团员提交包裹重量未达到门槛重量，则按照（拼团单价*系数）计算运费'
          )
        "
        placement="top"
      >
        <span class="el-icon-question icon-info"></span>
      </el-tooltip>
      <div class="weight-sty">{{ $t('门槛重量') }}</div>
      <el-input v-model="group_raise_threshold"></el-input>
      <div class="weight-sty">{{ $t('未达门槛重量计费系数') }}</div>
      <el-input v-model="group_raise_factor"></el-input>
      <!-- <el-checkbox style="margin-top: 10px" v-model="is_ignore_warehouse">{{
        $t('开启仓库限制')
      }}</el-checkbox>
      <el-tooltip
        class="item"
        effect="dark"
        :content="
          $t(
            '开启仓库限制时，加入拼团的包裹必须为团长设置的仓库包裹；不开启限制则支持不同仓库包裹加入参与同一拼团订单；'
          )
        "
        placement="top"
      >
        <span class="el-icon-question icon-info"></span>
      </el-tooltip> -->
      <div slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitGroup">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'vipaddress',
  data() {
    return {
      addressList: [],
      tableLoading: false,
      activeName: '0',
      dialogVisible: false,
      checked: '',
      groupId: '',
      group_raise: 0,
      // is_ignore_warehouse: 0,
      group_raise_factor: '',
      group_raise_threshold: '',
      mode: 0,
      min_member: ''
    }
  },
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getBuying({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.addressList = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    groupSet(id) {
      this.groupId = id
      this.dialogVisible = true
      this.groupDetails()
    },
    // 获取拼团配置
    groupDetails() {
      this.$request.lineBuying(this.groupId).then(res => {
        if (res.ret) {
          this.group_raise = Boolean(res.data.group_raise)
          // this.is_ignore_warehouse = Boolean(res.data.is_ignore_warehouse)
          this.group_raise_factor = res.data.group_raise_factor
          this.group_raise_threshold = res.data.group_raise_threshold
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 更新拼团
    submitGroup() {
      this.$request
        .updateLineBuying(this.groupId, {
          group_raise: Number(this.group_raise),
          // is_ignore_warehouse: Number(this.is_ignore_warehouse),
          group_raise_factor: this.group_raise_factor,
          group_raise_threshold: this.group_raise_threshold
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
          this.dialogVisible = false
        })
    },
    // 拼团 开启或关闭
    changeCountry(event, enabled, id) {
      console.log(event, 'event')
      this.$request.closeBuying(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clearDialog() {
      this.group_raise = ''
      // this.is_ignore_warehouse = ''
      this.group_raise_factor = ''
      this.group_raise_threshold = ''
      this.groupId = ''
    },
    // 获取其他配置
    getGlobal() {
      this.$request.getGlobal().then(res => {
        if (res.ret) {
          this.mode = res.data.mode
          this.min_member = res.data.min_member
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 更新其他配置
    changeRadio() {
      this.$request
        .updateGlobal({
          mode: this.mode
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getGlobal()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    }
  },
  watch: {
    // 监听tab组件参数
    activeName(newValue) {
      switch (newValue) {
        case '0': // 未入库
          this.page_params.page = 1
          // this.status = 0
          // this.timeList = []
          // this.begin_date = ''
          // this.end_date = ''
          // this.in_storage_end_date = ''
          // this.in_storage_end_date = ''
          // this.storageList = []
          this.page_params.keyword = ''
          this.getList()
          break
        case '1': // 已入库
          this.getGlobal()
          // this.page_params.page = 1
          // this.status = 2
          // this.timeList = []
          // this.storageList = []
          // this.begin_date = ''
          // this.end_date = ''
          // this.in_storage_end_date = ''
          // this.in_storage_end_date = ''
          // this.getList()
          break
      }
    }
  }
}
</script>
<style lang="scss">
.group-set-container {
  .searchGroup {
    width: 21.5%;
    float: right;
  }
  .clear {
    clear: both;
  }
  .tips-sty {
    background-color: #f2e2b8;
    line-height: 40px;
    font-size: 14px;
    padding-left: 10px;
    margin-top: 10px;
  }
  .icon-info {
    color: #e6a344;
    font-size: 18px;
    // margin-left: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  .weight-sty {
    margin-top: 10px;
  }
  .icon-info {
    color: #74b34f;
    font-size: 18px;
    margin-left: 5px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
}
</style>
