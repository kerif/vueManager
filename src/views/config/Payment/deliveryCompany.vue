<template>
  <div class="delivery-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="4">
          <div style="width: 100px; height: 100px">
            <span
              style="cursor: pointer"
              v-if="this.$route.params.logo"
              @click.stop=";(imgSrc = this.$route.params.logo), (imgVisible = true)"
            >
              <img :src="this.$route.params.logo" style="width: 70px; height: 80px" />
            </span>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px">{{ $t('名称') }}:{{ this.$route.params.name }}</div>
          <div style="padding: 10px">{{ $t('网址') }}:{{ this.$route.params.website }}</div>
          <div style="padding: 10px">{{ $t('电话') }}:{{ this.$route.params.contactPhone }}</div>
        </el-col>
      </el-row>
    </div>
    <el-button @click="addRule" style="background-color: #3540a5; color: #fff">{{
      $t('新增')
    }}</el-button>
    <el-table :data="ruleData" border style="width: 80%; margin-top: 10px">
      <el-table-column type="index"> </el-table-column>
      <el-table-column :label="$t('操作')" width="180">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="edit(scope.row.id)">{{ $t('修改') }}</el-button>
          <el-button class="btn-light-red" @click="del(scope.row.id)">{{ $t('删除') }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('规则名称')"> </el-table-column>
      <el-table-column :label="$t('关键词')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.rules" :key="item.index">{{ item.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="action" :label="$t('行为')"> </el-table-column>
      <el-table-column prop="replace" :label="$t('结果')"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleData: [],
      show: false,
      id: '',
      state: '',
      imgSrc: '',
      imgVisible: false
    }
  },
  components: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.id = this.$route.query.id
      console.log(this.id)
      this.$request.deliveryCompanyList(this.$route.query.id).then(res => {
        if (res.ret) {
          this.ruleData = res.data
          console.log(this.ruleData)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    addRule() {
      dialog(
        {
          type: 'setRules',
          state: 'add',
          id: this.id
        },
        () => {
          this.getList()
        }
      )
    },
    edit(id) {
      dialog(
        {
          type: 'setRules',
          state: 'edit',
          ids: id
        },
        () => {
          this.getList()
        }
      )
    },
    del(id) {
      this.$confirm(this.$t('您真的要删除此规则'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deliveryCompanyDel(id).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('操作成功'),
              message: res.msg
            })
            this.getList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.delivery-container {
  font-size: 14px;
  .el-table tr th.is-leaf div {
    text-align: center;
  }
  .el-table td div {
    text-align: center;
  }
}
</style>
