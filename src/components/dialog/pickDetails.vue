<template>
  <el-dialog
    :visible.sync="show"
    :title="$t('订单详情')"
    class="finish-details-container"
    @close="clear"
    width="85%"
  >
    <div class="receiverMSg msg-top"></div>
    <h3 class="change-sty">{{ $t('收货人信息') }}</h3>
    <el-form
      label-width="100px"
      :model="form"
      ref="form"
      class="demo-ruleForm"
      label-position="right"
    >
      <el-row class="container-center" :gutter="20">
        <!-- 客户ID -->
        <el-col :span="7">
          <p class="leftWidth">{{ $t('客户ID') }}</p>
          <span>{{ form.user_id }}</span>
        </el-col>
        <!-- 收件人 -->
        <el-col :span="7" :offset="1">
          <p class="leftWidth">{{ $t('收件人') }}</p>
          <span>{{ form.address && form.address.receiver_name }}</span>
        </el-col>
        <!-- 邮编 -->
        <el-col :span="7" :offset="1">
          <p class="leftWidth">{{ $t('邮编') }}</p>
          <span>{{ form.address && form.address.postcode }}</span>
        </el-col>
      </el-row>
      <el-row class="container-center" :gutter="20">
        <!-- 电话 -->
        <el-col :span="7">
          <p class="leftWidth">{{ $t('电话') }}</p>
          <span>{{ form.address && form.address.phone }}</span>
        </el-col>
        <!-- 收件人 -->
        <el-col :span="7" :offset="1">
          <p class="leftWidth">{{ $t('地址') }}</p>
          <span>{{ form.address && form.address.address }}</span>
        </el-col>
        <!-- 邮编 -->
        <el-col :span="7" :offset="1">
          <p class="leftWidth">{{ $t('线路类型') }}</p>
          <span>{{ form.express_line && form.express_line.cn_name }}</span>
        </el-col>
      </el-row>
      <el-row class="container-center" :gutter="20">
        <!-- 客户ID -->
        <el-col :span="7">
          <span class="leftWidth">{{ $t('转运单号') }}</span>
          <span>{{ form.logistics_sn }}</span>
        </el-col>
        <!-- 收件人 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('发货时间') }}</span>
          <span>{{ form.shipped_at }}</span>
        </el-col>
        <!-- 目的自提点 -->
        <el-col :span="7" :offset="1">
          <span class="leftWidth">{{ $t('目的自提点') }}</span>
          <span>{{ form.station_name }}</span>
        </el-col>
        <!-- 邮编 -->
        <!-- <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('自提点到货时间')}}</span>
              <span>{{form.station_shipped_at}}</span>
            </el-col> -->
      </el-row>
      <!-- <h3 class="change-sty">{{$t('费用信息')}}</h3> -->
      <!-- <el-row class="container-center" :gutter="20">
            <el-col :span="7">
              <span class="leftWidth">{{$t('应付金额')}}</span>
              <span>{{form.payment && form.payment.order_amount}}</span>
            </el-col>
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('支付时间')}}</span>
              <span>{{form.payment &&form.payment.paid_at}}</span>
            </el-col>
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('支付金额')}}</span>
              <span>{{form.payment && form.payment.pay_amount}}</span>
            </el-col>
          </el-row> -->
      <!-- <el-row class="container-center" :gutter="20">
            <el-col :span="7">
              <span class="leftWidth">{{$t('抵用券金额')}}</span>
              <span>{{form.payment && form.payment.coupon_amount}}</span>
            </el-col>
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('支付方式')}}</span>
              <span>{{form.payment &&form.payment.payment_type_name }}</span>
            </el-col>
          </el-row> -->
      <!-- <el-row class="container-center" :gutter="20">
            <el-col :span="7">
              <div class="bale-left packed-details">
                <span class="leftWidth">{{$t('支付截图')}}</span>
                <div class="left-img" v-for="(item, index) in form.payment && form.payment.payment_images" :key="index">
                  <span style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item}`, imgVisible=true">
                    <img :src="`${$baseUrl.IMAGE_URL}${item}`" class="productImg" >
                  </span>
                </div>
              </div>
            </el-col>
          </el-row> -->
    </el-form>
    <!-- <div>
          <h3>{{$t('原始包裹清单')}}</h3>
          <el-table :data="pakeageData" class="data-list" border stripe
           v-loading="tableLoading">
            <el-table-column :label="$t('快递单号')" prop="express_num"></el-table-column>
            <el-table-column :label="$t('物品名称')" prop="package_name"></el-table-column>
            <el-table-column :label="$t('物品价格')" prop="package_value"></el-table-column>
            <el-table-column :label="$t('物品属性')">
              <template slot-scope="scope">
                <span v-for="item in scope.row.props" :key="item.id">{{item.cn_name}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div> -->
    <el-row>
      <el-col :span="10">
        <h3 class="outWahouse-sty">{{ $t('出库清单') }}</h3>
        <span>{{ $t('共有') }}{{ boxData.length }}{{ $t('箱物品') }}</span>
        <el-table :data="boxData" class="data-list" border stripe v-loading="tableLoading">
          <el-table-column :label="$t('单号')" prop="sn"></el-table-column>
          <el-table-column
            :label="$t('重量') + `${localization.weight_unit ? localization.weight_unit : ''}`"
            prop="weight"
          ></el-table-column>
          <el-table-column
            :label="$t('尺寸') + `${localization.length_unit ? localization.length_unit : ''}`"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.length }}</span
              >* <span>{{ scope.row.width }}</span
              >*
              <span>{{ scope.row.height }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('体积重量')" prop="volume_weight"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10" :offset="1">
        <div class="updateChe">
          <p>{{ $t('打包照片') }}</p>
          <span class="img-item" v-for="(item, index) in packageImgList" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img" />
            <span class="model-box"></span>
            <span class="operat-box">
              <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
              <!-- <i class="el-icon-delete" @click="onDeleteImg(index)"></i> -->
            </span>
          </span>
        </div>
      </el-col>
    </el-row>
    <h3 class="change-sty">{{ $t('反馈信息') }}</h3>
    <el-row class="container-center" :gutter="20">
      <el-col :span="7">
        <span class="leftWidth">{{ $t('发货时间') }}</span>
        <span>{{ form.shipped_at }}</span>
      </el-col>
      <el-col :span="7" :offset="1">
        <span class="leftWidth">{{ $t('自提点收货') }}</span>
        <span>{{ form.station_received_at }}</span>
      </el-col>
      <el-col :span="7" :offset="1">
        <span class="leftWidth">{{ $t('状态') }}</span>
        <span v-if="form.station_status === 1">{{ $t('收货') }}</span>
        <span v-if="form.station_status === 3">{{ $t('直接出库') }}</span>
        <span v-if="form.station_status === 4">{{ $t('自提签收') }}</span>
        <span v-if="form.station_status === 5"
          >{{ $t('转运出库') }}-{{ form.transport_station_name }}</span
        >
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
      <el-col :span="7">
        <span class="leftWidth">{{ $t('完成时间') }}</span>
        <span v-if="form.station_shipped_at">{{ form.station_shipped_at }}</span>
        <span v-else>{{ form.signed_at }}</span>
      </el-col>
      <el-col :span="7" :offset="1">
        <span class="leftWidth">{{ $t('签收备注') }}</span>
        <span>{{ form.sign_remark }}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
      <el-col :span="7">
        <!-- <span class="leftWidth">{{$t('签收签字')}}</span>
              <span>
                <img :src="form.sign_signature" class="productImg">
              </span> -->
        <div class="updateChe">
          <p>{{ $t('签收签字') }}</p>
          <span class="img-item" v-if="form.sign_signature">
            <img :src="form.sign_signature" alt="" class="goods-img" />
            <span class="model-box"></span>
            <span class="operat-box">
              <!-- <i class="el-icon-zoom-in" @click="onPreview(form.sign_signature)"></i> -->
              <!-- <i class="el-icon-delete" @click="onDeleteImg(index)"></i> -->
            </span>
          </span>
        </div>
      </el-col>
      <el-col :span="7">
        <!-- `${$baseUrl.IMAGE_URL}${item}` -->
        <div class="bale-left packed-details">
          <p class="leftWidth">{{ $t('签收照片') }}</p>
          <div class="left-img" v-for="(item, index) in form.sign_images" :key="index">
            <span style="cursor: pointer" @click.stop=";(imgSrc = `${item}`), (imgVisible = true)">
              <img :src="`${item}`" class="productImg" />
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <div slot="footer">
            <el-button @click="returnShip">{{$t('取消')}}</el-button>
            <el-button type="primary" @click="confirmSign">{{$t('确定')}}</el-button>
          </div> -->
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      innerVisible: false,
      tableLoading: false,
      invoiceList: [],
      invoice: {
        sn: ''
      },
      form: {},
      pakeageData: [],
      boxData: [],
      localization: {},
      goodsImgList: [],
      packageImgList: [],
      id: '',
      sign: {
        sign_images: '',
        sign_remark: ''
      },
      photoId: '',
      transferId: ''
    }
  },
  methods: {
    // 添加签收照片
    getList() {
      this.$request
        .photosData(this.id, {
          XStationId: this.transferId
        })
        .then(res => {
          if (res.ret) {
            this.form = res.data
            this.pakeageData = res.data.packages // 原始包裹清单
            this.boxData = res.data.box // 出库清单
            this.localization = res.localization
            this.form.sign_images = res.data.sign_images
            this.form.sign_signature = res.data.sign_signature
            this.packageImgList = res.data.pack_pictures
            this.sign.sign_remark = res.data.sign_remark
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    // 添加签收照片 取消
    returnShip() {
      this.show = false
    },
    // 上传物品照片
    uploadGoodsImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.goodsImgList.push({
              name: item.name,
              url: item.path
            })
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
      console.log(image, 'image')
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      this.goodsImgList.splice(index, 1)
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
    // 确定签收
    confirmSign() {
      this.sign.sign_images = this.goodsImgList.map(item => item.url)
      console.log(this.sign.sign_images, 'this.sign.sign_images')
      this.$request
        .updatePhotosData(this.id, {
          XStationId: this.transferId,
          sign_images: this.sign.sign_images,
          sign_remark: this.sign.sign_remark
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
    clear() {
      this.sign.sign_images = ''
      this.sign.sign_remark = ''
    },
    init() {
      this.getList()
    }
  }
}
</script>
<style lang="scss" scope>
.finish-details-container {
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
  .created-btn {
    margin-left: 5px;
  }
  .content-long {
    .el-scrollbar {
      width: 200px !important;
    }
  }
  .table-sty {
    margin-top: 20px;
  }
  .outWahouse-sty {
    display: inline-block;
    margin-right: 10px;
  }
}
.bale-left {
  width: 50%;
  display: inline-block;
  vertical-align: top;
}
.left-img {
  margin-top: 20px;
  padding: 10px 5px;
}
.productImg {
  border: 1px dashed #ccc;
  display: inline-block;
  margin-right: 15px;
  width: 110px;
  height: 100px;
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
.container-center {
  margin-bottom: 20px !important;
}
.leftWidth {
  display: inline-block;
  width: 120px;
}
.el-select-dropdown__item.hover {
  width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap; /*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
.goods-img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}
</style>
