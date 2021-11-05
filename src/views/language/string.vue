<template>
  <div class="string-container">
    <div class="headerList">
      <div class="select-box">
        <add-btn @click.native="addString">{{ $t('添加') }}</add-btn>
      </div>
      <search-group
        :placeholder="$t('请输入关键字')"
        v-model="page_params.keyword"
        @search="goSearch"
      ></search-group>
    </div>
    <div style="height: calc(100vh - 270px">
      <el-table
        :data="transferData"
        v-loading="tableLoading"
        class="data-list"
        border
        stripe
        height="calc(100vh - 270px)"
        ref="table"
      >
        <el-table-column type="index"></el-table-column>
        <!-- 语言 -->
        <el-table-column :label="$t('字符串')" prop="key"></el-table-column>
        <el-table-column :label="$t('分组')">
          <template slot-scope="scope">
            <span v-if="scope.row.source === 1">{{ $t('PC端') }}</span>
            <span v-if="scope.row.source === 2">{{ $t('API') }}</span>
            <span v-if="scope.row.source === 3">{{ $t('小程序') }}</span>
          </template>
        </el-table-column>
        <!-- 区域 -->
        <el-table-column :label="$t('简体中文')">
          <template slot-scope="scope">
            <span>{{ scope.row.translation && scope.row.translation.zh_CN }}</span>
          </template>
        </el-table-column>
        <!-- 是否启用 -->
        <!-- <el-table-column :label="$t('是否启用')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeEnabled($event, scope.row.enabled, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray">
          </el-switch>
        </template>
      </el-table-column> -->
        <!-- 操作 -->
        <el-table-column :label="$t('操作')" width="230">
          <template slot-scope="scope">
            <el-button class="btn-dark-green" @click="editString(scope.row.id)">{{
              $t('编辑')
            }}</el-button>
            <!-- <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">{{$t('删除')}}</el-button> -->
            <!-- 设为默认 -->
            <!-- <el-button v-if="scope.row.is_default === 0" class="btn-deep-purple" @click="setDefault(scope.row.id)">{{$t('设为默认')}}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <nle-pagination
      style="margin-top: 5px"
      :pageParams="page_params"
      :notNeedInitQuery="false"
    ></nle-pagination>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    AddBtn,
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      transferData: [
        {
          enabled: true
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取转账支付
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size
        // status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.$request.stringTranslate(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transferData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 设为默认
    setDefault(id) {
      this.$confirm(this.$t('您真的要设为默认吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.defaultLg(id).then(res => {
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
    },
    // 修改是否启用的开关
    changeEnabled(event, enabled, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.changeLg(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 增加语言
    addString() {
      dialog({ type: 'stringAddEdit', state: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑语言
    editString(id) {
      console.log(id, 'id')
      dialog({ type: 'stringAddEdit', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    // 删除语言
    deleteTransfer(id) {
      this.$confirm(this.$t('您真的要删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteLG(id).then(res => {
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
.string-container {
  .headerList {
    overflow: hidden;
    .search-group {
      width: 21.5%;
      float: right;
    }
    .select-box {
      overflow: hidden;
      float: right;
      margin-left: 10px;
    }
  }
}
</style>
