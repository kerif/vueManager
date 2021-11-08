<template>
  <div>
    <el-select v-model="message" :placeholder="$t('全部')">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-input v-model="keyword" @click="goSearch" :placeholder="$t('请输入关键词')"></el-input>
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

<style></style>
