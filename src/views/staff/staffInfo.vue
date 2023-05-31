<!--可复用组件， 员工信息、权限设置具体界面，需要注意超级管理员只需要权限信息-->
<template>
  <div class="staff-container">
    <el-tabs v-model="activeName" @tab-click="test(activeName)" id="innerTab">
      <el-tab-pane
        v-for="item in getTabData"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        @click="test(item)"
      >
      <member-info :id="myId" v-if ="item.name =='staffInfo'"></member-info>
      <warehouse-permission v-if="item.name=='warehousePermission'" 
      :id ="myId"></warehouse-permission>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import MemberInfo from './permissionSwitch/memberInfo.vue'
import WarehousePermission from './permissionSwitch/warehousePermission.vue'
export default {
  components: {
    MemberInfo,
    WarehousePermission,
  },
  props: {
    permission: 0,
    id: 0,
  },
  computed: {
    getTabData: function () {
      return this.preTabData.filter(item => item.shouldNot != this.myPermission)
    }
  },
  methods: {
    test(item) {
      console.log(item)
    }
  },
  data() {
    return {
      activeName: 'staffInfo',
      myPermission: this.permission,
      myId: this.id,
      preTabData: [
        {
          title: '成员信息',
          name: 'staffInfo',
          shouldNot: 'I am always in'
        },
        {
          title: '仓库权限',
          name: 'warehousePermission',
          shouldNot: 0
        },
        {
          title: '自提点权限',
          name: 'selfPickupPermission',
          shouldNot: 0
        },
        {
          title: '系统权限',
          name: 'systemPermission',
          shouldNot: 0
        }
      ]
    }
  }
}
</script>

<style lang="scss">
// 单独修改
// 修改侧边Tab的样式
#innerTab .el-tabs__active-bar {
  background-color: #3641a3 !important;
  width: 70px !important;
}
#innerTab .el-tabs__nav-scroll {
  overflow: visible;
}
.el-tabs__nav-prev {
  z-index: -1000000;
}
.el-tabs__nav-next {
  z-index: -1000000;
}
#innerTab .el-tabs__item {
  background-color: transparent !important;
  border: none;
  display: inline-block !important;
  width: 100px;
  height: 40px;
}

.el-tabs {
  height: 100% !important;
}
</style>