<template>
  <el-drawer
    :visible="value"
    @close="handleClose"
    size="60%"
    :with-header="false"
  >
    <div class="luckyDrawRecordContainer">
      <el-card style="margin: 10px 0">
        <div slot="header" style="font-weight: 600">{{ activity.name }}</div>
        <div class="gift-take">
          <div class="gift-data" v-for="(item, index) in activity.gift_list" :key="index">
            <p>{{ item.gift_name }}</p>
            <p>
              总计： <span>{{ item.gift_num }}</span>.
            </p>
            <p>
              领取： <span>{{ item.gift_take_num }}</span>
            </p>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="search">
          <el-form
            ref="form"
            :model="searchForm"
            label-width="80px"
            size="small"
          >
            <div class="search-form">
              <el-form-item :label="$t('所属用户')" style="margin-right: 10px">
                <el-select v-model="searchForm.uids" style="width: 320px" filterable multiple>
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <el-button type="primary" size="small" @click="search">搜索</el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table">
          <el-table
            :data="luckyDrawRecords"
            style="width: 100%"
            :border="true"
            v-loading="loadingData.getLuckyDraw"
            height="calc(100vh - 380px)"
          >
            <el-table-column prop="userid" :label="$t('用户ID')"> </el-table-column>
            <el-table-column prop="username" :label="$t('用户名称')"> </el-table-column>
            <el-table-column prop="score" :label="$t('成长值')"> </el-table-column>
            <el-table-column prop="status_text" :label="$t('状态')">
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.status === 1">{{ scope.row.status_text }}</el-tag>
                <el-tag type="success" v-if="scope.row.status === 2">{{ scope.row.status_text }}</el-tag>
                <el-tag type="warning" v-if="scope.row.status === 3">{{ scope.row.status_text }}</el-tag>
                <el-tag type="danger" v-if="scope.row.status === -1">{{ scope.row.status_text }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="gift_name" :label="$t('奖品')"> </el-table-column>
            <el-table-column prop="draw_time" :label="$t('抽奖时间')"> </el-table-column>
            <el-table-column :label="$t('操作')">
              <template slot-scope="scope">
                <el-button type="primary" size="small" v-if="scope.row.status === 2" @click="updateStatus(scope.row.uid, 3)">{{ $t('兑换') }}</el-button>
                <el-button type="danger" size="small" v-if="scope.row.status === 1" @click="updateStatus(scope.row.uid, -1)">{{ $t('禁止抽奖') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <nle-pagination
            style="margin-top: 5px"
            :pageParams="searchForm"
            :notNeedInitQuery="false"
          ></nle-pagination>
        </div>
      </el-card>
    </div>
  </el-drawer>
</template>

<script>
import NlePagination from '@/components/pagination'
export default {
  name: 'luckyDrawRecord',
  components: {
    NlePagination
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    luckyDraw: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      searchForm: {
        uids: [],
        page: 1,
        size: 10,
        total: 0,
        handleCurrentChange: this.pageChange,
        handleQueryChange: this.resetPageSize
      },
      luckyDrawRecords: [],
      activity: {
        gift_list: []
      },
      giftTakeData: [{}, {}],
      loadingData: {
        getLuckyDrawRecords: false
      },
      userList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    addLuckyDraw() {
      this.$router.push({
        name: 'addLuckDraw'
      })
    },
    getDetail() {
      this.$request.getLuckyDrawInfo(this.luckyDraw.id, {}).then(res => {
        this.activity = res.data
      })
    },
    getLuckDrawRecords() {
      const params = {
        uids: this.searchForm.uids,
        lucky_draw_id: this.luckyDraw && this.luckyDraw.id,
        page: this.searchForm.page,
        page_size: this.searchForm.size
      }
      this.loadingData.getLuckyDrawRecords = true
      this.$request.getLuckyDrawRecords(params).then(res => {
        this.loadingData.getLuckyDrawRecords = false
        this.luckyDrawRecords = res.data
        this.searchForm.total = res.meta.total
      })
    },
    getUserList() {
      this.$request.getUsers({}).then(res => {
        this.userList = res.data
      })
    },
    search() {
      this.searchForm.page = 1
      this.getLuckDrawRecords()
    },
    reload() {
      this.getLuckDrawRecords()
    },
    pageChange(page) {
      this.searchForm.page = page
      this.getLuckDrawRecords()
    },
    resetPageSize(name, size) {
      this.searchForm[name] = size
      this.getLuckDrawRecords()
    },
    updateStatus(uid, status) {
      this.$request
        .updateLuckyDrawRecords(uid, { status, lucky_draw_id: this.activity.id })
        .then(res => {
          if (res.ret === 1) {
            this.$message.success('操作成功')
            setTimeout(() => {
              this.search()
            }, 500)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleClose() {
      this.$emit('input', false)
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getDetail()
        this.search()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.luckyDrawRecordContainer {
  padding: 0 15px 15px 15px;
  //background-color: #fff;
  .gift-take {
    display: flex;
    .gift-data {
      padding: 0 30px;
      border-right: 1px solid #cccccc;
      p {
        line-height: 12px;
      }
    }
  }
  .search {
    padding-top: 15px;
    .search-form {
      display: flex;
    }
  }
}
</style>
