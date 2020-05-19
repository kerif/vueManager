<template>
  <div class="position-container">
    <!-- <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div> -->
    <div class="select-box">
      <add-btn @click.native="addLocation">{{$t('新增货位')}}</add-btn>
    </div>
    <el-table :data="positionList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
       <el-table-column :label="$t('区域编号')" prop="number"></el-table-column>
      <el-table-column :label="$t('列数')" prop="column"></el-table-column>
      <el-table-column :label="$t('层数')" prop="row"></el-table-column>
      <el-table-column :label="$t('货位数量')" prop="counts"></el-table-column>
      <el-table-column :label="$t('操作')" width="200">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editLocation(scope.row.id)">{{$t('修改货位')}}</el-button>
          <el-button class="btn-light-red" @click="deleteWarehouse(scope.row.id)">{{$t('删除')}}</el-button>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
  </div>
</template>
<script>
// import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'positionList',
  components: {
    // SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      positionList: [],
      tableLoading: false,
      deleteNum: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      this.$request.locationArea(this.$route.params.id, {
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.positionList = res.data
          // this.positionList = res.data.map(item => {
          //   let arr = item.support_countries.map(item => item.cn_name)
          //   return {
          //     ...item,
          //     countries: arr.join(' ')
          //   }
          // })
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 修改仓库
    editWarehouse (id) {
      this.$router.push({ name: 'warehouseEdit',
        params: {
          id: id
        } }
      )
    },
    // 新增货位
    addLocation () {
      dialog({ type: 'locationList',
        state: 'add',
        id: this.$route.params.id,
        warehouseName: this.$route.params.warehouseName }, () => {
        this.getList()
      })
    },
    // 编辑货位
    editLocation (areaId) {
      dialog({ type: 'locationList',
        state: 'edit',
        id: this.$route.params.id,
        areaId: areaId,
        warehouseName: this.$route.params.warehouseName }, () => {
        this.getList()
      })
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteWarehouse (areaId) {
      this.$confirm(this.$t('您真的要删除此货位吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteLocation(this.$route.params.id, areaId).then(res => {
          if (res.ret) {
            this.$notify({
              title: '',
              message: res.msg,
              type: 'success'
            })
            this.getList()
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
    // // 删除
    // deleteData () {
    //   console.log(this.deleteNum, 'this.deleteNum')
    //   if (!this.deleteNum || !this.deleteNum.length) {
    //     return this.$message.error('请选择仓库')
    //   }
    //   this.$confirm(`是否确认删除？`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.$request.deleteWarehouseAddress({
    //       DELETE: this.deleteNum
    //     }).then(res => {
    //       if (res.ret) {
    //         this.$notify({
    //           title: '操作成功',
    //           message: res.msg,
    //           type: 'success'
    //         })
    //         this.getList()
    //       } else {
    //         this.$message({
    //           message: res.msg,
    //           type: 'error'
    //         })
    //       }
    //     })
    //   })
    // }
  }
}
</script>
<style lang="scss">
.position-container {
  .select-box {
    overflow: hidden;
  }
  .country-box {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .add-btn-container {
    margin-left: 10px;
  }
}
</style>
