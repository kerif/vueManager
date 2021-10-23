<template>
  <div class="customMenu-container">
    <div class="remark">
      {{ $t('*公众号菜单主菜单最多只能是三级，每级主菜单最多可以有五个子菜单栏目') }}
    </div>
    <el-button type="success" @click="addMenu" style="margin: 10px 0; background-color: #3540a5">{{
      $t('添加菜单')
    }}</el-button>
    <el-table
      :data="MenuList"
      stripe
      ref="table"
      border
      class="data-list"
      @expand-change="onExpand"
      v-loading="tableLoading"
      height="calc(100vh - 360px)"
    >
      <!-- 二级分类列表 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.subMenus">
            <!-- 二级分类名称 -->
            <el-table-column label="#" type="index"></el-table-column>
            <!-- 二级分类菜单名称 -->
            <el-table-column :label="$t('菜单名称')" prop="name"> </el-table-column>
            <!-- 二级分类菜单类型 -->
            <el-table-column :label="$t('菜单类型')" prop="type"> </el-table-column>
            <el-table-column :label="$t('操作')" width="300">
              <template>
                <!-- 修改 -->
                <el-button class="btn-dark-green btn-margin" @click="addMenu">{{
                  $t('修改')
                }}</el-button>
                <!-- 删除 -->
                <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- 一级分类列表 -->
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <!-- 一级分类菜单名称 -->
      <el-table-column :label="$t('菜单名称')" prop="name"></el-table-column>
      <!-- 一级分类菜单类型 -->
      <el-table-column :label="$t('菜单类型')" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">无</span>
          <span v-if="scope.row.type === 1">文字消息</span>
          <span v-if="scope.row.type === 2">图片消息</span>
          <span v-if="scope.row.type === 3">跳转网页</span>
          <span v-if="scope.row.type === 4">跳转小程序</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="300">
        <template slot-scope="scope">
          <!-- 添加子菜单 -->
          <el-button class="btn-dark-green btn-margin" @click="addMenu">{{
            $t('添加子菜单')
          }}</el-button>
          <!-- 修改 -->
          <el-button class="btn-main">{{ $t('修改') }}</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red btn-margin" @click="deleteMenu(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button style="background-color: #3540a5; color: #fff">{{ $t('保存并发布') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      radio: 1,
      textarea: '',
      show: false,
      baleImgList: [],
      state: '',
      ruleForm: {
        ruleName: ''
      },
      MenuList: []
    }
  },
  created() {
    this.getCustomMenuList()
  },
  methods: {
    addMenu() {
      this.show = true
    },
    getCustomMenuList() {
      this.$request.customMenuList().then(res => {
        if (res.ret) {
          console.log(res)
          this.MenuList = res.data
          // this.subMenus = res.data.map(item => item.sub_menus)
          // console.log(this.subMenus)
        }
      })
    },
    deleteMenu(id) {
      this.$confirm(this.$t('您真的要删除此菜单？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteMenu(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getCustomMenuList()
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
    onExpand() {},
    onPreview() {},
    onDeleteImg() {},
    uploadBaleImg() {},
    clear() {}
  }
}
</script>

<style lang="scss">
.customMenu-container {
  font-size: 14px;
  background-color: #fff !important;
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
  .remark {
    color: red;
  }
}
</style>
