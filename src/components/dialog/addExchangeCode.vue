<template>
  <el-dialog :visible.sync="show" :title="$t('兑换码管理')" @close="clear">
    <div>
      <el-button class="btn-main" @click="onAddCode">{{ $t('新增兑换码') }}</el-button>
      <span style="margin-left: 10px">{{ $t('注: 领取与使用情况, 请在该优惠券记录中查看') }}</span>
    </div>
    <el-table :data="tableData" border stripe style="margin-top: 20px">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column :label="$t('兑换码')" prop="code">
        <template slot-scope="scope">
          <div :title="$t('复制单号')" class="copy-sty" @click="copyNumber(scope.row.code)">
            <span>{{ scope.row.code }}</span
            ><i class="el-icon-copy-document"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('兑换码备注')" prop="remark"></el-table-column>
      <el-table-column :label="$t('可领取量')" prop="received_count"></el-table-column>
      <el-table-column :label="$t('使用/领取')" prop="used_count"></el-table-column>
      <el-table-column :label="$t('状态')" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">{{ $t('进行中') }}</span>
          <span v-else-if="scope.row.status === 9">{{ $t('已作废') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <el-button @click="onValid(scope.row.id)">{{ $t('作废') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 20px 0">
      <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
    <el-dialog :visible.sync="showCode" :title="$t('新增兑换码')" append-to-body @close="clearCode">
      <el-form :model="form" label-position="right" label-width="150px">
        <el-form-item :label="$t('最大可领取量')">
          <el-input v-model="form.code" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('兑换码备注')">
          <el-input type="textarea" v-model="form.remark" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item :label="$t('以上兑换码生成数量')">
          <el-input-number v-model="form.total_count" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelDialog">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data() {
    return {
      tableData: [],
      id: '',
      form: {
        code: '',
        remark: '',
        total_count: 1
      },
      showCode: false
    }
  },
  components: {
    NlePagination
  },
  mixins: [pagination],
  methods: {
    init() {
      if (this.id) {
        this.getList()
      }
    },
    getList() {
      this.$request
        .couponCodeList(this.id, {
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
    onAddCode() {
      this.showCode = true
    },
    onValid(id) {
      this.$request.cancelCouponCode(id).then(res => {
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
    confirm() {
      this.$request.addCouponCode(this.id, this.form).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.showCode = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    cancelDialog() {
      this.showCode = false
    },
    copyNumber(code) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', code)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    },
    clear() {},
    clearCode() {
      this.form.code = ''
      this.form.remark = ''
      this.form.total_count = ''
    }
  }
}
</script>

<style></style>
