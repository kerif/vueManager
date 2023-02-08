<template>
  <el-header>
    <div :class="[isCollapse && 'isCollapses']" class="layout-nav">
      <tags-view />
    </div>
  </el-header>
</template>
<script>
import TagsView from './components/tagsview'
// import { resetRouter } from '@/router'
export default {
  components: {
    TagsView
  },
  data() {
    return {
      languageList: [
        { label: '简体', value: 'zhCN' },
        { label: '繁体', value: 'zhTW' },
        { label: 'English', value: 'en' }
      ],
      language: '',
      gridData: [],
      aboutDialog: false,
      form: {
        company_name: '',
        expired_at: '',
        group_name: '',
        invite_code: ''
      },
      unread: ''
    }
  },
  created() {
    this.getCount()
  },
  activated() {
    this.getCount()
  },
  methods: {
    checkUser() {
      this.$request.aboutMe().then(res => {
        if (res.ret) {
          this.form.company_name = res.data.company_name
          this.form.expired_at = res.data.expired_at
          this.form.group_name = res.data.group_name
          this.form.uuid = res.data.uuid
          this.form.invite_code = `${this.$baseUrl.IMAGE_URL}${res.data.invite_code}`
        }
      })
    },
    onLogout() {
      this.$confirm(this.$t('是否确认退出登录'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.logout().then(res => {
          if (res.ret) {
            this.$store.commit('saveFileterAfterRouterMap', {
              fileterAfterRouterMap: [],
              isPermissionFilter: []
            })
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
      // .catch(() => {})
      // .finally(() => {
      //   resetRouter()
      // })
    },
    uploadManagenent() {
      this.getUpload()
    },
    // 下载管理 获取数据
    getUpload() {
      this.$request.exportsDownloads().then(res => {
        if (res.ret) {
          this.gridData = res.data
          console.log(this.gridData)
        }
      })
    },
    // 确定下载
    goUpload(url) {
      window.open(url)
    },
    switchLeft() {
      this.$store.commit('switchCollapse', !this.$store.state.isCollapse)
    },
    getCommonProblem() {
      this.$router.push({
        name: 'commonProblem'
      })
    },
    getSystemInfo() {
      this.$router.push({
        name: 'systemInfo'
      })
    },
    getCount() {
      this.$request.countMessage().then(res => {
        this.unread = res.data.unread
        this.$store.commit('changeUnread', res.data.unread)
      })
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.isCollapse
    },
    languageCode: {
      get() {
        return this.$store.state.languageCode
      },
      set(val) {
        this.$store.commit('saveLanguageCode', { locale: val, reload: true })
      }
    }
  }
}
</script>
<style lang="scss">
.isCollapses {
  width: 100vw !important;
  left: 60px;
}
.img {
  width: 50%;
}
.layout-header {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 99;
  transition: all 0.3s ease-in;
  padding: 0;
  .header-top {
    text-align: right;
    padding: 10px;
  }
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
  .user-box {
    cursor: pointer;
    margin: 0 30px;
    margin-right: 10px !important;
    .el-button {
      border: none;
    }
  }
  // .quest-icon {
  //   font-size: 20px;
  //   cursor: pointer;
  //   position: relative;
  //   top: 4px;
  //   margin-left: 20px;
  //   vertical-align: middle;
  // }
  // .info-icon {
  //   font-size: 20px;
  //   cursor: pointer;
  //   position: relative;
  //   top: 4px;
  //   margin-left: 20px;
  //   vertical-align: middle;
  // }
  // .logout-icon {
  //   font-size: 20px;
  //   position: relative;
  //   top: 4px;
  //   cursor: pointer;
  //   vertical-align: middle;
  //   &:hover {
  //     color: #3540a5;
  //     animation: move 0.3s ease-in 2;
  //   }
  // }
  // .download-icon {
  //   vertical-align: middle;
  // }
  .transfer-left {
    float: left;
    // margin-top: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .upload-btn {
    margin-right: 10px;
    padding-right: 0;
    padding-left: 30px;
    border: none;
  }
  .name-sty {
    width: 70px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
  .withdraw-sty {
    .el-dialog__header {
      background-color: #0e102a;
    }
    .el-dialog__title {
      color: #fff;
      font-size: 14px;
    }
  }
  .upload-icon {
    position: relative;
    right: 80px;
  }
}
</style>
