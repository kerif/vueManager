<template>
  <el-aside class="layout-aside">
    <!-- :class="[isCollapse ? 'isCollapse' : '']" -->
    <div class="aside-top">
      <!-- v-if="!isCollapse" -->
      <div v-if="customData.sidebar_title">
        <span>{{ customData.sidebar_title }}</span>
      </div>
      <div v-else>
        <span>{{ $t('海鸥集运') }}</span>
        <span>{{ $t('管理系统') }}</span>
      </div>
    </div>
    <div class="menu-left">
      <div v-for="item in topList" :key="item.id">
        <div class="header-menu" :class="$store.state.menuTitleId==item.id?'menu-background':''" @click="switchMenu(item)">{{ item.title }}</div>
      </div>
    </div>
    <div class="menu-right">
      <div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ languageCode=='zhCN'?'简体':languageCode=='zhTW'?'繁体':'English' }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in languageList" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-popover placement="top" width="800" trigger="click">
          <el-table :data="gridData">
            <el-table-column label="文件名">
              <template slot-scope="scope">
                <div class="name-sty">{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column property="created_at" width="165" label="时间"></el-table-column>
            <el-table-column width="80" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">{{ $t('处理中') }}</span>
                <span v-if="scope.row.status === 1" style="color: blue">{{ $t('完成') }}</span>
                <span v-if="scope.row.status === 2" style="color: red">{{ $t('失败') }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" label="操作">
              <template slot-scope="scope">
                <el-button icon="el-icon-download" round size="mini" v-if="scope.row.status === 1" @click="goUpload(scope.row.url)">{{ $t('下载') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button icon="el-icon-download download-icon" slot="reference" class="button" round @click="uploadManagenent">{{ $t('下载管理') }}
          </el-button>
        </el-popover>
        <el-button slot="reference" class="button" round @click="$router.push({name:'trackingService'})">
          <span class="icon">
            <svg t="1675651504636" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2696" width="16" height="16">
              <path
                d="M351.94087 575.903242l-127.978498 0c-17.717453 0-31.994625-14.277171-31.994625-31.994625 0-17.717453 14.277171-31.994625 31.994625-31.994625L319.946246 511.913993l0-95.983874c0-17.717453 14.277171-31.994625 31.994625-31.994625 17.717453 0 31.994625 14.277171 31.994625 31.994625l0 127.978498C383.935495 561.626071 369.658324 575.903242 351.94087 575.903242z"
                fill="#e6e6e6" p-id="2697"></path>
              <path
                d="M702.161599 666.898707c-61.92508 0-113.701327 43.347556-127.290442 101.144297l-123.85016 0c-13.589115-57.968755-65.365362-101.144297-127.290442-101.144297-72.245926 0-131.074752 58.828826-131.074752 131.074752 0 72.417941 58.828826 131.246766 131.074752 131.246766 60.376953 0 110.777087-41.283387 125.914329-97.015958l126.430371 0c15.137242 55.732572 65.537376 97.015958 126.086343 97.015958 72.245926 0 131.074752-58.828826 131.074752-131.074752S774.407526 666.898707 702.161599 666.898707zM323.730556 865.058962c-36.983034 0-67.085503-30.102469-67.085503-67.257517 0-36.983034 30.102469-67.085503 67.085503-67.085503 36.983034 0 67.085503 30.102469 67.085503 67.085503C390.816059 834.956493 360.71359 865.058962 323.730556 865.058962zM702.161599 864.886948c-36.983034 0-67.085503-30.102469-67.085503-67.085503s30.102469-67.085503 67.085503-67.085503c36.983034 0 67.085503 30.102469 67.085503 67.085503S739.144633 864.886948 702.161599 864.886948z"
                fill="#e6e6e6" p-id="2698"></path>
              <path
                d="M864.026877 95.983874 399.760793 95.983874c-44.035612 0-79.814547 35.778935-79.814547 79.814547l0 92.543591L125.398287 366.046027c-1.376113 0.688056-2.752226 1.548127-3.956325 2.408198C85.318999 393.912313 65.365362 433.475559 65.365362 479.919368l0 322.010415c0 17.717453 14.277171 31.994625 31.994625 31.994625s31.994625-14.277171 31.994625-31.994625L129.354611 479.919368c0-24.942046 9.116748-44.551655 27.006215-57.968755L366.390055 316.677977c1.376113-0.688056 2.408198-2.064169 3.612296-2.92424 1.892155-1.376113 3.78431-2.580212 5.332437-4.128339 1.376113-1.548127 2.408198-3.268268 3.440282-4.988409s2.236183-3.268268 2.92424-5.332437c0.860071-2.236183 1.032085-4.472367 1.376113-6.70855 0.172014-1.548127 0.860071-2.92424 0.860071-4.472367l0-112.325214c0-8.600706 7.052579-15.825298 15.825298-15.825298l464.266084 0c17.545439 0 31.994625 14.621199 31.994625 32.510667l0 607.381824c0 17.717453 14.277171 31.994625 31.994625 31.994625s31.994625-14.277171 31.994625-31.994625L960.010751 192.48379C960.010751 139.33143 916.835209 95.983874 864.026877 95.983874z"
                fill="#e6e6e6" p-id="2699"></path>
            </svg>
          </span>
          {{ $t('物流查询') }}
        </el-button>
        <el-button slot="reference" class="button" round @click="$router.push({name:'freight'})">
          <span>
            <svg t="1675652006164" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3894" width="20" height="20">
              <path
                d="M72 112.197l0 0 0 799.604c0 22.215 17.987 40.198 40.198 40.198l799.604 0c22.215 0 40.198-17.987 40.198-40.198l0-799.604c0-22.215-17.987-40.198-40.198-40.198l-799.604 0c-22.215 0-40.198 17.987-40.198 40.198l0 0zM292 703.716l-70.613-70.613c-7.652-7.652-20.571-7.907-28.381-0.097-7.583 7.582-7.767 20.517 0.097 28.381l70.613 70.613-70.613 70.613c-7.652 7.652-7.907 20.571-0.097 28.381 7.582 7.583 20.517 7.767 28.381-0.097l70.613-70.613 70.613 70.613c7.652 7.652 20.571 7.907 28.381 0.097 7.582-7.582 7.767-20.517-0.097-28.381l-70.613-70.613 70.613-70.613c7.652-7.652 7.907-20.571 0.097-28.381-7.582-7.582-20.517-7.767-28.381 0.097l-70.613 70.613zM272 272l-99.863 0c-10.821 0-20.137 8.954-20.137 20 0 10.722 9.016 20 20.137 20l99.863 0 0 99.863c0 10.821 8.954 20.137 20 20.137 10.723 0 20-9.016 20-20.137l0-99.863 99.863 0c10.821 0 20.137-8.954 20.137-20 0-10.722-9.016-20-20.137-20l-99.863 0 0-99.863c0-10.821-8.954-20.137-20-20.137-10.722 0-20 9.016-20 20.137l0 99.863zM32 112.197c0-44.292 35.881-80.197 80.197-80.197l799.604 0c44.292 0 80.197 35.881 80.197 80.197l0 799.604c0 44.292-35.881 80.197-80.197 80.197l-799.604 0c-44.292 0-80.197-35.881-80.197-80.197l0-799.604zM552 292c0-11.046 9.316-20 20.137-20l239.726 0c11.122 0 20.137 9.278 20.137 20 0 11.046-9.316 20-20.137 20l-239.726 0c-11.122 0-20.137-9.278-20.137-20zM552 652c0-11.046 9.316-20 20.137-20l239.726 0c11.122 0 20.137 9.278 20.137 20 0 11.046-9.316 20-20.137 20l-239.726 0c-11.122 0-20.137-9.278-20.137-20zM552 812c0-11.046 9.316-20 20.137-20l239.726 0c11.122 0 20.137 9.278 20.137 20 0 11.046-9.316 20-20.137 20l-239.726 0c-11.122 0-20.137-9.278-20.137-20z"
                fill="#e6e6e6" p-id="3895"></path>
            </svg>
          </span>
          {{ $t('运费试算') }}
        </el-button>
        <el-tooltip :content="$t('常见问题')" placement="top">
          <span class="el-icon-question quest-icon" @click="getCommonProblem"></span>
        </el-tooltip>
        <el-badge :value="$store.state.unread > 0 ? $store.state.unread : ''" class="item">
          <el-tooltip :content="$t('系统消息')" placement="top">
            <span class="el-icon-message info-icon" @click="getSystemInfo"></span>
          </el-tooltip>
        </el-badge>
        <el-popover class="user-box" placement="bottom" trigger="click" width="250">
          <p>{{ $t('公司') }}：{{ form.company_name }}</p>
          <p>{{ $t('系统有效期') }}：{{ form.expired_at }}</p>
          <p>{{ $t('所属员工组') }}：{{ form.group_name }}</p>
          <p>{{ $t('uuid') }}：{{ form.uuid }}</p>
          <div>
            {{ $t('员工二维码') }}:
            <div style="margin-left: 80px">
              <img class="img" :src="form.invite_code ? form.invite_code : ''" />
            </div>
          </div>
          <el-button slot="reference" icon="el-icon-s-custom" class="button" @click="checkUser">{{ $store.state.userName }}</el-button>
        </el-popover>
        <span class="el-icon-switch-button logout-icon" @click="onLogout"></span>
      </div>
    </div>
    <!-- <div v-else class="unTop">
      <img
        v-if="customData.sidebar_image"
        style="width: 61px; height: 65px"
        :src="$baseUrl.IMAGE_URL + customData.sidebar_image"
        alt=""
      />
      <img v-else src="../../assets/top.png" />
    </div> -->
  </el-aside>
</template>
<script>
export default {
  data() {
    return {
      languageList: [
        { label: '简体', value: 'zhCN' },
        { label: '繁体', value: 'zhTW' },
        { label: 'English', value: 'en' }
      ],
      language: '',
      gridData: [],
      customData: {},
      topList: [
        { title: this.$t('首页'), id: 1 },
        { title: this.$t('运营'), id: 2 },
        { title: this.$t('仓库'), id: 3 },
        { title: this.$t('财务'), id: 4 },
        { title: this.$t('数据'), id: 5 },
        { title: this.$t('配置'), id: 6 }
      ],
      form: {
        company_name: '',
        expired_at: '',
        group_name: '',
        invite_code: ''
      },
      unread: ''
    }
  },
  methods: {
    switchMenu(item) {
      this.$store.commit('saveMenu', item)
    },
    checkUser() {
      this.$request.aboutMe().then(res => {
        if (res.ret) {
          this.form.company_name = res.data.company_name
          this.form.expired_at = res.data.expired_at
          this.form.group_name = res.data.group_name
          this.form.uuid = res.data.uuid
          this.form.invite_code = `${this.$baseUrl.IMAGE_URL}${res.data.invite_code}`
          this.$router.push({
            name: 'reset-password'
          })
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
    handleCommand(val) {
      this.$store.commit('saveLanguageCode', { locale: val, reload: true })
    },
    // 确定下载
    goUpload(url) {
      window.open(url)
    },
    uploadManagenent() {
      this.getUpload()
    },
    // 下载管理 获取数据
    getUpload() {
      this.$request.exportsDownloads().then(res => {
        if (res.ret) {
          this.gridData = res.data
        }
      })
    },
    onMenuSelect() {
      // console.log('index', index)
      // console.log('indexPath', indexPath)
    },
    onRoute() {
      // console.log('route', route)
      // console.log('$route', this.$route)
    },
    getInit() {
      this.$request.initConfig({ domain: location.hostname }).then(res => {
        this.customData = res.data
        this.$store.commit('saveSiderBarImage', res.data.sidebar_image)
      })
    }
  },
  computed: {
    fileterAfterRouterMap() {
      return this.$store.state.fileterAfterRouterMap[0]
        ? this.$store.state.fileterAfterRouterMap[0].children
        : []
    },
    formatRouterMap() {
      console.log()
      let formatRouterMap = {}
      this.fileterAfterRouterMap &&
        this.fileterAfterRouterMap.forEach(item => {
          item.children.forEach(ele => {
            if (formatRouterMap[ele.meta.group]) {
              formatRouterMap[ele.meta.group].children.push({
                name: ele.meta.name,
                path: ele.path,
                level: ele.meta.level
              })
            } else {
              formatRouterMap[ele.meta.group] = {
                children: [{ name: ele.meta.name, path: ele.path, level: ele.meta.level }],
                name: ele.meta.group,
                level: 1,
                icon: item.icon
              }
            }
          })
        })
      console.log(formatRouterMap, '菜单')
      return formatRouterMap
    },
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
  },
  created() {
    this.getInit()
  }
}
</script>
<style lang="scss">
.layout-aside {
  .quest-icon {
    font-size: 20px;
    cursor: pointer;
    position: relative;
    margin-left: 20px;
    vertical-align: middle;
  }
  .transfer-left {
    float: left;
    // margin-top: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .is-fixed {
    top: 20px;
  }
  .info-icon {
    font-size: 20px;
    cursor: pointer;
    position: relative;
    margin-left: 20px;
    vertical-align: middle;
  }
  .logout-icon {
    font-size: 20px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    &:hover {
      color: #3540a5;
      animation: move 0.3s ease-in 2;
    }
  }
  .download-icon {
    vertical-align: middle;
  }
  .icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    position: relative;
    top: 3px;
  }
  .el-button.is-round {
    padding: 12px 10px;
  }
  .button {
    background-color: #3540a5;
    border: #3540a5;
    color: #fff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  width: 100% !important;
  // height: 100vh;
  height: 60px;
  position: relative;
  top: 0;
  z-index: 99;
  background-color: #4c5ad9;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s ease-in;
  overflow-x: hidden;
  .menu-left {
    line-height: 60px;
    display: flex;
    width: 42%;
    justify-items: center;
    align-items: center;
    .menu-background {
      background-color: #4c5ad9;
    }
    .header-menu {
      margin-right: 10px;
      padding: 0 10px;
      height: 32px;
      line-height: 32px;
      color: #ffffff;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .menu-right {
    line-height: 59px;
    color: #fff;
    text-align: right;
    margin-right: 40px;
    .el-dropdown-link {
      height: 60px;
      font-size: 15px;
      color: #fff;
      width: 80px;
      display: block;
      text-align: center;
    }
    .name-sty {
      width: 70px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
  }
  .aside-top {
    width: 280px;
    height: 60px;
    line-height: 60px;
    background-color: #3540a5;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
  .unTop {
    background-color: #3540a5;
    text-align: center;
    img {
      height: 60px;
      width: 61px;
      padding-top: 5px;
    }
  }
  .app-name {
    font-size: 35px;
    font-weight: bold;
    margin-right: 5px;
  }
  .route-menu {
    // width: 180px;
    border: none;
    // margin-top: 50px;
  }
  .route-item {
    padding-left: 60px !important;
  }
  .dot {
    display: inline-block;
    background: red !important;
    width: 6px !important;
    height: 6px !important;
    border-radius: 50%;
  }
  .el-menu-item-group__title {
    padding: 0;
  }
  .isCollapse {
    width: 50px !important;
  }
  .el-submenu__title {
    padding-left: 20px !important;
  }
  .icon-title {
    font-size: 18px;
    margin-right: 22px;
    color: #fff;
  }
  .el-submenu.is-active {
    .el-submenu__title {
      background-color: #3540a5 !important;
    }
  }
}
.el-dropdown-menu {
  width: 100px !important;
  text-align: center;
  top: 45px !important;
}
.el-menu-item-group__title {
  padding: 0;
}
</style>
