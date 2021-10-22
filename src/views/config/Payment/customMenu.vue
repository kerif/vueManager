<template>
  <div class="customMenu-container">
    <div class="remark">
      {{ $t('*公众号菜单主菜单最多只能是三级，每级主菜单最多可以有五个子菜单栏目') }}
    </div>
    <el-button type="success" @click="addMenu" style="margin: 10px 0; background-color: #3540a5">{{
      $t('添加菜单')
    }}</el-button>
    <el-table
      :data="MenuList"
      stripe
      ref="table"
      border
      class="data-list"
      @expand-change="onExpand"
      v-loading="tableLoading"
      height="calc(100vh - 360px)"
    >
      <!-- 二级分类列表 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.subMenus">
            <!-- 二级分类名称 -->
            <el-table-column label="#" type="index"></el-table-column>
            <!-- 二级分类菜单名称 -->
            <el-table-column :label="$t('菜单名称')" prop="name"> </el-table-column>
            <!-- 二级分类菜单类型 -->
            <el-table-column :label="$t('菜单类型')" prop="type"> </el-table-column>
            <el-table-column :label="$t('操作')" width="300">
              <template>
                <!-- 修改 -->
                <el-button class="btn-dark-green btn-margin" @click="addMenu">{{
                  $t('修改')
                }}</el-button>
                <!-- 删除 -->
                <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- 一级分类列表 -->
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <!-- 一级分类菜单名称 -->
      <el-table-column :label="$t('菜单名称')" prop="name"></el-table-column>
      <!-- 一级分类菜单类型 -->
      <el-table-column :label="$t('菜单类型')" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">无</span>
          <span v-if="scope.row.type === 1">文字消息</span>
          <span v-if="scope.row.type === 2">图片消息</span>
          <span v-if="scope.row.type === 3">跳转网页</span>
          <span v-if="scope.row.type === 4">跳转小程序</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column :label="$t('操作')" width="300">
        <template>
          <!-- 添加子菜单 -->
          <el-button class="btn-dark-green btn-margin" @click="addMenu">{{
            $t('添加子菜单')
          }}</el-button>
          <!-- 修改 -->
          <el-button class="btn-main">{{ $t('修改') }}</el-button>
          <!-- 删除 -->
          <el-button class="btn-light-red btn-margin">{{ $t('删除') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button style="background-color: #3540a5; color: #fff">{{ $t('保存并发布') }}</el-button>
    </div>
    <el-dialog :visible.sync="show" :title="$t('菜单设置')" @close="clear">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
        <!-- 菜单名称 -->
        <el-form-item :label="$t('菜单名称')">
          <el-input
            v-model="ruleForm.ruleName"
            style="width: 50%"
            :placeholder="$t('仅支持中英文和数字,字数不超过4个汉字或8个字母')"
          >
          </el-input>
        </el-form-item>
        <!-- 菜单类型 -->
        <el-form-item :label="$t('菜单类型')">
          <el-radio-group v-model="radio">
            <el-radio :label="1">{{ $t('发送文字消息') }}</el-radio>
            <el-radio :label="2">{{ $t('发送图片消息') }}</el-radio>
            <el-radio :label="3">{{ $t('跳转网页') }}</el-radio>
            <el-radio :label="4">{{ $t('跳转小程序') }}</el-radio>
          </el-radio-group>
          <el-input
            type="textarea"
            style="width: 80%"
            :rows="5"
            :placeholder="$t('请输入内容')"
            v-model="textarea"
          >
          </el-input>
        </el-form-item>
        <!-- 图片 -->
        <el-form-item class="updateChe">
          <span class="img-item" v-for="(item, index) in baleImgList" :key="index">
            <img :src="$baseUrl.IMAGE_URL + item" alt="" class="goods-img" />
            <span class="model-box"></span>
            <span class="operat-box">
              <i class="el-icon-zoom-in" @click="onPreview(item)"></i>
              <i class="el-icon-delete" @click="onDeleteImg(index)"></i>
            </span>
          </span>
          <el-upload
            v-show="baleImgList.length < 1"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImg"
            :show-file-list="false"
          >
            <i class="el-icon-plus"> </i>
          </el-upload>
          <div>{{ $t('*仅能上传1张图片,大小不超过10M') }}</div>
        </el-form-item>
        <!-- 网页 -->
        <div style="margin-left: 120px; margin-bottom: 20px">
          {{ $t('订阅者点击菜单会跳到以下链接') }}
        </div>
        <el-form-item :label="$t('页面地址')" style="margin-left: 70px">
          <el-input v-model="ruleForm.ruleName" style="width: 50%"> </el-input>
        </el-form-item>
        <!-- 小程序 -->
        <div style="margin-left: 120px; margin-bottom: 20px">
          {{ $t('订阅者点击该子菜单会跳到以下小程序') }}
        </div>
        <el-form-item :label="$t('小程序')" style="margin-left: 70px">
          <el-input
            v-model="ruleForm.app"
            style="width: 50%"
            :placeholder="$t('请输入小程序的appid')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('小程序路径')" style="margin-left: 70px">
          <el-input
            v-model="ruleForm.appPath"
            style="width: 50%"
            :placeholder="$t('请输入小程序的页面路径')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('备用网页')" style="margin-left: 70px">
          <el-input
            v-model="ruleForm.ruleName"
            style="width: 65%"
            :placeholder="$t('旧版微信客户端无法支持小程序,用户点击菜单时将会打开备用网页')"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button style="text-align: left; background-color: #3540a5; color: #fff">{{
          $t('保存')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableLoading: false,
      radio: 1,
      textarea: '',
      show: false,
      baleImgList: [],
      ruleForm: {
        ruleName: ''
      },
      MenuList: [{}],
      subMenus: []
    }
  },
  created() {
    this.getCustomMenuList()
  },
  methods: {
    addMenu() {
      this.show = true
    },
    getCustomMenuList() {
      this.$request.customMenuList().then(res => {
        if (res.ret) {
          console.log(res)
          this.MenuList = res.data
          this.subMenus = res.data.map(item => item.sub_menus)
          console.log(this.subMenus)
        }
      })
    },
    onExpand() {},
    onPreview() {},
    onDeleteImg() {},
    uploadBaleImg() {},
    clear() {}
  }
}
</script>

<style lang="scss">
.customMenu-container {
  font-size: 14px;
  background-color: #fff !important;
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
  .remark {
    color: red;
  }
}
</style>
