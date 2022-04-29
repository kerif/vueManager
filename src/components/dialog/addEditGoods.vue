<template>
  <el-dialog
    :visible.sync="show"
    :title="state === 'edit' ? $t('修改商品') : $t('添加商品')"
    @close="clear"
  >
    <h3>{{ $t('基础信息') }}</h3>
    <el-form label-position="right" :rules="rules" label-width="120px" :model="ruleForm">
      <el-form-item :label="$t('中文名称')" prop="cn_name">
        <el-input
          class="input-sty"
          v-model="ruleForm.cn_name"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('英文名称')" prop="en_name">
        <el-input
          class="input-sty"
          v-model="ruleForm.en_name"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('品牌')" prop="brand">
        <el-input class="input-sty" v-model="ruleForm.brand" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('商品分类')" prop="category_id">
        <el-cascader
          v-model="ruleForm.category_id"
          :options="classifyList"
          ref="good"
          :props="props"
          :show-all-levels="false"
          @change="handleVal"
        ></el-cascader>
      </el-form-item>
      <el-form-item :label="$t('商品属性')" prop="prop_id">
        <el-radio-group v-model="ruleForm.prop_id" @change="handleClick">
          <el-radio v-for="item in propList" :key="item.id" :label="item.id">{{
            item.name
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('采购单价')" prop="purchase_price">
        <el-input
          class="input-sty"
          v-model="ruleForm.purchase_price"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('物品总数量')" prop="quantity">
        <el-input
          class="input-sty"
          v-model="ruleForm.quantity"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('总箱数')" prop="box_count">
        <el-input
          class="input-sty"
          v-model="ruleForm.box_count"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('箱规')" prop="box_spec">
        <el-input
          class="input-sty"
          v-model="ruleForm.box_spec"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('条码')" prop="barcode">
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
      <el-form-item :label="$t('供应商')" prop="distributor">
        <el-input
          class="input-sty"
          v-model="ruleForm.distributor"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('HS CODE')" prop="hs_code">
        <el-input
          class="input-sty"
          v-model="ruleForm.hs_code"
          :placeholder="$t('请输入')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('SKU')" prop="sku">
        <el-input class="input-sty" v-model="ruleForm.sku" :placeholder="$t('请输入')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
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
        cn_name: '',
        en_name: '',
        brand: '',
        category_id: '',
        category_name: '',
        barcode: '',
        prop_id: '',
        prop_name: '',
        distributor: '',
        sku: '',
        hs_code: '',
        quantity: '',
        purchase_price: '',
        box_spec: '',
        image: ''
      },
      propList: [],
      level: [],
      props: { checkStrictly: false },
      classifyList: [],
      rules: {
        cn_name: [{ required: true, message: this.$t('请输入中文名称'), trigger: 'blur' }],
        en_name: [{ required: true, message: this.$t('请输入英文名称'), trigger: 'blur' }],
        prop_id: [{ required: true, message: this.$t('请输入商品属性'), trigger: 'change' }],
        quantity: [{ required: true, message: this.$t('请输入物品总数量'), trigger: 'blur' }],
        category_id: [{ required: true, message: this.$t('请选择商品分类'), trigger: 'change' }]
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
      console.log(val)
      this.level = val
      console.log(this.level)
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
    submit() {
      if (this.level.length) {
        console.log(this.level[this.level.length - 1])
        this.ruleForm.category_id = this.level[this.level.length - 1]
      }
      console.log(this.ruleForm.category_id)
      this.ruleForm.category_name = this.$refs.good.getCheckedNodes()[0].label
      this.propList.forEach(item => {
        if (item.id === this.ruleForm.prop_id) {
          this.ruleForm.prop_name = item.name
        }
      })
      let params = {
        ...this.ruleForm
      }
      if (this.state === 'edit') {
        this.success(JSON.parse(JSON.stringify(params)))
        this.show = false
      } else {
        this.show = false
        this.success(params)
      }
    },
    clear() {
      this.purchase = {}
      this.ruleForm.cn_name = ''
      this.ruleForm.en_name = ''
      this.ruleForm.brand = ''
      this.ruleForm.category_id = ''
      this.ruleForm.barcode = ''
      this.ruleForm.prop_id = ''
      this.ruleForm.distributor = ''
      this.ruleForm.sku = ''
      this.ruleForm.hs_code = ''
      this.ruleForm.quantity = ''
      this.ruleForm.purchase_price = ''
      this.ruleForm.box_spec = ''
      this.ruleForm.image = []
    }
  }
}
</script>

<style>
.input-sty {
  width: 40%;
}
</style>
