<template>
  <el-drawer
    :title="$t('导出订单详情')"
    :visible.sync="showTmpDrawer"
    class="exportTmp-container"
    :before-close="close"
  >
    <div style="margin: 20px">
      <el-button @click="addTmp('add')">{{ $t('新增模板') }}</el-button>
      <el-button style="background-color: #3540a5; color: #fff" @click="updatePackages">{{
        $t('确定导出')
      }}</el-button>
    </div>
    <el-row
      v-for="item in tmpList"
      :key="item.id"
      class="tmp"
      style="padding: 10px; margin: 20px"
      :style="{ background: colorStr }"
      :gutter="20"
      @click.native="activeFun(item.id)"
      @passVal="getTmpList"
    >
      <el-col>
        <div style="height: 180px">
          <el-col>
            <div>{{ item.name }}</div>
          </el-col>
          <el-row>
            <el-col :span="20"
              ><div style="margin-top: 20px; padding: 10px">
                {{ item.remark }}
              </div></el-col
            >
            <el-col :span="4">
              <div style="margin-top: 10px">
                <el-button @click="editTmp('edit', item.id)">{{ $t('编辑') }}</el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="deleteTmpDrawer(item.id)">{{ $t('删除') }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <inner-drawer
      :editTmpDrawer="editTmpDrawer"
      :status="status"
      :ids="ids"
      @receiveInner="receiveInner"
      :tmpCode="tmpCode"
    ></inner-drawer>
  </el-drawer>
</template>

<script>
// import InnerDrawer from './innerDrawer'
// export default {
//   components: {
//     InnerDrawer
//   },
//   data() {
//     return {
//       editTmpDrawer: false,
//       code: '',
//       name: '',
//       tmpName: '',
//       tmpCode: '',
//       status: 'add',
//       id: '',
//       ids: '',
//       tmpList: [],
//       colorStr: '#ccc'
//     }
//   },
//   props: {
//     showTmpDrawer: {
//       type: Boolean,
//       default: false
//     },
//     searchFieldData: {
//       type: Object
//     }
//   },
//   created() {
//     this.getCodeList()
//     this.getTmpList()
//   },
//   methods: {
//     close() {
//       this.$emit('receiveTmp', false)
//     },
//     addTmp() {
//       this.editTmpDrawer = true
//       this.status = 'add'
//     },
//     editTmp(status, ids) {
//       this.editTmpDrawer = true
//       this.status = 'edit'
//       this.ids = ids
//     },
//     receiveInner() {
//       this.editTmpDrawer = false
//     },
//     activeFun(id) {
//       console.log(id)
//       let params = {
//         ...this.searchFieldData
//       }
//       this.tmpList.forEach(ele => {
//         console.log(ele.id)
//         console.log(id)
//         console.log(ele.id === id)
//         if (ele.id === id) {
//           this.colorStr = 'red'
//         } else {
//           this.colorStr = '#ccc'
//         }
//       })
//       this.$request.orderExport(id, params).then(res => {
//         if (res.ret) {
//           this.$notify({
//             title: this.$t('操作成功'),
//             message: res.msg,
//             type: 'success'
//           })
//         } else {
//           this.$notify({
//             title: this.$t('操作失败'),
//             message: res.msg,
//             type: 'warning'
//           })
//         }
//       })
//     },
//     deleteTmpDrawer(id) {
//       this.$confirm(this.$t('您真的要删除此菜单？'), this.$t('提示'), {
//         confirmButtonText: this.$t('确定'),
//         cancelButtonText: this.$t('取消'),
//         type: 'warning'
//       }).then(() => {
//         this.$request.deleteTemplate(id).then(res => {
//           if (res.ret) {
//             this.$notify({
//               title: this.$t('操作成功'),
//               message: res.msg,
//               type: 'success'
//             })
//           } else {
//             this.$notify({
//               title: this.$t('操作失败'),
//               message: res.msg,
//               type: 'warning'
//             })
//           }
//         })
//       })
//     },
//     getTmpList() {
//       let code = this.code
//       this.$request.listQuery(code).then(res => {
//         console.log(res.data)
//         this.tmpList = res.data
//         this.tmpCode = res.data[0].code
//         console.log(this.tmpCode)
//       })
//     },
//     getCodeList() {
//       this.$request.getCodeList().then(res => {
//         this.code = res.data[0].id
//         this.name = res.data[0].name
//       })
//     },
//     updatePackages() {}
//   }
// }
</script>

<style lang="scss">
.exportTmp-container {
  font-size: 14px;
  .el-drawer.rtl {
    overflow: scroll;
  }
  .el-row {
    margin: 20px;
    padding: 10px;
    cursor: pointer;
  }
  .el-drawer__header {
    margin-bottom: 0;
  }
  /deep/.el-form-item {
    width: 200px;
  }
  /deep/.el-input {
    width: 40% !important;
    margin-left: 50px;
  }
  /deep/.el-form-item__label {
    width: 200px !important;
  }
}
</style>
