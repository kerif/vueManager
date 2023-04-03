<template>
  <div class="evaluation-management-container">
    <div class="order-list-search" v-if="hasFilterCondition">
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
          <el-select size="mini" v-model="is_recommend" clearable :placeholder="$t('请选择')">
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
    <div class="comment">
      <el-button
        type="danger"
        size="mini"
        v-if="this.enabled === 1"
        class="evaluate"
        @click="showDialog = true"
        >{{ $t('新增评价') }}</el-button
      >
      <div class="searchGroup">
        <search-group
          :placeholder="$t('请输入关键字')"
          v-model="page_params.keyword"
          @search="goSearch"
        >
        </search-group>
        <!-- <div class="filter">
          <el-button @click="hasFilterCondition = !hasFilterCondition" type="text"
            >{{ $t('高级搜索') }}<i class="el-icon-arrow-down"></i
          ></el-button>
        </div> -->
      </div>
    </div>
    <div v-if="evaluationData.length">
      <div class="comment-item" v-for="(item, index) in evaluationData" :key="index">
        <div class="comment-top">
          <span>{{ $t('订单号') }}：{{ item.order }}</span>
        </div>
        <div class="comment-center">
          <div class="list-img">
            <img :src="item.user.avatar" />
          </div>
          <div>
            <div class="info">
              <span>{{ item.user.id }}---{{ item.user.name }}</span>
              <span class="font-order">{{ item.created_at }}</span>
            </div>
            <div class="content">{{ item.content }}</div>
            <div class="img-list">
              <img
                v-for="(ele, index) in item.images"
                :key="index"
                :src="`${$baseUrl.IMAGE_URL}${ele}`"
                style="cursor: pointer"
                @click.stop=";(imgSrc = `${$baseUrl.IMAGE_URL}${ele}`), (imgVisible = true)"
              />
            </div>
          </div>
          <div>
            <div class="star">
              <span>{{ $t('综合评分') }}</span
              ><el-rate v-model="item.score" disabled> </el-rate>
            </div>
            <div class="star" v-if="item.logistics_score">
              <span>{{ $t('物流评分') }}</span
              ><el-rate v-model="item.logistics_score" disabled> </el-rate>
            </div>
            <div class="star" v-if="item.customer_score">
              <span>{{ $t('客服评分') }}</span
              ><el-rate v-model="item.customer_score" disabled> </el-rate>
            </div>
            <div class="star" v-if="item.pack_score">
              <span>{{ $t('打包评分') }}</span
              ><el-rate v-model="item.pack_score" disabled> </el-rate>
            </div>
            <!-- 精选 -->
            <div class="featured" v-if="item.is_recommend === 1">
              <span class="featured-font">
                {{ $t('精选') }}
              </span>
            </div>
          </div>
        </div>
        <div class="comment-footer">
          <div></div>
          <div>
            <div class="city">
              <i class="el-icon-map-location">{{ item.country }}</i>
            </div>
            <div class="reply">
              <el-input
                v-model="item.replyContent"
                type="textarea"
                :placeholder="$t('写评论...')"
              ></el-input>
              <el-button
                size="mini"
                type="primary"
                class="release"
                @click="release(item.id, item.user.id, item.replyContent)"
                >{{ $t('发布') }}</el-button
              >
            </div>
            <div class="bottom-btn">
              <el-button
                class="btn-light-red"
                v-if="item.is_recommend === 1"
                @click="resetRecommend(item.id, 0)"
                >{{ $t('取消精选') }}</el-button
              >
              <el-button class="btn-deep-purple" v-else @click="resetRecommend(item.id, 1)">{{
                $t('设为精选')
              }}</el-button>
              <el-button
                class="btn-light-red"
                v-if="item.is_admin_add === 1"
                @click="deleteRecommend(item.id)"
                >{{ $t('删除') }}</el-button
              >
              <el-button
                size="mini"
                type="primary"
                class="btn-deep-blue"
                @click="addTime(item.id, item.reference_time)"
                >{{ $t('时效') }}</el-button
              >
            </div>
            <div class="reply-content">
              <div v-for="ele in item.reply" :key="ele.id">
                <div v-if="ele.at_user" style="padding: 10px 0">
                  <span v-if="ele.user.id === -1" class="red-text">{{ ele.user.name }}</span>
                  <span v-else>{{ ele.user.name }}</span>
                  {{ $t('回复') }}
                  <span v-if="ele.at_user.id === -1" class="red-text">{{ ele.at_user.name }}</span>
                  <span v-else>{{ ele.at_user.name }}</span>
                  ：
                  {{ ele.content }}
                  <span
                    style="color: red; margin-left: 30px; cursor: pointer"
                    @click="onDeleteReply(item.id, ele.id)"
                    >{{ $t('删除') }}</span
                  >
                </div>

                <div style="padding: 10px 0" v-else>
                  <span v-if="ele.user.id === -1" class="red-text">{{ ele.user.name }}：</span>
                  <span v-else>{{ ele.user.name }}：</span>
                  {{ ele.content }}
                  <span
                    style="color: red; margin-left: 30px; cursor: pointer"
                    @click="onDeleteReply(item.id, ele.id)"
                    >{{ $t('删除') }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="noDate">
      {{ $t('暂无数据') }}
    </div>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :visible.sync="imgVisible" size="small">
      <div class="img_box">
        <img :src="imgSrc" class="imgDialog" />
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showDialog"
      :title="$t('新增评论')"
      class="dialog-comment"
      @close="clear"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px">
        <!-- 客户头像 -->
        <el-form-item :label="$t('客户头像')">
          <span class="img-item" v-if="this.image" :key="index">
            <img :src="$baseUrl.IMAGE_URL + this.image" alt="" class="goods-img" />
            <span class="model-box"></span>
            <span class="operat-box">
              <i class="el-icon-zoom-in" @click="onPreviewImg(image)"></i>
              <i class="el-icon-delete" @click="onDelete"></i>
            </span>
          </span>
          <el-upload
            v-show="!this.image"
            class="avatar-uploader"
            action=""
            list-type="picture-card"
            :http-request="uploadBaleImage"
            :show-file-list="false"
          >
            <i class="el-icon-plus"> </i>
          </el-upload>
        </el-form-item>
        <!--客户昵称 -->
        <el-form-item :label="$t('客户昵称')">
          <el-input v-model="ruleForm.nickname" :placeholder="$t('请输入')"> </el-input>
        </el-form-item>
        <!--客户ID -->
        <el-form-item :label="$t('客户ID')">
          <el-input v-model="ruleForm.customerId" :placeholder="$t('请输入')"> </el-input>
        </el-form-item>
        <!-- 订单号 -->
        <el-form-item :label="$t('订单号')">
          <el-input v-model="ruleForm.orderSn" :placeholder="$t('请输入')"> </el-input>
        </el-form-item>
        <!-- 显示时间 -->
        <el-form-item :label="$t('显示时间')">
          <el-date-picker
            v-model="ruleForm.display_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('选择日期')"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 收货国家 -->
        <el-form-item :label="$t('收货国家')">
          <el-select
            v-model="ruleForm.country_id"
            filterable
            clearable
            class="country-select"
            :placeholder="$t('请选择国家')"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 评价内容 -->
        <el-form-item :label="$t('评价内容')">
          <el-input v-model="ruleForm.content" :placeholder="$t('请输入')"> </el-input>
        </el-form-item>
        <!-- 上传图片 -->
        <el-form-item :label="$t('上传图片')">
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
        </el-form-item>
        <!-- 评分 -->
        <el-form-item :label="$t('评分')">
          <el-rate v-model="ruleForm.rate"></el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('确定') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="timeDialog"
      class="dialog-comment"
      :title="$t('填写时效')"
      size="small"
    >
      <div v-for="item in languageList" :key="item.id">
        <div style="margin: 10px 0">{{ item.name }}</div>
        <el-input
          :placeholder="$t('请填写时效')"
          v-model="timeContent[item.language_code]"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeDialog = false">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('确定') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import NlePagination from '@/components/pagination'
export default {
  components: {
    SearchGroup,
    NlePagination
  },
  name: 'evaluationList',
  mixins: [pagination],
  data() {
    return {
      tableLoading: false,
      is_recommend: '', // 是否精选
      agentData: [],
      localization: {},
      evaluationData: [],
      timeList: [],
      baleImgList: [],
      begin_date: '',
      end_date: '',
      imgVisible: false,
      imgSrc: '',
      urlHtml: '',
      show: false,
      showDialog: false,
      labelId: '',
      form: {},
      value: 2,
      countryList: [],
      enabled: 0,
      index: '',
      image: '',
      hasFilterCondition: true,
      ruleForm: {
        nickname: '',
        customerId: '',
        orderSn: '',
        country_id: '',
        display_time: '',
        content: '',
        rate: null
      },
      statusList: [
        {
          id: 0,
          name: this.$t('非精选')
        },
        {
          id: 1,
          name: this.$t('精选')
        }
      ],
      commentId: '',
      timeDialog: false,
      languageList: [],
      timeContent: {}
    }
  },
  created() {
    this.getlanguage()
    this.getList()
    this.getCountry()
    this.getConfig()
  },
  methods: {
    getlanguage() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageList = res.data
        }
      })
    },
    getList() {
      this.tableLoading = true
      this.evaluationData = []
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        is_recommend: this.is_recommend
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      // 提交时间
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getComments(params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.evaluationData = res.data
          this.localization = res.localization
          this.page_params.page = res.meta.current_page
          this.page_params.total = res.meta.total
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 上传打包照片
    uploadBaleImg(item) {
      let file = item.file
      this.onUpload(file).then(res => {
        if (res.ret) {
          res.data.forEach(item => {
            this.baleImgList.push(item.path)
            console.log(item)
          })
        }
      })
    },
    // 预览图片
    onPreview(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    // 删除图片
    onDeleteImg(index) {
      this.baleImgList.splice(index, 1)
      console.log(index)
    },
    // 上传图片
    onUpload(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    onPreviewImg(image) {
      dialog({
        type: 'previewimage',
        image
      })
    },
    onDelete() {
      this.image = ''
    },
    uploadBaleImage(item) {
      let file = item.file
      this.onUploads(file).then(res => {
        if (res.ret) {
          this.image = res.data[0].path
          this.$message.success(this.$t('上传成功'))
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 上传封面
    onUploads(file) {
      let params = new FormData()
      params.append(`images[${0}][file]`, file)
      return this.$request.uploadImg(params)
    },
    // 精选状态选择
    onShipStatus() {
      this.page_params.handleQueryChange('status', this.is_recommend)
      this.getList()
    },
    // 获取代理列表
    getAgentData() {
      this.$request.getSimpleList().then(res => {
        this.agentData = res.data
      })
    },
    // 提交时间
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      // this.getList()
    },
    // 取消或设置精选
    resetRecommend(id, status) {
      this.$confirm(this.$t('您真的要执行此操作吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.updateRecommend(id, status).then(res => {
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
    // 删除
    deleteRecommend(id) {
      this.$confirm(this.$t('您真的要执行此操作吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request.deleteComment(id).then(res => {
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
    // 预设分区表 获取国家
    getCountry() {
      this.$request.countryLocation().then(res => {
        if (res.ret) {
          this.countryList = res.data
          this.options = res.data.map(item => {
            return {
              value: item.id,
              label: item.name,
              children:
                item.areas < 1
                  ? undefined
                  : item.areas.map(item => {
                      return {
                        value: item.id,
                        label: item.name,
                        children:
                          item.areas < 1
                            ? undefined
                            : item.areas.map(item => {
                                return {
                                  value: item.id,
                                  label: item.name
                                }
                              })
                      }
                    })
            }
          })
          console.log(this.options)
        }
      })
    },
    release(id, userId, content) {
      if (!content) return
      this.$request
        .addReply(id, {
          at_user_id: userId,
          content,
          id
        })
        .then(res => {
          if (res.ret) {
            console.log(res.data)
            this.getList()
          }
        })
    },
    addTime(id) {
      this.$request.getCommentDetails(id).then(res => {
        if (res.ret) {
          this.commentId = id
          this.timeDialog = true
          this.timeContent = {}
          if (res.data.reference_time) {
            this.timeContent = res.data.reference_time
          }
        }
      })
    },
    save() {
      this.$request.addTime(this.commentId, { reference_time: this.timeContent }).then(res => {
        if (res.ret) {
          this.getList()
        }
        this.timeDialog = false
        this.commentId = ''
      })
    },
    // 重置表单
    resetForm() {
      this.timeList = []
      this.is_recommend = ''
    },
    // 提交表单
    submitForm() {
      this.onTime(this.timeList)
      this.onShipStatus()
    },
    getConfig() {
      this.$request.getFunConfig().then(res => {
        this.enabled = res.data[0].enabled
      })
    },
    clear() {
      this.ruleForm.nickname = ''
      this.ruleForm.customerId = ''
      this.ruleForm.display_time = ''
      this.ruleForm.country_id = ''
      this.ruleForm.content = ''
      this.ruleForm.rate = null
      this.baleImgList = []
      this.image = ''
      this.ruleForm.orderSn = ''
    },
    submit() {
      let param = {
        order_sn: this.ruleForm.orderSn,
        avatar: this.image,
        username: this.ruleForm.nickname,
        user_id: this.ruleForm.customerId,
        content: this.ruleForm.content,
        images: this.baleImgList,
        score: this.ruleForm.rate || '',
        created_at: this.ruleForm.display_time,
        country_id: this.ruleForm.country_id
      }
      this.$request.getAddEvaluate(param).then(res => {
        if (res.ret) {
          this.$notify({
            title: this.$t('操作成功'),
            message: res.msg,
            type: 'success'
          })
          this.showDialog = false
          this.getList()
        } else {
          this.$notify({
            title: this.$t('操作失败'),
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    onDeleteReply(id, replyId) {
      this.$request.delReply(id, replyId).then(res => {
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
    }
  }
}
</script>

<style lang="scss">
.evaluation-management-container {
  .agentRight {
    float: right;
  }
  .font-order {
    color: #7f7f7f;
  }
  .red-text {
    color: #ff4444;
  }
  .comment-item {
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
    .comment-top {
      padding: 20px;
    }
    .comment-center {
      display: grid;
      gap: 50px;
      grid-template-columns: 80px 65% 20%;
      padding: 10px;
      .list-img {
        width: 80px;
        img {
          height: 80px;
          width: 80px;
          border-radius: 50%;
          border: 1px solid #ececec;
        }
      }
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .content {
        padding: 10px 0;
      }
      .img-list {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(5, 1fr);
        img {
          width: 120px;
          height: 120px;
        }
      }
    }
    .comment-footer {
      padding: 20px;
      display: grid;
      gap: 50px;
      grid-template-columns: 80px 1fr;
      .city {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .reply {
        padding: 20px 0;
        overflow: hidden;
        .release {
          float: right;
          margin-top: 10px;
        }
      }
      .bottom-btn {
        text-align: right;
      }
      .reply-content {
        margin-top: 10px;
        padding: 0 10px;
        border-radius: 5px;
        background-color: #f8f8f8;
      }
    }
  }
  .star {
    display: flex;
    gap: 10px;
  }
  .changeTime {
    display: inline-block;
    .timeStyle {
      margin-right: 10px;
      width: 276px !important;
    }
  }
  .img_box {
    text-align: center;
    .imgDialog {
      width: 50%;
    }
  }
  .chooseOrder {
    cursor: pointer;
    color: blue;
    text-decoration: underline;
  }
  .operating-btn {
    margin-bottom: 5px;
  }
  .dialogSty {
    margin-left: 30px;
  }
  .iframe {
    width: 100%;
    min-height: 300px;
    border-width: 0;
  }
  .chooseStatus {
    width: 150px;
    display: inline-block;
  }
  ul {
    list-style: none;
    padding: 0;
    margin-top: 0;
    .el-row {
      margin: 0 !important;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .evaluation-list {
    background-color: #fff !important;
    width: 100%;
    padding-bottom: 10px;
    border: 1px solid #ebeef5;
    margin-bottom: 10px;
    .list-img {
      width: 80px;
      padding: 0 10px;
      img {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        border: 1px solid #ececec;
      }
    }
    .list-font {
      .list-evaluation {
        margin-top: 10px;
        font-size: 13px;
        // width: 200px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
      // .list-evaluation:hover {
      //   // cursor: pointer;
      //   width: auto !important;
      // }
      .order-img {
        width: 40px;
        img {
          display: inline-block;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  .order-num {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
    padding-left: 15px;
    padding-top: 10px;
  }
  .left-img {
    margin-top: 20px;
    padding: 10px 5px;
    display: inline-block;
  }
  .productImg {
    border: 1px dashed #ccc;
    display: inline-block;
    margin-right: 15px;
    width: 110px;
    height: 100px;
  }
  .location-sty {
    margin-top: 10px;
  }
  .featured {
    text-align: center;
    margin-top: 20px;
    .featured-font {
      color: #fff;
      background-color: red;
      line-height: 40px;
      font-size: 23px;
      padding: 0 5px;
      border-radius: 5px;
    }
  }
  .searchGroup {
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
    .search-group {
      // flex: 1;
      width: 21.5%;
      margin-right: 10px;
    }
  }
  .order-list-search {
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
      .shipments {
        display: inline-block;
      }
    }
    .chooseStatus {
      // width: 150px;
      display: inline-block;
    }
    .submit {
      float: right;
      margin-top: 10px;
    }
  }
  .comment {
    display: flex;
    justify-content: flex-start;
    .evaluate {
      height: 40px;
      margin-top: 10px;
    }
  }
  .dialog-comment {
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
    .el-input {
      width: 50%;
    }
    .el-select {
      width: 50%;
    }
    .el-rate {
      margin-top: 10px;
    }
  }
  .operat-box {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    opacity: 0;
  }
  .operat-box i {
    font-size: 20px;
    color: #fff;
    margin-right: 10px;
  }
}
</style>
