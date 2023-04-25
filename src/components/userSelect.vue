<template>
  <div class="user-box">
    <div class="first-line">
      <div class="uid">
        <span>{{ $t('编号') }}</span
        >{{ item.uid }}
      </div>
      <div>{{ item.id }}</div>
    </div>
    <div class="second-line">
      <div>{{ item.name }}</div>
      <div>{{ item.member_level_name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userSelect',
  props: ['item']
  // item: {}
}
</script>

<style lang="scss">
.user-box {
  padding: 0 -20px;
  border-bottom: 1px solid #bdbdbd;
  padding: 0 16px;
  .first-line {
    width: 100%;
    display: flex;
    justify-content: space-between !important;
    color: #484848;
    .uid {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .second-line {
    width: 100%;
    display: flex;
    justify-content: space-between !important;
    color: #484848;
  }
}
</style>
