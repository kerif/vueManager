<template>
  <div class="main">
    <el-dialog
      title="抽奖奖品设置"
      :visible="value"
      width="600px"
      @close="handleClose()"
    >
      <el-form ref="form" :model="giftForm" label-width="100px" style="width: 420px">
        <el-form-item :label="$t('中奖图片')">
          <span class="img-item" v-if="giftForm.gift_image">
            <img :src="$baseUrl.IMAGE_URL + giftForm.gift_image" alt="" class="goods-img" />
            <span class="model-box"></span>
            <span class="operate-box">
              <i class="el-icon-zoom-in" @click="onPreview(giftForm.gift_image)"></i>
              <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
            </span>
          </span>
          <el-upload
            v-show="!giftForm.gift_image"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImg"
            :show-file-list="false"
          >
            <i class="el-icon-plus"> </i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('奖品类型')">
          <el-radio-group v-model="giftForm.gift_type" @change="changeType">
            <el-radio :label="item.value" v-for="(item, index) in typeList" :key="index">{{ $t(item.label) }}</el-radio>
          </el-radio-group>
          <div style="margin-top: 10px">
            <el-select
              v-model="giftForm.gift_value"
              :placeholder="$t('请选择优惠券')"
              v-if="~~giftForm.gift_type === 1"
              style="width: 320px"
              @change="changeCoupon"
              filterable
            >
              <el-option
                v-for="item in couponList"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="giftForm.gift_name"
              :placeholder="$t('请输入自定义奖品名称')"
              v-else
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item :label="$t('投放数量')">
          <el-input v-model="giftForm.gift_num"></el-input>
        </el-form-item>
        <el-form-item :label="$t('限定中奖用户')">
          <el-select v-model="giftForm.limit_user" style="width: 320px" filterable multiple>
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialog from '@/components/dialog'

export default {
  name: 'addGift',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    giftInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      giftForm: {
        gift_name: '',
        gift_image: '',
        gift_type: 1,
        gift_value: '',
        gift_num: '',
        limit_user: []
      },
      typeList: [
        { label: '券', value: 1 },
        { label: '自定义', value: 2 }
      ],
      couponList: [],
      userList: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('input', false)
    },
    getCouponList() {
      this.$request
        .getCouponList({
          status: 2,
          page: 1,
          size: 1000
        })
        .then(res => {
          this.couponList = res.data
        })
    },
    getUserList() {
      this.$request.getUsers({}).then(res => {
        this.userList = res.data
      })
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          this.$set(this.giftForm, 'gift_image', res.data[0].path)
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
    changeCoupon(value) {
      let obj = this.couponList.find(item => {
        return item.id === value
      })
      this.giftForm.gift_name = obj.name
    },
    changeType() {
      this.giftForm.gift_name = ''
    },
    submit() {
      let obj = this.typeList.find(item => {
        return item.value === this.giftForm.gift_type
      })
      this.giftForm.gift_type_text = obj.label
      if (
        !this.giftForm.gift_image ||
        !this.giftForm.gift_name ||
        !this.giftForm.gift_type ||
        !this.giftForm.gift_num
      ) {
        this.$message.warning('请补充完整的信息')
        return false
      }
      this.$emit('submit', this.giftForm)
      this.handleClose()
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getCouponList()
        this.getUserList()
        if (this.giftInfo) {
          this.giftForm = JSON.parse(JSON.stringify(this.giftInfo))
          this.giftForm.gift_value = parseInt(this.giftForm.gift_value)
        } else {
          this.giftForm = { gift_image: '', limit_user: [], gift_type: 1, gift_name: '' }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.main {
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
      .operate-box {
        opacity: 1;
        transition: all 0.5s ease-in;
      }
    }
  }
}
</style>
