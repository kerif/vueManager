<template>
  <el-header :class="[isCollapse && 'isCollapses']" class="layout-header">
   <div @click="switchLeft" class="TransferLeft">
     <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
       style="font-size:24px;"></i>
    </div>
    <!-- <el-switch
      v-model="isSimple"
      :active-text="$t('简')"
      :inactive-text="$t('繁')"
      inactive-color="#13ce66" /> -->
    <el-select v-model="isSimple">
      <el-option v-for="item in language"
        :key="item.id" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <span class="user-box">{{ $store.state.userName }}</span>
    <span class="el-icon-switch-button logout-icon" @click="onLogout"></span>
  </el-header>
</template>
<script>
export default {
  data () {
    return {
      language: [
        { label: '简体', value: 1 },
        { label: '繁体', value: 2 }
      ]
    }
  },
  methods: {
    onLogout () {
      this.$confirm(this.$t('是否确认退出登录？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.logout().then(res => {
          if (res.ret) {
            this.$store.commit('saveFileterAfterRouterMap', { fileterAfterRouterMap: [], isPermissionFilter: [] })
            this.$store.commit('savePermissionStatus', false)
            this.$store.commit('removeToken')
            this.$router.replace({ name: 'login' })
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify({
              title: this.$t('退出失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    switchLeft () {
      this.$store.commit('switchCollapse', !this.$store.state.isCollapse)
    }
  },
  computed: {
    isCollapse () {
      return this.$store.state.isCollapse
    },
    isSimple: {
      get () {
        if (this.$store.state.languageCode === 'simple') {
          return 1
        }
        return 2
      },
      set (val) {
        console.log('valu', val)
        if (val === 1) {
          this.$store.commit('saveLanguageCode', 'simple')
        } else {
          this.$store.commit('saveLanguageCode', 'tradition')
        }
      }
    }
  }
}
</script>
<style lang="scss">
.isCollapses {
  width: 100vw !important;
  left: 0px;
}
.layout-header {
  width: calc(100vw - 180px);
  position: fixed;
  top: 0;
  left: 180px;
  background-color: #fff;
  z-index: 99;
  transition: all .3s ease-in;
  @keyframes move {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  height: 60px;
  line-height: 60px;
  text-align: right;
  .user-box {
    margin: 0 30px;
  }
  .logout-icon {
    font-size: 20px;
    position: relative;
    top: 4px;
    cursor: pointer;
    &:hover {
      color: #3540A5;
      animation: move .3s ease-in 2;
    }
  }
  .TransferLeft {
    float: left;
    height: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
