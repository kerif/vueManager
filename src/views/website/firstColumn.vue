<template>
  <div class="first-column-container">
    <el-form label-position="top" class="voucher-form" :model="ruleForm" ref="ruleForm">
      <!-- 排序 -->
      <el-form-item :label="$t('排序')">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入排序')"
          v-model="ruleForm.sort_index"
        ></el-input>
      </el-form-item>
      <!-- 栏目名称 -->
      <el-form-item :label="'*' + $t('栏目名称')">
        <el-input
          class="input-sty"
          :placeholder="$t('请输入栏目名称')"
          v-model="ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="save-btn"
          @click="submit"
          :loading="$store.state.btnLoading"
          >{{ $t('保存') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        sort_index: ''
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getList()
    }
  },
  methods: {
    getList() {
      this.$request.getAloneWebsites(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm.name = res.data.name
          this.ruleForm.sort_index = res.data.sort_index
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 保存
    submit() {
      if (!this.ruleForm.name) {
        return this.$message.error(this.$t('请输入栏目名称'))
      }
      // if (!this.customerList[0]) {
      //   return this.$message.error(this.$t('请上传pc端客户二维码'))
      // }
      this.$request.editArticle(this.$route.params.id, this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.$router.go(-1)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.first-column-container {
  background-color: #fff !important;
  padding: 20px;
  .voucher-form {
    // padding-left: 50px;
  }
  .save-btn {
    min-width: 100px;
  }
  .input-sty {
    width: 40%;
  }
  .choose-btn {
    margin-bottom: 20px;
    // margin-left: 80px;
    .el-button {
      vertical-align: top;
    }
  }
  .display-line {
    display: inline-block;
    padding: 5px;
    width: 245px;
    margin-left: 15px;
    // line-height: 25px;
    background-color: #ccc;
    // margin-bottom: 20px;
    p {
      margin: 0;
    }
  }
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
    // margin-left: 50px;
  }
  .img-item {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    width: 148px;
    height: 148px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 6px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      .model-box,
      .operat-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .operat-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    i {
      font-size: 20px;
      color: #fff;
      margin-right: 10px;
    }
  }
}
</style>
