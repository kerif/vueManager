<template>
  <div class="icon-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
    </div>
    <div class="select-box">
      <add-btn @click.native="addIcon">{{ $t('添加icon') }}</add-btn>
    </div>
    <el-table
      :data="iconList"
      stripe
      border
      class="data-list"
      v-loading="tableLoading"
      @selection-change="selectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <el-table-column :label="$t('名称')" prop="name"></el-table-column>
      <el-table-column :label="$t('图标')">
        <template slot-scope="scope">
          <div
            class="img-style"
            @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${scope.row.icon}`), (imgVisible = true)"
          >
            <img :src="`${$baseUrl.IMAGE_URL}${scope.row.icon}`" style="width: 100px" />
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_default === 1">{{ $t('默认') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.is_default === 0"
            class="btn-green"
            @click="setDefault(scope.row.id)"
            >{{ $t('设为默认') }}</el-button
          >
          <el-button class="btn-deep-blue" @click="editIcon(scope.row.id)">{{
            $t('编辑')
          }}</el-button>
          <el-button class="btn-light-red" @click="deleteIcon(scope.row.id)">{{
            $t('删除')
          }}</el-button>
        </template>
      </el-table-column>
      <!-- <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">删除</el-button>
        </div>
      </template> -->
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
export default {
  name: 'iconList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn
  },
  mixins: [pagination],
  data() {
    return {
      iconList: [],
      tableLoading: false,
      deleteNum: [],
      imgVisible: false,
      imgSrc: ''
    }
  },
  created() {
    this.getList()
    localStorage.setItem('add', '')
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .iconLines({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.iconList = res.data
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
    // 跳转至添加icon
    addIcon() {
      dialog({ type: 'addIcon', state: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑icon
    editIcon(id) {
      dialog({ type: 'addIcon', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    // 设置为默认
    setDefault(id) {
      this.$request.asDefault(id).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.getList()
          this.$router.go(-1)
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
    editWarehouse(id) {
      this.$router.push({
        name: 'warehouseEdit',
        params: {
          id: id
        }
      })
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
      console.log(this.deleteNum, 'this.deleteNum')
    },
    // 删除单条转账支付
    deleteIcon(id) {
      this.$confirm(this.$t('您真的要删除此路线吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteIcon(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
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
  }
}
</script>
<style lang="scss">
.icon-container {
  .select-box {
    overflow: hidden;
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .img-style {
    cursor: pointer;
    width: 80px;
    text-align: center;
  }
}
</style>
