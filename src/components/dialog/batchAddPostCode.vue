<template>
  <el-dialog title="批量添加邮编" :visible.sync="show">
    <el-form>
      <el-form-item>
        <el-input
          type="textarea"
          :rows="10"
          placeholder="每一行一个规则,如开始邮编-结束邮编
10000-20000
30000-40000"
          v-model="postcode_lines"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      postcode_lines: ''
    }
  },
  methods: {
    onConfirm() {
      const lines = this.postcode_lines
        .replace(/(^\s*)|(\s*$)/g, '')
        .replace(/\t/g, '-')
        .split('\n')
      let result = []
      if (lines !== '') {
        for (let index = 0; index < lines.length; index++) {
          const currentLine = lines[index].replace(/\t/g, '-').replace(/(^\s*)|(\s*$)/g, '')
          if (currentLine === '') continue
          const element = currentLine.split('-')
          if (element.length === 0) continue
          result.push({
            rule: '邮编规则',
            start: element[0].replace(/(^\s*)|(\s*$)/g, ''),
            end: element[1].replace(/(^\s*)|(\s*$)/g, ''),
            type: 1
          })
        }
      }
      this.success(result)
      this.show = false
    }
  }
}
</script>
