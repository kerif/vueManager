<template>
  <el-dialog :visible.sync="show" :title="$t('可用客户授权')" width="50%" @close="clear">
    <div>
      <span style="display: inline-block; width: 150px">{{ $t('可用该渠道客户') }}</span>
      <el-radio-group v-model="auth_target">
        <el-radio :label="1">{{ $t('所有客户') }}</el-radio>
        <el-radio :label="2">{{ $t('部分客户') }}</el-radio>
      </el-radio-group>
    </div>
    <div class="box" v-if="auth_target === 2">
      <div class="box-one">
        <div class="box-one-top">
          <div>{{ $t('用户组') }}</div>
          <div>{{ modeList.length }}</div>
        </div>
        <div class="box-one-bottom">
          <el-checkbox-group v-model="userList">
            <el-checkbox v-for="item in modeList" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="box-two">
        <div class="box-two-left">
          <div>{{ $t('特定等级组') }}</div>
          <div>{{ vipList.length }}</div>
        </div>
        <div class="box-two-bottom">
          <el-checkbox-group v-model="levelList">
            <el-checkbox v-for="item in vipList" :key="item.id" :label="item.id">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="box-three">
        <div class="box-three-top">
          <div>{{ $t('特定客户') }}</div>
          <div>{{ customerList.length }}</div>
        </div>
        <div style="padding: 10px">
          <el-autocomplete
            v-model="selectUser"
            :fetch-suggestions="querySearchUser"
            value-key="name"
            clearable
            :placeholder="$t('请输入客户ID')"
            @select="handleSelect"
            style="width: 200px"
          >
            <template #default="{ item }">
              <div class="name">{{ item.id }}---{{ item.name }}</div>
            </template>
          </el-autocomplete>
        </div>
        <div style="padding: 10px; height: 300px; overflow: auto">
          <div
            class="customer-item"
            style="margin: 10px"
            v-for="item in customerList"
            :key="item.id"
          >
            {{ item.id }}---{{ item.name }}
            <i
              class="el-icon-delete"
              style="color: red; cursor: pointer"
              @click="delCustomer(index)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      auth_target: 1,
      userList: [],
      levelList: [],
      selectUser: '',
      customerList: [],
      modeList: [],
      vipList: []
    }
  },
  methods: {
    init() {
      if (this.id) {
        this.getList()
      }
      this.getGradeList()
      this.getUserGroup()
    },
    getList() {
      this.$request.authDetail(this.id).then(res => {
        if (res.ret) {
          this.auth_target = res.data.auth_target
          this.levelList = res.data.member_levels.map(item => item.id)
          this.userList = res.data.user_groups.map(item => item.id)
          this.customerList = res.data.users
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 选择客户
    querySearchUser(keyword, cb) {
      this.$request
        .getUsers({ keyword })
        .then(res => {
          if (res.ret) {
            cb(res.data)
          } else {
            cb([])
          }
        })
        .catch(() => cb([]))
    },
    //获取会员组
    getGradeList() {
      this.$request.getGradeList({ size: 100 }).then(res => {
        if (res.ret) {
          this.vipList = res.data.map(item => {
            let name = item.name
            let id = item.id
            return {
              name,
              id
            }
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    //获取客户组
    getUserGroup() {
      this.$request.getUserGroup({ size: 100 }).then(res => {
        if (res.ret) {
          this.modeList = res.data.map(item => {
            let name = item.name_cn
            let id = item.id
            return {
              name,
              id
            }
          })
        }
      })
    },
    handleSelect(item) {
      if (this.customerList.map(item => item.id).includes(item.id)) {
        return false
      }
      this.customerList.push(item)
    },
    delCustomer(index) {
      this.customerList.splice(index, 1)
    },
    confirm() {
      let params = {
        auth_target: this.auth_target,
        user_group_ids: this.userList,
        member_level_ids: this.levelList
      }
      params.user_ids = this.customerList.map(item => item.id)
      this.$request.userAuth(this.id, params).then(res => {
        console.log(res)
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.show = false
          this.success()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {
      this.id = ''
      this.auth_target = 1
      this.userList = []
      this.customerList = []
      this.levelList = []
    }
  }
}
</script>

<style lang="scss">
.box {
  display: flex;
  margin: 20px 0;
  .box-one {
    width: 200px;
    border: 1px solid #eee;
    border-radius: 6px;
    .box-one-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: #eee;
      border-bottom: 1px solid #eee;
    }
    .box-one-bottom {
      padding: 10px;
      height: 300px;
      overflow: auto;
      .el-checkbox {
        margin: 10px 0;
        display: block;
      }
    }
  }
  .box-two {
    width: 200px;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-left: 20px;
    .box-two-left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: #eee;
      border-bottom: 1px solid #eee;
    }
    .box-two-bottom {
      padding: 10px;
      height: 300px;
      overflow: auto;
      .el-checkbox {
        margin: 10px 0;
        display: block;
      }
    }
  }
  .box-three {
    width: 240px;
    border: 1px solid #eee;
    border-radius: 6px;
    margin-left: 20px;
    .box-three-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: #eee;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
