// 带复选框的el-table需要添加的属性和事件
// @selection-change="selectionChange"
// @row-click="rowClick"
// ref="table"
export default {
  data() {
    return {
      selection: [], // 选中的数据
      format_selection: [], // 格式化后的选中数据
      void_disabled: true, // 没有元素被选中时，按钮的禁用状态
      setOnSelf_disabled: true, // 设置上架按钮禁用状态
      audit_disabled: true // 设置审核按钮禁用状态
    }
  },
  methods: {
    // 勾选复选框
    selectionChange(selection) {
      this.selection = selection
      this.void_disabled = !selection.length
    },
    // 点击行自动勾选复选框
    rowClick(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 反选
    antiSelection() {
      this.$refs.table.data.forEach(row => {
        this.$refs.table.toggleRowSelection(row)
      })
    },
    // 格式化选择框数据
    formatData(attr) {
      this.format_selection = []
      console.log(this.selection)
      this.selection.forEach(item => {
        this.format_selection.push(item[attr])
      })
    },
    // 删除确认框
    deleteSelection() {
      this.$confirm(this.$t('confirmToDelete') + '?', this.$t('tips'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.deleteData()
        })
        .catch(() => {})
    },
    // 成功提示
    successMsg(res) {
      this.$notify({
        title: this.$t('success'),
        message: res.tips,
        type: 'success'
      })
      this.getList()
    }
  }
}
