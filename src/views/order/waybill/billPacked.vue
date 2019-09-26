<template>
    <div class="packed-container">
      <el-form ref="params" :model="user" class="package-form" label-width="140px" label-position="left">
        <el-col :lg="12">
          <!-- 转运单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="转运单号" prop="name">
                <el-input v-model="this.$route.params.order_sn" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 重量 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="重量" prop="weight">
                <el-input v-model="user.weight" placeholder="请输入重量">
                <template slot="append">KG</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 尺寸 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="尺寸">
                <el-input v-model="user.length"  class="sizeLength" placeholder="长 cm"></el-input>
                <el-input v-model="user.width" class="sizeLength" placeholder="宽 cm"></el-input>
                <el-input v-model="user.height"  class="sizeLength" placeholder="高 cm"></el-input>
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
              <el-form-item label="上传打包照片" class="updateChe">
                  <el-upload
                    class="avatar-uploader"
                    list-type="picture-card"
                    action=""
                    :on-success="filesuccess"
                    :on-error="fileerror"
                    :before-upload="beforeUploadImg"
                    :http-request="onUpload"
                    :show-file-list="false">
                    <i class="el-icon-plus">
                    </i>
                </el-upload>
                <div class="updateImg">支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张</div>
                <div v-show="icon">
                    <div class="upload_ball">
                    <img :src="icon" width="200px" height="200px"/>
                    </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :lg="12">
          <!-- 留仓单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="留仓单号">
                <el-input v-model="user.in_warehouse_item" placeholder="请输入留仓单号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 物品照片 -->
        <!-- :action="$baseUrl.BASE_API_URL + '/user/upload-image'" -->
                            <!-- :headers = "Authorization" -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item prop="password_confirmation" class="updateChe" label="物品照片">
                <el-upload
                    class="avatar-uploader"
                    list-type="picture-card"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    name="images"
                    :on-success="filesuccess"
                    :on-error="fileerror"
                    :before-upload="beforeUploadImg"
                    :show-file-list="false">
                    <i class="el-icon-plus">
                    </i>
                </el-upload>
                <div class="updateImg">支持图片格式：jpeg.png.jpg... 图片大小限2M，最多上传3张</div>
                <div v-show="icon">
                    <div class="upload_ball">
                    <img :src="icon" width="200px" height="200px"/>
                    </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
       </el-col>
     </el-form>
    <!-- 保存 -->
    <el-row :gutter="20">
    <el-col :span="18">
      <el-button @click="savePacked" type="primary">保存</el-button>
    </el-col>
    </el-row>
    </div>
</template>

<script>
export default {
  data () {
    return {
      checked: false,
      icon: '',
      user: {
        weight: '',
        width: '',
        length: '',
        height: '',
        remark: '',
        in_warehouse_item: ''
      }
    }
  },
  methods: {
    savePacked () {
      console.log(this.user)
      this.$request.saveOrderPack(this.$route.params.id, this.user).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.$router.push({ name: 'wayBillList' })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    filesuccess (file) {
      this.$notify({
        title: '操作成功',
        message: '上传成功',
        type: 'success'
      })
      this.form.icon = file.data
    },
    fileerror (file) {
      this.$notify({
        title: '操作失败',
        message: '文件上传失败',
        type: 'warning'
      })
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
    // 上传图片
    onUpload (item) {
      console.log('item', item)
      let file = item.file
      console.log(file)
      let params = new FormData()
      params.append('file', file)
      // params.append('age', '13')
      let arr = []
      arr.push({
        params
      })
      console.log(params.get('file'))
      this.$request.uploadImg(arr).then(res => {})
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
  .upload_btn{
    color:#000;
    padding:1px 60px;
    border-radius:5px;
    border:1px solid #BFCBD9;
    outline:none;
    cursor:pointer;
    background-color:#fff;
    }
  .upload_btn:hover{
    color:#009FEF;
    cursor:pointer;
    outline:none;
    border:1px solid #009FEF;
    background-color:#fff;
    }
  .updateImg {
    margin-top: 10px;
    color: #ccc;
  }
  .package-form {
    overflow: hidden;
  }
}
</style>
