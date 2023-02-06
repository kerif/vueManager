<template>
  <el-dialog title="批量添加区间" :visible.sync="show">
    <el-form>
      <el-form-item>
        <el-input
          type="textarea"
          :rows="10"
          placeholder="每一行一个重量段区间,请用空格分开"
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
    implode(v) {
      let arr = []
      switch (this.mode) {
        case 1: // 首重续重
          arr.push(v.start || 0)
          arr.push(v.end || 0)
          arr.push(v.unit_weight || 0)
          break
        case 2: // 阶梯价格
          arr.push(v.start || 0)
          arr.push(v.end || 0)
          break
        case 3: // 删除掉了
        case 4: // 多级续重
          arr.push(v.unit_weight || 0)
          break
        case 5: // 阶梯首重续重模式
          arr.push(v.start || 0)
          arr.push(v.end || 0)
          arr.push(v.first_weight || 0)
          arr.push(v.unit_weight || 0)
          break
      }

      return arr.join('\t') + '\n'
    },
    explode(fillValueLineArr) {
      if (fillValueLineArr.length === 0) return []
      let arr = []
      switch (this.mode) {
        case 1: // 首重续重
          arr.push({
            start: fillValueLineArr[0],
            end: fillValueLineArr[1],
            unit_weight: fillValueLineArr[2],
            first_weight: 0 // 只有mode5才
          })
          break
        case 2: // 阶梯价格
          arr.push({
            start: fillValueLineArr[0],
            end: fillValueLineArr[1],
            first_weight: 0, // 只有mode5才
            unit_weight: 0
          })
          break
        case 3: // 删除掉了
        case 4: // 多级续重
          arr.push({
            start: 0,
            end: 0,
            first_weight: 0, // 只有mode5才
            unit_weight: fillValueLineArr[0]
          })
          break
        case 5: // 阶梯首重续重模式
          arr.push({
            start: fillValueLineArr[0],
            end: fillValueLineArr[1],
            first_weight: fillValueLineArr[2], // 只有mode5才
            unit_weight: fillValueLineArr[3]
          })
          break
      }
      console.info('arr', arr)
      return arr
    },
    init() {
      this.show = true
      this.ruleContent = ''
      if (this.grades.length > 0) {
        for (let index = 0; index < this.grades.length; index++) {
          const element = this.grades[index]
          this.ruleContent += this.implode(element)
        }
      }
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
        if (element !== '') {
          const d = this.explode(fillValueLineArr)
          if (d.length > 0) {
            convertArr.push(d[0])
          }
        }
      }
      console.info('convertArr', convertArr)
      this.success(convertArr)
      this.show = false
    }
  }
}
</script>
