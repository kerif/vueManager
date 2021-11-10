<template>
  <el-drawer
    :title="$t('导出订单详情')"
    :visible.sync="showTmpDrawer"
    class="exportTmp-container"
    :before-close="close"
  >
    <div style="margin: 20px">
      <el-button @click="addTmp('add')">{{ $t('新增模板') }}</el-button>
      <el-button style="background-color: #87cefa; color: #fff" @click="updatePackages">{{
        $t('确定导出')
      }}</el-button>
    </div>
    <el-card
      v-for="item in tmpList"
      :key="item.id"
      style="padding: 10px; margin: 20px; background: #f5f5f5"
      :class="{ active: ind === item.id }"
      :gutter="20"
      @click.native="activeFun(item.id)"
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
                <el-button @click="editTmp('edit', item.id)" class="btn-blue-green">{{
                  $t('编辑')
                }}</el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="deleteTmpDrawer(item.id)" class="btn-light-red">{{
                  $t('删除')
                }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-card>
    <inner-drawer
      :editTmpDrawer="editTmpDrawer"
      :status="status"
      :ids="ids"
      v-if="status"
      @receiveInner="receiveInner"
      :tmpCode="tmpCode"
      @passVal="getTmpList"
    ></inner-drawer>
  </el-drawer>
</template>

<script>
import InnerDrawer from './innerDrawer'
export default {
  components: {
    InnerDrawer
  },
  data() {
    return {
      editTmpDrawer: false,
      code: '',
      name: '',
      tmpName: '',
      tmpCode: '',
      status: 'add',
      id: '',
      ids: '',
      tmpList: [],
      ind: 0,
      activeId: '',
      template_id: ''
    }
  },
  props: {
    showTmpDrawer: {
      type: Boolean,
      default: false
    },
    searchFieldData: {
      type: Object
    }
  },
  created() {
    this.getCodeList()
    this.getTmpList()
  },
  activated() {
    this.getTmpList()
  },
  methods: {
    close() {
      this.$emit('receiveTmp', false)
    },
    addTmp() {
      this.status = 'add'
      this.editTmpDrawer = true
    },
    editTmp(status, ids) {
      this.status = 'edit'
      this.ids = ids
      this.editTmpDrawer = true
    },
    receiveInner() {
      this.getTmpList()
      this.editTmpDrawer = false
    },
    activeFun(id) {
      console.log(id)
      this.ind = id
      this.activeId = id
    },
    deleteTmpDrawer(id) {
      this.$confirm(this.$t('您真的要删除此菜单？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteTemplate(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getTmpList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    getTmpList() {
      let code = this.code
      this.$request.listQuery(code).then(res => {
        console.log(res.data)
        this.tmpList = res.data
        this.tmpCode = res.data[0].code
        console.log(this.tmpCode)
      })
    },
    getCodeList() {
      this.$request.getCodeList().then(res => {
        this.code = res.data[0].id
        this.name = res.data[0].name
      })
    },
    updatePackages() {
      console.log(this.activeId)
      this.$request.ordersExport({ template_id: this.activeId }).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.exportTmp-container {
  font-size: 14px;
  .el-drawer.rtl {
    overflow: scroll;
  }
  .active {
    background: #87cefa !important;
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
