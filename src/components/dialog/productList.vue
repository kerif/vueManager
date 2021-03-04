<template>
  <el-dialog :visible.sync="show" :title="state === 'add' ? $t('添加商品明细') : $t('修改商品明细')" class="dialog-add-setting" width="45%"
  @close="clear">
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm"
    label-position="top">
        <!-- 货品名称 -->
        <el-form-item :label="$t('*货品名称')">
          <el-input v-model="ruleForm.name">
          </el-input>
        </el-form-item>
        <!-- 货品数量 -->
        <el-form-item :label="$t('*货品数量')" class="product-num">
          <el-input-number v-model="ruleForm.qty" @change="handleChange" :min="1" :label="$t('描述文字')"></el-input-number>
        </el-form-item>
        <!-- 货品单价 -->
        <el-form-item :label="$t('*货品单价') + this.currencyUnit">
          <el-input v-model="ruleForm.unit_price">
          </el-input>
        </el-form-item>
        <!-- 材质 -->
        <el-form-item :label="$t('材质') + this.currencyUnit">
          <el-input v-model="ruleForm.material">
          </el-input>
        </el-form-item>
        <!-- 品牌 -->
        <el-form-item :label="$t('品牌')">
          <el-input v-model="ruleForm.brand">
          </el-input>
        </el-form-item>
        <!-- 规格 -->
        <el-form-item :label="$t('规格') + this.currencyUnit">
          <el-input v-model="ruleForm.spec">
          </el-input>
        </el-form-item>
        <!-- 货品状态 -->
        <el-form-item :label="$t('*货品状态')" class="service-style">
          <el-radio-group v-model="ruleForm.status">
            <el-radio v-for="item in updateProp" :key="item.id" :label="item.id">{{item.name}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 照片 -->
        <el-form-item :label="$t('照片')" class="updateChe">
            <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img">
            <span class="model-box"></span>
            <span class="operat-box">
                <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
            </span>
            </span>
          <el-upload
            v-show="baleImgList.length < 3"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImg"
            :show-file-list="false">
            <i class="el-icon-plus">
            </i>
        </el-upload>
        <div class="updateImg">{{$t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张')}}</div>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('备注')">
            <el-input type="textarea" v-model="ruleForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :placeholder="$t('请输入备注')"></el-input>
       </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{$t('取消')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('确定')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      ruleForm: {
        unit_price: '',
        material: '',
        brand: '',
        spec: '',
        name: '',
        remark: '',
        status: '',
        qty: 1,
        images: ''
      },
      state: '',
      currencyUnit: '',
      id: '',
      ele: '',
      tranAmount: '',
      updateProp: [
        {
          id: 0,
          name: this.$t('正常')
        }, {
          id: 1,
          name: this.$t('破损')
        }, {
          id: 2,
          name: this.$t('问题件')
        }
      ],
      baleImgList: [],
      localization: {}
    }
  },
  methods: {
    getList () {
      this.$request.getSingleDetails(this.id, this.ele).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.baleImgList = res.data.images
          console.log(this.ruleForm, 'this.ruleForm')
          // res.data.images && (this.baleImgList = { url: res.data.images })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    handleChange (value) {
      console.log(value)
    },
    confirm () {
      console.log(this.ruleForm.status, 'ruleForm.status')
      this.ruleForm.images = this.baleImgList
      if (!this.ruleForm.name) {
        return this.$message.error(this.$t('请输入货品名称'))
      } else if (!this.ruleForm.qty) {
        return this.$message.error(this.$t('请输入货品数量'))
      } else if (this.ruleForm.status === '') {
        return this.$message.error(this.$t('请选择货品状态'))
      } else if (!this.ruleForm.unit_price) {
        return this.$message.error(this.$t('请输入货品单价'))
      } else {
        if (this.state === 'add') { // 新增商品清单保存
          this.$request.updatePackagesDetails(this.id, this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            this.show = false
          })
        } else { // 编辑商品清单保存
          this.$request.saveSingleDetails(this.id, this.ele, this.ruleForm).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.show = false
              this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            this.show = false
          })
        }
      }
    },
    // 上传商品照片
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        console.log(res)
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 预览图片
    onPreview (image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg (index) {
      this.baleImgList.splice(index, 1)
    },
    // 上传图片
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clear () {
      this.ruleForm.unit_price = ''
      this.ruleForm.material = ''
      this.ruleForm.qty = ''
      this.ruleForm.brand = ''
      this.ruleForm.spec = ''
      this.ruleForm.name = ''
      this.ruleForm.status = ''
      this.ruleForm.remark = ''
      this.baleImgList = []
      this.ruleForm.images = []
    },
    init () {
      console.log(this.id, '我是接受id')
      if (this.state === 'edit') {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss">
.dialog-add-setting {
  .el-dialog__body {
    margin-left: 20px !important;
  }
  .el-input {
    width: 70%;
  }
  .el-textarea__inner {
    width: 70%;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      width: 500px !important;
    }
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
    margin-left: 50px;
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
      .model-box, .operat-box {
        opacity: 1;
        transition: all .5s ease-in;
      }
    }
  }
  .model-box {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, .3);
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
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
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
  .product-num {
    .el-input {
      width: 100%;
    }
  }
}
</style>
