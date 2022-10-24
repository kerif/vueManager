<template>
  <el-dialog :visible.sync="show" :title="$t('新增拼团')" width="60%" @close="clear">
    <el-row :gutter="20">
      <el-form :model="ruleForm" label-width="120px">
        <el-col :span="17">
          <el-form-item :label="$t('发起拼团成员')">
            <el-select :placeholder="$t('请选择')">
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('拼团名称')">
            <el-input :placeholder="$t('请输入拼团名称')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('拼团仓库')">
            <el-select :placeholder="$t('请选择')">
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('收货地址')">
            <div style="padding: 35px; border-radius: 5px; border: 1px dashed #000">
              <div style="display: flex; align-items: center">
                <el-button class="btn-light-green">{{ $t('选择地址') }}</el-button>
                <el-button class="btn-main">{{ $t('新增地址') }}</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('拼团渠道')">
            <div style="padding: 35px; border-radius: 5px; border: 1px dashed #000">
              <div style="display: flex; align-items: center">
                <el-button class="btn-light-green">{{ $t('选择渠道') }}</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('派送形式')">
            <el-radio>{{ $t('送货上门') }}</el-radio>
            <el-radio>{{ $t('自提点收货') }}</el-radio>
            <div style="padding: 35px; border-radius: 5px; border: 1px dashed #000">
              <div style="display: flex; align-items: center">
                <el-button class="btn-light-green">{{ $t('选择自提点') }}</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('支付方式')">
            <el-radio>{{ $t('团员自付') }}</el-radio>
            <el-radio>{{ $t('团长代付') }}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('拼团截止')"></el-form-item>
          <el-form-item :label="$t('是否为公开拼团')">
            <el-switch active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </el-form-item>
          <el-form-item :label="$t('拼团介绍')">
            <el-input type="textarea" :placeholder="$t('请输入拼团介绍')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-upload
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImg"
            :show-file-list="false"
          >
            <i class="el-icon-plus"> </i>
          </el-upload>
          <div style="margin-top: 10px; text-align: center">{{ $t('上传拼团封面图') }}</div>
        </el-col>
      </el-form>
    </el-row>
    <div slot="footer">
      <el-button type="primary" @click="confirm">{{ $t('保存') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {}
    }
  },
  methods: {
    uploadBaleImg() {},
    confirm() {},
    clear() {}
  }
}
</script>

<style></style>
