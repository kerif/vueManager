<template>
  <div class="systemInfo-container">
    <el-select v-model="message" :placeholder="$t('全部')">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <div class="header-search">
      <el-input v-model="keyword" :placeholder="$t('请输入关键词')">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
      </el-input>
    </div>
    <el-table :data="messageData" border style="width: 100%; margin-top: 10px">
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
    <el-dialog :title="$t('标题')" :visible.sync="dialogVisible" width="30%"> </el-dialog>
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
      messageData: [],
      options: [
        {
          value: '选项1',
          label: '未读'
        },
        {
          value: '选项2',
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
      this.$request.messageList().then(res => {
        console.log(res)
        this.messageData = res.data
      })
    },
    goSearch() {
      this.getList()
    },
    edit(id) {
      console.log(id)
      this.dialogVisible = true
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
