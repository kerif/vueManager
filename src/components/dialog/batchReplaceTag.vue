<template>
  <el-dialog :visible.sync="show" :title="$t('批量替换标签')" @close="clear">
    <el-form :model="form" label-width="150px" label-position="left">
      <el-form-item :label="$t('您当前选择了客户ID')">{{ selectId }}</el-form-item>
      <el-form-item :label="$t('审核')">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">{{ $t('通过') }}</el-radio>
          <el-radio :label="2">{{ $t('拒绝') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('拒绝原因')">
        <el-input
          v-model="form.remark"
          style="width: 45%"
          type="textarea"
          :placeholder="$t('请输入拒绝原因')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('标签')">
        <el-select v-model="form.tag_ids" multiple :placeholder="$t('请选择标签')">
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-button @click="onManage" style="margin-left: 10px">{{ $t('标签管理') }}</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('保存') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      form: {
        status: 1,
        remark: '',
        tag_ids: ''
      },
      ids: [],
      tagList: [],
      selectId: ''
    }
  },
  methods: {
    init() {
      if (this.ids.length) {
        this.selectId = this.ids.join(',')
      }
      this.getList()
    },
    getList() {
      this.$request.addressTagList().then(res => {
        if (res.ret) {
          this.tagList = res.data
        }
      })
    },
    onConfirm() {
      let params = {
        ...this.form,
        ids: this.ids,
        tag_ids: this.tag_ids
      }
      this.$request.addressBatchAudit(params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onManage() {
      dialog(
        {
          type: 'tagManage'
        },
        () => {
          this.getList()
        }
      )
    },
    clear() {
      this.ids = []
      this.form.status = 1
      this.form.tag_ids = ''
      this.form.status = ''
    }
  }
}
</script>

<style></style>
