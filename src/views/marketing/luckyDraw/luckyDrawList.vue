<template>
  <div class="luckyDrawContainer">
    <div class="search">
      <el-form
        ref="form"
        :model="searchForm"
        label-width="80px"
        style="display: flex; justify-content: space-between"
        size="small"
      >
        <div>
          <el-button type="primary" size="small" @click="addLuckyDraw" icon="el-icon-plus">{{
            $t('新增抽奖活动')
          }}</el-button>
        </div>
        <div class="search-form">
          <el-form-item :label="$t('活动名称')" style="margin-right: 10px">
            <el-input v-model="searchForm.name" :placeholder="$t('请输入活动名称')"></el-input>
          </el-form-item>
          <div>
            <el-button type="primary" size="small" @click="search">{{ $t('搜索') }}</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="luckyDrawList"
        style="width: 100%"
        :border="true"
        v-loading="loadingData.getLuckyDraw"
        height="calc(100vh - 280px)"
      >
        <el-table-column prop="name" label="活动名称"> </el-table-column>
        <el-table-column label="活动时间">
          <template slot-scope="scope">
            <p>{{ scope.row.start_time }} - {{ scope.row.end_time }}</p>
          </template>
        </el-table-column>
        <el-table-column label="抽奖时间">
          <template slot-scope="scope">
            <p>{{ scope.row.draw_start_time }} - {{ scope.row.draw_end_time }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="活动状态" width="180px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="warning">{{
              scope.row.status_text
            }}</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">{{
              scope.row.status_text
            }}</el-tag>
            <el-tag v-if="scope.row.status === 3" type="info">{{ scope.row.status_text }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              class="btn-main detailsBtn"
              size="small"
              @click="editActivity(scope.row.id)"
              >{{ $t('编辑') }}</el-button
            >
            <el-button
              class="btn-light-red detailsBtn"
              size="small"
              v-if="scope.row.status === 1"
              @click="deleteActivity(scope.row.id)"
              >{{ $t('删除') }}</el-button
            >
            <el-button
              class="btn-dark-green detailsBtn"
              size="small"
              @click="showDetail(scope.row)"
              >{{ $t('详情') }}</el-button
            >
            <el-button
              class="btn-light-red detailsBtn"
              size="small"
              @click="updateStatus(scope.row.id, 2)"
              v-if="scope.row.status === 1"
            >{{ $t('开始活动') }}</el-button
            >
            <el-button
              class="btn-light-red detailsBtn"
              size="small"
              @click="updateStatus(scope.row.id, 3)"
              v-if="scope.row.status === 2"
            >{{ $t('结束活动') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <nle-pagination
        style="margin-top: 5px"
        :pageParams="searchForm"
        :notNeedInitQuery="false"
      ></nle-pagination>
    </div>
    <lucky-draw-record
      v-model="visibleData.lucKyDrawRecords"
      :lucky-draw="activeRow"
    ></lucky-draw-record>
  </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import LuckyDrawRecord from './luckyDrawRecord.vue'
export default {
  name: 'luckyDrawList',
  components: {
    NlePagination,
    LuckyDrawRecord
  },
  data() {
    return {
      searchForm: {
        name: '',
        page: 1,
        size: 10,
        total: 0,
        handleCurrentChange: this.pageChange,
        handleQueryChange: this.resetPageSize
      },
      luckyDrawList: [],
      loadingData: {
        getLuckyDraw: false
      },
      visibleData: {
        lucKyDrawRecords: false
      },
      activeRow: null
    }
  },
  created() {
    this.search()
  },
  methods: {
    addLuckyDraw() {
      this.$router.push({
        name: 'addLuckDraw',
        params: {
          id: 0
        }
      })
    },
    getLuckDrawList() {
      const params = {
        name: this.searchForm.name,
        page: this.searchForm.page,
        page_size: this.searchForm.size
      }
      this.loadingData.getLuckyDraw = true
      this.$request.getLuckyDrawList(params).then(res => {
        this.loadingData.getLuckyDraw = false
        this.luckyDrawList = res.data
        this.searchForm.total = res.meta.total
      })
    },
    editActivity(id) {
      this.$router.push({
        name: 'addLuckDraw',
        params: {
          id: id
        }
      })
    },
    deleteActivity(id) {
      this.$request.deleteLuckyDraw({ ids: [id] }).then(res => {
        if (res.ret === 1) {
          this.$message.success('删除成功')
          setTimeout(() => {
            this.reload()
          }, 500)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateStatus(id, status) {
      let params = { status }
      this.$request.updateLuckyDraw(id, params)
      .then(res => {
        if (res.ret === 1) {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.reload()
          }, 500)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showDetail(row) {
      this.activeRow = row
      this.visibleData.lucKyDrawRecords = true
    },
    search() {
      this.searchForm.page = 1
      this.getLuckDrawList()
    },
    reload() {
      this.getLuckDrawList()
    },
    pageChange(page) {
      this.searchForm.page = page
      this.getLuckDrawList()
    },
    resetPageSize(name, size) {
      this.searchForm[name] = size
      this.getLuckDrawList()
    }
  }
}
</script>

<style scoped lang="scss">
.luckyDrawContainer {
  padding: 0 15px 15px 15px;
  background-color: #fff;
  .search {
    padding-top: 15px;
    .search-form {
      display: flex;
    }
  }
}
</style>
