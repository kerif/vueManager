<template>
  <div class="vip-list-container">
    <div>
      <search-select placeholder="请选择客户组"></search-select>
      <search-group></search-group>
    </div>
  </div>
</template>
<script>
import { SearchSelect, SearchGroup } from '@/components/searchs'
export default {
  components: {
    SearchSelect,
    SearchGroup
  }
}
</script>
