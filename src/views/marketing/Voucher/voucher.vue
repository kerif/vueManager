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
      <!-- v-if="oderData.length" -->
    </el-tabs>
    <div class="" style="overflow: hidden">
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
    </div>
    <div style="height: calc(100vh - 340px)">
      <el-table
        class="data-list"
        border
        stripe
        v-loading="tableLoading"
        height="calc(100vh - 360px)"
        ref="table"
        :data="voucherData"
        @selection-change="onSelectChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column type="index" width="50"></el-table-column>
        <!-- 优惠券名称 -->
        <el-table-column :label="$t('优惠券名称')" prop="name"></el-table-column>
        <!-- 类型 -->
        <el-table-column :label="$t('类型')" prop="type"></el-table-column>
        <!-- 金额 -->
        <el-table-column :label="$t('金额') + this.localization.currency_unit" prop="amount">
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('状态')" prop="status">
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
        <el-table-column :label="$t('最低消费金额')" prop="threshold"></el-table-column>
        <!-- 失效时间 -->
        <el-table-column :label="$t('失效时间')" prop="expired_at"></el-table-column>
        <!-- 投放数量 -->
        <el-table-column :label="$t('投放数量')" prop="total_count"></el-table-column>
        <!-- 使用数量 -->
        <el-table-column :label="$t('使用数量')" prop="used_count"></el-table-column>
        <el-table-column
          :label="item.name"
          v-for="item in formatLangData"
          :key="item.id"
          align="center"
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
            <!-- 投放 -->
            <el-button
              class="btn-purple detailsBtn"
              v-if="scope.row.status === '' || scope.row.status === 1 || scope.row.status === 2"
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
            <!-- 记录 -->
            <el-button
              size="small"
              class="btn-dark-green detailsBtn"
              @click="recoding(scope.row.id)"
              >{{ $t('记录') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="noDate" v-else>暂无数据</div> -->
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog
      :visible.sync="show"
      :title="$t('请选择')"
      class="change-status-dialog dialog-container"
      width="35%"
      @close="clear"
    >
      <div class="status-box">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">{{ $t('客户组投放') }}</el-radio>
          <el-radio :label="2">{{ $t('单个客户投放') }}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer">
        <el-button @click="show = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
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
      type: '1',
      voucherChange: [
        {
          id: '2',
          name: this.$t('新用户福利券')
        },
        {
          id: '1',
          name: this.$t('抵用券')
        },
        {
          id: '',
          name: this.$t('全部')
        }
      ],
      show: false,
      selectIDs: [],
      servingId: '',
      localization: {},
      tableLoading: false,
      languageData: [],
      transCode: '',
      ruleForm: {
        status: []
      }
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
    // if (this.$route.query.type === '2') {
    // }
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
    }
  },
  methods: {
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
            this.voucherData = res.data
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
    // 记录
    recoding(id) {
      this.$router.push({ name: 'notes', query: { id: id } })
    },
    // 作废
    obsolete(id) {
      this.$confirm(this.$t('确定要作废优惠券吗？'), this.$t('提示'), {
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
      console.log(this.ruleForm.status)
      if (!this.ruleForm.status) {
        return this.$message.info(this.$t('请选择客户或客户组'))
      }
      this.show = false
      if (this.ruleForm.status === 2) {
        dialog({ type: 'selectCus' }, data => {
          console.log(data, '我是客户data')
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
          console.log(data, '我是客户组data')
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
    },
    // 投放第一步
    serving(id) {
      this.show = true
      this.servingId = id
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
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'voucherLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
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
}
</style>
