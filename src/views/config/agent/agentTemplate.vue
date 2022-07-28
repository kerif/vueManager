<template>
  <div class="agent-template-container">
    <!-- <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div> -->
    <div class="select-box">
      <add-btn @click.native="addCommission">{{ $t('添加') }}</add-btn>
    </div>
    <el-table
      :data="rulesList"
      stripe
      border
      class="data-list"
      v-loading="tableLoading"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('模版名称')" prop="name"></el-table-column>
      <el-table-column :label="$t('应用数量')" prop="count"> </el-table-column>
      <el-table-column :label="$t('操作')" width="150px">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button class="btn-green" @click="editCommission(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red" @click="deleteSelf(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
    </el-table>
    <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
    <!-- 配置计佣模版 -->
    <el-dialog
      :title="$t('配置计佣模版')"
      :visible.sync="withdrawVisible"
      width="70%"
      class="withdraw-sty"
      @close="clear"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item :label="$t('分成方式')">
          <el-select class="select-sty" v-model="form.type" :placeholder="$t('请选择')" clearable>
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('默认佣金')">
          <el-input v-model="form.value" class="input-sty"></el-input>&nbsp;
          <span v-if="form.type === 1">%/{{ $t('单') }}</span>
          <span v-if="form.type === 2">¥/{{ $t('单') }}</span>
          <span v-if="form.type === 3">¥/KG</span>
        </el-form-item>
        <el-form-item :label="$t('模版名称')">
          <el-input v-model="form.name" class="input-sty"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.mode">{{
            $t('按比例计佣时仅计算实际运费佣金不包含增值费用保险费用抵用券等）')
          }}</el-checkbox>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <!-- 用户名 -->
        <el-table-column prop="name" :label="$t('线路名称')"> </el-table-column>
        <!-- 姓名 -->
        <el-table-column :label="$t('分成方式')">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" :placeholder="$t('请选择')" clearable>
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 值 -->
        <el-table-column :label="`${$t('值')}(${$t('比例%/金额￥/单位金额￥')})`">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="close">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm(form, tableData)">{{ $t('确定') }}</el-button>
      </div>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </el-dialog>
  </div>
</template>
<script>
// import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
// import dialog from '@/components/dialog'
import { pagination } from '@/mixin'
export default {
  name: 'rulesList',
  components: {
    // SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      rulesList: [],
      tableLoading: false,
      deleteNum: [],
      trackDialog: false,
      tableData: [
        {
          type: '',
          value: ''
        }
      ],
      details: [],
      sn: '',
      trackId: '',
      linesId: '',
      lineName: '',
      status: 1,
      lineDialog: false,
      localization: {},
      withdrawVisible: false,
      form: {
        name: '',
        mode: '',
        type: '',
        value: ''
      },
      setId: '',
      options: [
        {
          id: 1,
          name: this.$t('按比例提成')
        },
        {
          id: 2,
          name: this.$t('按固定金额提成')
        },
        {
          id: 3,
          name: this.$t('按计费重量计佣设置每单位重量佣金')
        }
      ]
    }
  },
  created() {
    this.getRules()
  },
  methods: {
    getRules() {
      this.tableLoading = true
      this.$request
        .agentTemplate({
          // keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.rulesList = res.data
            this.localization = res.localization
            // this.page_params.page = res.meta.current_page
            // this.page_params.total = res.meta.total
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    // 添加计佣方式
    addCommission() {
      // this.withdrawVisible = true
      // this.getList()
      this.$router.push({ name: 'agentTemplateAdd' })
      // this.$request.commissionData(0, {
      //   page: this.page_params.page,
      //   size: this.page_params.size
      // }).then(res => {
      //   if (res.ret) {
      //     this.tableData = res.data
      //     this.page_params.page = res.meta.current_page
      //     this.page_params.total = res.meta.total
      //   }
      // })
    },
    // 编辑 计佣方式
    editCommission(id) {
      // this.setId = id
      // this.withdrawVisible = true
      // this.getList()
      // this.getWithdraw()
      this.$router.push({ name: 'agentTemplateEdit', params: { id: id } })
    },
    // 获取列表数据
    getList() {
      console.log(this.setId, 'this.setId')
      this.$request
        .commissionData(`${this.setId ? this.setId : 0}`, {
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    // 获取模版数据
    getWithdraw() {
      console.log('我是form')
      this.$request.commissionSet(this.setId).then(res => {
        if (res.ret) {
          this.form.name = res.data.name
          this.form.type = res.data.type
          this.form.mode = Boolean(res.data.mode)
          this.form.value = res.data.value
        }
      })
    },
    clear() {
      this.setId = ''
      this.form.name = ''
      this.form.mode = ''
      this.form.type = ''
      this.form.value = ''
    },
    close() {
      this.withdrawVisible = false
    },
    confirm(form, tableData) {
      let arr = tableData.map(item => {
        return {
          express_line_id: item.express_line_id,
          type: item.type,
          value: item.value
        }
      })
      if (this.setId) {
        this.$request
          .commissionUpdate(
            {
              name: this.form.name,
              value: this.form.value,
              type: this.form.type,
              mode: Number(this.form.mode),
              rules: arr
            },
            this.setId
          )
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.withdrawVisible = false
              this.getRules()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            // this.withdrawVisible = false
          })
      } else {
        this.$request
          .commissionAdd({
            name: this.form.name,
            value: this.form.value,
            type: this.form.type,
            mode: Number(this.form.mode),
            rules: arr
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('操作成功'),
                message: res.msg
              })
              this.withdrawVisible = false
              this.getRules()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            // this.withdrawVisible = false
          })
      }
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteSelf(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.commissionDelete(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRules()
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
    // 新增行
    addRow() {
      console.log(this.details, 'this.details')
      this.details.push({
        created_at: '',
        content: ''
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    getTrack() {
      this.$request.getTracking(this.trackId).then(res => {
        if (res.ret) {
          this.details = res.data
        }
      })
    },
    // 轨迹
    addTrack() {
      this.$request
        .updateTracking(this.trackId, {
          details: this.details
        })
        .then(res => {
          if (res.ret) {
            this.trackDialog = false
            this.getRules()
          }
        })
    }
  }
}
</script>
<style lang="scss" scope>
.agent-template-container {
  .select-box {
    overflow: hidden;
  }
  .country-box {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .add-btn-container {
    margin-left: 10px;
  }
  .icon-sty {
    cursor: pointer;
    // padding-left: 20px;
    font-weight: 700;
    color: black;
  }
  .add-row {
    margin-bottom: 10px;
    text-align: right;
  }
  .check-sty {
    cursor: pointer;
  }
  .self-sty {
    margin-bottom: 20px;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
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
  .input-sty {
    width: 40%;
  }
  .select-sty {
    width: 41%;
  }
}
</style>
