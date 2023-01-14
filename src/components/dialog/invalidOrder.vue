<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('设为作废订单')"
    class="dialog-invalid-order"
    width="55%"
    @close="clear"
  >
    <div class="tip-box">
      <p>
        <span class="el-icon-warning icon-info"></span>
        {{ $t('已付款订单作废后，退款将进入财务模块进行审核') }}
      </p>
    </div>
    <div v-if="parent === 1" class="invalid-sty">
      <el-checkbox v-model="ruleForm.should_invalid_packages">{{
        $t('是否同时作废所有包裹')
      }}</el-checkbox>
    </div>
    <div v-else>
      <h4>{{ $t('选择弃件的包裹列表（勾选了用户不能再提交）') }}</h4>
      <el-table :data="voidList" class="data-list" border stripe @selection-change="onSelectChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('包裹单号')" prop="express_num"></el-table-column>
        <el-table-column :label="$t('包裹名称')" prop="package_name"></el-table-column>
        <el-table-column :label="$t('物品属性')">
          <template slot-scope="scope">
            <span v-for="item in scope.row.props" :key="item.id">
              {{ item.cn_name }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-position="top">
      <!-- 实际支付金额 -->
      <el-form-item
        :label="$t('实际支付金额') + this.localization.currency_unit"
        v-if="activeName === '3' || (status === 1 && paymentStatus === 2)"
      >
        <span>{{ this.payAmount }}</span
        >&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ '(' + this.paymentTypeName + ')' }}</span>
        <!-- <el-input v-model="this.payAmount" disabled></el-input> -->
      </el-form-item>
      <!-- 退款金额 -->
      <el-form-item :label="$t('*退款金额') + this.localization.currency_unit">
        <el-input
          class="input-sty"
          v-model="ruleForm.refund_amount"
          :disabled="
            (activeName === '1' && !(status === 1 && paymentStatus === 2)) || activeName === '2'
          "
        >
        </el-input>
        <div class="updateImg">
          {{ $t('退款金额不能超过下单实际支付金额，且券不能返还，代理产生的佣金将会被清掉') }}
        </div>
      </el-form-item>
      <!-- 退款方式 -->
      <el-form-item :label="$t('退款方式')">
        <el-select v-model="ruleForm.refund_type" placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="$t('原路返回')">
          <el-radio-group v-model="ruleForm.should_return_wechat">
            <el-radio v-for="item in updateProp" :key="item.id" :label="item.id">{{item.name}}
            </el-radio>
          </el-radio-group>
          <div class="updateImg">{{$t('选择是，如果是微信支付，直接退到微信账号上面。选择否的话，就退到余额中。')}}</div>
        </el-form-item> -->
      <el-form-item :label="$t('*其它方式')" v-if="ruleForm.refund_type === 2">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="$t('请备注具体退款方式')"
          v-model="ruleForm.refund_method"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('作废原因')">
        <el-input
          type="textarea"
          v-model="ruleForm.invalid_reason"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('请输入作废原因')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('备注截图')" class="updateChe">
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
          :before-upload="beforeUploadImg"
          :http-request="uploadBaleImg"
          :show-file-list="false"
        >
          <i class="el-icon-plus"> </i>
        </el-upload>
        <div class="updateImg">
          {{ $t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张') }}
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="show = false">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      ruleForm: {
        refund_amount: 0,
        invalid_reason: '',
        refund_method: '',
        images: [],
        invalid_package_ids: [],
        should_return_wechat: 0,
        should_invalid_packages: '',
        refund_type: 0
      },
      state: '',
      tranAmount: '',
      voidList: [],
      baleImgList: [],
      activeName: '',
      payAmount: '',
      paymentTypeName: '',
      localization: {},
      parent: '',
      packages: '',
      status: '',
      paymentStatus: '',
      updateProp: [
        {
          id: 0,
          name: this.$t('否')
        },
        {
          id: 1,
          name: this.$t('是')
        }
      ],
      options: [
        {
          id: 0,
          name: this.$t('原路返回（仅微信支付，其他方式退回余额）')
        },
        {
          id: 1,
          name: this.$t('账户余额')
        },
        {
          id: 2,
          name: this.$t('其他方式')
        }
      ],
      should_invalid_packages: '',
      value: '',
      textarea: ''
    }
  },
  methods: {
    getList() {
      this.$request.getVoidList(this.id).then(res => {
        if (res.ret) {
          this.voidList = res.data
          this.localization = res.localization
          // res.data.qr_code && (this.baleImgList[0] = res.data.qr_code)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    confirm() {
      if (this.baleImgList) {
        this.ruleForm.images = this.baleImgList
      } else {
        this.ruleForm.images = []
      }
      if (this.ruleForm.refund_amount === '') {
        return this.$message.error(this.$t('请输入退款金额'))
      } else if (this.ruleForm.refund_amount > this.payAmount) {
        return this.$message.error(this.$t('退款金额不能大于实际支付金额'))
      } else if (this.ruleForm.refund_type === 2 && !this.ruleForm.refund_method) {
        return this.$message.error(this.$t('请备注具体退款方式'))
      }
      this.$request
        .ordersInvalid(this.id, {
          ...this.ruleForm,
          should_invalid_packages: Number(this.ruleForm.should_invalid_packages)
        })
        .then(res => {
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
    },
    onSelectChange(selection) {
      this.ruleForm.invalid_package_ids = selection.map(item => item.id)
    },
    // 上传打包照片
    uploadBaleImg(item) {
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
    beforeUploadImg(file) {
      if (!/^image/.test(file.type)) {
        this.$message.info(this.$t('请上传图片类型文件'))
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info(this.$t('上传图片大小不能超过2M'))
        return false
      }
      return true
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
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    clear() {
      this.ruleForm.refund_amount = 0
      this.ruleForm.should_return_wechat = 0
      this.ruleForm.invalid_reason = ''
      this.ruleForm.refund_method = ''
      this.ruleForm.refund_type = 0
      this.baleImgList = []
      this.ruleForm.images = []
      this.ruleForm.invalid_package_ids = []
    },
    init() {
      this.getList()
      // this.paymentTypeName = this.paymentTypeName
      // this.payAmount = this.payAmount
      console.log(this.parent, 'parent')
    }
  }
}
</script>
<style lang="scss">
.dialog-invalid-order {
  .el-dialog__body {
    margin-left: 20px !important;
  }
  .input-sty {
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
  .goods-img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
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
  .updateImg {
    margin-top: 10px;
    color: #ccc;
    font-size: 13px;
  }
  .invalid-sty {
    margin-bottom: 15px;
  }
  .tip-box {
    width: 500px;
    height: 40px;
    line-height: 40px;
    padding-left: 25px;
    background: #fef0f0;
    p {
      color: red;
    }
  }
  .icon-info {
    position: relative;
    top: 2px;
    font-size: 18px;
  }
}
</style>
