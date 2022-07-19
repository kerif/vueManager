<template>
  <el-dialog :title="$t('员工二维码')" :visible.sync="show" @close="clear">
    <el-form :model="ruleForm">
      <el-form-item :label="$t('新客户归属客户组')">
        <el-select v-model="ruleForm.invite_user_group_id" clearable>
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :value="item.id"
            :label="item.name_cn"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="img_box">
      <img :src="$baseUrl.IMAGE_URL + code" class="imgDialog" />
      <div class="code">
        <div class="img-code">{{ username }}</div>
        <el-button
          size="mini"
          class="btn-light-red"
          style="margin-left: 20px"
          @click="uploadQRCode"
          >{{ $t('下载二维码') }}</el-button
        >
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="onSubmit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { downloadStreamFile } from '@/utils/index'
export default {
  data() {
    return {
      username: '',
      code: '',
      id: '',
      groupList: [],
      ruleForm: {
        invite_user_group_id: ''
      }
    }
  },
  methods: {
    init() {
      this.getQRCode()
      this.getUserGroup()
    },
    getUserGroup() {
      this.$request.getUserGroup().then(res => {
        if (res.ret) {
          this.groupList = res.data
        }
      })
    },
    getQRCode() {
      this.$request.inviteCode(this.id).then(res => {
        if (res.ret) {
          this.code = res.data.invite_code
          this.ruleForm.invite_user_group_id = res.data.invite_user_group_id
        }
      })
    },
    uploadQRCode() {
      if (this.code) {
        // let url = `${this.$baseUrl.IMAGE_URL}${this.code}`
        // let a = document.createElement('a')
        // a.href = url
        // a.download = 'pic'
        // a.click()
        // window.open(`${this.$baseUrl.IMAGE_URL}${this.code}`)
        downloadStreamFile(`${this.$baseUrl.IMAGE_URL}${this.code}`, '二维码', 'jpg')
      }
    },
    onSubmit() {
      let groupId = this.ruleForm.invite_user_group_id
      this.$request.inviteUserGroup(this.id, groupId).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.show = false
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.img_box {
  margin-top: 20px;
  text-align: center;
  .imgDialog {
    width: 25%;
  }
}
.img-code {
  display: inline-block;
}
.code {
  margin-top: 20px;
}
</style>
