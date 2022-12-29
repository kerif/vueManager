<template>
  <div class="voucher-container">
    <el-tabs v-model="activeName" class="tabLength" @tab-click="onTabChange">
      <!-- 全部 -->
      <el-tab-pane :label="$t('全部')" name="1"></el-tab-pane>
      <!-- 未开始 -->
      <el-tab-pane :label="$t('未开始')" name="2"></el-tab-pane>
      <!-- 进行中 -->
      <el-tab-pane :label="$t('进行中')" name="3"></el-tab-pane>
      <!-- 已失效 -->
      <el-tab-pane :label="$t('已失效')" name="4"></el-tab-pane>
    </el-tabs>
    <div style="overflow: hidden">
      <add-btn router="addVoucher">{{ $t('添加') }}</add-btn>
      <div class="changeVou">
        <el-select
          v-model="type"
          @change="onVocherTypeChange"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in voucherChange"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </div>
      <div class="searchGroup">
        <search-group
          :placeholder="$t('请输入关键字')"
          v-model="page_params.keyword"
          @search="goSearch"
        ></search-group>
      </div>
      <div class="changeVou">
        <el-button class="btn-main" style="margin-top: 5px" @click="exportList">{{
          $t('导出清单')
        }}</el-button>
      </div>
      <el-button type="primary" size="small" @click="onNew">{{ $t('新用户福利') }}</el-button>
    </div>
    <div style="height: calc(100vh - 270px)">
      <el-table
        class="data-list"
        border
        stripe
        v-loading="tableLoading"
        height="calc(100vh - 270px)"
        ref="table"
        :data="voucherData"
        @selection-change="onSelectChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column type="index" width="50"></el-table-column>
        <!-- 优惠券名称 -->
        <el-table-column :label="$t('优惠券名称')" prop="name"></el-table-column>
        <!-- 类型 -->
        <el-table-column :label="$t('类型')" prop="type" width="180"></el-table-column>
        <!-- 金额 -->
        <el-table-column
          :label="$t('金额') + this.localization.currency_unit"
          prop="amount"
          width="120"
        >
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('状态')" prop="status" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">{{ $t('未开始') }}</span>
            <span v-if="scope.row.status === 2">{{ $t('进行中') }}</span>
            <span v-if="scope.row.status === 3">{{ $t('已失效') }}</span>
          </template>
        </el-table-column>
        <!-- 使用范围 -->
        <el-table-column :label="$t('使用范围')" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-for="item in scope.row.usable_lines" :key="item.id">
              {{ item.name }}&nbsp;
            </span>
          </template>
        </el-table-column>
        <!-- 最低消费金额 -->
        <el-table-column :label="$t('最低消费金额')" prop="threshold" width="120"></el-table-column>
        <!-- 失效时间 -->
        <el-table-column :label="$t('失效时间')" prop="expired_at" width="160"></el-table-column>
        <!-- 投放数量 -->
        <el-table-column :label="$t('投放数量')" prop="total_count" width="80"></el-table-column>
        <!-- 使用数量 -->
        <el-table-column :label="$t('使用数量')" width="80">
          <template slot-scope="scope">
            <span v-bind:style="{ color: scope.row.used_count > 0 ? 'blue' : '' }">{{
              scope.row.used_count
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('待使用数量')"
          prop="unused_count"
          width="100"
        ></el-table-column>
        <el-table-column :label="$t('过期数量')" prop="expired_count" width="80"></el-table-column>
        <el-table-column :label="$t('作废数量')" prop="invalid_count" width="80"></el-table-column>
        <el-table-column
          :label="item.name"
          v-for="item in formatLangData"
          :key="item.id"
          align="center"
          width="130"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row['trans_' + item.language_code]"
              class="el-icon-check icon-sty"
              @click="onLang(scope.row, item)"
            ></span>
            <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button
              class="btn-main"
              v-if="
                (scope.row.status === '' || scope.row.status === 1 || scope.row.status === 2) &&
                scope.row.type !== '新用户福利'
              "
              @click="ManageExchangeCode(scope.row.id)"
              >{{ $t('兑换码管理') }}</el-button
            >
            <!-- 投放 -->
            <el-button
              class="btn-purple detailsBtn"
              v-if="
                (scope.row.status === '' || scope.row.status === 1 || scope.row.status === 2) &&
                scope.row.type !== '新用户福利'
              "
              @click="serving(scope.row.id)"
              >{{ $t('投放') }}</el-button
            >
            <!-- 作废 -->
            <el-button
              class="btn-deep-blue detailsBtn"
              v-if="
                (activeName === '1' || activeName === '2' || activeName === '3') &&
                scope.row.status !== 3
              "
              @click="obsolete(scope.row.id)"
              >{{ $t('作废') }}</el-button
            >
            <!-- 删除 -->
            <el-button
              class="btn-light-red detailsBtn"
              v-if="scope.row.used_count === 0"
              @click="onDelete(scope.row.id)"
              >{{ $t('删除') }}</el-button
            >
            <!-- 记录 -->
            <el-button
              size="small"
              class="btn-dark-green detailsBtn"
              @click="recoding(scope.row)"
              >{{ $t('记录') }}</el-button
            >
            <el-button
              size="small"
              class="btn-pink detailsBtn"
              v-if="scope.row.type === $t('用户抢券')"
              @click="share(scope.row.id)"
              >{{ $t('分享') }}</el-button
            >
            <!-- <el-button size="small" class="btn-main">{{ $t('详情') }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="noDate" v-else>暂无数据</div> -->
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
    <el-dialog
      :visible.sync="show"
      :title="$t('请选择')"
      class="change-status-dialog dialog-container"
      width="50%"
      @close="clear"
    >
      <div class="status-box">
        <!-- <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">{{ $t('客户组投放') }}</el-radio>
          <el-radio :label="2">{{ $t('单个客户投放') }}</el-radio>
        </el-radio-group> -->
        <div class="box">
          <div class="box-one">
            <div class="box-one-top">
              <div>{{ $t('用户组') }}</div>
              <div>{{ userList.length }}</div>
            </div>
            <div class="box-one-bottom">
              <el-checkbox-group v-model="userList">
                <el-checkbox v-for="item in modeList" :key="item.id" :label="item.id"
                  >{{ item.name }}({{ item.users_count }})</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-two">
            <div class="box-two-left">
              <div>{{ $t('特定等级组') }}</div>
              <div>{{ levelList.length }}</div>
            </div>
            <div class="box-two-bottom">
              <el-checkbox-group v-model="levelList">
                <el-checkbox v-for="item in vipList" :key="item.id" :label="item.id"
                  >{{ item.name }}({{ item.users_count }})</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-two">
            <div class="box-two-left">
              <div>{{ $t('客户标签组') }}</div>
              <div>{{ tags.length }}</div>
            </div>
            <div class="box-two-bottom">
              <el-checkbox-group v-model="tags">
                <el-checkbox v-for="item in labelList" :key="item.id" :label="item.id"
                  >{{ item.name }}({{ item.users_count }})</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-three">
            <div class="box-three-top">
              <div>{{ $t('特定客户') }}</div>
              <div>{{ customerList.length }}</div>
            </div>
            <div style="padding: 10px">
              <el-autocomplete
                v-model="selectUser"
                :fetch-suggestions="querySearchUser"
                value-key="name"
                clearable
                :placeholder="$t('请输入客户ID')"
                @select="handleSelect"
                style="width: 200px"
              >
                <template #default="{ item }">
                  <div class="name">{{ item.id }}---{{ item.name }}</div>
                </template>
              </el-autocomplete>
            </div>
            <div style="padding: 10px; height: 300px; overflow: auto">
              <div
                class="customer-item"
                style="margin: 10px"
                v-for="(item, index) in customerList"
                :key="index"
              >
                {{ item.id }}---{{ item.name }}
                <i
                  class="el-icon-delete"
                  style="color: red; cursor: pointer"
                  @click="delCustomer(index)"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
        <!-- <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button> -->
      </div>
    </el-dialog>
    <!-- 分享 -->
    <el-dialog
      :visible.sync="shareDialog"
      :title="$t('分享')"
      class="change-status-dialog dialog-container"
      width="35%"
      @close="shareClear"
    >
      <span class="img-item">
        <img :src="`${$baseUrl.IMAGE_URL}${imgShare}`" alt="" class="goods-img" />
      </span>
      <div slot="footer">
        <el-button type="primary" @click="uploadCode">{{ $t('下载二维码') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddBtn from '@/components/addBtn'
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  name: 'voucherList',
  data() {
    return {
      activeName: '1',
      voucherData: [],
      status: '',
      type: '',
      voucherChange: [
        // {
        //   id: '2',
        //   name: this.$t('新用户福利券')
        // },
        {
          id: '1',
          name: this.$t('普通抵用券')
        },
        {
          id: '',
          name: this.$t('全部')
        },
        {
          id: '3',
          name: this.$t('用户抢券')
        }
      ],
      show: false,
      shareDialog: false,
      selectIDs: [],
      servingId: '',
      localization: {},
      tableLoading: false,
      languageData: [],
      transCode: '',
      ruleForm: {
        status: []
      },
      imgShare: '',
      selectUser: '',
      tags: [],
      userList: [],
      modeList: [],
      levelList: [],
      customerList: [],
      vipList: [],
      labelList: []
    }
  },
  created() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
      this.status = Number(this.activeName) === 0 ? '' : Number(this.activeName) - 1
    }
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  mounted() {
    this.getList()
    this.getLanguageList()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    },
    sum() {
      let sum1 = 0,
        sum2 = 0,
        sum3 = 0,
        sum4 = 0
      this.modeList.forEach(item => {
        this.userList.forEach(ele => {
          if (item.id === ele) {
            sum1 += Number(item.users_count)
          }
        })
      })
      this.vipList.forEach(item => {
        this.levelList.forEach(ele => {
          if (item.id === ele) {
            sum2 += Number(item.users_count)
          }
        })
      })
      this.labelList.forEach(item => {
        this.tags.forEach(ele => {
          if (item.id === ele) {
            sum3 += Number(item.users_count)
          }
        })
      })
      sum4 = this.customerList.length
      return sum1 + sum2 + sum3 + sum4
    }
  },
  methods: {
    onDelete(id) {
      this.$confirm(this.$t('确定要删除优惠券吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteCoupon(id).then(res => {
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
    getList() {
      this.tableLoading = true
      this.voucherData = []
      this.$request
        .getCouponList({
          status: this.status,
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          type: this.type,
          template_id: this.$route.query.type === '2' ? this.$route.query.id : ''
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            // 待发货列表的转运快递单号添加
            // res.data.forEach(item => {
            //   item.disabled = true
            //   item.copySN = item.logistics_sn
            // })
            this.voucherData = res.data.filter(item => item.type !== '新用户福利')
            setTimeout(() => {
              this.$nextTick(() => {
                this.$refs.table.doLayout()
              })
            }, 300)
            this.localization = res.localization
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
    getGroupList() {
      this.$request.userRelation().then(res => {
        if (res.ret) {
          this.modeList = res.data.groups
          this.vipList = res.data.levels
          this.labelList = res.data.tags
        }
      })
    },
    // 选择客户
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
    handleSelect(item) {
      if (this.customerList.map(item => item.id).includes(item.id)) {
        return false
      }
      this.customerList.push(item)
    },
    delCustomer(index) {
      this.customerList.splice(index, 1)
    },
    // 记录
    recoding(couponInfo) {
      dialog({ type: 'couponDetail', couponInfo }, () => {})
    },
    // 分享
    share(id) {
      this.shareDialog = true
      this.$request.getCouponDetails(id).then(res => {
        if (res.ret) {
          this.imgShare = res.data.share_qr_code
        }
      })
    },
    shareClear() {},
    exportList() {
      this.$request
        .exportCoupon({
          status: this.status,
          keyword: this.page_params.keyword,
          type: this.type,
          template_id: this.$route.query.type === '2' ? this.$route.query.id : ''
        })
        .then(res => {
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
    },
    // 下载二维码
    uploadCode() {
      window.open(`${this.$baseUrl.IMAGE_URL}${this.imgShare}`)
    },
    // 作废
    obsolete(id) {
      this.$confirm(this.$t('确定要作废优惠券吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.disableCoupons(id).then(res => {
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
    confirm() {
      if (!this.ruleForm.status) {
        return this.$message.info(this.$t('请选择客户或客户组'))
      }
      this.show = false
      if (this.ruleForm.status === 2) {
        dialog({ type: 'selectCus' }, data => {
          this.$request
            .addLaunch(this.servingId, {
              user_id: [data.id]
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.getList()
              } else {
                this.$notify({
                  type: 'error',
                  message: res.msg
                })
              }
            })
        })
      } else {
        dialog({ type: 'selectGroup' }, data => {
          this.$request
            .addLaunchGroup(this.servingId, {
              group_id: [data.id]
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  type: 'success',
                  title: this.$t('操作成功'),
                  message: res.msg
                })
                this.getList()
              } else {
                this.$notify({
                  type: 'error',
                  message: res.msg
                })
              }
            })
        })
      }
    },
    clear() {
      this.ruleForm.status = []
      this.id = ''
      this.userList = []
      this.customerList = []
      this.levelList = []
      this.tags = []
    },
    onConfirm() {
      this.$confirm(
        this.sum > 0
          ? this.$t(`您当前已选${this.sum}位客户，是否确认全部投放`)
          : this.$t('请先选择客户'),
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        if (this.sum > 0) {
          this.$request
            .launchCoupon(this.servingId, {
              group_ids: this.userList,
              level_ids: this.levelList,
              user_ids: this.customerList.map(item => item.id),
              tag_ids: this.tags
            })
            .then(res => {
              if (res.ret) {
                this.$notify({
                  title: this.$t('保存成功'),
                  message: res.msg,
                  type: 'success'
                })
                this.show = false
                this.getList()
              } else {
                this.$notify({
                  title: this.$t('操作失败'),
                  message: res.msg,
                  type: 'warning'
                })
              }
            })
        } else {
          this.show = false
        }
      })
    },
    // 投放第一步
    serving(id) {
      this.show = true
      this.servingId = id
      this.getGroupList()
    },
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    onSelectChange(selection) {
      this.selectIDs = selection.map(item => item.id)
    },
    // 添加转运快递单号
    edit(row) {
      row.disabled = !row.disabled
    },
    // 取消
    cancel(row) {
      row.logistics_sn = row.copySN
      row.disabled = true
    },
    // 保存添加转运快递单号
    saveLogistics(row) {
      if (!row.logistics_sn) {
        return this.$message.info(this.$t('请输入转运快递单号'))
      }
      this.$request
        .updateLogistics([
          {
            id: row.id,
            sn: row.logistics_sn
          }
        ])
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('保存成功'),
              message: res.msg,
              type: 'success'
            })
            row.disabled = true
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // tab change
    onTabChange(tab) {
      switch (tab.name) {
        case '1': // 全部
          this.status = ''
          break
        case '2': // 未开始
          this.status = 1
          break
        case '3': // 进行中
          this.status = 2
          break
        case '4': // 已失效
          this.status = 3
          break
      }
      this.page_params.page = 1
      this.page_params.handleQueryChange('page', 1)
      this.page_params.handleQueryChange('activeName', tab.name)
      this.getList()
    },
    // 选择不同类型优惠券
    onVocherTypeChange() {
      this.page_params.handleQueryChange('type', this.type)
      this.getList()
    },
    // 转账 修改语言
    onLang(line, lang) {
      this.transCode = line['trans_' + lang.language_code]
      dialog({ type: 'voucherLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    },
    ManageExchangeCode(id) {
      dialog({
        type: 'addExchangeCode',
        id
      })
    },
    onNew() {
      dialog({
        type: 'newUser'
      })
    }
  }
}
</script>

<style lang="scss">
.voucher-container {
  .searchGroup {
    width: 21.2%;
    float: right;
  }
  .tabLength {
    width: 350px !important;
  }
  .detailsBtn {
    margin: 3px 2px !important;
  }
  .changeVou {
    float: right;
    margin: 0 10px;
    .el-input {
      width: 100%;
    }
  }
  .img-item {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 148px;
    height: 148px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .model-box,
      .operat-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
    }
  }
  .box {
    display: flex;
    margin: 20px 0;
    text-align: left;
    .box-one {
      width: 200px;
      border: 1px solid #eee;
      border-radius: 6px;
      .box-one-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #eee;
        border-bottom: 1px solid #eee;
      }
      .box-one-bottom {
        padding: 10px;
        height: 300px;
        overflow: auto;
        .el-checkbox {
          margin: 10px 0;
          display: block;
        }
      }
    }
    .box-two {
      width: 200px;
      border: 1px solid #eee;
      border-radius: 6px;
      margin-left: 20px;
      .box-two-left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #eee;
        border-bottom: 1px solid #eee;
      }
      .box-two-bottom {
        padding: 10px;
        height: 300px;
        overflow: auto;
        .el-checkbox {
          margin: 10px 0;
          display: block;
        }
      }
    }
    .box-three {
      width: 240px;
      border: 1px solid #eee;
      border-radius: 6px;
      margin-left: 20px;
      .box-three-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        background: #eee;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>
