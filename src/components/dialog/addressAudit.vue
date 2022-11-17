<template>
  <el-dialog :visible.sync="show" class="address-audit" :title="$t('审核状态')" @close="clear">
    <el-form label-width="150px" label-position="left">
      <el-form-item :label="$t('用户编号')">
        <span>{{ userInfo.user_id }}</span>
      </el-form-item>
      <el-form-item :label="$t('国家地区')">
        <span>{{ userInfo.country && userInfo.country.name }}</span>
      </el-form-item>
      <el-form-item :label="$t('区域')">
        <span>{{ userInfo.sub_area && userInfo.sub_area.name }}</span>
      </el-form-item>
      <el-form-item :label="$t('城市')">
        <span>{{ userInfo.area && userInfo.area.city }}</span>
      </el-form-item>
      <el-form-item :label="$t('街道')"
        ><span>{{ userInfo.street }}</span></el-form-item
      >
      <el-form-item :label="$t('门牌号')">
        <span>{{ userInfo.door_no }}</span>
      </el-form-item>
      <el-form-item :label="$t('邮编')">
        <span>{{ userInfo.postcode }}</span>
      </el-form-item>
      <el-form-item :label="$t('审核')">
        <el-radio-group v-model="status">
          <el-radio :label="1">{{ $t('通过') }}</el-radio>
          <el-radio :label="2">{{ $t('拒绝') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('拒绝原因')" v-if="status === 2">
        <el-input
          v-model="remark"
          style="width: 50%"
          type="textarea"
          :placeholder="$t('请输入拒绝原因')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('用户分组')" v-if="status === 2">
        <el-select v-model="group_id" :placeholder="$t('请选择用户分组')">
          <el-option
            v-for="item in userGroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      status: 1,
      group_id: '',
      address_status: '',
      remark: '',
      userGroupList: [],
      userInfo: {}
    }
  },
  methods: {
    init() {
      this.getList()
      this.getUserGroup()
    },
    getList() {
      this.$request.singleAddress(this.id).then(res => {
        this.userInfo = res.data
      })
    },
    getUserGroup() {
      this.$request.getUserGroup().then(res => {
        this.userGroupList = res.data.map(item => {
          const id = item.id
          const name = item.name_cn
          return {
            id,
            name
          }
        })
      })
    },
    onConfirm() {
      let params = {
        status: this.status,
        remark: this.remark,
        group_id: this.group_id
      }
      this.$request.addressAudit(this.id, params).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
          this.success()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    clear() {
      this.id = ''
      this.status = 1
      this.group_id = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.address-audit {
  padding: 10px 20px;
}
</style>
