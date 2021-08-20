<template>
  <div class="detail-container">
    <div class="leftSide">
      <h3>{{ $t('客户信息') }}</h3>
      <div class="box-card">
        <div class="leftInfo">
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('客户ID') }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <span
                ><i class="idNum">{{ detailData.user.id }}</i
                >&nbsp;&nbsp;&nbsp;{{ detailData.user.name }}</span
              >
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <span class="leftWidth">{{ $t('流水号') }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{{ detailData.serial_no }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="rightInfo">
          <template>
            <h1 v-if="detailData.status_name === '待审核'" class="review_color">
              {{ $t('待审核') }}
            </h1>
            <h1 v-else-if="detailData.status_name === '审核拒绝'" class="reject_color">
              {{ $t('审核拒绝') }}
            </h1>
            <h1 v-else class="pass_color">
              {{ $t('审核通过') }}
            </h1>
          </template>
        </div>
      </div>
      <h3>{{ $t('提现信息') }}</h3>
      <div class="info-card">
        <el-row :gutter="20">
          <!-- 提现方式 -->
          <el-col :span="8">
            <span class="withdrawal">{{ $t('提现方式') }}</span>
            <span class="bank">{{ detailData.type }}</span>
          </el-col>
          <!-- 提现金额¥ -->
          <el-col :span="8" :offset="4">
            <span class="withdrawal">{{ $t('提现金额¥') }}</span>
            <span>{{ detailData.amount }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 账户名 -->
          <el-col :span="8">
            <span class="withdrawal">{{ $t('账户名') }}</span>
            <span>{{ detailData.account }}</span>
          </el-col>
          <!-- 客户备注 -->
          <el-col :span="8" :offset="4">
            <span class="withdrawal">{{ $t('客户备注：') }}</span>
            <span>{{ detailData.customer_remark }}</span>
          </el-col>
        </el-row>
        <div class="main">
          <div class="leftBank">
            <el-row :gutter="20">
              <!-- 真实姓名 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('真实姓名') }}</span>
                <span>{{ info.fullname }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 银行名称 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('银行名称') }}</span>
                <span>{{ info.bank_name }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 银行卡号 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('银行卡号') }}</span>
                <span>{{ info.bank_number }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 手机号码 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('手机号码') }}</span>
                <span>{{ info.phone }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 电子邮箱 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('电子邮箱') }}</span>
                <span>{{ info.email }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <!-- 身份证号码 -->
              <el-col :span="24">
                <span class="withdrawal">{{ $t('身份证号码') }}</span>
                <span>{{ info.idcard }}</span>
              </el-col>
            </el-row>
          </div>
          <div class="idCard">
            <el-row>
              <el-col>
                <div class="positive">
                  <img v-if="detailData.back_img !== ''" :src="detailData.back_img" alt="" />
                  <span v-else>身份证反面</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <div class="reverse">
                  <img v-if="detailData.face_img !== ''" :src="detailData.face_img" alt="" />
                  <span v-else>身份证正面</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="middle"></div>
    <div class="rightSide">
      <h3>{{ $t('日志') }}</h3>
      <div class="daily-card">
        <div class="text">2021-08-01&nbsp; 12:00:00&nbsp; 提交申请&nbsp; 100392</div>
      </div>
      <h3>{{ $t('审核备注') }}</h3>
      <div class="remarks-card">
        <div v-if="detailData.status_name === '待审核'" class="condition">该记录还未审核</div>
        <div v-else>
          <div class="text">
            {{ detailData.remark }}
          </div>
          <div class="screenshot"></div>
        </div>
      </div>
    </div>
    <div class="clearfix">
      <h3>{{ $t('提现明细') }}</h3>
      <el-card class="detail-card" shadow="never">
        <el-row :gutter="20">
          <!-- 提现金额 -->
          <el-col :span="5">
            <span class="withdrawal">{{ $t('提现金额') }}</span>
            <span class="withdrawal_amount">{{ detailData.amount }}</span>
          </el-col>
          <!-- 确认金额 -->
          <el-col :span="5" :offset="10">
            <span class="withdrawal">{{ $t('确认金额') }}</span>
            <span class="confirm_amount">{{ detailData.confirm_amount }}</span>
          </el-col>
        </el-row>
        <div class="text">
          <!-- 表格 -->
          <el-table border style="width: 100%" :data="charge">
            <el-table-column type="index" label="#" width="120"> </el-table-column>
            <el-table-column prop="order_number" label="订单号" width="180"> </el-table-column>
            <el-table-column prop="order_status" label="状态"> </el-table-column>
            <el-table-column prop="order_amount" label="总金额￥" width="180"> </el-table-column>
            <el-table-column prop="proportion" label="佣金方式" width="180"> </el-table-column>
            <el-table-column prop="commission_amount" label="可得佣金￥"> </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-row class="auditStatus">
        <el-button type="danger" @click="viewRejused">{{ $t('审核拒绝') }}</el-button>
        <el-button type="primary" @click="viewApproved">{{ $t('审核通过') }}</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      showDialog: false,
      showCancelDialog: false,
      detailData: {},
      info: {},
      charge: {},
      tableLoading: false
    }
  },
  created() {
    this.getReview()
  },
  components: {},
  methods: {
    getReview() {
      this.$request.Review(this.$route.params.id).then(res => {
        console.log(res)
        this.detailData = res.data
        this.info = res.data.bank_card_info || {}
        this.charge = res.data.commissions
      })
    },
    // 审核通过
    viewApproved() {
      dialog(
        {
          type: 'confirmAudit',
          userid: this.detailData.user.id,
          withdrawsId: this.$route.params.id,
          amount: this.detailData.confirm_amount
        },
        () => {
          this.getReview()
        }
      )
    },
    viewRejused() {
      dialog(
        {
          type: 'failAudit',
          userid: this.detailData.user.id,
          withdrawsId: this.$route.params.id
        },
        () => {
          this.getReview()
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  .leftSide {
    float: left;
    .box-card {
      display: flex;
      width: 680px;
      font-size: 14px;
      padding: 15px 40px;
      background-color: #fff;
      .leftInfo {
        flex: 1;
        .el-row {
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .leftWidth {
          width: 100px;
        }
        .idNum {
          color: blue;
          font-style: normal;
        }
      }
      .rightInfo {
        width: 150px;
        .review_color {
          color: red;
        }
        .reject_color {
          color: red;
        }
        .pass_color {
          color: green;
        }
      }
    }
    .info-card {
      width: 680px;
      font-size: 14px;
      padding: 15px 40px;
      background-color: #fff;
      .el-row {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .withdrawal {
        display: inline-block;
        width: 100px;
      }
      .bank {
        color: blue;
      }
      .main {
        display: flex;
        padding: 5px;
        border: 2px dashed grey;
        .leftBank {
          flex: 1;
        }
        .idCard {
          width: 300px;
          .positive {
            width: 200px;
            height: 100px;
            background-color: #ccc;
            span {
              display: block;
              width: 80px;
              height: 20px;
              padding-top: 50px;
              padding-left: 60px;
            }
          }
          .reverse {
            width: 200px;
            height: 100px;
            background-color: #ccc;
            span {
              display: block;
              width: 80px;
              height: 20px;
              padding-top: 50px;
              padding-left: 60px;
            }
          }
        }
      }
    }
  }
  .middle {
    float: left;
    width: 1px;
    height: 520px;
    text-align: center;
    border-right: 1px solid black;
    margin-top: 26px;
    margin-left: 14px;
  }
  .rightSide {
    float: right;
    .daily-card {
      width: 340px;
      font-size: 14px;
      background-color: #fff;
      .text {
        padding: 15px 40px;
      }
    }
    .remarks-card {
      width: 340px;
      height: 300px;
      font-size: 14px;
      background-color: #fff;
      padding: 20px 0px;
      .condition {
        text-align: center;
      }
      .text {
        padding: 5px 40px;
      }
      .screenshot {
        width: 260px;
        height: 180px;
        margin: 0 auto;
        background-color: #ccc;
      }
    }
  }
  .clearfix {
    clear: both;
    h3 {
      padding-top: 15px;
    }
    .detail-card {
      font-size: 14px;
      padding: 15px;
      /deep/.el-table tr th.is-leaf {
        border-bottom: 1px #ecedf0 solid;
        background-color: #fff;
      }
      .withdrawal {
        display: inline-block;
        width: 100px;
      }
      .withdrawal_amount {
        color: red;
        font-size: 24px;
        font-weight: bold;
      }
      .confirm_amount {
        color: blue;
        font-size: 24px;
        font-weight: bold;
      }
      /deep/.el-table th > .cell {
        text-align: center;
      }
      /deep/.el-table .cell {
        text-align: center;
      }
    }
    .auditStatus {
      margin-top: 40px;
      text-align: center;
    }
  }
}
</style>
