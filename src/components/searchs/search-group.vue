<template>
    <el-row :gutter="10" class="search-group">
      <slot></slot>
      <el-col :lg="6" :sm="12" class="pull-right">
        <el-input class="top-20" :value="value" :placeholder="placeholder" ref="input" @input="updateValue" @keyup.enter.native="Enter">
          <el-button class="search-btn" slot="append" @click="Enter" :loading="$store.state.btn_loading">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
</template>
<script>
export default {
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String,
      default: '请输入关键字'
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
  // line-height: 4em;
  .pull-right {
    float: right
  }
  .search-btn {
    color: #fff;
    background-color: #3540A5;
    border: 1px solid #3540A5;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  padding-bottom: 15px;
}
</style>
