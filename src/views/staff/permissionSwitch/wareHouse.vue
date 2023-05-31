<!--仓库展示卡片组件-->
<template>
  <div class="card-container">
    <div class="default-card" :class="{active: checkedActive}">
      <div class="check">
        <input type="checkbox"  id="check-box" v-model="checkedActive"/>
        <span id="whouse-name">
          仓库名称:
          <span style="color: black;
            font-size: 15px">{{ warehouse_name }}</span>
        </span>
      </div>
      <div class="info">
        <span>仓库联系人:{{checkedActive}}</span>
        <span>联系电话:</span>
        <span>联系地址:</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 当前卡片仓库名称
    warehouse_name: String,
    // 当前卡片所展示仓库的Id
    currentId: Number,
    // 包含了需要高亮显示的仓库
    warehouse_id: Array
  },

  data() {
    return {
        checkedActive:false,
    }
  },

    //监听当前的仓库卡片是否被选中，给父组件事件通知
    watch: {
        checkedActive: function(newCheck) {
            if(newCheck)this.$emit('makeChecked', this.currentId)
            else this.$emit('cancelChecked', this.currentId)
        }
    },
  mounted() {
      this.checkedActive = this.warehouse_id.includes(this.currentId)||this.warehouse_id.includes(0)? true: false
  }

}
</script>

<style lang="scss">
.card-container {
  width: 100%;
  height: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  .default-card {
    background-color: white;
    font-size: 14px;
    color: gray;
    width: 95%;
    height: 120px;
    border: 2px solid rgba(200, 200, 200, 0.4);
    border-radius: 10px;
    #check-box {
      position: relative;
      top: 30px;
      left: 30px;
    }
    #whouse-name {
      position: relative;
      top: 30px;
      left: 100px;
    }
    .info {
      position: relative;
      top: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
  .active {
    border: 2px solid rgba($color: #3641a3, $alpha: 0.8) !important;
  }
}
</style>