<template>
  <div>
    <el-dialog
      :title="title"
      :visible="value"
      :width="width"
      @close="handleClose">
      <div>
        <div class="box">
          <div class="box-one">
            <div class="box-one-top">
              <div>{{ $t('用户组') }}</div>
              <div>{{ chooseUserList.userGroupList.length }}</div>
            </div>
            <div class="box-one-bottom">
              <el-checkbox-group v-model="chooseUserList.userGroupList">
                <el-checkbox v-for="item in modeList" :key="item.id" :label="item.id">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-two">
            <div class="box-two-left">
              <div>{{ $t('特定等级组') }}</div>
              <div>{{ chooseUserList.levelList.length }}</div>
            </div>
            <div class="box-two-bottom">
              <el-checkbox-group v-model="chooseUserList.levelList">
                <el-checkbox v-for="item in vipList" :key="item.id" :label="item.id">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-two">
            <div class="box-two-left">
              <div>{{ $t('客户标签组') }}</div>
              <div>{{ chooseUserList.tagList.length }}</div>
            </div>
            <div class="box-two-bottom">
              <el-checkbox-group v-model="chooseUserList.tagList">
                <el-checkbox v-for="item in labelList" :key="item.id" :label="item.id">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="box-three">
            <div class="box-three-top">
              <div>{{ $t('特定客户') }}</div>
              <div>{{ chooseUserList.customerList.length }}</div>
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
                v-for="(item, index) in chooseUserList.customerList"
                :key="index"
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
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择客户'
    },
    width: {
      type: String,
      default: '1000px'
    },
    chooseUser: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectUser: '',
      chooseUserList: {
        userGroupList: [],
        levelList: [],
        tagList: [],
        customerList: []
      },
      modeList: [],
      vipList: [],
      labelList: []
    }
  },
  created() {
    this.getGradeList()
    this.getUserGroup()
    this.getLabelList()
  },
  methods: {
    handleClose() {
      this.$emit('input', false)
    },
    submit() {
      this.$emit('submit', this.chooseUserList)
      this.handleClose()
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
    // 客户标签
    getLabelList() {
      this.$request.userTag({ size: 100 }).then(res => {
        if (res.ret) {
          this.labelList = res.data
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
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
    handleSelect(item) {
      if (this.chooseUserList.customerList.map(item => item.id).includes(item.id)) {
        return false
      }
      this.chooseUserList.customerList.push(item)
      this.selectUser = ''
    },
    delCustomer(index) {
      this.customerList.splice(index, 1)
    },
    clear() {
      this.chooseUserList = {
        userGroupList: [],
        levelList: [],
        tagList: [],
        customerList: []
      }
    },
    toNumber(arr) {
      return arr.map(item => parseInt(item))
    }
  },
  watch: {
    value(val) {
      if (val) {
        if (this.chooseUser) {
          this.chooseUserList.userGroupList = this.toNumber(this.chooseUser.userGroupList || [])
          this.chooseUserList.levelList = this.toNumber(this.chooseUser.levelList || [])
          this.chooseUserList.tagList = this.toNumber(this.chooseUser.tagList || [])
          let customerList = this.chooseUser.customerList || []
          this.chooseUserList.customerList = JSON.parse(JSON.stringify(customerList))
        } else {
          this.clear()
        }
        console.log(this.chooseUserList)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
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
