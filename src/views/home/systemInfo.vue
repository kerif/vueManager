<template>
  <div>
    <el-select v-model="message" :placeholder="$t('全部')">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <div class="header-search">
      <el-input v-model="keyword" :placeholder="$t('请输入关键词')">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
      </el-input>
    </div>
    <el-table :data="messageData" border style="width: 100%">
      <el-table-column prop="title" :label="$t('标题')" width="180"> </el-table-column>
      <el-table-column prop="name" :label="$t('内容')" width="180"> </el-table-column>
      <el-table-column prop="creator" :label="$t('发件人')" width="180"> </el-table-column>
      <el-table-column prop="created_at" :label="$t('时间')"> </el-table-column>
      <el-table-column prop="address" :label="$t('操作')">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)">{{ $t('查看') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="$t('提示')" :visible.sync="dialogVisible" width="30%"> </el-dialog>
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
      keyword: '',
      dialogVisible: false,
      messageData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.messageList().then(res => {
        console.log(res)
        this.messageData = res.data
      })
    },
    goSearch() {
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.systemInfo-container {
  .header-search {
    float: right;
    width: 200px;
  }
  /deep/ .el-table tr th.is-leaf {
    border-bottom: 1px #ecedf0 solid;
    background-color: #fff;
  }
  /deep/ .el-table th > .cell {
    text-align: center;
  }
  /deep/ .el-table .cell {
    text-align: center;
  }
}
</style>
