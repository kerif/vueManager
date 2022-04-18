<template>
  <el-dialog :visible.sync="showGoods" :title="$t('添加商品')" :before-close="close" @close="clear">
    <h3>{{ $t('基础信息') }}</h3>
    <el-form label-position="right" :rules="rules" label-width="120px" :model="ruleForm">
      <el-form-item :label="$t('中文名称')" prop="name">
        <el-input class="input-sty" v-model="ruleForm.name" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('英文名称')" prop="eName">
        <el-input class="input-sty" v-model="ruleForm.eName" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('品牌')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('商品分类')" prop="type">
        <el-input class="input-sty" v-model="ruleForm.type" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('商品属性')" prop="radio">
        <el-radio-group v-model="ruleForm.radio">
          <el-radio :label="0">备选项</el-radio>
          <el-radio :label="1">备选项</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('采购单价')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('物品总数量')" prop="number">
        <el-input
          class="input-sty"
          v-model="ruleForm.number"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('总箱数')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('箱规')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('条码')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('物品照片')" prop="baleImgList">
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
      <el-form-item :label="$t('供应商')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('HS CODE')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('SKU')" prop="value">
        <el-input class="input-sty" v-model="ruleForm.value" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="showGoods = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      baleImgList: [],
      ruleForm: {
        name: '',
        eName: '',
        type: '',
        number: '',
        radio: 1,
        value: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        eName: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        type: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        number: [{ required: true, message: this.$t('请输入'), trigger: 'blur' }],
        radio: [{ required: true, message: this.$t('请选择'), trigger: 'change' }]
      }
    }
  },
  props: {
    showGoods: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        }
      })
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
    },
    close() {
      this.$emit('passVal', false)
    },
    submit() {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //   } else {
      //   }
      // })
    },
    clear() {}
  }
}
</script>

<style lang="scss">
.el-dialog__header {
  background-color: #0e102a;
}
.el-dialog__title {
  font-size: 14px;
  color: #fff;
}
.el-dialog__close {
  color: #fff;
}
.input-sty {
  width: 40%;
}
</style>
