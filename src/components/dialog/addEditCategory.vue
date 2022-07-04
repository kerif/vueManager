<template>
  <el-dialog :visible.sync="show" :title="$t('分类管理')" width="80%" @close="clear">
    <!-- <div style="display: flex; justify-content: flex-end">
      <el-button @click="addCategory" style="margin-bottom: 5px" type="primary">{{
        $t('新增')
      }}</el-button>
    </div>
    <el-table :data="categoryData" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="name" :label="$t('分类')">
        <template slot-scope="scope">
          <el-input v-if="scope.row.editState" v-model="scope.row.name"></el-input>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-main" v-if="!scope.row.editState" @click="onEdit(scope.row)">{{
            $t('编辑')
          }}</el-button>
          <el-button class="btn-main" v-if="scope.row.editState" @click="onAddEdit(scope.row)">{{
            $t('保存')
          }}</el-button>
          <el-button class="btn-light-red" @click="onDelete(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div> -->
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      categoryData: []
    }
  },
  methods: {
    // addCategory() {
    //   this.categoryData.push({
    //     name: '',
    //     editState: true
    //   })
    // },
    // onEdit(row) {
    //   row.editState = true
    // },
    // onAddEdit(row) {
    //   console.log(row)
    //   if (row.id) {
    //     row.editState = true
    //     this.$request.editChannelCategory(row.id, { name: row.name }).then(res => {
    //       if (res.ret) {
    //         this.$notify({
    //           title: this.$t('操作成功'),
    //           message: res.msg,
    //           type: 'success'
    //         })
    //         this.success()
    //       } else {
    //         this.$notify({
    //           title: this.$t('操作失败'),
    //           message: res.msg,
    //           type: 'warning'
    //         })
    //       }
    //     })
    //   } else {
    //     this.$request.addChannelCategory({ name: row.name }).then(res => {
    //       if (res.ret) {
    //         this.$notify({
    //           title: this.$t('操作成功'),
    //           message: res.msg,
    //           type: 'success'
    //         })
    //         this.success()
    //       } else {
    //         this.$notify({
    //           title: this.$t('操作失败'),
    //           message: res.msg,
    //           type: 'warning'
    //         })
    //       }
    //     })
    //   }
    // },
    // onDelete(id) {
    //   console.log(id)
    //   this.$request.delChannelCategory(id).then(res => {
    //     if (res.ret) {
    //       this.$notify({
    //         title: this.$t('操作成功'),
    //         message: res.msg,
    //         type: 'success'
    //       })
    //       this.success()
    //     } else {
    //       this.$notify({
    //         title: this.$t('操作失败'),
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
    // },
    // clear() {}
  }
}
</script>

<style></style>
