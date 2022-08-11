<template>
  <el-dialog :title="$t('成员')" :visible.sync="show" @close="clear">
    <el-button class="btn-main" @click="addMember">{{ $t('添加') }}</el-button>
    <el-table :data="tableData" border class="data-list">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="id" :label="$t('客户ID')"> </el-table-column>
      <el-table-column prop="name" :label="$t('客户昵称')"></el-table-column>
      <el-table-column prop="last_login_at" :label="$t('最后登录时间')"></el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button class="btn-light-red" @click="removeMember(scope.row.id)">{{
            $t('移除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 20px 0">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <el-dialog :title="$t('用户')" :visible.sync="showInner" append-to-body @close="clearInner">
      <el-form :model="form">
        <el-form-item :label="$t('用户')">
          <el-input v-model="form.user_id" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showInner = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="onSave">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  components: {
    NlePagination
  },
  mixins: [pagination],
  data() {
    return {
      tableData: [],
      id: '',
      showInner: false,
      form: {
        user_id: ''
      }
    }
  },
  methods: {
    init() {
      if (this.id) {
        this.getList()
      }
    },
    getList() {
      this.$request
        .getUserMembers(this.id, {
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          if (res.ret) {
            this.tableData = res.data
            this.page_params.page = res.meta.current_page
            this.page_params.total = res.meta.total
          }
        })
    },
    addMember() {
      this.showInner = true
    },
    removeMember() {},
    onSave() {
      this.$request.printLabel(this.id, { user_ids: this.form.user_id.split(',') }).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clearInner() {},
    clear() {
      this.id = ''
    }
  }
}
</script>

<style></style>
