<template>
  <el-dialog :visible.sync="show" :title="$t('添加发货信息')" :before-close="close" @close="clear">
    <el-form>
      <el-form-item :label="$t('发货公司')">
        <el-select v-model="value" :placeholder="$t('请选择')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('物流单号')">
        <el-input v-model="value"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ]
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    confirm() {},
    close() {
      this.$emit('passVal', false)
    },
    clear() {}
  }
}
</script>

<style></style>
