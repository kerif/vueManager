<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('自提点权限设置')"
    class="dialog-pick-piont"
    @close="clear"
    width="55%"
  >
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index"> </el-table-column>
      <!-- 用户名 -->
      <el-table-column prop="username" :label="$t('用户名')"> </el-table-column>
      <!-- 姓名 -->
      <el-table-column prop="name" :label="$t('姓名')"> </el-table-column>
      <!-- 邮箱 -->
      <el-table-column prop="email" :label="$t('邮箱')"> </el-table-column>
      <!-- 电话 -->
      <el-table-column prop="phone" :label="$t('电话')"> </el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column width="200" :label="$t('自提点权限')">
        <template slot-scope="scope">
          <el-select clearable multiple v-model="scope.row.stations" placeholder="请选择">
            <el-option
              v-for="item in stationData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <!-- <span v-for="item in scope.row.stations" :key="item.id">{{item.name}}</span> -->
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="editPiont">{{ $t('确定') }}</el-button>
    </div>
    <div class="pagination-box">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
  </el-dialog>
</template>
<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      tableData: [],
      stationData: [],
      pointList: []
    }
  },
  methods: {
    getList() {
      this.$request
        .getPickPoint(this.id, {
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableData = res.data.map(item => ({
            ...item,
            stations: item.stations.map(item => item.id)
          }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        })
    },
    getStations() {
      this.$request.stationList().then(res => {
        if (res.ret) {
          this.stationData = res.data
        }
      })
    },
    editPiont() {
      console.log(this.tableData, 'tableData')
      const val = this.tableData.map(item => {
        return {
          id: item.id,
          station_ids: item.stations
        }
      })
      console.log(val, 'val')
      this.$request.updateStation(val).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    },
    init() {
      this.getList()
      this.getStations()
    },
    clear() {
      this.page_params.page = 1
    }
  }
}
</script>
<style lang="scss">
.dialog-pick-piont {
  .pagination-box {
    margin-top: 10px;
  }
  .el-dialog__header {
    background-color: #0e102a;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
  .select-sty {
    width: 40% !important;
  }
}
</style>
