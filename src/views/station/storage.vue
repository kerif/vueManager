<template>
    <div class="storage-container">
      <el-row class="container-top">
      <el-form ref="user" :model="user" label-width="140px" label-position="left">
         <el-col :lg="12">
          <!-- 重量 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*重量" class="weight-style">
                <el-input v-model="user.package_weight" placeholder="请输入重量">
                <template slot="append">{{this.localization.weight_unit}}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
              <div class="line-center"></div>
          <!-- 快递单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*快递单号">
                <el-input v-model="user.express_num" placeholder="请输入快递单号" :disabled="!!this.$route.params.id && !hasStore"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        <!-- 仓库名称 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*仓库名称">
                <el-select v-model="user.warehouse_id" clearable
                 :disabled="!!this.$route.params.id && !hasStore">
                  <el-option
                    v-for="item in agentData"
                    :key="item.id"
                    :value="item.id"
                    :label="item.warehouse_name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
           <!-- 客户id -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="客户ID" class="changeQuery">
                  <el-autocomplete
                  :fetch-suggestions="queryCNSearch"
                  @select="handleSelect"
                  placeholder="请输入客户ID"
                  v-model="user.user_id"
                  :disabled="!!this.$route.params.id && !hasStore">
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 物品类型 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="物品类型">
                <el-input v-model="user.package_name" placeholder="请输入物品类型"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        <!-- 物品总价值 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="物品总价值">
                <el-input v-model="user.package_value" placeholder="请输入物品总价值"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 备注 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="备注">
                <el-input v-model="user.remark" placeholder="请输入备注"
                type="textarea"  :autosize="{ minRows: 2, maxRows: 4}"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      <el-col :lg="12">
        <!-- 服务 -->
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="服务" class="service-style">
              <el-checkbox-group v-model="user.chosen_services">
                <el-checkbox v-for="item in updateService" :key="item.id" :label="item.id">{{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          </el-row>
            <div class="line-center"></div>
          <!-- 快递公司 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="*快递公司">
                <el-input v-model="user.express_company" placeholder="请输入快递公司"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 寄往地区 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="寄往地区">
                <el-input v-model="user.destination_country.cn_name" placeholder="请输入寄往地区"></el-input>
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
          <!-- 存放货位 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="存放货位">
                <el-input v-model="user.location" placeholder="请输入存放货位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 物品属性 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="物品属性" class="service-style">
                <el-checkbox-group v-model="user.props">
                  <el-checkbox v-for="item in updateProp" :key="item.id" :label="item.id">{{item.cn_name}}
                  </el-checkbox>
                </el-checkbox-group>
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
                      <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
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
          <!-- 保存 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item class="saveBtn">
                <el-button @click="submitStorage" :loading="$store.state.btnLoading">保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
                    <!-- <el-form-item class="saveBtn"> -->
              <!-- </el-form-item> -->
    <!-- <div class="save-btn">
      <el-button @click="submitStorage" type="primary" :loading="$store.state.btnLoading">保存</el-button>
    </div> -->
    </el-form>
  </el-row>
  <div class="select-box">
      <h4>商品清单</h4>
      <add-btn @click.native="addProduct" v-if="this.$route.params.id">添加商品清单</add-btn>
    </div>
    <el-row :gutter="20" class="id-style">
      <el-col :span="6">
        <p class="upload-top">原始上传清单：</p>
        <div v-if="user.pack_pictures">
          <div class="left-img" v-for="item in user.pack_pictures" :key="item.id">
            <span style="cursor:pointer;" @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
              <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" class="productImg" >
            </span>
          </div>
        </div>
        <div v-else class="nullProduct">无</div>
        <p>原始商品数量：<span>{{user.qty}}</span></p>
        <p>原始商品备注：</p>
        <p>{{user.remark}}</p>
      </el-col>
      <el-col :span="18">
        <el-table
          :data="tableData"
          border
          v-loading="tableLoading"
          class="data-list"
          style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <!-- 货品名称 -->
          <el-table-column
          prop="package_name"
          label="货品名称">
          </el-table-column>
          <!-- 数量 -->
          <el-table-column
          prop="qty"
          label="数量">
          </el-table-column>
          <!-- 单价 -->
          <el-table-column
          prop="package_value"
          label="单价">
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">正常</span>
            <span v-if="scope.row.status === 2">破损</span>
            <span v-if="scope.row.status === 3">问题件</span>
          </template>
          </el-table-column>
          <!-- 图片 -->
          <el-table-column label="图片" prop="item_pictures">
            <template slot-scope="scope">
              <span v-for="item in scope.row.item_pictures"
              :key="item.id" style="cursor:pointer;"
                @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
                  <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" style="width: 40px; margin-right: 5px;">
              </span>
          </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button class="btn-dark-green" @click="editProduct(scope.row.id)">编辑</el-button>
                <el-button class="btn-light-red" @click="deleteProduct(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      </el-col>
    </el-row>
    <!-- <nle-pagination :pageParams="page_params"></nle-pagination> -->
      <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog">
      </div>
     </el-dialog>
    </div>
</template>

<script>
// import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import AddBtn from '@/components/addBtn'
export default {
  mixins: [pagination],
  components: {
    // NlePagination,
    AddBtn
  },
  data () {
    return {
      user: {
        express_num: '',
        express_company: '',
        user_id: '',
        warehouse_id: '',
        package_weight: '',
        package_value: '',
        package_name: '',
        props: [],
        chosen_services: [],
        destination_country: {
          cn_name: ''
        },
        length: '',
        width: '',
        height: '',
        remark: '',
        location: '',
        package_pictures: ''
      },
      updateProp: [], // 物品属性数据
      updateService: [], // 服务数据
      tableData: [], // 表格数据
      tableLoading: false,
      localization: {},
      agentData: [],
      goodsImgList: [],
      hasStore: false,
      imgVisible: false,
      imgSrc: '',
      form: {}
    }
  },
  created () {
    this.getProp() // 获取物品属性
    this.getService() // 获取全部服务
    this.getAgentData()
    if (this.$route.params.id) {
      console.log(this.$route.params.warehouse_id, 'warehouse_id')
      // this.getWarehouseInfo() // 从订单跳转过来时加载的表格数据
      this.getList() // 获取商品详细
      // this.user.warehouse_id = this.$route.params.warehouse_id
      // this.user.express_num = this.$route.params.express_num
      // this.user.user_id = this.$route.params.user_id + '---' + this.$route.params.user_name
      // if (this.$route.query.props) {
      //   let props = JSON.parse(this.$route.query.props)
      //   this.user.props = props.map(item => item.id)
      // }
    }
  },
  methods: {
    // 获取全部物品属性
    getProp () {
      this.$request.getProps().then(res => {
        this.updateProp = res.data
        this.localization = res.localization
      })
    },
    // 获取全部服务
    getService () {
      this.$request.getAllService().then(res => {
        this.updateService = res.data
      })
    },
    // 获取商品清单
    getList () {
      this.$request.getProductDetails(this.$route.params.id).then(res => {
        if (res.ret) {
          this.user = res.data
          // this.user.express_num = this.$route.params.express_num
          this.user.user_id = res.data.user_id + '---' + res.data.user_name
          this.user.props = res.data.props.map(item => item.id)
          this.user.chosen_services = res.data.chosen_services.map(item => item.service_id)
          this.user.warehouse_id = res.data.warehouse.id
          // if (res.data.props) {
          //   let props = JSON.parse(res.data.props)
          // }
          this.tableData = [res.data]
          console.log(this.form, 'form')
        }
      })
    },
    // 获取代理列表
    getAgentData () {
      this.$request.getSimpleWarehouse().then(res => {
        this.agentData = res.data
      })
    },
    // 增加转账支付配置
    addProduct () {
      dialog({ type: 'productList', state: 'add' }, () => {
        this.getList()
      })
    },
    // 编辑商品清单
    editProduct (id) {
      console.log(id, 'id')
      dialog({ type: 'productList', state: 'edit', id: id }, () => {
        this.getList()
      })
    },
    // 删除商品清单
    deleteProduct (id) {
      this.$confirm(`您真的要删除转账支付吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.deleteTransfer(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: '操作成功',
              message: res.msg,
              type: 'success'
            })
            this.getPayment()
          } else {
            this.$notify({
              title: '操作失败',
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    // 从订单跳转到入库时加载的表格数据
    // getWarehouseInfo () {
    //   this.tableLoading = true
    //   this.$request.getWarehouseList({
    //     page: this.page_params.page,
    //     size: this.page_params.size
    //   }).then(res => {
    //     this.tableLoading = false
    //     if (res.ret) {
    //       this.tableData = res.data
    //       this.page_params.page = res.meta.current_page
    //       this.page_params.total = res.meta.total
    //     } else {
    //       this.$notify({
    //         title: '操作失败',
    //         message: res.msg,
    //         type: 'warning'
    //       })
    //     }
    //   })
    // },
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
        this.$message.info('请上传图片类型文件')
        return false
      } else if (file.size > 1024 * 1024 * 2) {
        this.$message.info('上传图片大小不能超过2M')
        return false
      }
      return true
    },
    queryCNSearch (queryString, callback) {
      console.log(this.user.user_id)
      var list = [{}]
      this.$request.Automatic({
        keyword: this.user.user_id.toString()
      }).then(res => {
        for (let i of res.data) {
          // i.value = i.id
          i.value = i.id + '---' + i.name
        }
        list = res.data
        callback(list)
      })
    },
    handleSelect (item) {
      // this.ruleForm.en_name = item.name
      console.log(item)
      this.supplierId = item.id
      this.supplierName = item.name
    },
    // 直接添加时加载的表格数据
    // getList () {
    //   this.tableLoading = true
    //   if (this.$route.params.id) {
    //     this.getWarehouseInfo()
    //   } else {
    //     this.$request.getStorageList({
    //       page: this.page_params.page,
    //       size: this.page_params.size
    //     }).then(res => {
    //       this.tableLoading = false
    //       if (res.ret) {
    //         this.tableData = res.data
    //         this.page_params.page = res.meta.current_page
    //         this.page_params.total = res.meta.total
    //       } else {
    //         this.$notify({
    //           title: '操作失败',
    //           message: res.msg,
    //           type: 'warning'
    //         })
    //       }
    //     })
    //   }
    // },
    // 保存
    submitStorage () {
      this.user.package_pictures = this.goodsImgList.map(item => {
        return {
          url: item.url
        }
      })
      if (this.user.express_num === '') {
        this.$message.error('请输入快递单号')
      } else if (this.user.package_weight === '') {
        this.$message.error('请输入重量')
      } else if (this.user.length === '') {
        this.$message.error('请输入长度')
      } else if (this.user.width === '') {
        this.$message.error('请输入长度')
      } else if (this.user.height === '') {
        this.$message.error('请输入高度')
      } else if (!this.user.props.length) {
        this.$message.error('请选择属性')
      } else if (this.user.warehouse_id === '') {
        this.$message.error('请选择仓库')
      } else {
        if (this.$route.params.id) { // 如果是从订单跳转过来
          this.tableLoading = true
          this.user.user_id = this.user.user_id.split('---')[0]
          this.$request.submitPackage(this.$route.params.id, this.user).then(res => {
            this.tableLoading = false
            if (res.ret) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
              this.getWarehouseInfo()
              this.user.length = this.user.width = this.user.height = this.user.package_weight = this.user.package_value = ''
              this.user.user_id = this.user.warehouse_id = this.user.package_name = ''
              this.user.express_num = this.user.remark = this.user.express_company = ''
              this.user.props = []
              this.user.chosen_services = []
              this.user.location = ''
              this.hasStore = true
            } else {
              this.$message({
                title: '操作失败',
                message: res.msg,
                type: 'warning'
              })
            }
          })
        } else { // 如果是添加
          this.tableLoading = true
          this.user.user_id = this.user.user_id.split('---')[0]
          console.log(this.user.user_id, 'this.user.user_id')
          this.$request.getExpress(this.user).then(res => {
            this.tableLoading = false
            if (res.ret === 1) {
              this.$notify({
                type: 'success',
                title: '操作成功',
                message: res.msg
              })
              this.getList()
              this.user.length = this.user.width = this.user.height = this.user.package_weight = this.user.package_name = ''
              this.user.user_id = this.user.warehouse_id = this.user.package_value = ''
              this.user.express_num = this.user.remark = this.user.express_company = ''
              this.user.props = []
              this.user.chosen_services = []
              this.user.location = ''
            } else if (res.ret === 2) {
              this.$confirm('快递单号不存在或客户未预报，请确认是否入库', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$request.addShipment(this.user).then(res => {
                  if (res.ret) {
                    this.$notify({
                      title: '操作成功',
                      message: res.msg,
                      type: 'success'
                    })
                    this.getList()
                    this.user.length = this.user.width = this.user.height = this.user.package_weight = this.user.package_name = this.user.package_value = ''
                    this.user.user_id = this.user.warehouse_id = ''
                    this.user.express_num = this.user.express_company = this.user.remark = ''
                    this.user.props = []
                    this.user.chosen_services = []
                    this.user.location = ''
                  } else {
                    this.$notify({
                      title: '操作失败',
                      message: res.msg,
                      type: 'warning'
                    })
                  }
                })
              })
            } else {
              this.$notify({
                title: '操作失败',
                message: res.msg,
                type: 'warning'
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.storage-container {
  .container-top {
    background-color: #fff !important;
    padding: 20px;
  }
  .sizeLength {
    width: 33% !important;
  }
  .updateChe {
    .el-form-item__content {
      // margin-left: 0 !important;
    }
  }
  .saveBtn {
    .el-button {
      background-color: #3540A5;
      color: #fff;
      padding: 15px 35px;
    }
  }
  .changeQuery {
    .el-autocomplete {
      width: 100%;
    }
  }
  .weight-style {
    .el-form-item__content .el-input-group {
      height: 80px !important;
    }
    .el-input-group--append .el-input__inner {
      height: 80px !important;
    }
  }
  .service-style {
    .el-checkbox-group {
      height: 80px !important;
    }
  }
  .line-center {
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  .img-item {
    // display: inline-block;
    // border: 1px dashed #d9d9d9;
    // width: 148px;
    // height: 148px;
    // margin-right: 10px;
    // margin-bottom: 10px;
    // border-radius: 6px;
    // text-align: center;
    // position: relative;
    // box-sizing: border-box;
    // cursor: pointer;
    // &:hover {
    //   .model-box, .operat-box {
    //     opacity: 1;
    //     transition: all .5s ease-in;
    //   }
    // }
  }
  .operat-box {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // opacity: 0;
    // i {
    //   font-size: 20px;
    //   color: #fff;
    //   margin-right: 10px;
    // }
  }
  .model-box {
    // width: 100%;
    // height: 100%;
    // position: absolute;
    // left: 0;
    // opacity: 0;
    // background-color: rgba(0, 0, 0, .3);
  }
  .updateImg {
    // margin-top: 10px;
    // color: #ccc;
  }
  .goods-img {
    // width: 100%;
    // height: 100%;
    // border-radius: 6px;
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: top;
  }
  .save-btn {
    // text-align: center;
  }
  .select-box {
    margin-top: 10px;
    overflow: hidden;
    h4 {
      display: inline-block;
    }
  }
  .id-style {
    background-color: #fff !important;
    .upload-top {
      margin-top: 40px;
    }
  }
  .img_box{
    text-align: center;
    .imgDialog{
      width: 50%;
    }
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
  .nullProduct {
    padding-left: 70px;
    color: #ccc;
  }
}
</style>
