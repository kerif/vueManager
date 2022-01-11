<template>
  <div class="viplist-details">
    <div>
      <el-row :gutter="20">
        <el-col :span="20">
          <h3>{{ $t('基本信息') }}</h3>
        </el-col>
        <el-col :span="4">
          <el-button class="btn-light-red" @click="customerMerge">{{ $t('合并') }}</el-button>
          <el-button v-show="!edit" class="btn-deep-blue" @click="editInfo">{{
            $t('修改')
          }}</el-button>
          <el-button v-show="edit" class="btn-deep-blue" @click="saveInfo">{{
            $t('保存')
          }}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="demo-basic--circle">
            <div class="block">
              <!-- <span
                v-if="info.avatar"
                style="cursor: pointer"
                @click.stop=";(imgSrc = info.avatar), (imgVisible = true)"
              >
                <img :src="info.avatar" />
              </span> -->
              <el-avatar :size="80" :src="info.avatar"></el-avatar>
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
              <span>{{ info.member_level_name }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('余额:') }}</span>
              <span>{{ info.balance }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('所属客服:') }}</span>
              <span v-show="!edit">{{ info.customer_name }}</span>
              <el-input v-show="edit" v-model="info.customer_name" style="width: 120px"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('注册日期:') }}</span>
              <span>{{ info.created_at }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户昵称:') }}</span>
              <span>{{ info.name }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('EMAIL:') }}</span>
              <span>{{ info.email }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('积分:') }}</span>
              <span>{{ info.point }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('所属销售:') }}</span>
              <span v-show="!edit">{{ info.sale_name }}</span>
              <el-input v-show="edit" v-model="info.sale_name" style="width: 120px"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('最后登录时间:') }}</span>
              <span>{{ info.last_login_at }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户组:') }}</span>
              <span v-show="!edit">{{ info.name_cn }}</span>
              <el-input v-show="edit" v-model="info.name_cn" style="width: 120px"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('手机号:') }}</span>
              <span>{{ info.phone }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('订单数:') }}</span>
              <span>{{ info.order_count }}</span>
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
        <el-tab-pane :label="`${$t('包裹列表')} (${count.package || 0})`" name="1">
          <el-table :data="packageData" border style="width: 100%" height="calc(100vh - 270px)">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column :label="$t('客户ID')">
              <template slot-scope="scope">
                <span>{{ scope.row.user_id }}-{{ scope.row.user_name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="express_num" :label="$t('快递单号')"></el-table-column>
            <el-table-column prop="status_name" :label="$t('状态')"></el-table-column>
            <el-table-column prop="package_name" :label="$t('物品名称')"></el-table-column>
            <el-table-column prop="package_value" :label="$t('物品价值')"></el-table-column>
            <el-table-column prop="package_weight" :label="$t('物品单价')"></el-table-column>
            <el-table-column prop="destination_country" :label="$t('寄往国家')"></el-table-column>
            <el-table-column prop="express_company" :label="$t('仓库')"></el-table-column>
            <el-table-column prop="created_at" :label="$t('提交时间')"></el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params"></nle-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`${$t('订单列表')} (${count.order || 0})`" name="2">
          <el-table :data="orderData" border style="width: 100%" height="calc(100vh - 270px)">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="user_id" :label="$t('客户ID')"> </el-table-column>
            <el-table-column prop="user_name" :label="$t('用户名')"></el-table-column>
            <el-table-column prop="order_sn" :label="$t('订单号')"></el-table-column>
            <el-table-column prop="express_line" :label="$t('线路名称')"></el-table-column>
            <el-table-column prop="receiver_name" :label="$t('收货人')"></el-table-column>
            <el-table-column prop="country_name" :label="$t('收货国家地区')"></el-table-column>
            <el-table-column prop="payment_weight" :label="$t('预计重量')"></el-table-column>
            <el-table-column prop="payment_fee" :label="$t('预计费用')"></el-table-column>
            <el-table-column prop="created_at" :label="$t('提交时间')"></el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params"></nle-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`${$t('地址')} (${count.address || 0})`" name="3">
          <el-table :data="addressData" border style="width: 100%" height="calc(100vh - 270px)">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="user_id" :label="$t('客户ID')"></el-table-column>
            <el-table-column prop="receiver_name" :label="$t('收件人')"></el-table-column>
            <el-table-column prop="phone" :label="$t('联系电话')"></el-table-column>
            <el-table-column prop="country.name" :label="$t('国家地区')"></el-table-column>
            <el-table-column prop="address_area" :label="$t('区域')"></el-table-column>
            <el-table-column prop="city" :label="$t('城市')"></el-table-column>
            <el-table-column prop="street" :label="$t('街道')"></el-table-column>
            <el-table-column prop="door_no" :label="$t('门牌号')"></el-table-column>
            <el-table-column prop="postcode" :label="$t('邮编')"></el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params"></nle-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`${$t('券包')} (${count.coupon || 0})`" name="4">
          <el-table
            class="data-list"
            :data="inviteData"
            border
            style="width: 100%"
            height="calc(100vh - 270px)"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="name" :label="$t('券名称')"> </el-table-column>
            <el-table-column prop="code" :label="$t('券码')"> </el-table-column>
            <el-table-column prop="amount" :label="$t('金额')"> </el-table-column>
            <el-table-column prop="status" :label="$t('状态')"> </el-table-column>
            <el-table-column prop="created_at" :label="$t('发放时间')"> </el-table-column>
            <el-table-column prop="used_at" :label="$t('使用时间')"> </el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params"></nle-pagination>
        </el-tab-pane>
        <el-tab-pane :label="`${$t('邀请记录')} (${count.invite || 0})`" name="5">
          <el-table
            class="data-list"
            :data="tableData"
            border
            style="width: 100%"
            height="calc(100vh - 270px)"
          >
            <el-table-column type="index"> </el-table-column>
            <!-- 客户ID -->
            <el-table-column prop="id" :label="$t('客户ID')"> </el-table-column>
            <!-- 客户昵称 -->
            <el-table-column prop="name" :label="$t('客户昵称')"> </el-table-column>
            <el-table-column prop="created_at" :label="$t('注册时间')"> </el-table-column>
            <!-- 最后登录时间 -->
            <el-table-column prop="last_login_at" :label="$t('最后登录时间')"> </el-table-column>
          </el-table>
          <nle-pagination :pageParams="page_params"></nle-pagination>
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
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img-box">
        <img :src="imgSrc" class="img-dialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'vipListDetails',
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      activeName: '1',
      info: {},
      customerId: '',
      customerName: '',
      dialogVisible: false,
      edit: false,
      target: '',
      tableData: [],
      inviteData: [],
      packageData: [],
      orderData: [],
      addressData: [],
      imgVisible: false,
      imgSrc: '',
      count: {}
    }
  },
  created() {
    this.getInfo()
    this.getPackageList()
    this.getCount()
    this.getList()
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
    getList() {
      // this.$request.getUsers().then(res => {
      //   if (res.ret) {
      //     console.log(res)
      //   }
      // })
    },
    getCount() {
      // this.$request.infoCount(this.$route.params.id).then(res => {
      //   if (res.ret) {
      //     this.count = res.data
      //   }
      // })
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
    handleClick() {
      // if (this.activeName === '1') {
      //   this.getPackageList()
      // } else if (this.activeName === '2') {
      //   this.getOrderList()
      // } else if (this.activeName === '3') {
      //   this.getAddressList()
      // } else if (this.activeName === '4') {
      //   this.getCardList()
      // } else {
      //   this.getInviteList()
      // }
    },
    editInfo() {
      this.edit = true
    },
    saveInfo() {
      // this.$request
      //   .updateVipInfo(this.$route.params.id, {
      //     sale_name: this.info.sale_name,
      //     name_cn: this.info.name_cn,
      //     customer_name: this.info.customer_name
      //   })
      //   .then(res => {
      //     if (res.ret) {
      //       this.$notify({
      //         title: this.$t('操作成功'),
      //         message: res.msg,
      //         type: 'success'
      //       })
      //       this.edit = false
      //     } else {
      //       this.$notify({
      //         title: this.$t('操作失败'),
      //         message: res.msg,
      //         type: 'warning'
      //       })
      //     }
      //   })
    },
    //确定合并
    mergeConfirm() {
      // if (!this.target) {
      //   return this.$message.error(this.$t('请输入目标客户ID'))
      // }
      // this.targetID = this.target.split('---')[0]
      // this.$request.mergeCustomer(this.customerId, this.targetID).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       title: this.$t('操作成功'),
      //       message: res.msg,
      //       type: 'success'
      //     })
      //     this.dialogVisible = false
      //   } else {
      //     this.$notify({
      //       title: this.$t('操作失败'),
      //       message: res.msg,
      //       type: 'warning'
      //     })
      //     this.dialogVisible = false
      //   }
      // })
    },
    getInviteList() {
      // this.$request
      //   .invitations(this.$route.params.id, {
      //     page: this.page_params.page,
      //     size: this.page_params.size
      //   })
      //   .then(res => {
      //     if (res.ret) {
      //       this.tableData = res.data
      //       console.log(this.tableData)
      //       this.page_params.page = res.meta.current_page
      //       this.page_params.total = res.meta.total
      //     }
      //   })
    },
    getCardList() {
      // this.$request
      //   .voucherUser(this.$route.params.id, {
      //     page: this.page_params.page,
      //     size: this.page_params.size
      //   })
      //   .then(res => {
      //     if (res.ret) {
      //       this.inviteData = res.data
      //       console.log(this.inviteData)
      //       this.page_params.page = res.meta.current_page
      //       this.page_params.total = res.meta.total
      //     }
      //   })
    },
    getPackageList() {
      //   this.$request
      //     .packageList(this.$route.params.id, {
      //       page: this.page_params.page,
      //       size: this.page_params.size
      //     })
      //     .then(res => {
      //       if (res.ret) {
      //         this.packageData = res.data
      //         this.page_params.page = res.meta.current_page
      //         this.page_params.total = res.meta.total
      //       }
      //     })
    },
    getOrderList() {
      // this.$request
      //   .orderList(this.$route.params.id, {
      //     page: this.page_params.page,
      //     size: this.page_params.size
      //   })
      //   .then(res => {
      //     if (res.ret) {
      //       this.orderData = res.data
      //       this.page_params.page = res.meta.current_page
      //       this.page_params.total = res.meta.total
      //     }
      //   })
    },
    getAddressList() {
      // this.$request
      //   .addressList(this.$route.params.id, {
      //     page: this.page_params.page,
      //     size: this.page_params.size
      //   })
      //   .then(res => {
      //     if (res.ret) {
      //       this.addressData = res.data
      //       this.page_params.page = res.meta.current_page
      //       this.page_params.total = res.meta.total
      //     }
      //   })
    }
  }
}
</script>

<style lang="scss">
.viplist-details {
  font-size: 14px;
  background-color: #fff !important;
  .leftWidth {
    width: 100px;
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
