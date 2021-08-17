<template>
  <div class="agency-list-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部')" name="first">
        <dropdown></dropdown>
        <All :allData="all" @subprice="fn" />
      </el-tab-pane>
      <el-tab-pane :label="$t('待审核')" name="second">
        <dropdown></dropdown>
        <All :allData="resultData" @subprice="fn" />
      </el-tab-pane>
      <el-tab-pane :label="$t('已审核')" name="third">
        <dropdown></dropdown>
        <All :allData="passData" @subprice="fn" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import All from './table.vue'
import dropdown from './dropdown.vue'
export default {
  data() {
    return {
      activeName: 'first',
      all: [],
      resultData: [],
      passData: [],
      value: ''
    }
  },
  components: {
    All,
    dropdown
  },
  created() {
    this.getAllData()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    editSettled(id) {
      this.$router.push({
        name: 'agencyCommission',
        params: {
          id: id
        }
      })
    },
    getAllData() {
      this.$request.PendingReview().then(res => {
        console.log(res)
        if (res.ret) {
          this.all = res.data
          this.resultData = this.all.filter(item => item.status_name === '待审核')
          console.log(this.resultData)
          this.passData = this.all.filter(
            item => item.status_name === '审核通过' || item.status_name === '审核拒绝'
          )
          console.log(this.passData)
        }
      })
    },
    fn(id) {
      console.log(id)
      this.$router.push({
        name: 'viewDetails',
        params: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.agency-list-container {
  background-color: white;
  .headline {
    margin-top: 20px;
    .searchBtn {
      width: 120px;
    }
    .unsettled {
      width: 120px;
    }
  }
}
</style>
