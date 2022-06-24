<template>
  <div class="question-container">
    <div class="question-search" v-if="hasFilterCondition">
      <div>
        <div class="changeTime">
          <!-- 提交时间 -->
          <el-date-picker
            size="mini"
            class="timeStyle"
            v-model="timeList"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('提交开始日期')"
            :end-placeholder="$t('提交结束日期')"
          >
          </el-date-picker>
        </div>
        <!-- 是否精选 -->
        <div class="chooseStatus">
          <el-select size="mini" v-model="featured" clearable :placeholder="$t('请选择')">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="submit">
        <el-button type="primary" plain size="small" @click="submitForm">{{
          $t('搜索')
        }}</el-button>
        <el-button size="small" @click="resetForm">{{ $t('重置') }}</el-button>
      </div>
    </div>
    <div class="searchGroup">
      <search-group
        :placeholder="$t('请输入关键字')"
        v-model="page_params.keyword"
        @search="goSearch"
      >
      </search-group>
      <div class="filter">
        <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
          >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
        ></el-button>
      </div>
    </div>
    <div class="question-list" v-for="item in questionList" :key="item.id">
      <div style="display: flex">
        <div class="title-item">
          <span style="font-weight: bold">{{ item.user.id }} --- {{ item.user.name }}</span
          ><span>{{ item.created_at }}</span>
          <div>
            <span class="featured" v-if="item.featured === 1">{{ $t('精选') }}</span>
          </div>
        </div>
        <div class="title-btn">
          <el-button
            size="small"
            class="btn-deep-blue"
            v-if="item.featured === 1"
            @click="setFeature(item.id, 0)"
            >{{ $t('取消精选') }}</el-button
          >
          <el-button size="small" class="btn-light-red" v-else @click="setFeature(item.id, 1)">{{
            $t('设为精选')
          }}</el-button>
          <el-button size="small" @click="delQuestion(item.id)">{{ $t('删除提问') }}</el-button>
        </div>
      </div>
      <div class="question-item question-title">
        <div style="font-weight: bold">
          <span>{{ $t('提问:') }} {{ item.content }}</span>
          <el-button class="btn-light-red" style="margin-left: 10px" @click="reply(item.id)">{{
            $t('回复')
          }}</el-button>
        </div>
        <div style="color: #3540a5; cursor: pointer" @click="changeShow">
          {{ show ? $t('收起') : $t('展开') }}
        </div>
      </div>
      <div>
        <div class="answer-item" v-show="show" v-for="ele in item.answers" :key="ele.id">
          <div class="question-item">
            <div>
              <span style="font-weight: bold"
                >{{ ele.user.id === 0 ? '' : ele.user.id }} {{ ele.user.name }}:</span
              >
              {{ ele.content }}
            </div>
            <div>
              <el-button size="small" @click="delAnswer(ele.id)">{{ $t('删除') }}</el-button>
            </div>
          </div>
          <div class="imgList">
            <img
              v-for="(pic, index) in ele.images"
              :key="index"
              :src="`${$baseUrl.IMAGE_URL}${pic}`"
              style="cursor: pointer"
              @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${pic}`), (imgVisible = true)"
            />
          </div>
        </div>
      </div>
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import { pagination } from '@/mixin'
import NlePagination from '@/components/pagination'
import dialog from '@/components/dialog'
export default {
  data() {
    return {
      featured: '',
      timeList: [],
      show: true,
      hasFilterCondition: false,
      questionList: [],
      editor: null,
      imgSrc: '',
      imgVisible: false,
      statusList: [
        {
          id: 0,
          name: this.$t('非精选')
        },
        {
          id: 1,
          name: this.$t('精选')
        }
      ]
    }
  },
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination],
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    changeShow() {
      this.show = !this.show
    },
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
    },
    submitForm() {
      this.onTime(this.timeList)
      this.onShipStatus()
    },
    onShipStatus() {
      this.page_params.handleQueryChange('status', this.featured)
      this.getList()
    },
    resetForm() {
      this.timeList = []
      this.featured = ''
    },
    getList() {
      this.$request
        .qaList({
          page: this.page_params.page,
          size: this.page_params.size,
          keyword: this.page_params.keyword,
          featured: this.featured,
          begin_date: this.begin_date,
          end_date: this.end_date
        })
        .then(res => {
          this.questionList = res.data
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        })
    },
    delQuestion(id) {
      this.$confirm(this.$t('您真的要删除此问题'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteQuestion(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    delAnswer(id) {
      this.$confirm(this.$t('您真的要删除此回答'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteAnswer(id).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    setFeature(id, status) {
      this.$confirm(this.$t('您真的要执行此操作吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.setFeatured(id, status).then(res => {
          if (res.ret) {
            this.$notify({
              title: this.$t('操作成功'),
              message: res.msg,
              type: 'success'
            })
            this.getList()
          } else {
            this.$notify({
              title: this.$t('操作失败'),
              message: res.msg,
              type: 'warning'
            })
          }
        })
      })
    },
    reply(id) {
      dialog(
        {
          type: 'replyInfo',
          id: id
        },
        () => {
          this.getList()
        }
      )
    }
  }
}
</script>

<style lang="scss">
.question-container {
  .question-search {
    font-size: 14px;
    background: #fff;
    margin: 10px 0;
    padding: 10px;
    overflow: hidden;
    .changeTime {
      display: inline-block;
      margin-right: 20px;
      .timeStyle {
        margin-right: 10px;
        width: 276px !important;
      }
    }
    .chooseStatus {
      display: inline-block;
    }
    .submit {
      float: right;
      margin-top: 10px;
    }
  }
  .searchGroup {
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
    .search-group {
      width: 21.5%;
      margin-right: 10px;
    }
  }
  .question-list {
    background: #fff;
    border-radius: 5px;
    padding: 25px;
    margin-bottom: 10px;
    box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
    .title-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      .featured {
        display: inline-block;
        color: #fff;
        background-color: red;
        line-height: 30px;
        font-size: 16px;
        padding: 0 5px;
        border-radius: 5px;
      }
    }
    .title-btn {
      display: flex;
      flex: 3;
      justify-content: flex-end;
    }
    .question-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #fff;
    }
    .question-title {
      padding: 10px;
      margin-top: 10px;
    }
    .answer-item {
      background: #fff !important;
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 5px 10px;
      font-size: 14px;
      margin-bottom: 10px;
      .imgList img {
        width: 50px;
      }
    }
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
}
</style>
