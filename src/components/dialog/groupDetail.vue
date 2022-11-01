<template>
  <el-dialog :visible.sync="show" :title="$t('拼图详细')" width="60%" @close="clear">
    <div class="container">
      <div class="flex-box">
        <div v-for="(item, index) in groupDetail.images" :key="index">
          <img :src="item" style="width: 120px" />
        </div>
        <div style="margin: 5px 0px">
          <span class="show-text" v-if="groupDetail.is_public === 1">{{ $t('公开') }}</span>
          <span class="show-text" v-else>{{ $t('私人') }}</span>
        </div>
        <div>
          <div class="margin-bottom">
            <span style="width: 200px">{{ groupDetail.name }}</span>
            <span class="margin-left font-size font-bold" v-if="groupDetail.status === 0">{{
              $t('拼团中')
            }}</span>
            <span class="margin-left font-size" v-else-if="groupDetail.status === 1">{{
              $t('拼团结束')
            }}</span>
            <span class="margin-left" v-else>{{ $t('取消拼团') }}</span>
          </div>
          <div class="margin-bottom" v-if="this.groupDetail.end_until > 0">
            {{ $t('拼团时间剩余') }} <span class="red-text font-bold">{{ count }}</span>
          </div>
          <div class="margin-bottom red-text" v-else>{{ $t('拼团时间已结束') }}</div>
          <div class="margin-bottom">
            {{
              $t(`已有${detailsList.length}人参与，体积重量:${volumeWeight}，重量:${packageWeight}`)
            }}
          </div>
          <div class="margin-bottom">
            <span v-if="groupDetail.mode === 0">{{ $t('团员自付') }}</span>
            <span v-else>{{ $t('团长代付') }}</span>
            <span v-if="groupDetail.is_delivery === 0" style="margin-left: 80px">{{
              $t('送货上门')
            }}</span>
            <span v-else style="margin-left: 80px">{{ $t('自提收货') }}</span>
          </div>
        </div>
        <div>
          <div class="detail-item">
            <el-button class="btn-main" @click="submitGroup">{{ $t('提交拼团') }}</el-button>
            <el-button class="btn-light-red" @click="cancelGroup">{{ $t('取消拼团') }}</el-button>
            <el-button class="btn-light-green" @click="editGroup">{{ $t('修改拼团') }}</el-button>
          </div>
          <div>
            <el-button class="btn-deep-purple" @click="dialogDays = true">{{
              $t('延长时间')
            }}</el-button>
          </div>
        </div>
      </div>
      <div class="spacing">
        <div style="display: flex">
          <div v-for="item in groupLeader" :key="item.id" style="width: 100px">
            <div class="circle">
              <img :src="item.avatar" class="icon-img" />
            </div>
            <div style="margin-top: 10px">{{ item.id }} --- {{ item.name }}</div>
          </div>
          <div style="margin-left: 80px">
            <div class="font-bold black-text">{{ $t('团长有话说') }}</div>
            <div class="solid-line">
              {{ groupDetail.remark }}
            </div>
          </div>
        </div>
        <div class="flex-item spacing">
          <div>
            <div class="flex-item font-bold font-size black-text send-text">
              <div>{{ $t('寄') }}</div>
              <img src="../../assets/address.png" />
            </div>
            <div class="flex-item font-bold font-size black-text send-text">
              <div>{{ $t('收') }}</div>
              <img src="../../assets/send.png" />
            </div>
          </div>
          <div style="margin-left: 80px">
            <div class="flex-item dashed-line">
              <div
                v-if="groupDetail.express_line && groupDetail.express_line.icon"
                class="detail-icon"
              >
                <img
                  :src="$baseUrl.IMAGE_URL + groupDetail.express_line.icon.icon"
                  style="width: 50px"
                />
              </div>
              <div>
                <div class="font-bold black-text detail-item font-size">
                  {{ groupDetail.express_line && groupDetail.express_line.name }}
                </div>
                <div class="detail-item">
                  {{ groupDetail.express_line && groupDetail.express_line.props }}
                </div>
              </div>
            </div>
            <div class="flex-item dashed-line">
              <div class="detail-icon">
                <img src="../../assets/receive.png" />
              </div>
              <div v-if="groupDetail.address">
                <div class="font-bold black-text detail-item font-size">
                  {{ groupDetail.address.country && groupDetail.address.country.name }}
                </div>
                <div class="detail-item">
                  {{ groupDetail.address.receiver_name }}&nbsp;{{ groupDetail.address.phone }}
                </div>
                <div class="detail-item">
                  {{ groupDetail.address.city }}&nbsp;{{ groupDetail.address.province }}&nbsp;{{
                    groupDetail.address.street
                  }}&nbsp;{{ groupDetail.address.address }}
                </div>
              </div>
            </div>
            <div class="flex-item dashed-line" v-if="groupDetail.is_delivery === 1">
              <div class="detail-icon">
                <img src="../../assets/station.png" />
              </div>
              <div>
                <div class="font-bold black-text detail-item">
                  {{ groupDetail.station && groupDetail.station.name }}
                </div>
                <div class="detail-item">
                  {{ groupDetail.station && groupDetail.station.address }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 50px">
        <div class="flex">
          <div class="flex-1 font-bold font-size black-text">
            {{ $t('拼团成员') }} ({{ detailsList.length }})
          </div>
          <div>
            <el-button class="btn-main" style="margin-left: 10px" @click="addGroupMember">{{
              $t('添加拼团成员')
            }}</el-button>
          </div>
        </div>
        <el-table
          class="data-list spacing"
          border
          stripe
          ref="table"
          v-loading="tableLoading"
          :data="detailsList"
        >
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="is_group_leader" :label="$t('身份')">
            <template slot-scope="scope">
              <span v-if="scope.row.is_group_leader === 1">{{ $t('团长') }}</span>
              <span v-else>{{ $t('团员') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="avatar" :label="$t('头像')">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" style="width: 50%" />
            </template>
          </el-table-column>
          <el-table-column prop="id" :label="$t('客户ID')">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('昵称')">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="is_submitted" :label="$t('状态')">
            <template slot-scope="scope">
              <span v-if="scope.row.is_submitted === 1">{{ $t('已提交') }}</span>
              <span v-else>{{ $t('未提交') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="packages_count" :label="$t('提交包裹')"></el-table-column>
          <el-table-column
            :label="$t('提交重量') + `${localization.weight_unit ? localization.weight_unit : ''}`"
            prop="package_weight"
          ></el-table-column>
          <el-table-column
            :label="
              $t('提交体积重量') + `${localization.weight_unit ? localization.weight_unit : ''}`
            "
            prop="package_volume_weight"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.package_volume_weight }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button class="btn-light-red" @click="removeGroup(scope.row.id)">{{
                $t('移除拼团')
              }}</el-button>
              <el-button class="btn-main" @click="managePackage(scope.row)">{{
                $t('管理包裹')
              }}</el-button>
              <el-button class="btn-light-red" v-if="groupDetail.end_until <= 0">{{
                $t('详细')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right">
          <span>{{ $t('合计已提交包裹') }}{{ packagesCount }} {{ $t('个') }}</span>
          <span class="margin-left">
            {{ $t('重量') }}:{{ packageWeight }}
            {{ `${localization.weight_unit ? localization.weight_unit : ''}` }}
          </span>
          <span class="margin-left">
            {{ $t('体积重量') }}:{{ volumeWeight }}
            {{ `${localization.weight_unit ? localization.weight_unit : ''}` }}
          </span>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :visible.sync="showManagePackage"
      :title="$t('管理包裹')"
      width="50%"
      @close="clearInner"
    >
      <div style="padding: 20px">
        <div class="flex">
          <div class="flex-box">
            <div class="circle">
              <img :src="userInfo.avatar" class="icon-img" />
            </div>
            <div class="margin-left">
              <div style="margin-bottom: 15px" class="font-size">
                {{ groupDetail.name }}
              </div>
              <div>
                <span>{{ userInfo.name }}</span>
                <span style="margin-left: 15px">{{ userInfo.id }}</span>
              </div>
            </div>
          </div>
          <div>
            <el-button @click="addPackage" class="save-btn" type="primary">{{
              $t('添加')
            }}</el-button>
          </div>
        </div>
        <div class="line"></div>
        <div class="show-text">
          {{ $t('已加入拼团包裹') }}
        </div>
        <el-table :data="packageData" border class="spacing">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="express_num" :label="$t('包裹号')"></el-table-column>
          <el-table-column prop="in_storage_at" :label="$t('入库时间')"></el-table-column>
          <el-table-column prop="location" :label="$t('货位')"></el-table-column>
          <el-table-column prop="package_weight" :label="$t('入库重量')"></el-table-column>
          <el-table-column :label="$t('操作')">
            <template slot-scope="scope">
              <el-button class="btn-light-red" @click="removePackage(scope.row.id)">{{
                $t('移除包裹')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :visible.sync="showAddPackage"
      :title="$t('添加包裹')"
      @close="clearAddPackage"
    >
      <div class="red-text">*{{ $t('仅显示可添加的包裹') }}</div>
      <el-table :data="tableData" border class="spacing" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="express_num" :label="$t('包裹号')"></el-table-column>
        <el-table-column prop="in_storage_at" :label="$t('入库时间')"></el-table-column>
        <el-table-column prop="location" :label="$t('货位')"></el-table-column>
        <el-table-column prop="package_weight" :label="$t('入库重量')"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" :loading="$store.state.btnLoading" @click="onSubmit">{{
          $t('提交')
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('延长拼团时间')" :visible.sync="dialogDays" append-to-body>
      {{ $t('延长') }}
      <el-input-number
        v-model="days"
        controls-position="right"
        :min="1"
        :max="100"
      ></el-input-number>
      {{ $t('天') }}
      <div slot="footer">
        <el-button @click="dialogDays = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" :loading="$store.state.btnLoading" @click="submitTimes">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showMember"
      :title="$t('添加拼团成员')"
      append-to-body
      @close="clearShowMember"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('拼团成员')">
          <el-autocomplete
            :fetch-suggestions="queryCNSearch"
            :placeholder="$t('请输入客户ID')"
            v-model="form.userId"
          >
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :loading="$store.state.btnLoading" @click="onConfirm">{{
          $t('确定')
        }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      showManagePackage: false,
      showAddPackage: false,
      id: '',
      groupDetail: {},
      tableLoading: false,
      dialogDays: false,
      detailsList: [],
      localization: {},
      tableData: [],
      days: '',
      volumeWeight: '',
      packageWeight: '',
      packagesCount: '',
      count: '',
      showMember: false,
      packageData: [],
      userInfo: {},
      ids: [],
      groupLeader: [],
      form: {
        userId: ''
      }
    }
  },
  mounted() {
    this.Time()
  },
  methods: {
    init() {
      if (this.id) {
        this.getDetails(this.id)
      }
    },
    // 天 时 分 秒 格式化函数
    countDown() {
      let d = parseInt(this.groupDetail.end_until / (24 * 60 * 60))
      d = d < 10 ? '0' + d : d
      let h = parseInt((this.groupDetail.end_until / (60 * 60)) % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt((this.groupDetail.end_until / 60) % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(this.groupDetail.end_until % 60)
      s = s < 10 ? '0' + s : s
      this.count = d + '天' + h + '时' + m + '分' + s + '秒'
    },
    //定时器每过1秒参数减1
    Time() {
      setInterval(() => {
        this.groupDetail.end_until -= 1
        this.countDown()
      }, 1000)
    },
    getDetails(id) {
      this.$request.groupDetails(id).then(res => {
        if (res.ret) {
          this.groupDetail = res.data
          this.groupDetail.express_line.props =
            res.data.express_line && res.data.express_line.props.map(item => item).join(',')
          this.detailsList = res.data.members
          this.groupLeader = res.data.members.filter(item => item.is_group_leader === 1)
          this.volumeWeight = res.data.package_volume_weight
          this.packageWeight = res.data.package_weight
          this.packagesCount = res.data.packages_count
          this.localization = res.localization
        }
      })
    },
    // 取消拼团
    cancelGroup() {
      this.$confirm(
        this.$t('取消拼团后团员已提交的拼团包裹将会退回原仓库您确定要取消该拼团吗'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.cancelGroup(this.id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getDetails(this.id)
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
    // 移除拼团
    removeGroup(id) {
      this.$confirm(
        this.$t('移除该团员后团员已提交的拼团包裹将会退回原仓库您确定要移除该团员吗'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.removeGroup(this.id, id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getDetails(this.id)
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
    removePackage(id) {
      let params = {
        ids: [id]
      }
      this.$confirm(this.$t('您确认移除包裹'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.removeGroupPackage(this.id, params).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getPackageList()
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
    // 延长拼团时间
    submitTimes() {
      if (this.days < 0) {
        return this.$message.error(this.$t('请输入正确天数'))
      }
      this.$request
        .proLong(this.id, {
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
            this.getDetails(this.id)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    submitGroup() {
      this.$request.endGroup(this.id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getDetails(this.id)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    addGroupMember() {
      this.showMember = true
    },
    // 客户id
    queryCNSearch(queryString, callback) {
      var list = [{}]
      this.$request
        .Automatic({
          keyword: this.form.userId.toString()
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback && callback(list)
        })
    },
    onConfirm() {
      let userId = this.form.userId.substring(0, 6)
      this.$request.addGroupMember(this.id, userId).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.showMember = false
          this.getDetails(this.id)
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    editGroup() {
      this.show = false
      dialog({
        type: 'onAddGroup',
        id: this.id
      })
    },
    managePackage(row) {
      this.userInfo = row
      this.showManagePackage = true
      this.getPackageList()
    },
    getPackageList() {
      this.$request.joinGroupPackageList(this.id, this.userInfo.id).then(res => {
        if (res.ret) {
          this.packageData = res.data
        }
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
    },
    addPackage() {
      this.showAddPackage = true
      this.$request.toJoinGroupPackageList(this.id, this.userInfo.id).then(res => {
        if (res.ret) {
          this.tableData = res.data
        }
      })
    },
    onSubmit() {
      let id = this.userInfo ? this.userInfo.id : ''
      this.$request
        .addPackageToGroup(id, {
          ids: this.ids
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.showAddPackage = false
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    clearInner() {
      this.showManagePackage = false
    },
    clearAddPackage() {
      this.showAddPackage = false
    },
    clear() {
      this.show = false
    },
    clearShowMember() {
      this.showMember = false
      this.form.userId = ''
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 10px 20px;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-item {
  display: flex;
  align-items: center;
}
.flex-box {
  display: flex;
  justify-content: space-between;
}
.flex-1 {
  flex: 1;
}
.show-text {
  font-weight: bold;
  font-size: 18px;
  color: #000;
}
.text-align {
  text-align: center;
}
.box-top {
  margin-top: 20px;
}
.font-bold {
  font-weight: bold;
}
.line {
  margin: 20px 0;
  border-top: 1px solid #000;
}
.margin-left {
  margin-left: 20px;
}
.center {
  text-align: center;
}
.dashed-line {
  border: 2px dashed #3540a5;
  padding: 20px;
  width: 600px;
  border-radius: 5px;
  margin-top: 20px;
}
.solid-line {
  border: 1px solid #000;
  padding: 20px;
  border-radius: 5px;
  margin-top: 10px;
  width: 600px;
}
.margin-left {
  margin-left: 20px;
}
.margin-bottom {
  margin-bottom: 20px;
}
.spacing {
  margin-top: 20px;
}
.red-text {
  color: red;
}
.black-text {
  color: #000;
}
.detail-item {
  margin-bottom: 10px;
}
.font-size {
  font-size: 16px;
}
.send-text {
  width: 100px;
  height: 100px;
}
.detail-icon {
  width: 50px;
  margin-right: 30px;
}
.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  .icon-img {
    width: 100%;
    height: 100%;
  }
}
</style>
