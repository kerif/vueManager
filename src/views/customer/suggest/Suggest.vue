<template>
  <div class="suggest-list-container">
    <search-group placeholder="请输入关键字" v-model="page_params.keyword" @search="goSearch">
      <div class="changeTime">
      <!-- 提交时间 -->
        <el-date-picker
        class="timeStyle"
        v-model="timeList"
        type="daterange"
        @change="onTime"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="提交开始日期"
        end-placeholder="提交结束日期">
      </el-date-picker>
    </div>
      <div class="chooseStatus">
        <el-select v-model="status" @change="onAgentChange" clearable
        placeholder="请选择状态">
          <el-option
            v-for="item in statusData"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </el-option>
        </el-select>
      </div>
    </search-group>
    <el-table class="data-list" border stripe :data="suggestList"
    v-loading="tableLoading">
    <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="标题" prop="title">
      </el-table-column>
      <!-- <el-table-column label="内容" prop="content">
      </el-table-column> -->
      <!-- <el-table-column label="图片" prop="images">
        <template slot-scope="scope">
          <span v-for="item in scope.row.images"
          :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
              <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" style="width: 40px; margin-right: 5px;">
          </span>
       </template>
      </el-table-column> -->
      <el-table-column label="状态">
        <template slot-scope="scope">
        <span v-if="scope.row.status == '1'">未处理</span>
        <span v-if="scope.row.status == '2'">已处理</span>
        </template>
      </el-table-column>
      <el-table-column label="客户ID" prop="user_id">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="btn-green" @click="onChangeStatus(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="show" title="修改状态" class="change-status-dialog" @close="clear">
      <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" label-width="70px">
      <!-- 标题 -->
      <el-form-item label="标题" class="input-style">
        <span>{{ruleForm.title}}</span>
      </el-form-item>
      <!-- 内容 -->
      <el-form-item label="内容" class="input-style">
        <span>{{ruleForm.content}}</span>
      </el-form-item>
      <!-- 联系方式 -->
      <el-form-item label="联系方式" class="input-style">
        {{ruleForm.contact}}
      </el-form-item>
      <!-- 附件 -->
      <el-form-item label="附件" class="updateChe">
        <span v-for="item in ruleForm.images" :key="item.id" style="cursor:pointer;"
            @click.stop="imgSrc=`${$baseUrl.IMAGE_URL}${item.url}`, imgVisible=true">
          <img :src="`${$baseUrl.IMAGE_URL}${item.url}`" style="width: 40px; margin-right: 5px;">
        </span>
        </el-form-item>
        <!-- 创建时间 -->
        <el-form-item label="创建时间" class="input-style">
          <span>{{ruleForm.created_at}}</span>
        </el-form-item>
        <!-- 更改状态 -->
        <el-form-item label="更改状态">
          <el-select v-model="ruleForm.status">
            <el-option label="未处理" :value="1"></el-option>
            <el-option label="已处理" :value="2"></el-option>
          </el-select>
        </el-form-item>
        </el-form>
        <el-dialog :visible.sync="imgVisible" modal-append-to-body width="30%">
        <div class="img_box">
          <img :src="imgSrc" class="imgDialog">
        </div>
        </el-dialog>
        <div slot="footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
        </div>
     </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
// import dialog from '@/components/dialog'
export default {
  data () {
    return {
      suggestList: [], // 表格数据
      tableLoading: false,
      imgVisible: false,
      imgSrc: '',
      timeList: [],
      begin_date: '',
      end_date: '',
      status: '',
      show: false,
      statusData: [
        {
          id: 0,
          name: '未处理'
        }, {
          id: 1,
          name: '已处理'
        }
      ],
      ruleForm: {
        status: ''
      },
      baleImgList: [],
      dialogId: '',
      outerVisible: true,
      innerVisible: false
    }
  },
  name: 'suggestList',
  mixins: [pagination],
  components: {
    NlePagination,
    SearchGroup
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        status: this.status
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getSuggest(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.suggestList = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: '操作失败',
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getDialog () {
      this.$request.getSuggests(this.dialogId).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          res.data.qr_code && (this.baleImgList[0] = res.data.qr_code)
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    onChangeStatus (id) {
      // dialog({
      //   type: 'changestatus', id: id
      // }, () => {
      //   this.getList()
      // }
      // )
      this.dialogId = id
      this.show = true
      this.getDialog()
    },
    onAgentChange () {
      this.page_params.page = 1
      this.page_params.handleQueryChange('status', this.status)
      this.getList()
    },
    clear () {
      this.ruleForm.status = ''
    },
    confirm () {
      this.$request.submitSuggest(this.dialogId, this.ruleForm).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: res.msg
          })
          this.show = false
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.show = false
      })
    },
    // 提交时间
    onTime (val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    }
  }
}
</script>
<style lang="scss">
// .imgDialog {
//     width: 50% !important;
//   }
  .el-dialog__wrapper {
    background: rgba(0,0,0, 0.3);
  }
.suggest-list-container {
  .el-dialog__body {
    .img_box{
      text-align: center;
      img {
        width: 300px !important;
      }
    }
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
    .el-select {
      // width: 100%;
    }
  }
  .changeTime {
    display: inline-block;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
}
</style>
