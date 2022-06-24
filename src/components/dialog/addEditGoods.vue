<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'edit' ? $t('修改商品') : $t('添加商品')"
    @close="clear"
  >
    <h3>{{ $t('基础信息') }}</h3>
    <el-form
      label-position="right"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      :model="ruleForm"
    >
      <el-form-item :label="$t('商品编号')" prop="number">
        <el-input
          v-model="ruleForm.number"
          :placeholder="$t('请输入')"
          class="input-sty"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('中文名称')" prop="cn_name">
        <el-input
          class="input-sty"
          v-model="ruleForm.cn_name"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('英文名称')">
        <el-input
          class="input-sty"
          v-model="ruleForm.en_name"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('包装')" prop="casing">
        <el-input
          class="input-sty"
          v-model="ruleForm.casing"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('材质')" prop="material">
        <el-input
          class="input-sty"
          v-model="ruleForm.material"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('颜色')" prop="color">
        <el-input class="input-sty" v-model="ruleForm.color" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('价格')" prop="purchase_price">
        <el-input
          class="input-sty"
          v-model="ruleForm.purchase_price"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('应到数量')" prop="quantity">
        <el-input
          class="input-sty"
          v-model="ruleForm.quantity"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('装箱数')" prop="box_count">
        <el-input
          class="input-sty"
          v-model="ruleForm.box_count"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item label="barcode" prop="barcode">
        <el-input
          class="input-sty"
          v-model="ruleForm.barcode"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('物品照片')" prop="image">
        <span class="img-item" v-if="ruleForm.image">
          <img :src="$baseUrl.IMAGE_URL + ruleForm.image" alt="" class="goods-img" />
          <span class="model-box"></span>
          <span class="operat-box">
            <i class="el-icon-zoom-in" @click="onPreview(ruleForm.image)"></i>
            <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
          </span>
        </span>
        <el-upload
          v-show="!ruleForm.image"
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
      <el-button type="primary" @click="submit('ruleForm')">{{ $t('提交') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      purchase: {},
      state: '',
      options: [],
      ruleForm: {
        number: '',
        material: '',
        casing: '',
        color: '',
        cn_name: '',
        en_name: '',
        barcode: '',
        quantity: '',
        purchase_price: '',
        box_count: '',
        image: ''
      },
      propList: [],
      level: [],
      label: '',
      classifyList: [],
      rules: {
        purchase_price: [{ required: true, message: this.$t('请输入价格'), trigger: 'blur' }],
        number: [{ required: true, message: this.$t('请输入商品编号'), trigger: 'blur' }],
        cn_name: [{ required: true, message: this.$t('请输入中文名称'), trigger: 'blur' }],
        quantity: [{ required: true, message: this.$t('请输入物品总数量'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {
      this.getProp()
      this.getGoods()
      if (this.state === 'edit') {
        this.ruleForm = this.purchase
      }
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.ruleForm.image = res.data[0].path
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
    onDeleteImg() {
      this.ruleForm.image = ''
    },
    handleVal(val) {
      this.level = val
      this.label = this.$refs.good.getCheckedNodes()[0].label
    },
    handleClick(v) {
      console.log(v)
    },
    getGoods() {
      this.$request.getAllTree().then(res => {
        if (res.ret) {
          if (res.data.length) {
            this.options = res.data
            this.classifyList = res.data.map(item => {
              return {
                value: item.id,
                label: item.name,
                children:
                  item.children < 1
                    ? undefined
                    : item.children.map(item => {
                        return {
                          value: item.id,
                          label: item.name,
                          children:
                            item.children < 1
                              ? undefined
                              : item.children.map(item => {
                                  return {
                                    value: item.id,
                                    label: item.name
                                  }
                                })
                        }
                      })
              }
            })
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getProp() {
      this.$request.getProps().then(res => {
        if (res.ret) {
          this.propList = res.data
        }
      })
    },
    submit(formName) {
      let params = {
        ...this.ruleForm
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.state === 'edit') {
            this.success(JSON.parse(JSON.stringify(params)))
            this.show = false
          } else {
            this.show = false
            this.success(params)
          }
        } else {
          return false
        }
      })
    },
    clear() {
      this.purchase = {}
      this.ruleForm.number = ''
      this.ruleForm.material = ''
      this.ruleForm.color = ''
      this.ruleForm.casing = ''
      this.ruleForm.cn_name = ''
      this.ruleForm.en_name = ''
      this.ruleForm.barcode = ''
      this.ruleForm.box_count = ''
      this.ruleForm.quantity = ''
      this.ruleForm.purchase_price = ''
      this.ruleForm.image = ''
    }
  }
}
</script>

<style lang="scss">
.input-sty {
  width: 40%;
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
</style>
