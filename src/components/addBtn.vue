<template>
  <div class="add-btn-container" @click="clickMethod">
    <span class="add">+</span>
    <span class="add-btn">
      <slot></slot>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    router: String,
    params: Object
  },
  methods: {
    clickMethod() {
      if (this.router) {
        if (this.params && this.params.add) {
          localStorage.setItem('add', 1)
        }
        this.$router.push({ name: this.router, query: this.params })
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/styles/communalVariate.scss';
.add-btn-container {
  background-color: #3540a5;
  border-radius: 6px;
  color: #fff;
  line-height: 40px;
  padding: 0 10px;
  float: right;
  cursor: pointer;
  .add {
    font-size: 18px;
    font-weight: bold;
  }
  .add-btn {
    border-radius: 0;
    border: none;
    font-size: 12px;
    padding-left: 5px;
    padding-right: 5px;
  }
  &:hover {
    color: #fff;
    background-color: $main-color;
    transition: all 0.5s ease-in;
  }
}
</style>
