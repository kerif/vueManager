<template>
  <div class="warehouse-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch">
      </search-group>
      </div>
    <div class="select-box">
      <add-btn router="warehouseAdd">添加仓库</add-btn>
    </div>
    <el-table :data="vipGroupList" stripe border class="data-list"
    v-loading="tableLoading"
    @selection-change="selectionChange">
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="仓库名字" prop="warehouse_name"></el-table-column>
      <el-table-column label="收件人姓名" prop="receiver_name"></el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <el-table-column label="邮编" prop="postcode"></el-table-column>
      <el-table-column label="地址" prop="address"></el-table-column>
      <el-table-column label="支持国家">
        <template slot-scope="scope">
          <div class="country-box" :title="scope.row.countries">
          <!-- <span v-for="item in scope.row.support_countries" :key="item.id">
            {{item.cn_name}}
          </span> -->
          {{scope.row.countries}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="editWarehouse(scope.row.id)">修改仓库</el-button>
          <el-button class="btn-deep-purple" @click="positionAdd(scope.row.id, scope.row.warehouse_name)">仓位管理</el-button>
          <el-button class="btn-light-red" @click="deleteWarehouse(scope.row.id)">删除</el-button>
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
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
export default {
  name: 'vipGroupList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data () {
    return {
      vipGroupList: [],
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
      this.$request.getWarehouseAddress({
        keyword: this.page_params.keyword,
        page: this.page_params.page,
        size: this.page_params.size
      }).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.vipGroupList = res.data.map(item => {
            let arr = item.support_countries.map(item => item.cn_name)
            return {
              ...item,
              countries: arr.join(' ')
            }
          })
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
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
    // 仓位管理
    positionAdd (id, warehouseName) {
      this.$router.push({ name: 'position',
        params: {
          id: id,
          warehouseName: warehouseName
        } }
      )
    },
    selectionChange (selection) {
      this.deleteNum = selection.map(item => (item.id))
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteWarehouse (id) {
      this.$confirm(`您真的要删除此仓库吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteWarehouseAddress(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: '操作失败',
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
.warehouse-container {
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
