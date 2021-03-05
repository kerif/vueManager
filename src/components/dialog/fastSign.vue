<template>
  <el-dialog :visible.sync="show" :title="$t('快速签收')" class="fast-sign-container"
  @close="clear" width="85%">
    <el-row>
      <el-col :span="12">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 8}"
        :placeholder="$t('多个包裹单号，请用回车分割')"
        v-model="textarea2">
      </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button @click.native="search">{{$t('确定')}}</el-button>
      </el-col>
    </el-row>
    <el-table
      class="table-sty"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <!-- 客户ID -->
      <el-table-column
        :label="$t('客户ID')">
        <template slot-scope="scope">
          <span>{{scope.row.user.id}}-{{scope.row.user.name}}</span>
        </template>
      </el-table-column>
      <!-- 转运单号 -->
      <el-table-column
        prop="order_sn"
        :label="$t('转运单号')">
      </el-table-column>
      <!-- 收件人 -->
      <el-table-column
        prop="receiver_name"
        :label="$t('收件人')">
      </el-table-column>
      <!-- 联系电话 -->
      <el-table-column
        prop="receiver_phone"
        :label="$t('联系电话')">
      </el-table-column>
      <!-- 到站时间 -->
      <el-table-column
        prop="shipped_at"
        :label="$t('到站时间')">
      </el-table-column>
      <!-- 箱数 -->
      <el-table-column
        prop="box_count"
        :label="$t('箱数')">
      </el-table-column>
      <!-- 重量 -->
      <el-table-column
        prop="actual_weight"
        :label="$t('重量') + `${localization.weight_unit ? localization.weight_unit : '' }`">
      </el-table-column>
      <!-- 尺寸/体积 -->
      <el-table-column :label="$t('尺寸') + `${localization.length_unit ? localization.length_unit : '' }`">
        <template slot-scope="scope">
          <span>{{scope.row.length}}</span>*<span>{{scope.row.width}}</span>*<span>{{scope.row.height}}</span>
        </template>
      </el-table-column>
      <!-- 所属发货单 -->
      <el-table-column
        prop="shipment_sn"
        :label="$t('所属发货单')">
      </el-table-column>
      <!-- 付款状态 -->
      <el-table-column
        :label="$t('付款状态')">
        <template slot-scope="scope">
          <span v-if="scope.row.on_delivery_status > 0 && scope.row.on_delivery_status !== 2">{{('货到付款（未付款）')}}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        :label="$t('操作')"
        width="190px">
        <template slot-scope="scope">
          <el-button class="btn-light-red" @click="deleteRow(scope.$index, tableData)">{{$t('移除')}}</el-button>
          <el-button class="btn-green" @click="goPhont(scope.row.id)">{{$t('添加签收照片')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-button class="created-btn" @click="goCreated">{{$t('创建发货单')}}</el-button> -->
    <div slot="footer">
      <!-- <el-button @click="show = false">{{$t('取消')}}</el-button> -->
      <el-button type="primary" @click="confirmShip">{{$t('确定签收')}}</el-button>
    </div>
      <!-- 签收详情 -->
      <el-dialog :visible.sync="innerVisible" :title="$t('签收详情')" class="dialog-invoice"
      width="85%" @close="clear" append-to-body>
        <div class="receiverMSg msg-top">
        </div>
        <h3 class="change-sty">{{$t('收货人信息')}}</h3>
        <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
        label-position="right">
          <el-row class="container-center" :gutter="20">
            <!-- 客户ID -->
            <el-col :span="7">
              <p class="leftWidth">{{$t('客户ID')}}</p>
              <span>{{form.user_id}}</span>
            </el-col>
            <!-- 收件人 -->
              <el-col :span="7" :offset="1">
              <p class="leftWidth">{{$t('收件人')}}</p>
              <span>{{form.address &&form.address.receiver_name}}</span>
            </el-col>
            <!-- 邮编 -->
              <el-col :span="7" :offset="1">
              <p class="leftWidth">{{$t('邮编')}}</p>
              <span>{{form.address && form.address.postcode}}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 电话 -->
            <el-col :span="7">
              <p class="leftWidth">{{$t('电话')}}</p>
              <span>{{form.address && form.address.phone}}</span>
            </el-col>
            <!-- 收件人 -->
              <el-col :span="7" :offset="1">
              <p class="leftWidth">{{$t('地址')}}</p>
              <span>{{form.address &&form.address.address}}</span>
            </el-col>
            <!-- 邮编 -->
              <el-col :span="7" :offset="1">
              <p class="leftWidth">{{$t('线路类型')}}</p>
              <span>{{form.express_line && form.express_line.cn_name}}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 客户ID -->
            <el-col :span="7">
              <span class="leftWidth">{{$t('转运单号')}}</span>
              <span>{{form.logistics_sn}}</span>
            </el-col>
            <!-- 收件人 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('发货时间')}}</span>
              <span>{{form.shipped_at}}</span>
            </el-col>
            <!-- 邮编 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('自提点到货时间')}}</span>
              <span>{{form.station_received_at}}</span>
            </el-col>
          </el-row>
         <h3 class="change-sty">{{$t('费用信息')}}</h3>
         <el-row class="container-center" :gutter="20">
            <!-- 应付金额 -->
            <el-col :span="7">
              <span class="leftWidth">{{$t('应付金额')}}</span>
              <span>{{form.payment && form.payment.order_amount}}</span>
            </el-col>
            <!-- 支付时间 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('支付时间')}}</span>
              <span>{{form.payment &&form.payment.paid_at}}</span>
            </el-col>
            <!-- 支付金额 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('支付金额')}}</span>
              <span>{{form.payment && form.payment.pay_amount}}</span>
            </el-col>
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 抵用券金额 -->
            <el-col :span="7">
              <span class="leftWidth">{{$t('抵用券金额')}}</span>
              <span>{{form.payment && form.payment.coupon_amount}}</span>
            </el-col>
            <!-- 支付方式 -->
              <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('支付方式')}}</span>
              <span>{{form.payment &&form.payment.payment_type_name }}</span>
            </el-col>
            <!-- 邮编 -->
              <!-- <el-col :span="7" :offset="1">
              <span class="leftWidth">{{$t('线路类型')}}</span>
              <span>{{form.address && form.address.country.cn_name}}</span>
            </el-col> -->
          </el-row>
          <el-row class="container-center" :gutter="20">
            <!-- 支付截图 -->
            <el-col :span="7">
              <!-- <span class="leftWidth">{{$t('支付截图')}}</span> -->
              <!-- payment_images -->
              <!-- <span>{{form.address && form.address.receiver_name}}</span> -->
              <div class="bale-left packed-details">
                <span class="leftWidth">{{$t('支付截图')}}</span>
                <!-- ${$baseUrl.IMAGE_URL}${item}` -->
                <div class="left-img" v-for="(item, index) in form.payment && form.payment.payment_images" :key="index">
                  <span style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item}`, imgVisible=true">
                    <img :src="`${$baseUrl.IMAGE_URL}${item}`" class="productImg" >
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div>
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
        </div>
        <el-row>
          <el-col :span="10">
            <h3>{{$t('出库清单')}}
            </h3>
              <span>{{$t('共有')}}{{boxData.length}}{{$t('箱物品')}}</span>
            <el-table :data="boxData" class="data-list" border stripe
            v-loading="tableLoading">
              <el-table-column :label="$t('单号')" prop="sn"></el-table-column>
              <el-table-column :label="$t('重量') + `${localization.weight_unit ? localization.weight_unit : ''}`" prop="weight"></el-table-column>
              <el-table-column :label="$t('尺寸') + `${localization.length_unit ? localization.length_unit : ''}`">
                <template slot-scope="scope">
                  <span>{{scope.row.length}}</span>*
                  <span>{{scope.row.width}}</span>*
                  <span>{{scope.row.height}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('体积')" prop="volume_weight"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="10" :offset="1">
            <div class="updateChe">
              <p>{{$t('打包照片')}}</p>
              <span class="img-item" v-for="(item, index) in packageImgList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                  <!-- <i class="el-icon-delete" @click="onDeleteImg(index)"></i> -->
                </span>
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="updateChe">
              <span>{{$t('上传签收照片')}}</span>
              <span class="img-item" v-for="(item, index) in goodsImgList" :key="index">
                <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
                <span class="model-box"></span>
                <span class="operat-box">
                  <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                  <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
                </span>
              </span>
              <el-upload
                v-show="goodsImgList.length < 1"
                class="avatar-uploader"
                list-type="picture-card"
                action=""
                :before-upload="beforeUploadImg"
                :http-request="uploadGoodsImg"
                :show-file-list="false"
                >
                <i class="el-icon-plus">
                </i>
                </el-upload>
                <!-- <div class="updateImg">{{$t('支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张')}}</div> -->
              </div>
            </el-col>
            </el-row>
            <el-row>
              <el-col>
                <p>{{$t('签收备注（选填）')}}：</p>
                <el-input v-model="sign.sign_remark" type="textarea" :rows="3" :placeholder="$t('请输入内容')"></el-input>
              </el-col>
            </el-row>
          <div slot="footer">
            <el-button @click="returnShip">{{$t('取消')}}</el-button>
            <el-button type="primary" @click="confirmSign">{{$t('确定')}}</el-button>
          </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      innerVisible: false,
      tableLoading: false,
      invoiceList: [],
      invoice: {
        sn: ''
      },
      ruleForm: {
        country_id: '',
        name: '',
        remark: ''
      },
      country: [],
      tableData: [],
      textarea2: '',
      form: {},
      pakeageData: [],
      boxData: [],
      localization: {},
      goodsImgList: [],
      packageImgList: [],
      rules: {
        country_id: [
          { required: true, message: this.$t('请输入目的地'), trigger: 'blur' }
        ]
      },
      id: '',
      sign: {
        sign_images: '',
        sign_remark: ''
      },
      photoId: '',
      orderSnNum: [],
      state: '',
      strArr: []
    }
  },
  methods: {
    // 查询单号数据
    search () {
      this.$request.signData({
        XStationId: this.id,
        sn: this.textarea2
      }).then(res => {
        if (res.ret) {
          this.tableData = res.data
          this.localization = res.localization
        }
      })
    },
    getName (val) {
      console.log(val)
    },
    // 添加签收照片
    goPhont (id) {
      this.photoId = id
      this.innerVisible = true
      // this.show = false
      this.$request.photosData(id, {
        XStationId: this.id
      }).then(res => {
        if (res.ret) {
          this.form = res.data
          this.pakeageData = res.data.packages // 原始包裹清单
          this.boxData = res.data.box // 出库清单
          this.localization = res.localization
          this.goodsImgList = res.data.sign_images
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
    returnShip () {
      this.innerVisible = false
      // this.show = true
    },
    getUser () {
    },
    getCountry () {
      this.$request.getCountry().then(res => {
        this.country = res.data
      })
    },
    // 上传物品照片
    uploadGoodsImg (item) {
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
    onUpload (file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
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
      this.goodsImgList.splice(index, 1)
    },
    beforeUploadImg (file) {
      if (!(/^image/.test(file.type))) {
        this.$message.info(this.$t('请上传图片类型文件'))
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info(this.$t('上传图片大小不能超过2M'))
        return false
      }
      return true
    },
    // 确认签收
    confirmShip () {
      let dataId = this.tableData.map(item => item.id)
      this.strArr = this.tableData.filter(item => item.on_delivery_status > 0 && item.on_delivery_status !== 2).map(item => item.order_sn)
      this.$confirm(this.$t(`该订单${this.strArr.toString()}为货到付款订单（未付款），是否确认收款并签收`), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.batchSign({
          XStationId: this.id,
          ids: dataId
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: '操作成功',
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
      })
      // let dataId = this.tableData.map(item => item.id)
      // console.log(dataId, 'dataId')
      // this.$request.batchSign({
      //   XStationId: this.id,
      //   ids: dataId
      // }).then(res => {
      //   if (res.ret) {
      //     this.$notify({
      //       type: 'success',
      //       title: '操作成功',
      //       message: res.msg
      //     })
      //     this.show = false
      //     this.success()
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     })
      //   }
      //   this.show = false
      // })
    },
    // 确认创建发货单
    confirmSign () {
      this.sign.sign_images = this.goodsImgList.map(item => item.url)
      console.log(this.sign.sign_images, 'this.sign.sign_images')
      if (this.form.on_delivery_status > 0 && this.form.on_delivery_status !== 2) {
        this.$confirm(this.$t('该订单为货到付款订单（未付款），是否确认收款并签收'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }).then(() => {
          this.$request.updatePhotosData(this.photoId, {
            XStationId: this.id,
            sign_images: this.sign.sign_images,
            sign_remark: this.sign.sign_remark
          }).then(res => {
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: this.$t('成功'),
                message: res.msg
              })
              this.innerVisible = false
              this.show = true
              this.getUser()
              // this.success()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        })
      } else {
        this.$request.updatePhotosData(this.photoId, {
          XStationId: this.id,
          sign_images: this.sign.sign_images,
          sign_remark: this.sign.sign_remark
        }).then(res => {
          if (res.ret) {
            this.$notify({
              type: 'success',
              title: this.$t('成功'),
              message: res.msg
            })
            this.innerVisible = false
            this.show = true
            this.getUser()
            // this.success()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    clear () {
      this.textarea2 = ''
      this.tableData = []
    },
    init () {
      // this.getUser()
      console.log(this.state, 'state')
      if (this.state === 'batch') {
        this.textarea2 = this.orderSnNum.join('\n')
        this.search()
        console.log(this.orderSnNum, '1111')
      }
    }
  }
}
</script>
<style lang="scss" scope>
.fast-sign-container{
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
.el-select-dropdown__item.hover{
    width: auto;
}
.el-select-dropdown__item {
  width: 180px;
  white-space: nowrap;/*设置不换行*/
  overflow: hidden; /*设置隐藏*/
  text-overflow: ellipsis;
}
.goods-img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}
</style>
