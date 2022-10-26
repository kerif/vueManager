<template>
  <el-dialog :visible.sync="show" :title="$t('拼图详细')" width="60%" @close="clear">
    <div style="padding: 10px 20px">
      <div class="flex-box">
        <div style="width: 120px; height: 100px; border: 1px dashed #000">
          <img :src="$baseUrl.IMAGE_URL + groupDetail.images[0]" />
        </div>
        <div style="margin: 5px 0px">
          <span class="show-text" v-if="groupDetail.is_public === 1">{{ $t('公开') }}</span>
          <span class="show-text" v-else>{{ $t('私人') }}</span>
        </div>
        <div>
          <div class="margin-bottom">
            <span style="width: 200px">{{ groupDetail.name }}</span>
            <span class="margin-left" v-if="groupDetail.status === 0">{{ $t('拼团中') }}</span>
            <span class="margin-left" v-else-if="groupDetail.status === 1">{{
              $t('拼团结束')
            }}</span>
            <span class="margin-left" v-else>{{ $t('取消拼团') }}</span>
          </div>
          <div class="margin-bottom" v-if="this.groupDetail.end_until > 0">
            {{ $t('拼团时间剩余') }} <span class="red-text">{{ count }}</span>
          </div>
          <div class="margin-bottom red-text" v-else>{{ $t('拼团时间已结束') }}</div>
          <div class="margin-bottom">
            {{ $t('已有2人参与，共10kg') }}
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
          <div>
            <el-button class="btn-main">{{ $t('提交拼团') }}</el-button>
            <el-button class="btn-light-red" @click="cancelGroup">{{ $t('取消拼团') }}</el-button>
            <el-button class="btn-light-green" @click="editGroup">{{ $t('修改拼团') }}</el-button>
          </div>
          <div style="margin-top: 10px">
            <el-button class="btn-deep-purple" @click="dialogDays = true">{{
              $t('延长时间')
            }}</el-button>
          </div>
        </div>
      </div>
      <div class="spacing">
        <div style="display: flex">
          <div v-for="item in detailsList" :key="item.id" style="width: 100px">
            <div style="width: 50px; height: 50px; border-radius: 50%; border: 1px solid #000">
              <img :src="$baseUrl.IMAGE_URL + item" />
            </div>
            <div style="margin-top: 10px">{{ item.id }} --- {{ item.name }}</div>
          </div>
          <div style="margin-left: 80px">
            <div>{{ $t('团长有话说') }}</div>
            <div class="solid-line">
              {{ groupDetail.remark }}
            </div>
          </div>
        </div>
        <div class="flex-item spacing">
          <div style="margin-top: -80px">
            <div
              style="width: 100px; height: 50px; backgroud-color: grey; border: 1px solid #000"
            ></div>
            <div style="border-left: 1px solid #000; height: 100px" class="center"></div>
            <div
              style="width: 100px; height: 50px; backgroud-color: grey; border: 1px solid #000"
            ></div>
          </div>
          <div style="margin-left: 80px">
            <div class="flex-item dashed-line">
              <div
                style="width: 50px; height: 50px; border: 1px solid #000; margin-right: 20px"
              ></div>
              <div>
                <div style="margin-bottom: 10px" class="font-bold black-text">
                  {{ groupDetail.express_line && groupDetail.express_line.name }}
                </div>
                <div style="margin-bottom: 10px">{{ $t('普货，敏感货') }}</div>
              </div>
            </div>
            <div class="flex-item dashed-line">
              <div
                style="width: 50px; height: 50px; border: 1px solid #000; margin-right: 20px"
              ></div>
              <div v-if="groupDetail.address">
                <div style="margin-bottom: 10px" class="font-bold black-text">
                  {{ groupDetail.address.country && groupDetail.address.country.name }}
                </div>
                <div style="margin-bottom: 10px">
                  {{ groupDetail.address.receiver_name }}&nbsp;{{ groupDetail.address.phone }}
                </div>
                <div style="margin-bottom: 10px">
                  {{ groupDetail.address.city }}&nbsp;{{ groupDetail.address.province }}&nbsp;{{
                    groupDetail.address.street
                  }}&nbsp;{{ groupDetail.address.address }}
                </div>
              </div>
            </div>
            <div class="flex-item dashed-line" v-if="groupDetail.is_delivery === 1">
              <div
                style="width: 50px; height: 50px; background-color: #000; margin-right: 20px"
              ></div>
              <div>
                <div style="margin-bottom: 10px" class="font-bold black-text">
                  {{ groupDetail.station && groupDetail.station.name }}
                </div>
                <div style="margin-bottom: 10px">
                  {{ groupDetail.station && groupDetail.station.address }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 50px">
        <div class="flex">
          <div class="flex-1 font-bold" style="font-size: 16px; color: #000">
            {{ $t('拼团成员') }} ({{ detailsList.length }})
          </div>
          <div class="flex-1">
            <el-input style="width: 70%"></el-input>
            <el-button class="btn-main" style="margin-left: 10px" @click="addGroupMember">{{
              $t('添加拼团成员')
            }}</el-button>
          </div>
        </div>
        <el-table
          class="data-list"
          border
          stripe
          ref="table"
          v-loading="tableLoading"
          :data="detailsList"
          style="margin-top: 20px"
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
          ></el-table-column>
          <el-table-column :label="$t('操作')" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button class="btn-light-red" @click="removeGroup(scope.row.id)">{{
                $t('移除拼团')
              }}</el-button>
              <el-button class="btn-main" @click="managePackage">{{ $t('管理包裹') }}</el-button>
              <el-button class="btn-light-red" v-if="groupDetail.end_until <= 0">{{
                $t('详细')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex-item" style="justify-content: space-between">
          <div>{{ $t('合计已提交包裹') }}{{ packagesCount }} {{ $t('个') }}</div>
          <div>
            {{ $t('重量') }}{{ packageWeight }}
            {{ `${localization.weight_unit ? localization.weight_unit : ''}` }}
          </div>
          <div>
            {{ $t('体积重量') }}{{ volumeWeight }}
            {{ `${localization.weight_unit ? localization.weight_unit : ''}` }}
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :visible.sync="showManagePackage"
      :title="$t('管理包裹')"
      width="40%"
      @close="clearInner"
    >
      <div style="padding: 20px">
        <div class="flex">
          <div class="flex-box">
            <div
              style="
                width: 80px;
                height: 80px;
                background-color: #000;
                border: 1px solid #000;
                border-radius: 50%;
              "
            ></div>
            <div class="margin-left">
              <div style="margin-bottom: 15px">
                {{ $t('爱心拼团007') }}
              </div>
              <div>
                <span>{{ $t('胡大仙') }}</span>
                <span style="margin-left: 15px">{{ $t('001') }}</span>
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
        <el-table :data="tableData" border style="margin-top: 20px">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column prop="" :label="$t('包裹号')"></el-table-column>
          <el-table-column prop="" :label="$t('入库时间')"></el-table-column>
          <el-table-column prop="" :label="$t('货位')"></el-table-column>
          <el-table-column prop="" :label="$t('入库重量')"></el-table-column>
          <el-table-column :label="$t('操作')">
            <template>
              <el-button class="btn-light-red">{{ $t('移除拼团') }}</el-button>
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
      <div>*{{ $t('仅显示可添加的包裹') }}</div>
      <el-table :data="tableData" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="" :label="$t('包裹号')"></el-table-column>
        <el-table-column prop="" :label="$t('入库时间')"></el-table-column>
        <el-table-column prop="" :label="$t('货位')"></el-table-column>
        <el-table-column prop="" :label="$t('入库重量')"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button class="btn-main">{{ $t('提交') }}</el-button>
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
        <el-button type="primary" @click="submitTimes">{{ $t('确定') }}</el-button>
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
      count: ''
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
          this.detailsList = res.data.members
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
    addGroupMember() {},
    editGroup() {
      this.show = false
      dialog({
        type: 'onAddGroup',
        id: this.id
      })
    },
    managePackage() {
      this.showManagePackage = true
    },
    addPackage() {
      this.showAddPackage = true
    },
    clearInner() {
      this.showManagePackage = false
    },
    clearAddPackage() {
      this.showAddPackage = false
    },
    clear() {
      this.show = false
    }
  }
}
</script>

<style>
.flex {
  display: flex;
  justify-content: center;
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
  border: 1px dashed #000;
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
</style>
