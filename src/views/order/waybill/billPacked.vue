<template>
    <div class="packed-container">
      <el-row>
           <el-form ref="params" :model="user" :rules="rules" label-width="140px" label-position="left">
         <el-col :lg="12">
          <!-- 快递单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="快递单号" prop="name">
                <el-input v-model="user.name" placeholder="请输入快递单号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 重量 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="重量" prop="password">
                <el-input v-model="user.full_name" placeholder="请输入重量">
                <template slot="append">KG</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 尺寸 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="尺寸" prop="email">
                <el-input v-model="user.email"  class="sizeLength" placeholder="长 cm"></el-input>
                <el-input v-model="user.email" class="sizeLength" placeholder="宽 cm"></el-input>
                <el-input v-model="user.email"  class="sizeLength" placeholder="高 cm"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
      <el-col :lg="12">
          <!-- 留仓单号 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="留仓单号" prop="full_name">
                <el-input v-model="user.full_name" placeholder="请输入留仓单号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 上传打包照片 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item prop="password_confirmation" class="updateChe">
                <el-upload
                    class="upload-demo"
                    :action="$baseUrl.BASE_API_URL + '/user/upload-image'"
                    :headers = "Authorization"
                    name="image"
                    :on-success="filesuccess"
                    :on-error="fileerror"
                    :show-file-list="false">
                    <div class="upload_btn">点击上传</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 联系电话 -->
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item prop="tel" class="saveBtn updateChe">
                <el-button>保存</el-button>
              </el-form-item>
            </el-col>
          </el-row>
      </el-col>
    </el-form>
      </el-row>
      <el-table
        :data="tableData"
        border
        class="data-list"
        style="width: 100%">
        <!-- 时间 -->
        <el-table-column
        prop="date"
        label="时间">
        </el-table-column>
        <!-- 快递单号 -->
        <el-table-column
        prop="name"
        label="快递单号">
        </el-table-column>
        <!-- 重量 -->
        <el-table-column
        prop="address"
        label="重量kg">
        </el-table-column>
        <!-- 长 -->
        <el-table-column
        label="长">
        </el-table-column>
        <!-- 宽 -->
        <el-table-column
        label="宽">
        </el-table-column>
        <!-- 高 -->
        <el-table-column
        label="高">
        </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
    </div>
</template>

<script>
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  mixins: [pagination],
  components: {
    NlePagination
  },
  data () {
    return {
      checked: false,
      tableData: [],
      rules: { // 必填项校验
        // full_name: [
        //   { required: true, message: '请输入姓名', trigger: 'change' }
        // ],
        // name: [
        //   { required: true, message: '请输入名字', trigger: 'change' }
        // ],
        // email: [
        //   { required: true, message: '请输入邮箱', trigger: 'blur' },
        //   { type: 'email', message: '', trigger: ['blur', 'change'] }
        // ],
        // tel: [
        //   { required: true, message: '请输入电话号码', trigger: 'change' }
        // ],
        // password: [
        //   { required: true, message: '请输入密码', trigger: 'change' }
        // ],
        // password_confirmation: [
        //   { required: true, message: '请再次输入密码', trigger: 'change' }
        // ],
        // group: [
        //   { required: true, message: '请输入员工组', trigger: 'change' }
        // ]
      },
      user: {}
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
  }
  .saveBtn {
    .el-button {
      background-color: #3540A5;
      color: #fff;
      padding: 15px 35px;
    }
  }
}
</style>
