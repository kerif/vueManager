<template>
    <el-col :lg="6" :md="12">
      <el-select style="width: 100%;" @change="selectChange" v-model="select_value" :placeholder="placeholder" :clearable="true" :disabled="disabled">
        <el-option
          v-for="item in selectArr"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
</template>
<script>
export default {
  name: 'searchSelect',
  props: {
    selectArr: {
      type: Array
    },
    value: [String, Number],
    placeholder: {
      type: String,
      default: '请选择'
    },
    width: {
      type: Number,
      default: 4
    },
    disabled: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  computed: {
    select_value: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  activated () {
    if (this.$store.state.search_flag) {
      this.select_value = ''
    }
  },
  methods: {
    selectChange (val) {
      console.log(val)
      this.$emit('search')
    }
  }
}
</script>
<style lang="scss">
</style>
