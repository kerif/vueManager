<template>
  <el-dialog :visible.sync="show" :title="$t('关于我们')" class="check-we-dialog" @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-width="70px">
      <!-- 标题 -->
      <el-form-item :label="$t('标题')" class="input-style">
        <span>{{ruleForm.title}}</span>
      </el-form-item>
      <!-- 内容 -->
      <el-form-item :label="$t('内容')" class="input-style">
        <span>{{ruleForm.content}}</span>
      </el-form-item>
      <!-- 联系方式 -->
      <el-form-item :label="$t('联系方式')" class="input-style">
        {{ruleForm.contact}}
      </el-form-item>
      <!-- 附件 -->
      <el-form-item :label="$t('附件')" class="updateChe">
        <span v-for="item in ruleForm.images" :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
          <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" style="width: 40px; margin-right: 5px;">
        </span>
    </el-form-item>
    <!-- 创建时间 -->
    <el-form-item :label="$t('创建时间')" class="input-style">
      <span>{{ruleForm.created_at}}</span>
    </el-form-item>
    <!-- 更改状态 -->
    <el-form-item :label="$t('更改状态')">
      <el-select v-model="ruleForm.status" :placeholder="$t('请选择')">
        <el-option :label="$t('未处理')" :value="1"></el-option>
        <el-option :label="$t('已处理')" :value="2"></el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <!-- <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm('ruleForm')">{{$t('确定')}}</el-button>
    </div> -->
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        status: ''
      },
      baleImgList: []
    }
  },
  methods: {
    getList () {
      this.$request.aboutUs().then(res => {
        if (res.ret) {
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    clear () {
    },
    init () {
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.check-we-dialog {
  .status-box {
    text-align: center;
    margin: 20 0;
  }
  .el-input {
    width: 100% !important;
  }
  .el-dialog__header {
    background-color: #0E102A;
  }
  .el-dialog__title {
    font-size: 14px;
    color: #FFF;
  }
  .el-dialog__close {
    color: #FFF;
  }
  .input-style {
    .el-input__inner {
      width: 70%;
    }
    .el-textarea__inner {
      width: 70%;
    }
  }
  .el-form-item__label {
    margin-right: 40px;
  }
}
</style>
