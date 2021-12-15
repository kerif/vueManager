<template>
  <div class="delivery-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div style="width: 100px; height: 100px"></div>
        </el-col>
        <el-col :span="18">
          <el-row>{{ $t('名称') }}</el-row>
          <el-row>{{ $t('网址') }}</el-row>
          <el-row>{{ $t('电话') }}</el-row>
        </el-col>
      </el-row>
    </div>
    <el-button @click="addRule" style="background-color: #3540a5; color: #fff">{{
      $t('新增')
    }}</el-button>
    <el-table :data="ruleData" border style="width: 80%; margin-top: 10px">
      <el-table-column type="index" width="180"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row.id)">{{ $t('修改') }}</el-button>
          <el-button @click="del(scope.row.id)">{{ $t('删除') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" :label="$t('规则名称')"> </el-table-column>
      <el-table-column prop="date" :label="$t('关键词')"> </el-table-column>
      <el-table-column prop="name" :label="$t('行为')"> </el-table-column>
      <el-table-column prop="address" :label="$t('结果')"> </el-table-column>
    </el-table>
    <set-rule :show="show" @passVal="passVal" :id="id" :state="state"></set-rule>
  </div>
</template>

<script>
import setRule from './components/setRule'
export default {
  data() {
    return {
      ruleData: [],
      show: false,
      id: '',
      state: ''
    }
  },
  components: {
    setRule
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // this.id = this.$route.query.id
      // console.log(this.id)
      // this.$request.deliveryCompanyList(this.$route.query.id).then(res => {
      //   if (res.ret) {
      //     this.ruleData = res.data
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      // })
    },
    passVal() {
      this.show = false
    },
    addRule() {
      this.show = true
      this.state = 'add'
    },
    edit() {
      this.show = true
      this.state = 'edit'
    },
    del() {}
  }
}
</script>

<style lang="scss">
.delivery-container {
  font-size: 14px;
}
</style>
