<template>
  <el-drawer
    :title="$t('导出订单详情')"
    :visible.sync="showTmpDrawer"
    class="exportTmp-container"
    :before-close="close"
  >
    <div style="margin: 20px 0">
      <el-button @click="addTmp('add')" size="small" class="btn-purple">{{
        $t('新增模板')
      }}</el-button>
      <el-button size="small" type="primary" @click="updatePackages">{{
        $t('确定导出')
      }}</el-button>
    </div>
    <div
      v-for="item in tmpList"
      :key="item.id"
      :class="['template-item', { active: ind === item.id }]"
      @click="activeFun(item.id)"
    >
      <div class="template-top">
        <div class="template-name">{{ item.name }}</div>
        <div>
          <el-button @click="editTmp('edit', item.id)" class="btn-blue-green">{{
            $t('编辑')
          }}</el-button>
          <el-button @click="deleteTmpDrawer(item.id)" class="btn-light-red">{{
            $t('删除')
          }}</el-button>
        </div>
      </div>
      <div class="template-remark">{{ item.remark }}</div>
    </div>
    <inner-drawer
      :editTmpDrawer="editTmpDrawer"
      :state="state"
      :ids="ids"
      v-if="state"
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
      state: 'add',
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
    },
    activeName: {
      type: String
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
      this.state = 'add'
      this.editTmpDrawer = true
    },
    editTmp(state, ids) {
      this.state = 'edit'
      this.ids = ids
      this.editTmpDrawer = true
    },
    receiveInner() {
      this.editTmpDrawer = false
      this.getTmpList()
    },
    activeFun(id) {
      this.ind = id
      this.activeId = id
    },
    deleteTmpDrawer(id) {
      this.$confirm(this.$t('您真的要删除此模板？'), this.$t('提示'), {
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
      const searchData = this.searchFieldData
      let param = {
        ...searchData,
        status: this.activeName,
        template_id: this.activeId,
        begin_date: searchData.date ? searchData.date[0] : '',
        end_date: searchData.date ? searchData.date[1] : '',
        order_sn: searchData.order_sn.split(/[(\r\n)\r\n]+/),
        country_id:
          searchData.countryArr.length > 1
            ? searchData.countryArr[0]
            : searchData.countryArr[searchData.countryArr.length - 1]
      }
      this.$request.ordersExport(param).then(res => {
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

<style lang="scss" scoped>
.exportTmp-container {
  font-size: 14px;
  ::v-deep .el-drawer__body {
    padding: 0 20px;
    overflow-y: auto;
  }
  ::v-deep .el-drawer__header {
    font-size: 16px;
    font-weight: bold;
  }
  .active {
    border: 1px solid #3540a5 !important;
  }
  .template-item {
    cursor: pointer;
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.4s;
    border: 1px solid #eeeeee;
    border-radius: 5px;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.04);
    background: #fff;
    .template-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      .template-name {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .template-remark {
      line-height: 20px;
    }
  }
}
</style>
