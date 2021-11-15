<template>
  <div class="systemInfo-container">
    <el-select
      v-model="message"
      :placeholder="$t('全部')"
      @change="changeVal"
      :clearable="true"
      :disabled="disabled"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <div class="header-search">
      <el-input v-model="keywords" :placeholder="$t('请输入关键词')" @keyup.enter.native="goSearch">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
      </el-input>
    </div>
    <el-table
      :data="messageData"
      ref="table"
      border
      style="width: 100%; margin-top: 10px; height: calc(100vh - 275px)"
    >
      <el-table-column :label="$t('标题')" prop="title">
        <template slot-scope="scope">
          <span v-if="scope.row.is_read === 0" class="el-icon-message message-icon">{{
            scope.row.title
          }}</span>
          <span v-else class="el-icon-postcard postcard-icon">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name" :label="$t('内容')" width="180"> </el-table-column> -->
      <el-table-column prop="creator" :label="$t('发件人')"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('时间')"> </el-table-column>
      <el-table-column prop="address" :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            @click="edit(scope.row.id)"
            size="mini"
            style="background: #3540a5; color: #fff"
            >{{ $t('查看') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <div v-html="content"></div>
    </el-dialog>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  name: 'systemInfo',
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      message: '',
      keywords: '',
      dialogVisible: false,
      messageData: [],
      title: '',
      content: '',
      is_read: null,
      disabled: false,
      localization: {},
      options: [
        {
          value: '0',
          label: '未读'
        },
        {
          value: '1',
          label: '已读'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        keyword: this.keywords,
        page: this.page_params.page,
        size: this.page_params.size
      }
      this.$request
        .messageList(params)
        .then(res => {
          if (res.ret) {
            console.log(res)
            this.messageData = res.data
            this.localization = res.localization
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    goSearch() {
      this.getList()
    },
    edit(id) {
      this.dialogVisible = true
      this.$request.messageDetail(id).then(res => {
        this.title = res.data.title
        this.content = res.data.content
      })
    },
    changeVal(val) {
      console.log(val)
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.systemInfo-container {
  // background-color: #fff !important;
  .header-search {
    float: right;
    width: 200px;
  }
  .message-icon {
    cursor: pointer;
  }
  .postcard-icon {
    cursor: pointer;
  }
  .el-table tr th.is-leaf {
    border-bottom: 1px #ecedf0 solid;
    background-color: #fff;
  }
  .el-table th > .cell {
    text-align: center;
  }
  .el-table .cell {
    text-align: center;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }
}
</style>
