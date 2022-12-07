<template>
  <el-dialog :title="$t('客户合并')" :visible.sync="show" width="50%">
    <div v-lading="loading">
      <p>{{ $t('当前客户ID') }}</p>
      <p>{{ id }}&nbsp;---&nbsp;{{ profile.origin_name }}</p>
      <p>*{{ $t('请输入合并目标客户ID') }}</p>
      <!-- <el-input style="width: 40%" v-model="targetID"></el-input> -->
      <el-autocomplete
        :fetch-suggestions="queryCNSearch"
        @select="handleSelect"
        :placeholder="$t('请输入客户ID')"
        v-model="target"
      >
      </el-autocomplete>
    </div>
    <div style="margin-top: 40px">
      <span>{{ $t('合并规则') }}</span> <br />
      <span>1、{{ $t('合并客户ID时，保留当前客户ID下所有信息；') }}</span
      ><br />
      <span
        >2、{{
          $t(
            '合并目标客户的【余额、订单、包裹、收件地址、佣金、代理客户、交易记录、充值记录】合并至当前客户ID，其他信息清空；'
          )
        }}</span
      >
      <br />
      <span
        >3、{{
          $t(
            '目标客户ID合并后即作废，绑定的手机号、邮箱、微信也自动解除绑定，可用于重新绑定其他客户ID。'
          )
        }}</span
      >
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="mergeConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      id: 0,
      customerName: '',
      targetID: 0,
      target: '',
      groupList: [],
      saleList: [],
      customerList: [],
      profile: { origin_name: '' },
      loading: false
    }
  },
  methods: {
    init() {
      this.loading = true
      this.$request.checkVipInfo(this.id).then(res => {
        this.profile = res.data
        this.loading = false
      })
    },
    //确定合并
    mergeConfirm() {
      if (!this.target) {
        return this.$message.error(this.$t('请输入目标客户ID'))
      }
      this.targetID = this.target.split('---')[0]
      this.$request.mergeCustomer(this.id, this.targetID).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 客户id
    handleSelect(item) {
      console.log(item)
    },
    // 客户id
    queryCNSearch(queryString, callback) {
      console.log(this.target)
      var list = [{}]
      this.$request
        .Automatic({
          keyword: this.target.toString()
        })
        .then(res => {
          for (let i of res.data) {
            i.value = i.id + '---' + i.name
          }
          list = res.data
          callback && callback(list)
        })
    },
    // 获取员工数据
    getStaff() {
      this.$request.getStaff({ size: 1000 }).then(res => {
        if (res.ret) {
          this.options = res.data
          this.customerList = [...res.data]
          this.customerList.push({
            id: -1,
            name: this.$t('未选客服')
          })
          this.saleList = [...res.data]
          this.saleList.push({
            id: -1,
            name: this.$t('未选销售')
          })
        }
      })
    },
    // 搜索客户组列表
    getUserGroup() {
      this.$request.getUserGroup().then(res => {
        if (res.ret) {
          this.groupList = res.data
        }
      })
    }
  }
}
</script>
