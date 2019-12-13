<template>
    <div class="packed-container">
    <div class="receiverMSg">
    <h4>收货人信息</h4>
    <el-row class="container-center" :gutter="20">
      <!-- 姓名 -->
      <el-col :span="7">
        <span class="leftWidth">姓名</span>
        <span>{{form.address && form.address.receiver_name}}</span>
      </el-col>
      <!-- 手机/联系电话 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">手机/联系电话</span>
         <span>{{form.address &&form.address.phone}}</span>
      </el-col>
      <!-- 国家 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">国家</span>
         <span>{{form.address && form.address.country.cn_name}}</span>
      </el-col>
    </el-row>
    <el-row class="container-center" :gutter="20">
     <!-- 城市 -->
      <el-col :span="7">
        <span class="leftWidth">城市</span>
        <span>{{form.address && form.address.city}}</span>
      </el-col>
      <!-- 街道/门牌号 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">街道门牌号</span>
         <span>{{form.address && form.address.street}}{{form.address && form.address.door_no}}</span>
      </el-col>
      <!-- 邮编 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">邮编</span>
         <span>{{form.address && form.address.postcode}}</span>
      </el-col>
    </el-row>
    </div>
    <div class="receiverMSg">
    <h4>打包详情</h4>
    <el-row class="container-center"  :gutter="20">
      <!-- 订单号 -->
      <el-col :span="7">
        <span class="leftWidth">订单号</span>
        <span>{{form.order_sn}}</span>
      </el-col>
      <!-- 线路名称 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">线路名称</span>
         <span>{{form.express_line && form.express_line.cn_name}}</span>
      </el-col>
      <!-- 提交时间 -->
        <el-col :span="7" :offset="1">
         <span class="leftWidth">提交时间</span>
         <span>{{form.created_at}}</span>
      </el-col>
    </el-row>
    </div>
      <!-- 打包清单 -->
      <h4>包裹清单</h4>
      <el-table :data="PackageData" v-loading="tableLoading" class="data-list" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="快递单号" prop="express_num"></el-table-column>
        <el-table-column label="物品名称" prop="package_name"></el-table-column>
        <el-table-column :label="'物品价值' + this.localization.currency_unit" prop="package_value"></el-table-column>
        <el-table-column label="物品属性">
          <template slot-scope="scope">
          <span v-for="item in scope.row.props" :key="item.id">
            {{item.cn_name}}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="代理" prop="agent"></el-table-column>
        <el-table-column label="货位" prop="location"></el-table-column>
      </el-table>
      <el-form ref="params" :model="user" class="package-form" label-width="140px" label-position="left">
        <el-col :lg="12">
          <!-- 订单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="订单号" prop="name">
                <el-input v-model="this.$route.params.order_sn" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 重量 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*重量" prop="weight">
                <el-input v-model="user.weight" placeholder="请输入重量">
                <template slot="append">{{this.localization.weight_unit}}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 尺寸 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*尺寸">
                <el-input v-model="user.length"  class="sizeLength" :placeholder="'长' + this.localization.length_unit"></el-input>
                <el-input v-model="user.width" class="sizeLength" :placeholder="'宽' + this.localization.length_unit"></el-input>
                <el-input v-model="user.height"  class="sizeLength" :placeholder="'高' + this.localization.length_unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 客服备注 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="客服备注" class="customer">
                <el-input type="textarea" placeholder="请输入备注"
                v-model="user.remark"
                :autosize="{ minRows: 2, maxRows: 4}"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 上传打包照片 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*上传打包照片" class="updateChe">
                  <span class="img-item" v-for="(item, index) in baleImgList" :key="item.name">
                    <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
                    <span class="model-box"></span>
                    <span class="operat-box">
                      <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                      <i class="el-icon-delete" @click="onDeleteImg('bale', index)"></i>
                    </span>
                  </span>
                  <el-upload
                    v-show="baleImgList.length < 3"
                    class="avatar-uploader"
                    action=""
                    list-type="picture-card"
                    :before-upload="beforeUploadImg"
                    :http-request="uploadBaleImg"
                    :show-file-list="false">
                    <i class="el-icon-plus">
                    </i>
                </el-upload>
                <div class="updateImg">支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张</div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 增值服务 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="增值服务" class="customer">
                <el-checkbox v-for="item in updateProp" :key="item.id" v-model="item.checked">{{item.name}}
                <el-input v-model="item.price"></el-input>
                </el-checkbox>
                <!-- <el-checkbox-group v-model="user.services">
                </el-checkbox-group> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :lg="12">
          <!-- 留仓物品 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="留仓物品">
                <el-input v-model="user.in_warehouse_item" placeholder="请输入留仓物品"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 货位 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="货位">
                <el-input v-model="user.location" placeholder="请输入货位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 物品照片 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item prop="password_confirmation" class="updateChe" label="物品照片">
                <span class="img-item" v-for="(item, index) in goodsImgList" :key="item.name">
                  <img :src="$baseUrl.IMAGE_URL + item.url" alt="" class="goods-img">
                  <span class="model-box"></span>
                  <span class="operat-box">
                    <i class="el-icon-zoom-in" @click="onPreview(item.url)"></i>
                    <i class="el-icon-delete" @click="onDeleteImg('goods', index)"></i>
                  </span>
                </span>
                <el-upload
                  v-show="goodsImgList.length < 3"
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
                <div class="updateImg">支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张</div>
              </el-form-item>
            </el-col>
          </el-row>
       </el-col>
     </el-form>
    <!-- 保存 -->
    <el-row :gutter="20">
    <el-col :span="18">
      <el-button @click="savePacked" type="primary" :loading="$store.state.btnLoading">保存</el-button>
    </el-col>
    </el-row>
    </div>
