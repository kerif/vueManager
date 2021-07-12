<template>
  <el-header :class="[isCollapse && 'isCollapses']" class="layout-header" style="height: auto">
    <div class="header-top">
      <div @click="switchLeft" class="transfer-left">
        <i
          :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
          style="font-size: 24px"
        ></i>
        <el-select v-model="isSimple" style="margin-left: 25px">
          <el-option
            v-for="item in language"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- <el-switch
      v-model="isSimple"
      :active-text="$t('简')"
      :inactive-text="$t('繁')"
      inactive-color="#13ce66" /> -->
      <!-- <el-button class="upload-btn">{{$t('下载管理')}}</el-button> -->
      <!-- <div>关于我们</div> -->
      <i class="iconfont icon-bianji upload-icon"></i>
      <el-popover placement="top" width="600" trigger="click">
        <el-table :data="gridData">
          <el-table-column>
            <template slot-scope="scope">
              <div class="name-sty">{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column property="created_at"></el-table-column>
          <el-table-column width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">{{ $t('处理中') }}</span>
              <span v-if="scope.row.status === 1">{{ $t('完成') }}</span>
              <span v-if="scope.row.status === 2">{{ $t('失败') }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === 1" @click="goUpload(scope.row.url)">{{
                $t('下载')
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="upload-btn" slot="reference" @click="uploadManagenent">{{
          $t('下载管理')
        }}</el-button>
      </el-popover>
      <!-- <span class="user-box" @click="checkUser">{{ $store.state.userName }}</span> -->
      <el-popover class="user-box" placement="bottom" trigger="click" width="250">
        <p>{{ $t('公司') }}：{{ form.company_name }}</p>
        <p>{{ $t('系统有效期') }}：{{ form.expired_at }}</p>
        <p>{{ $t('所属员工组') }}：{{ form.group_name }}</p>
        <el-button slot="reference" @click="checkUser">{{ $store.state.userName }}</el-button>
      </el-popover>
      <span class="el-icon-switch-button logout-icon" @click="onLogout"></span>
    </div>
    <div :class="[isCollapse && 'isCollapses']" class="layout-nav">
      <tags-view />
    </div>
  </el-header>
</template>
<script>
import TagsView from './components/tagsview'
export default {
  components: {
    TagsView
  },
  data() {
    return {
      language: [
        { label: '简体', value: 1 },
        { label: '繁体', value: 2 }
      ],
      gridData: [],
      aboutDialog: false,
      form: {
        company_name: '',
        expired_at: '',
        group_name: ''
      }
    }
  },
  methods: {
    checkUser() {
      this.$request.aboutMe().then(res => {
        if (res.ret) {
          this.form.company_name = res.data.company_name
          this.form.expired_at = res.data.expired_at
          this.form.group_name = res.data.group_name
        }
      })
    },
    onLogout() {
      this.$confirm(this.$t('是否确认退出登录？'), this.$t('提示'), {
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
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.isCollapse
    },
    isSimple: {
      get() {
        if (this.$store.state.languageCode === 'simple') {
          return 1
        }
        return 2
      },
      set(val) {
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
  left: 60px;
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
  .logout-icon {
    font-size: 20px;
    position: relative;
    top: 4px;
    cursor: pointer;
    &:hover {
      color: #3540a5;
      animation: move 0.3s ease-in 2;
    }
  }
  .transfer-left {
    float: left;
    // margin-top: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .upload-btn {
    margin-right: 10px;
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
    margin-right: 10px;
  }
}
</style>
