<template>
  <div>
    <el-table :data="rulesData" v-loading="tableLoading" class="data-list" border stripe>
      <el-table-column type="index"></el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('项目名称')">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">{{ $t('会员编号') }}</span>
          <span v-if="scope.row.type === 2">{{ $t('订单编号') }}</span>
          <span v-if="scope.row.type === 3">{{ $t('订单分箱号') }}</span>
          <span v-if="scope.row.type === 4">{{ $t('拼团订单编号') }}</span>
          <span v-if="scope.row.type === 5">{{ $t('发货单编号') }}</span>
          <span v-if="scope.row.type === 7">{{ $t('盘点单编号') }}</span>
          <span v-if="scope.row.type === 8">{{ $t('采购单编号') }}</span>
          <span v-if="scope.row.type === 9">{{ $t('采购分货号') }}</span>
          <span v-if="scope.row.type === 10">{{ $t('采购分货转运订单编号') }}</span>
          <span v-if="scope.row.type === 11">{{ $t('采购分货转运订单分箱号') }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column :label="$t('状态')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changeRules($event, scope.row.status, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- 示例 -->
      <el-table-column :label="$t('示例')">
        <template slot-scope="scope">
          <span
            >{{ scope.row.prefix
            }}<span v-if="scope.row.prefix !== ''"
              >{{ num }}<span v-if="scope.row.type === 3">{{ scope.row.link }}</span>
              <span v-if="scope.row.sn === 0 && scope.row.type === 3">1</span>
              <span v-if="scope.row.sn === 1 && scope.row.type === 3">a</span>
              <span v-if="scope.row.sn === 2 && scope.row.type === 3">A</span>
            </span></span
          >
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('前缀字符')">
        <template slot-scope="scope">
          <span>{{ scope.row.prefix }}</span>
        </template>
      </el-table-column> -->
      <!-- 单号长度 -->
      <!-- <el-table-column prop="length" :label="$t('单号长度')"></el-table-column> -->
      <!-- 数字增值 -->
      <!-- <el-table-column prop="system" :label="$t('数字增值')"></el-table-column> -->
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button class="btn-dark-green" @click="editRules(scope.row.id, scope.row.type)">{{
            $t('编辑')
          }}</el-button>
          <!-- 重新生成 -->
          <el-button
            class="btn-light-red delete-btn"
            @click="regenerate(scope.row.id)"
            v-if="scope.row.type === 1"
            >{{ $t('重新生成') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination> -->
  </div>
</template>

<script>
// import NlePagination from '@/components/pagination'
import dialog from '@/components/dialog'
// import { pagination } from '@/mixin'
export default {
  components: {
    // NlePagination
  },
  // mixins: [pagination],
  data() {
    return {
      page_params: {
        type: ''
      },
      tableLoading: false,
      rulesData: [],
      show: false,
      num: '0001200016'
    }
  },
  created() {
    // this.page_params.page = 1
    this.getRules()
  },
  methods: {
    getList() {
      this.getRules()
    },
    // 获取单号规则数据
    getRules() {
      this.tableLoading = true
      this.$request
        .getRules({ page: this.page_params.page, size: this.page_params.size })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.rulesData = res.data
          }
        })
    },
    // 单号规则 开启或关闭
    changeRules(event, enabled, id) {
      this.$request.changeRules(id, event).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getRules()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    editRules(id, name) {
      dialog({ type: 'rulesEdit', id: id, name: name }, () => {
        this.getRules()
      })
    },
    passVal() {
      this.show = false
    },
    regenerate() {
      this.$confirm(
        this.$t('确定要重新生成会员编号吗原来的编号将会被重置可能会部分影响到包裹订单出入库'),
        this.$t('重新生成'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      ).then(() => {
        this.$request.goResetId().then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getRules()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    }
  }
}
</script>
<style scoped></style>
