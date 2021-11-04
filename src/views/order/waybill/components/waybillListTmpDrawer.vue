<template>
  <el-drawer
    :title="$t('导出订单详情')"
    :visible.sync="showTmpDrawer"
    class="exportTmp-container"
    :before-close="close"
    @opened="open()"
  >
    <div style="margin: 20px">
      <el-button @click="addTmp">{{ $t('新增模板') }}</el-button>
      <el-button>{{ $t('确定导出') }}</el-button>
    </div>
    <el-row style="background: #ccc; margin: 20px; padding: 10px" :gutter="20">
      <el-col>
        <div style="height: 180px">
          <el-col>
            <div>模板名称</div>
          </el-col>
          <el-row>
            <el-col :span="20"
              ><div style="margin-top: 20px; padding: 10px">
                模板名称模板名称模板名称模板名称模板名称模板名称模板名称
              </div></el-col
            >
            <el-col :span="4">
              <div style="margin-top: 10px">
                <el-button @click="editTmp">编辑</el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="deleteTmpDrawer">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="background: #ccc; margin: 20px; padding: 10px" :gutter="20">
      <el-col>
        <div style="height: 180px">
          <el-col>
            <div>模板名称</div>
          </el-col>
          <el-row>
            <el-col :span="20"
              ><div style="margin-top: 20px; padding: 10px">
                模板名称模板名称模板名称模板名称模板名称模板名称模板名称
              </div></el-col
            >
            <el-col :span="4">
              <div style="margin-top: 10px">
                <el-button @click="editTmpDrawer = true">编辑</el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="deleteTmpDrawer">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="background: #ccc; margin: 20px; padding: 10px" :gutter="20">
      <el-col>
        <div style="height: 180px">
          <el-col>
            <div>模板名称</div>
          </el-col>
          <el-row>
            <el-col :span="20"
              ><div style="margin-top: 20px; padding: 10px">
                模板名称模板名称模板名称模板名称模板名称模板名称模板名称
              </div></el-col
            >
            <el-col :span="4">
              <div style="margin-top: 10px">
                <el-button @click="editTmpDrawer = true">编辑</el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="deleteTmpDrawer">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="background: #ccc; margin: 20px; padding: 10px" :gutter="20">
      <el-col>
        <div style="height: 180px">
          <el-col>
            <div>模板名称</div>
          </el-col>
          <el-row>
            <el-col :span="20"
              ><div style="margin-top: 20px; padding: 10px">
                模板名称模板名称模板名称模板名称模板名称模板名称模板名称
              </div></el-col
            >
            <el-col :span="4">
              <div style="margin-top: 10px">
                <el-button @click="editTmpDrawer = true">编辑</el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="deleteTmpDrawer">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="background: #ccc; margin: 20px; padding: 10px" :gutter="20">
      <el-col>
        <div style="height: 180px">
          <el-col>
            <div>模板名称</div>
          </el-col>
          <el-row>
            <el-col :span="20"
              ><div style="margin-top: 20px; padding: 10px">
                模板名称模板名称模板名称模板名称模板名称模板名称模板名称
              </div></el-col
            >
            <el-col :span="4">
              <div style="margin-top: 10px">
                <el-button @click="editTmpDrawer = true">编辑</el-button>
              </div>
              <div style="margin-top: 20px">
                <el-button @click="deleteTmpDrawer">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- <waybill-list-inner-drawer
      :editTmpDrawer="editTmpDrawer"
      @receiveInner="receiveInner"
      :append-to-body="true"
    ></waybill-list-inner-drawer> -->
  </el-drawer>
</template>

<script>
// import WaybillListInnerDrawer from './components/waybillListInnerDrawer'
export default {
  components: {
    // WaybillListInnerDrawer
  },
  data() {
    return {
      editTmpDrawer: false,
      activeNames: ['1'],
      order: 1,
      code: '',
      name: '',
      tmpName: '',
      tmpCode: '',
      tmpList: [],
      checkList: []
    }
  },
  props: {
    showTmpDrawer: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getCodeList()
    this.getTmpList()
    this.getTmpData()
  },
  methods: {
    close() {
      this.$emit('receiveTmp', false)
    },
    open() {},
    handleChange(val) {
      console.log(val)
    },
    addTmp() {
      this.editTmpDrawer = true
      let param = {
        // name:
        // code:
        // header:
      }
      this.$request.addTemplate(param).then(res => {
        console.log(res.data)
      })
    },
    editTmp() {
      this.editTmpDrawer = true
    },
    receiveInner() {
      this.editTmpDrawer = true
    },
    deleteTmpDrawer() {
      // this.$confirm(this.$t('您真的要删除此菜单？'), this.$t('提示'), {
      //   confirmButtonText: this.$t('确定'),
      //   cancelButtonText: this.$t('取消'),
      //   type: 'warning'
      // }).then(() => {
      //   this.$request.deleteTemplate().then(res => {
      //     if (res.ret) {
      //       this.$notify({
      //         title: this.$t('操作成功'),
      //         message: res.msg,
      //         type: 'success'
      //       })
      //     } else {
      //       this.$notify({
      //         title: this.$t('操作失败'),
      //         message: res.msg,
      //         type: 'warning'
      //       })
      //     }
      //   })
      // })
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
    getTmpData() {
      let param = {
        code: this.tmpCode
      }
      this.$request.getListTemplate(param).then(res => {
        console.log(res)
      })
    },
    getCodeList() {
      this.$request.getCodeList().then(res => {
        this.code = res.data[0].id
        this.name = res.data[0].name
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
