<!--新的员工组列页面-->
<template>
  <el-container>
    <el-header>
      <div class="header-container">
        <button id="add-actor" @click="addStaff">+添加角色</button>
      </div>
    </el-header>
    <el-container>
      <el-main style="height:739px !important;">
        <el-tabs tab-position="left" style="height: 200px;">
          <el-tab-pane v-for="(item,index) in staff_group_list" :key="index" :label="item.name_cn">
            <div class="tab-container">
              <basic-info
                :name="item.name_cn"
                :description="item.description"
                :hidePhone="item.hide_phone"
                :id="item.id"
                @hidePhoneChange="changeHidePhone"
                @updateBaseInfo="editStaff"
              ></basic-info>

              <staff-info :permission="item.permissions" :id="item.id"></staff-info>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import BasicInfo from './basicInfo.vue'
import StaffInfo from './staffInfo.vue'
import dialog from '@/components/dialog'
export default {
  components: {
    BasicInfo,
    StaffInfo,
  },
  data() {
    return {
      staff_group_list: [],
      tableLoading: false,
      normal: 1,
      dataPermission: {},
      show: false,
      hide_phone: 0,
    }
  },

  created() {
    this.getConfig()
  },

  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$request
        .getVipGroup({
          keyword: '',
          page: 1,
          size: 1000
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.staff_group_list = res.data
            console.log('list的数据', res.data)
          }
        })
    },

    getConfig() {
      this.$request.getFunConfig().then(res => {
        if (res.ret) {
          this.dataPermission = res.data[2]
          console.log(this.dataPermission)
        }
      })
    },

    changeHidePhone(id, hide_phone) {
      let params = {}
      params.hide_phone = hide_phone
      this.$request.telPermission(id, params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 编辑
    editStaff(id) {
      dialog({ type: 'addStaff', id: id, staff: 'edit' }, () => {
        this.getList()
      })
    },

    // 添加员工组
    addStaff() {
      dialog({ type: 'addStaff', staff: 'add' }, () => {
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss">
.el-header {
  height: 50px !important;
}
.header-container {
  background-color: white;
  display: flex;
  align-items: center;
  height: 50px;
  border: 1px solid rgba(230, 230, 230, 0.5);
  box-shadow: 0px 0px 1px rgb(200, 200, 200);

  #add-actor {
    background-color: white;
    border: none;
    cursor: pointer;
    margin-left: 80px;
    font-weight: bold;
    font-size: 16px;
  }
}

// 修改侧边Tab的样式
.el-tabs__active-bar {
  background-color: transparent;
}
.el-tabs__nav-scroll {
  overflow: visible;
}
.el-tabs__nav-prev {
  z-index: 100;
}
.el-tabs__nav-next {
  z-index: 100;
}
.el-tabs__item {
  background-color: white;
  border: 0.5px solid rgba(230, 230, 230, 0.5);
  height: 50px;
  width: 200px;
  display: flex !important;
  flex-direction: row;
  justify-content: center;
}
.el-tabs__content {
  height: 1000px;
}
.el-tabs {
  height: 100% !important;
}
.tab-container {
  padding: 10px;
}
#pager-container {
  width: 200px;
}
</style>