<template>
  <el-row class="search-group">
    <slot></slot>
    <el-col :lg="3" :sm="3" class="pull-right">
      <el-input
        class="top-20"
        :value="value"
        :placeholder="$t(placeholder)"
        ref="input"
        @input="updateValue"
        @keyup.enter.native="Enter"
      >
        <el-button
          class="search-btn"
          slot="append"
          @click="Enter"
          :loading="$store.state.btnLoading"
          >{{ $t('搜索') }}</el-button
        >
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
      default: '请输入'
    }
  },
  data() {
    return {
      $t
    }
  },
  name: 'SearchGroup',
  methods: {
    Enter() {
      this.$emit('search')
    },
    updateValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss">
.search-group {
  // line-height: 4em;
  // padding-bottom: 15px;
  .pull-right {
    float: right;
    width: 100%;
  }
  .search-btn {
    color: #fff !important;
    background-color: #3540a5 !important;
    border: 1px solid #3540a5 !important;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
    border-color: #e8e9eb;
  }
  .search-group .search-btn {
    color: #3540a5 !important;
    border: none !important;
    background-color: #fff !important;
  }
  .el-input-group--append .el-input__inner {
    border-right: none !important;
    border-color: #e8e9eb;
  }
  .el-button {
    //color: #3540a5 !important;
    background-color: #fff;
    border: none;
  }
}
</style>
