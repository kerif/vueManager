<template>
  <div class="viplist-details">
    <div>
      <el-row :gutter="20">
        <el-col :span="20">
          <h3>{{ $t('基本信息') }}</h3>
        </el-col>
        <el-col :span="4">
          <el-button class="btn-light-red" @click="customerMerge">{{ $t('合并') }}</el-button>
          <el-button class="btn-deep-blue" @click="editInfo">{{ $t('修改') }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="demo-basic--circle">
            <div class="block">
              <el-avatar :size="80" :src="circleUrl"></el-avatar>
              <div class="title">{{ $t('头像') }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户ID:') }}</span>
              <span>{{ this.$route.params.id }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('VIP等级:') }}</span>
              <span>{{ this.info.memberLevelName }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('余额:') }}</span>
              <span>{{ this.info.balance }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('所属客服:') }}</span>
              <span>{{ this.info.customerName }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('注册日期:') }}</span>
              <span>{{ this.info.createdAt }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户昵称:') }}</span>
              <span>{{ this.info.name }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('EMAIL:') }}</span>
              <span>{{ this.info.email }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('积分:') }}</span>
              <span>{{ this.info.point }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('所属销售:') }}</span>
              <span>{{ this.info.saleName }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('最后登录时间:') }}</span>
              <span>{{ this.info.lastLogin }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户组:') }}</span>
              <span></span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('手机号:') }}</span>
              <span>{{ this.info.phone }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('订单数:') }}</span>
              <span></span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('微信号:') }}</span>
              <span></span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 30px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('包裹列表')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('订单列表')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('地址')" name="3"></el-tab-pane>
        <el-tab-pane :label="$t('券包')" name="4">
          <el-table class="data-list" :data="inviteData" border style="width: 100%">
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="name" :label="$t('券名称')"> </el-table-column>
            <el-table-column prop="code" :label="$t('券码')"> </el-table-column>
            <el-table-column prop="amount" :label="$t('金额')"> </el-table-column>
            <el-table-column prop="status" :label="$t('状态')"> </el-table-column>
            <el-table-column prop="created_at" :label="$t('发放时间')"> </el-table-column>
            <el-table-column prop="used_at" :label="$t('使用时间')"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 作废 -->
                <el-button
                  class="btn-light-red"
                  v-if="scope.row.usable === true"
                  @click="failCoupon(scope.row.id)"
                  >{{ $t('作废') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="$t('邀请记录')" name="5">
          <el-table class="data-list" :data="tableData" border style="width: 100%">
            <el-table-column type="index"> </el-table-column>
            <!-- 客户ID -->
            <el-table-column prop="id" :label="$t('客户ID')"> </el-table-column>
            <!-- 客户昵称 -->
            <el-table-column prop="name" :label="$t('客户昵称')"> </el-table-column>
            <el-table-column prop="created_at" :label="$t('注册时间')"> </el-table-column>
            <!-- 最后登录时间 -->
            <el-table-column prop="last_login_at" :label="$t('最后登录时间')"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 客户合并 -->
    <el-dialog :title="$t('客户合并')" :visible.sync="dialogVisible" width="50%">
      <div>
        <p>{{ $t('当前客户ID') }}</p>
        <p>{{ customerId }}&nbsp;---&nbsp;{{ customerName }}</p>
        <p>*{{ $t('请输入合并目标客户ID') }}</p>
        <!-- <el-input style="width: 40%" v-model="targetID"></el-input> -->
        <el-autocomplete
          :fetch-suggestions="queryCNSearch"
          @select="handleSelect"
          :placeholder="$t('请输入客户ID')"
          v-model="target"
        >
        </el-autocomplete>
      </div>
      <div style="margin-top: 40px">
        <span>{{ $t('合并规则') }}</span> <br />
        <span>1、{{ $t('合并客户ID时，保留当前客户ID下所有信息；') }}</span
        ><br />
        <span
          >2、{{
            $t(
              '合并目标客户的【余额、订单、包裹、收件地址、佣金、代理客户、交易记录、充值记录】合并至当前客户ID，其他信息清空；'
            )
          }}</span
        >
        <br />
        <span
          >3、{{
            $t(
              '目标客户ID合并后即作废，绑定的手机号、邮箱、微信也自动解除绑定，可用于重新绑定其他客户ID。'
            )
          }}</span
        >
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="mergeConfirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'vipListDetails',
  data() {
    return {
      activeName: '1',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      info: {},
      customerId: '',
      customerName: '',
      dialogVisible: false,
      target: '',
      tableData: [],
      inviteData: []
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.info = JSON.parse(this.$route.query.info)
      console.log(this.info)
    },
    customerMerge() {
      this.customerId = this.$route.params.id
      this.customerName = this.info.name
      this.dialogVisible = true
    },
    // 客户id
    queryCNSearch(queryString, callback) {
      console.log(this.target)
      var list = [{}]
      this.$request
        .Automatic({
          keyword: this.target.toString()
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback && callback(list)
        })
    },
    handleSelect(item) {
      console.log(item)
    },
    handleClick() {},
    editInfo() {},
    //确定合并
    mergeConfirm() {
      if (!this.target) {
        return this.$message.error(this.$t('请输入目标客户ID'))
      }
      this.targetID = this.target.split('---')[0]
      this.$request.mergeCustomer(this.customerId, this.targetID).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.dialogVisible = false
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.viplist-details {
  font-size: 14px;
  background-color: #fff !important;
  .leftWidth {
    width: 120px;
    padding: 10px 0;
    display: inline-block;
  }
  .title {
    width: 80px;
    margin-top: 10px;
    text-align: center;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
  .el-dialog__close {
    color: #fff;
  }
}
</style>
