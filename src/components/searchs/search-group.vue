<template>
    <el-row class="search-group">
      <slot></slot>
      <el-col :lg="4" :sm="4" class="pull-right">
        <el-input class="top-20" :value="value" :placeholder="$t(placeholder)" ref="input" @input="updateValue" @keyup.enter.native="Enter">
          <el-button class="search-btn" slot="append" @click="Enter" :loading="$store.state.btnLoading" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
</template>
<script>
import $t from '../../utils/language'
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
      $t
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
<style lang="scss">
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
  .el-input-group__append, .el-input-group__prepend {
    background-color: #fff;
    border-color: #E8E9EB;
  }
  .search-group .search-btn {
    color: #3540A5 !important;
    border: none !important;
    background-color: #fff !important;
  }
  .el-input-group--append .el-input__inner {
    border-right: none !important;
    border-color: #E8E9EB;
  }
  .el-button {
    color: #3540A5 !important;
    background-color: #fff;
    border: none;
  }
}
</style>
