<template>
  <div class="autoReply-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('关键词回复')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('被关注回复')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('收到消息回复')" name="2"></el-tab-pane>
    </el-tabs>
    <div class="main-top">
      <div class="number-sty">{{ $t('规则名称') }}:</div>
      <el-input v-model="expressName" class="input-sty"> </el-input>
      <el-button>{{ $t('搜索') }}</el-button>
      <el-button @click="addNewRule" style="background-color: #3540a5; color: #fff">{{
        $t('添加新规则')
      }}</el-button>
    </div>
    <el-table :data="tableData" border style="width: 70%">
      <el-table-column label="#" type="index"> </el-table-column>
      <el-table-column prop="date" :label="$t('规则名称')"> </el-table-column>
      <el-table-column prop="name" :label="$t('关键词')"> </el-table-column>
      <el-table-column prop="address" :label="$t('回复类型')"> </el-table-column>
      <el-table-column :label="$t('操作')">
        <el-button class="btn-dark-green btn-margin">{{ $t('修改') }}</el-button>
        <el-button class="btn-light-red">{{ $t('删除') }}</el-button>
      </el-table-column>
    </el-table>
    <div>
      <span>{{ $t('被关注回复') }}</span>
      <span>{{ $t('可以同时发两条消息') }}</span>
    </div>
    <el-form>
      <!-- 消息类型 -->
      <el-form-item :label="$t('消息类型')">
        <el-radio-group v-model="megType">
          <el-radio :label="1">{{ $t('文字') }}</el-radio>
          <el-radio :label="2">{{ $t('图片') }}</el-radio>
        </el-radio-group>
        <el-input
          type="textarea"
          style="margin-left: 65px"
          :rows="5"
          :placeholder="$t('请输入内容')"
          v-model="textarea"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('消息类型')">
        <el-radio-group v-model="megType">
          <el-radio :label="1">{{ $t('文字') }}</el-radio>
          <el-radio :label="2">{{ $t('图片') }}</el-radio>
        </el-radio-group>
        <el-input
          type="textarea"
          style="margin-left: 65px"
          :rows="5"
          :placeholder="$t('请输入内容')"
          v-model="textarea"
        >
        </el-input>
      </el-form-item>
      <!-- 回复内容 -->
      <el-form-item :label="$t('回复内容')">
        <el-radio-group v-model="ansContent">
          <el-radio :label="1">{{ $t('文字') }}</el-radio>
          <el-radio :label="2">{{ $t('图片') }}</el-radio>
        </el-radio-group>
        <el-input
          type="textarea"
          style="margin-left: 65px"
          :rows="5"
          :placeholder="$t('请输入内容')"
          v-model="textarea"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button style="background-color: #3540a5; color: #fff">{{ $t('保存') }}</el-button>
      <el-button>{{ $t('删除回复') }}</el-button>
    </div>
    <el-dialog :visible.sync="show" :title="$t('规则设置')" @close="clear">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
        <!-- 规则名称 -->
        <el-form-item :label="$t('规则名称')">
          <el-input
            v-model="ruleForm.ruleName"
            style="width: 40%"
            :placeholder="$t('请输入规则名称,最多60个字')"
          >
          </el-input>
        </el-form-item>
        <!-- 关键词 -->
        <el-form-item :label="$t('关键词')">
          <el-select v-model="value" style="width: 20%" :placeholder="$t('半匹配')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.keyword" style="width: 50%" :placeholder="$t('请输入关键词')">
          </el-input>
          <i class="el-icon-circle-plus-outline" @click="addItem"></i>
          <i class="el-icon-remove-outline" @click="deleteItem"></i>
        </el-form-item>
        <!-- 回复内容 -->
        <el-form-item :label="$t('回复内容')">
          <el-radio-group v-model="ansContent">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input type="textarea" :rows="5" :placeholder="$t('请输入内容')" v-model="textarea">
          </el-input>
          <div>
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
              :http-request="uploadBaleImg"
              :show-file-list="false"
            >
              <i class="el-icon-plus"> </i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item :label="$t('回复内容')">
          <el-radio-group v-model="ansContent">
            <el-radio :label="1">{{ $t('文字') }}</el-radio>
            <el-radio :label="2">{{ $t('图片') }}</el-radio>
          </el-radio-group>
          <el-input type="textarea" :rows="5" :placeholder="$t('请输入内容')" v-model="textarea">
          </el-input>
          <div>
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
              :http-request="uploadBaleImg"
              :show-file-list="false"
            >
              <i class="el-icon-plus"> </i>
            </el-upload>
          </div>
        </el-form-item>
        <!-- 回复方式 -->
        <el-form-item :label="$t('回复方式')">
          <el-radio-group v-model="ansMethod">
            <el-radio :label="3">{{ $t('随机一条') }}</el-radio>
            <el-radio :label="4">{{ $t('回复全部') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button style="background-color: #3540a5; color: #fff">{{ $t('保存') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '0',
      megType: 1,
      ansContent: 1,
      ansMethod: 1,
      textarea: '',
      expressName: '',
      value: '',
      show: false,
      baleImgList: [],
      ruleForm: {
        ruleName: '',
        keyword: ''
      },
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  methods: {
    addNewRule() {
      this.show = true
    },
    addItem() {},
    deleteItem() {},
    uploadBaleImg() {},
    clear() {}
  }
}
</script>

<style lang="scss">
.autoReply-container {
  margin-left: 30px;
  font-size: 14px;
  .main-top {
    margin-top: 20px;
    margin-bottom: 20px;
    .number-sty {
      display: inline-block;
      margin-right: 10px;
    }
    .input-sty {
      width: 30%;
      margin-right: 10px;
    }
  }
  .el-textarea__inner {
    width: 70%;
  }
  .el-icon-circle-plus-outline:before {
    font-size: 24px;
  }
  .el-icon-remove-outline:before {
    font-size: 24px;
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
  .el-table tr th.is-leaf div {
    text-align: center;
  }
  .el-table td div {
    text-align: center;
  }
}
</style>
