<template>
  <div class="delivery-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">
          <div style="width: 100px; height: 100px; padding: 10px 0">
            <span
              style="cursor: pointer"
              v-if="this.info.logo"
              @click.stop=";(imgSrc = this.info.logo), (imgVisible = true)"
            >
              <img :src="this.info.logo" style="width: 70px; height: 80px" />
            </span>
          </div>
        </el-col>
        <el-col :span="19">
          <div style="padding: 10px 5px">{{ $t('名称') }}:{{ name }}</div>
          <div style="padding: 10px 5px">{{ $t('网址') }}:{{ info.website }}</div>
          <div style="padding: 10px 5px">{{ $t('电话') }}:{{ info.contactPhone }}</div>
        </el-col>
      </el-row>
    </div>
    <div class="add-row">
      <el-button @click="addRule" class="btn-deep-purple">{{ $t('新增') }}</el-button>
    </div>
    <el-table :data="ruleData" border style="width: 100%; margin-top: 10px">
      <el-table-column type="index" :label="$t('#')"> </el-table-column>
      <el-table-column prop="name" :label="$t('规则名称')"> </el-table-column>
      <el-table-column :label="$t('关键词')">
        <template slot-scope="scope">
          <span v-for="item in scope.row.rules" :key="item.index">{{ item.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('行为')">
        <template slot-scope="scope">
          <span v-if="scope.row.action === 0">{{ $t('替换') }}</span>
          <span v-if="scope.row.action === 1">{{ $t('隐藏') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replace" :label="$t('结果')"> </el-table-column>
      <el-table-column :label="$t('操作')" width="180">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="edit(scope.row.id)">{{ $t('修改') }}</el-button>
          <el-button class="btn-light-red" @click="del(scope.row.id)">{{ $t('删除') }}</el-button>
        </template>
      </el-table-column>
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
      name: '',
      logo: '',
      contactPhone: '',
      website: '',
      imgSrc: '',
      imgVisible: false,
      info: {}
    }
  },
  components: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.id = this.$route.params.id
      this.name = this.$route.params.name
      this.info = JSON.parse(this.$route.query.info)
      this.$request.deliveryCompanyList(this.$route.params.id).then(res => {
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
  background-color: #fff !important;
  .el-table tr th.is-leaf div {
    text-align: center;
  }
  .el-table td div {
    text-align: center;
  }
  .add-row {
    margin-bottom: 10px;
    float: right;
  }
}
</style>
