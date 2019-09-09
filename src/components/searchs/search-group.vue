<template>
    <el-row :gutter="10" class="search-group">
      <slot></slot>
      <el-col :lg="4" :sm="12" class="pull-right">
        <el-input class="top-20" :value="value" ref="input" @input="updateValue"  @keyup.enter.native="Enter">
          <el-button slot="append" @click="Enter"  icon="el-icon-search" :loading="$store.state.btn_loading"></el-button>
        </el-input>
      </el-col>
    </el-row>
</template>
<script>
export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  name: 'SearchGroup',
  methods: {
    Enter () {
      this.$emit('search')
    },
    updateValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-group {
  line-height: 4em;
  .pull-right {
    float: right
  }
  padding-bottom: 15px;
}
</style>
