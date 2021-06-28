<template>
  <div class="group-list-container">
    <div class="bottom-sty">
      <div class="addUser">
        <div class="searchGroup">
          <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
        </div>
        <!-- <search-select
          :selectArr="clientGroupList"
          v-model="page_params.group"
          @search="onGroupChange"
        >
        </search-select> -->
        <!-- <add-btn @click.native="addUser">{{ $t('添加客户') }}</add-btn> -->
      </div>
    </div>
    <!-- <div class="select-box">
    </div> -->
    <el-table
      class="data-list"
      border
      stripe
      ref="table"
      v-loading="tableLoading"
      :data="groupList"
      height="calc(100vh - 270px)"
    >
      <el-table-column :label="$t('序号')" type="index" :index="1" width="60"></el-table-column>
      <el-table-column :label="$t('团长')">
        <template slot-scope="scope">
          <span
            >{{ scope.row.leader && scope.row.leader.id }}--{{
              scope.row.leader && scope.row.leader.name
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column :label="$t('拼团订单号')" prop="sn"></el-table-column>
      <el-table-column :label="$t('类型')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_public === 1">{{ $t('公告') }}</span>
          <span v-if="scope.row.is_public === 0">{{ $t('私人') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('拼团名称')" prop="name"></el-table-column>
      <el-table-column :label="$t('目的国家')" prop="country"></el-table-column>
      <el-table-column :label="$t('提货方式')">
        <template slot-scope="scope" v-if="scope.row.station">
          <span v-if="scope.row.station.name"
            >{{ $t('自提') }}（{{ scope.row.station.name }}）</span
          >
        </template>
      </el-table-column>
      <el-table-column :label="$t('收件人')" prop="address.receiver_name"></el-table-column>
      <el-table-column :label="$t('联系方式')" prop="address.phone"></el-table-column>
      <el-table-column :label="$t('人数')">
        <template slot-scope="scope">
          <span>{{ scope.row.members_submitted_count }}/{{ scope.row.members_count }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('提交包裹')" prop="package_count"></el-table-column>
      <el-table-column
        :label="$t('重量') + `${localization.weight_unit ? localization.weight_unit : ''}`"
        prop="package_weight"
      ></el-table-column>
      <el-table-column
        :label="$t('体积重量') + `${localization.weight_unit ? localization.weight_unit : ''}`"
        prop="package_volume_weight"
      ></el-table-column>
      <el-table-column :label="$t('开始时间')" prop="created_at"></el-table-column>
      <el-table-column :label="$t('剩余时间')" prop="remaining_time"></el-table-column>
      <el-table-column :label="$t('操作')" width="116px" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" plain>
              {{ $t('操作') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="item-sty" @click.native="detailsGroup(scope.row.id)">
                <span>{{ $t('参团详情') }}</span>
              </el-dropdown-item>
              <el-dropdown-item
                class="item-sty"
                @click.native="
                  submitGroup(
                    scope.row.members_submitted_count,
                    scope.row.members_count,
                    scope.row.id
                  )
                "
              >
                <span>{{ $t('提交拼团') }}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="cancelGroup(scope.row.id)">
                <span>{{ $t('取消拼团') }}</span>
              </el-dropdown-item>
              <el-dropdown-item class="item-sty" @click.native="changeMsg(scope.row.id)">
                <span>{{ $t('修改团单信息') }}</span>
              </el-dropdown-item>
              <!-- 操作日志 -->
              <el-dropdown-item class="item-sty" @click.native="proLong(scope.row.id)">
                <span>{{ $t('延长拼团时间') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="$t('参团详情')" :visible.sync="dialogVisible" width="55%">
      <el-table
        class="data-list"
        border
        stripe
        ref="table"
        v-loading="tableLoading"
        :data="detailsList"
      >
        <el-table-column :label="$t('身份')">
          <template slot-scope="scope">
            <span v-if="scope.row.is_group_leader === 1">{{ $t('团长') }}</span>
            <span v-else>{{ $t('团员') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('客户ID')">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}--{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('状态')">
          <template slot-scope="scope">
            <span v-if="scope.row.is_submitted === 1">{{ $t('已提交') }}</span>
            <span v-else>{{ $t('未提交') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('提交包裹')" prop="packages_count"></el-table-column>
        <el-table-column
          :label="$t('提交重量') + `${localization.weight_unit ? localization.weight_unit : ''}`"
          prop="package_weight"
        ></el-table-column>
        <el-table-column
          :label="
            $t('提交体积重量') + `${localization.weight_unit ? localization.weight_unit : ''}`
          "
          prop="package_volume_weight"
        ></el-table-column>
        <el-table-column :label="$t('操作')">
          <template slot-scope="scope">
            <el-button class="btn-light-red" @click="removeGroup(scope.row.id)">{{
              $t('移除拼团')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-col :offset="1" :span="5">
          {{ $t('合计已提交包裹：') }}{{ packagesCount }} {{ $t('个') }}</el-col
        >
        <el-col :offset="1" :span="5">
          {{ $t('重量：') }}{{ packageWeight }}
          {{ `${localization.weight_unit ? localization.weight_unit : ''}` }}</el-col
        >
        <el-col :span="5">
          {{ $t('体积重量：') }}{{ volumeWeight }}
          {{ `${localization.weight_unit ? localization.weight_unit : ''}` }}</el-col
        >
      </div>
    </el-dialog>
    <!-- 延长拼团时间 -->
    <el-dialog :title="$t('延长拼团时间')" :visible.sync="dialogDays">
      延长
      <el-input-number
        v-model="days"
        controls-position="right"
        :min="1"
        :max="100"
      ></el-input-number>
      小时
      <div slot="footer">
        <el-button @click="dialogDays = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submitTimes">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
// import AddBtn from '@/components/addBtn'
export default {
  name: 'grouplist',
  data() {
    return {
      groupList: [],
      deleteNum: [],
      tableLoading: false,
      localization: {},
      clientGroupList: [],
      page_params: {
        group: ''
      },
      urlExcel: '',
      dialogVisible: false,
      detailsId: '',
      detailsList: [],
      volumeWeight: '',
      packageWeight: '',
      packagesCount: '',
      days: '',
      dialogDays: false,
      proId: ''
    }
  },
  mixins: [pagination],
  created() {
    if (this.$route.query.group) {
      this.page_params.group = Number(this.$route.query.group)
    }
  },
  mounted() {
    this.getList()
  },
  activated() {
    this.getList()
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .groupList({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.groupList = res.data
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.table.doLayout()
              })
            }, 300)
            console.log('back', JSON.stringify(this.page_params))
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 操作日志
    getLogs(id) {
      dialog({ type: 'vipLogs', id: id })
    },
    changeMsg(id) {
      dialog({ type: 'groupChange', id: id }, () => {
        this.getList()
      })
    },
    proLong(id) {
      this.proId = id
      this.dialogDays = true
    },
    // 延长拼团时间
    submitTimes() {
      if (this.days < 0) {
        return this.$message.error(this.$t('请输入正确时间'))
      }
      this.$request
        .proLong(this.proId, {
          days: this.days
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.dialogDays = false
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 导出清单
    uploadList() {
      this.$request.uploadUserExcel().then(res => {
        if (res.ret) {
          this.urlExcel = res.data.url
          // window.location.href = this.urlExcel
          window.open(this.urlExcel)
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
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
    // 券包
    voucher(id) {
      dialog({ type: 'inviteList', state: 'voucher', id }, () => {
        this.getList()
      })
    },
    // 选择客户组
    onGroupChange() {
      this.page_params.handleQueryChange('group', this.page_params.group)
      this.getList()
    },
    detailsGroup(id) {
      this.detailsId = id
      this.dialogVisible = true
      this.getDetails()
    },
    // 获取参团详情数据
    getDetails() {
      this.$request.groupDetails(this.detailsId).then(res => {
        if (res.ret) {
          this.detailsList = res.data.members
          this.volumeWeight = res.data.package_volume_weight
          this.packageWeight = res.data.package_weight
          this.packagesCount = res.data.packages_count
        }
      })
    },
    // 移除拼团
    removeGroup(id) {
      this.$confirm(
        this.$t('移除该团员后，团员已提交的拼团包裹将会退回原仓库，您确定要移除该团员吗？'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.removeGroup(this.detailsId, id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getDetails()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 取消拼团
    cancelGroup(id) {
      this.$confirm(
        this.$t('取消拼团后，团员已提交的拼团包裹将会退回原仓库，您确定要取消该拼团吗？'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.cancelGroup(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 提交拼团
    submitGroup(subCount, count, id) {
      if (subCount < count) {
        this.$confirm(
          this.$t('还有团员未提交包裹，提交包裹会自动踢出该团员，您确定要提交该拼团吗？'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        ).then(() => {
          this.$request.submitGroup(id).then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
        })
      } else {
        this.$confirm(this.$t('您确定提交该拼团吗？'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.submitGroup(id).then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$notify({
                title: this.$t('操作失败'),
                message: res.msg,
                type: 'warning'
              })
            }
          })
        })
      }
    }
  },
  components: {
    // SearchSelect,
    SearchGroup,
    NlePagination
    // AddBtn
  }
}
</script>

<style lang="scss">
.group-list-container {
  .btnList:after {
    content: '';
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }
  .select-box {
    overflow: hidden;
  }
  .el-icon-lock {
    color: red;
  }
  .optionBtn {
    margin: 3px;
  }
  .import-list {
    display: inline-block;
    margin-left: 10px;
    // text-align: right;
  }
  .addUser {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    .searchGroup {
      // width: 29.42%;
      // float: left;
      margin-right: 10px;
    }
  }
  .addUser > .add-btn-container {
    margin-left: 10px;
  }
  .bottom-sty {
    width: 100%;
    // margin-top: 20px;
    margin-bottom: 10px;
    float: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