</template>
<script>
import dialog from '@/components/dialog'
export default {
  data () {
    return {
      checked: false,
      form: {},
      user: {
        weight: '',
        width: '',
        length: '',
        height: '',
        remark: '',
        location: '',
        services: [],
        in_warehouse_item: '',
        in_warehouse_pictures: [], // 留仓物品照片
        pack_pictures: [] // 打包照片
      },
      tableLoading: false,
      baleImgList: [],
      goodsImgList: [],
      PackageData: [],
      services: [],
      updateProp: [],
      localization: {}
    }
  },
  created () {
    this.getPackage()
    // this.getProp() // 获取多选框数据
  },
  methods: {
    getList () {
      // this.$request.getOrderDetails(this.$route.params.id).then(res => {
      //   this.form = res.data
      //   this.oderData = [res.data.details]
      // })
    },
    // 获取多选框
    getProp (arr) {
      this.$request.getAdded().then(res => {
        if (res.ret) {
          let ids = res.data.map(item => item.id)
          this.updateProp = res.data.map(item => {
            return {
              ...item,
              checked: false
            }
          })
          arr.forEach(item => {
            let index = ids.indexOf(item.service_id)
            if (index !== -1) {
              this.updateProp[index].checked = true
            }
          })
        }
      })
    },
    savePacked () {
      console.log(this.user)
      console.log('pr', this.updateProp)
      // console.log(this.user.services = this.user.services.map(item => {
      //   return {
      //     price: item.price,
      //     id: item.id
      //   }
      // }), 'user.services')
      this.user.services = this.updateProp.filter(item => item.checked).map(item => {
        return {
          id: item.id,
          price: item.price
        }
      })
      console.log('ser', this.user.services)
      this.user.in_warehouse_pictures = this.goodsImgList.map(item => {
        return {
          url: item.url
        }
      })
      this.user.pack_pictures = this.baleImgList.map(item => {
        return {
          url: item.url
        }
      })
      this.$request.saveOrderPack(this.$route.params.id, this.user).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          // this.$router.push({ name: 'wayBillList' })
          this.$router.go(-1)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getPackage () {
      this.$request.getOrderDetails(this.$route.params.id).then(res => {
        this.form = res.data
        this.PackageData = res.data.packages
        this.services = res.data.services
        this.getProp(res.data.services)
        this.localization = res.localization
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
    onDeleteImg (type, index) {
      if (type === 'bale') {
        this.baleImgList.splice(index, 1)
      } else if (type === 'goods') {
        this.goodsImgList.splice(index, 1)
      }
    },
    beforeUploadImg (file) {
      if (!(/^image/.test(file.type))) {
        this.$message.info('请上传图片类型文件')
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info('上传图片大小不能超过2M')
        return false
      }
      return true
    },
    // 上传打包照片
    uploadBaleImg (item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push({
              name: item.name,
              url: item.path
            })
          })
        }
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
    }
  },
  computed: {
    addServices () {
      if (!this.updateProp.length || !this.services.length) return []
      let arr = JSON.parse(JSON.stringify(this.updateProp))
      let ids = arr.map(item => item.id)
      this.services.forEach(item => {
        let index = ids.indexOf(item.id)
        if (index !== -1) {
          arr[index].checked = true
        }
      })
      console.log('dcd', this.arr)
      return arr
    }
  }
}
</script>

<style lang="scss">
.packed-container {
  .sizeLength {
    width: 33% !important;
  }
  .updateChe {
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__label {
      width: 500px !important;
    }
  }
  .upload_ball{
  text-align:center;
  border:1px solid #ccc;
  margin-top:10px;
  border-radius:5px;
  padding-top:10px;
  }
  .customer {
    .el-textarea {
      width: 100%;
    }
  }
  .saveBtn {
    .el-button {
      background-color: #3540A5;
      color: #fff;
      padding: 15px 35px;
    }
  }
  .updateImg {
    margin-top: 10px;
    color: #ccc;
  }
  .package-form {
    overflow: hidden;
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
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
  }
  .container-center {
    margin-bottom: 20px;
  }
  .receiverMSg {
    border-bottom: 1px #ccc solid;
  }
 .leftWidth {
    display: inline-block;
    width: 120px;
  }
}
</style>
