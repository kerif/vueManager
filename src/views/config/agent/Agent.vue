<template>
  <div class="agent-list-container">
    <div class="order-list-search" v-show="hasFilterCondition">
      <el-date-picker
        size="mini"
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :range-separator="$t('至')"
        :start-placeholder="$t('开始日期')"
        :end-placeholder="$t('结束日期')"
      >
      </el-date-picker>
      <div class="submit">
        <el-button type="primary" plain size="small" @click="submitForm">{{
          $t('搜索')
        }}</el-button>
        <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="btn">
      <add-btn router="addAgent" class="add-sty">{{ $t('添加代理') }}</add-btn>
      <add-btn router="agentTemplate">{{ $t('计佣模版配置') }}</add-btn>
      <el-button type="primary" @click="updateAgentCode">{{ $t('更新代理二维码') }}</el-button>
      <div class="changeVou">
        <el-button @click="withdraw">{{ $t('提现说明') }}</el-button>
      </div>
      <div class="filter">
        <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
          >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
        ></el-button>
      </div>
      <div class="agent-search">
        <search-group
          :placeholder="$t('请输入关键字')"
          v-model="page_params.keyword"
          @search="goSearch"
        >
        </search-group>
      </div>
      <div class="changeVou">
        <el-button class="btn-main" style="margin-top: 5px" @click="uploadList">{{
          $t('导出清单')
        }}</el-button>
      </div>
      <div class="changeVou">
        <el-button class="btn-main" style="margin-top: 5px" @click="exportOeder">{{
          $t('导出订单')
        }}</el-button>
      </div>
    </div>
    <el-table
      class="data-list"
      border
      stripe
      ref="table"
      :data="suggestList"
      v-loading="tableLoading"
      @selection-change="selectionChange"
      height="calc(100vh - 275px)"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column :label="$t('代理名称')" width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="viewProfile(scope.row.user_id)">
            <span v-if="$store.state.uid === 1">{{ scope.row.user_uid }}</span>
            <span v-if="$store.state.uid === 1">(</span>{{ scope.row.user_id
            }}<span v-if="$store.state.uid === 1">)</span>-{{ scope.row.agent_name }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column :label="$t('联系人')" prop="contact_name"></el-table-column>
      <el-table-column :label="$t('佣金分成')" prop="commission" width="100"> </el-table-column>
      <el-table-column :label="$t('推广下单数')" width="100">
        <template slot-scope="scope">
          <span style="color: blue">{{ scope.row.deal_order }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('推广成交数')" width="100">
        <template slot-scope="scope">
          <span style="color: red">{{ scope.row.deal_order }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" prop="created_at" width="155"> </el-table-column>
      <el-table-column :label="$t('是否启用')" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeTransfer($event, scope.row.enabled, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="600" fixed="right">
        <template slot-scope="scope">
          <!-- 代理二维码 -->
          <el-button class="btn-green" @click.stop="openAgent(scope.row)">{{
            $t('代理二维码')
          }}</el-button>
          <!-- 修改 -->
          <el-button class="btn-green" @click="editAgent(scope.row.id)">{{ $t('修改') }}</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red" @click="deleteAgent(scope.row.id)">{{
            $t('删除')
          }}</el-button>
          <!-- 成交记录 -->
          <!-- 设置佣金 -->
          <el-button
            class="btn-deep-purple"
            @click="setCommission(scope.row.id, scope.row.agent_name, scope.row.commission)"
            >{{ $t('设置佣金') }}</el-button
          >
          <!-- <el-button class="btn-blue" @click="record(scope.row.id)">{{$t('成交记录')}}</el-button> -->
          <!-- 提现申请 -->
          <el-badge
            :value="scope.row.apply_counts > 0 ? scope.row.apply_counts : ''"
            class="item record-sty"
          >
            <el-button class="btn-deep-blue" @click="withdrawal(scope.row.user_id)">{{
              $t('提现申请')
            }}</el-button>
          </el-badge>
          <el-button class="btn-blue" @click="invite(scope.row.user_id)">{{
            $t('邀请记录')
          }}</el-button>

          <el-badge
            :value="scope.row.settle_count > 0 ? scope.row.settle_count : ''"
            class="item record-sty"
          >
            <el-button class="btn-blue" @click="record(scope.row.id, scope.row.user_id)">{{
              $t('成交记录')
            }}</el-button>
          </el-badge>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
        <div>
          <div class="img-code">{{ imgUser }}</div>
          <el-button
            size="mini"
            class="btn-light-red"
            style="margin-left: 20px"
            @click="uploadAgentCode"
            >{{ $t('下载二维码') }}</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- 提现说明弹窗 -->
    <el-dialog
      :title="$t('提现说明')"
      :visible.sync="withdrawVisible"
      width="50%"
      class="withdraw-sty"
      @close="clear"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="$t('选择语言')">
          <el-select v-model="form.language" placeholder="请选择" @change="changeLang">
            <el-option
              v-for="item in options"
              :key="item.language_code"
              :label="item.name"
              :value="item.language_code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('提现说明内容')">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            :placeholder="$t('请输入内容')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="withdrawVisible = false">{{ $t('取消') }}</el-button>
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
import { downloadStreamFile } from '@/utils/index'
export default {
  data() {
    return {
      suggestList: [
        {
          enabled: true
        }
      ], // 表格数据
      tableLoading: false,
      imgVisible: false,
      imgSrc: '',
      imgUser: '',
      begin_date: null,
      end_date: null,
      deleteNum: [],
      options: [],
      withdrawVisible: false,
      hasFilterCondition: true,
      id: '',
      type: '',
      form: {
        content: '',
        language: ''
      },
      timeList: []
    }
  },
  name: 'agentList',
  mixins: [pagination],
  components: {
    NlePagination,
    SearchGroup,
    AddBtn
  },
  mounted() {
    this.getList()
  },
  methods: {
    viewProfile(id) {
      dialog({ type: 'vipProfile', id: id })
    },
    getList() {
      this.tableLoading = true
      this.$request
        .getAgents({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size,
          begin_date: this.begin_date,
          end_date: this.end_date
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.suggestList = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
            // this.suggestList = res.data
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
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      // this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 重置表单
    resetForm() {
      this.timeList = []
      this.getList()
    },
    // 提交表单
    submitForm() {
      this.onTime(this.timeList)
    },
    openAgent(data) {
      this.imgVisible = true
      this.imgUser = data.user_id
      this.id = data.id
      this.onAgentDetails(this.id)
    },
    onAgentDetails(id) {
      this.$request.getEditAgent(id).then(res => {
        this.imgSrc = res.data.qr_code
      })
    },
    // 修改代理
    editAgent(id) {
      console.log(id, 'id')
      this.$router.push({
        name: 'editAgent',
        query: {
          id: id
        }
      })
    },
    // 邀请记录
    invite(id) {
      dialog({ type: 'inviteList', state: 'invite', id })
    },
    //删除代理
    deleteAgent(id) {
      this.$confirm(this.$t('您真的要删除此代理'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteAgent(id).then(res => {
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
    // 提现申请
    withdrawal(id) {
      this.$router.push({
        name: 'Withdrawal',
        params: {
          id: id
        }
      })
    },
    // 修改代理管理的开关
    changeTransfer(event, enabled, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.resetAgents(id, Number(event)).then(res => {
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
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 获取提现说明
    getWithdraw() {
      this.$request.withdrawData().then(res => {
        if (res.ret) {
          this.form.content = res.data.content
          this.form.language = res.data.language
        }
      })
    },
    // 切换语言
    changeLang() {
      this.$request
        .withdrawData({
          lang: this.form.language
        })
        .then(res => {
          if (res.ret) {
            this.form.content = res.data.content
            this.form.language = res.data.language
          }
        })
    },
    // 获取语言列表
    getLanguage() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.options = res.data
        }
      })
    },
    // 导出
    uploadList() {
      let params = {
        status: this.status,
        keyword: this.page_params.keyword,
        type: this.type,
        discount_type: this.discount_type,
        template_id: this.$route.query.type === '2' ? this.$route.query.id : ''
      }
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.uploadAgent(params).then(res => {
        if (res.ret) {
          // this.urlExcel = res.data.url
          // window.open(this.urlExcel)
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
    // 导出订单
    exportOeder() {
      let params = {}
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.exportAgentOrder(params).then(res => {
        if (res.ret) {
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
    // 提现说明 确认
    confirm() {
      this.$request.updateWithdrawData(this.form).then(res => {
        if (res.ret) {
          this.withdrawVisible = false
        }
      })
    },
    // 更新代理二维码
    updateAgentCode() {
      this.$confirm(this.$t('是否确认更新代理二维码'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          this.$request.updateAgentCode().then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 下载二维码
    uploadAgentCode() {
      let param = {
        responseType: 'blob'
      }
      this.$request.uploadAgentCode(this.id, param).then(res => {
        downloadStreamFile(res, 'code', 'jpg')
      })
    },
    // 提现说明
    withdraw() {
      this.withdrawVisible = true
      this.getLanguage()
      this.getWithdraw()
    },
    clear() {
      this.form.content = ''
      this.form.language = ''
    },
    // 成交记录
    record(id, userId) {
      this.$router.push({
        name: 'record',
        query: {
          id: id,
          userId: userId
        }
      })
    },
    // 删除
    deleteData() {
      // this.$request.deleteVip({
      //   DELETE: this.deleteNum
      // }).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       title: '操作成功',
      //       message: res.msg,
      //       type: 'success'
      //     })
      //     this.getList()
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      // })
    },
    onChangeStatus(id) {
      dialog(
        {
          type: 'changestatus',
          id: id
        },
        () => {
          this.getList()
        }
      )
    },
    // 设置佣金
    setCommission(id, agentName, commission) {
      dialog({ type: 'commission', id: id, agentName: agentName, commission: commission }, () => {
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss" scope>
.img_box {
  text-align: center;
  .imgDialog {
    width: 50%;
  }
}
.el-button {
  margin: 3px;
}
.btn {
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}
.agent-search {
  width: 21.5%;
  float: right;
}
.record-sty {
  .el-badge__content.is-fixed {
    top: 10px;
  }
}
.changeVou {
  float: right;
  margin-right: 7px;
  margin-left: 5px;
  // margin-bottom: 15px;
}
.withdraw-sty {
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    color: #fff;
    font-size: 14px;
  }
}
.add-sty {
  margin-left: 10px;
}
.img-code {
  display: inline-block;
}
.order-list-search {
  font-size: 14px;
  background: #fff;
  margin: 10px 0;
  padding: 10px;
  overflow: hidden;
  .submit {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
