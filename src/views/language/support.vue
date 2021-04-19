<template>
  <div class="language-container">
    <div class="select-box">
      <add-btn @click.native="addTransfer">{{$t('添加语言')}}</add-btn>
    </div>
    <el-table :data="transferData" v-loading="tableLoading" class="data-list"
    border stripe>
      <el-table-column type="index"></el-table-column>
      <!-- 语言 -->
      <el-table-column :label="$t('语言')" prop="name"></el-table-column>
      <!-- 区域 -->
      <el-table-column :label="$t('语言编码')" prop="language_code"></el-table-column>
      <!-- 是否默认 -->
      <el-table-column :label="$t('是否默认')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_default === 1">{{$t('是')}}</span>
          <span v-else>{{$t('否')}}</span>
        </template>
      </el-table-column>
      <!-- 是否启用 -->
      <el-table-column :label="$t('是否启用')">
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
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="230">
        <template slot-scope="scope">
          <el-button class="btn-dark-green" @click="editTransfer(scope.row.id)">{{$t('编辑')}}</el-button>
          <el-button class="btn-light-red" @click="deleteTransfer(scope.row.id)">{{$t('删除')}}</el-button>
          <!-- 设为默认 -->
          <el-button v-if="scope.row.is_default === 0" class="btn-deep-purple" @click="setDefault(scope.row.id)">{{$t('设为默认')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  components: {
    AddBtn
  },
  data () {
    return {
      transferData: [
        {
          enabled: true
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取转账支付
    getList () {
      this.tableLoading = true
      this.$request.getLanguageList().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transferData = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 设为默认
    setDefault (id) {
      this.$confirm(this.$t('您真的要设为默认吗？'), this.$t('提示'), {
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
    changeEnabled (event, enabled, id) {
      console.log(typeof (event), '我是event')
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
    addTransfer () {
      dialog({ type: 'languageEdit', state: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑语言
    editTransfer (id) {
      console.log(id, 'id')
      dialog({ type: 'languageEdit', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    // 删除语言
    deleteTransfer (id) {
      this.$confirm(this.$t('您真的要删除吗？'), this.$t('提示'), {
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
.language-container {
  .select-box {
    overflow: hidden;
  }
}
</style>
