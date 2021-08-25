<template>
  <el-dialog :visible.sync="show" :title="$t('审核')" class="dialog-addInvoicing">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <!--开票金额  -->
      <el-form-item :label="$t('开票金额')" prop="amount">
        <el-input v-model="ruleForm.amount"> </el-input>
      </el-form-item>
      <!-- 发票号码 -->
      <el-form-item :label="$t('发票号码')" prop="amount">
        <el-input v-model="ruleForm.amount"> </el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('备注')" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="ruleForm.remark"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
      <!--上传照片-->
      <el-form-item :label="$t('上传照片')">
        <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
          <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="baleImgList.length < 3"
          class="avatar-uploader"
          action=""
          list-type="picture-card"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dialog-addInvoicing {
}
</style>
