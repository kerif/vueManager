<template>
  <div class="system">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('基础配置')" name="first" :lazy="true">
        <grade />
      </el-tab-pane>
      <el-tab-pane :label="$t('收支规则')" name="second" :lazy="true">
        <rules />
      </el-tab-pane>
      <el-tab-pane  :label="$t('收支记录')" name="third" :lazy="true">
        <record />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Record from './record.vue'
import Grade from './grade.vue'
import Rules from './rules.vue'
export default {
  name: 'system',
  components: {
    Grade,
    Rules,
    Record
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
<style scoped>
.system {
  background-color: #fff;
  padding: 0px 15px;
}
</style>
