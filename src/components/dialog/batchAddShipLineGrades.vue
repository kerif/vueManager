<template>
  <el-dialog title="批量添加区间" :visible.sync="show">
    <el-form>
      <el-form-item>
        <el-input
          type="textarea"
          :rows="10"
          placeholder="每一行一个规则,请用空格分开"
          v-model="ruleContent"
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
  name: 'batchAddShipLineGrades',
  data() {
    return {
      show: false,
      mode: 1,
      ruleContent: '',
      grades: []
    }
  },
  methods: {
    init() {
      this.show = true
      this.ruleContent = []
    },
    onConfirm() {
      let convertArr = []
      let fillValue = this.ruleContent
        .replace(/\t/g, ' ')
        .replace(/^s+/, '')
        .replace(/s+$/, '')
        .split('\n')
      for (let index = 0; index < fillValue.length; index++) {
        const element = fillValue[index].replace(/\t/g, ' ').replace(/^s+/, '').replace(/s+$/, '')
        let fillValueLineArr = element.split(' ')
        convertArr.push({
          start: fillValueLineArr[0],
          end: fillValueLineArr[1],
          unit_weight: fillValueLineArr[2]
        })
      }
      this.success(convertArr)
      this.show = false
    }
  }
}
</script>
