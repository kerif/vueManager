<template>
  <el-dialog :title="$t('添加标签')" :visible.sync="showLabel" :before-close="close" @close="clear">
    <el-form :model="form">
      <el-form-item :label="$t('选择标签')">
        <el-select v-model="form.tag_ids" multiple clearable>
          <el-option
            v-for="item in labelData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button class="add-btn" @click="onAddLabel">{{ $t('新增标签') }}</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      form: {
        tag_ids: []
      },
      labelData: []
    }
  },
  props: {
    showLabel: {
      type: Boolean,
      default: false
    },
    deleteNum: {
      type: Array
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request.userTag().then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.labelData = res.data
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onAddLabel() {
      dialog(
        {
          type: 'editLabel'
        },
        () => {
          this.getList()
        }
      )
    },
    confirm() {
      this.$request
        .makeTag({
          user_ids: this.deleteNum,
          tag_ids: this.form.tag_ids
        })
        .then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.$emit('passVal', false)
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
    },
    close() {
      this.$emit('passVal', false)
    },
    clear() {
      this.form.tag_ids = []
    }
  }
}
</script>

<style lang="scss">
.add-btn {
  margin-left: 20px;
}
</style>
