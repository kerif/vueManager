<template>
  <div class="drainage-container">
    <div class="poster-left">
      <p class="left-name">{{ $t('渠道名称') }}</p>
      <span>{{ ruleForm.channel_name }}</span
      ><br />
      <p class="left-name">{{ $t('创建日期') }}</p>
      <span>{{ ruleForm.created_at }}</span
      ><br />
      <div class="page-sty">
        <p class="left-name">{{ $t('小程序页面路径') }}</p>
        <p class="path-sty">{{ ruleForm.path }}</p>
        <div :title="$t('复制单号')" class="copy-sty" @click="copyNumber(ruleForm.path)">
          <i class="el-icon-copy-document"></i>
        </div>
      </div>
      <br />
      <div class="code-font">{{ $t('专属小程序码') }}</div>
      <div class="left-bottom">
        <!-- <img src="../../../assets/bale.png"> -->
        <img :src="$baseUrl.IMAGE_URL + ruleForm.app_code" alt="" class="goods-img" />
      </div>
      <div class="upload-btn">
        <!-- <a :href="urlImg" download>xiazai</a> -->
        <el-button type="primary" @click="uploadImg">{{ $t('下载') }}</el-button>
        <p class="share">{{ $t('推荐将小程序码放在公众号或广告插图进行推广') }}</p>
      </div>
    </div>
    <div class="poster-right">
      <div>
        <search-group v-model="page_params.keyword" @search="goSearch">
          <el-date-picker
            class="timeStyle"
            v-model="timeList"
            type="daterange"
            @change="onTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('至')"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
          >
          </el-date-picker>
        </search-group>
      </div>
      <el-table :data="transactionList" stripe border class="data-list" v-loading="tableLoading">
        <el-table-column type="index" :index="1"></el-table-column>
        <!-- 统计日期 -->
        <el-table-column :label="$t('统计日期')" prop="days"></el-table-column>
        <!-- 注册用户 -->
        <el-table-column :label="$t('注册用户')" prop="count"> </el-table-column>
        <!-- 邮箱激活 -->
        <el-table-column :label="$t('邮箱激活')" prop="email_count"></el-table-column>
        <!-- 手机号激活 -->
        <el-table-column :label="$t('手机号激活')" prop="phone_count"></el-table-column>
        <!-- 预报量 -->
        <el-table-column :label="$t('预报量')" prop="package_count"></el-table-column>
        <!-- 转化率 -->
        <el-table-column :label="$t('转化率%')" prop="conversion_ratio"></el-table-column>
      </el-table>
      <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    </div>
  </div>
</template>

<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
// import { downloadStreamFile } from '@/utils/index'
export default {
  mixins: [pagination],
  name: 'drainageList',
  components: {
    SearchGroup,
    NlePagination
  },
  data() {
    return {
      timeList: [],
      transactionList: [],
      begin_date: '',
      end_date: '',
      tableLoading: false,
      localization: {},
      ruleForm: {},
      urlImg: ''
    }
  },
  created() {
    this.getList()
    this.getDetails()
  },
  methods: {
    getList() {
      this.tableLoading = true
      let params = {
        page: this.page_params.page,
        size: this.page_params.size,
        payment_type: this.type
      }
      this.page_params.keyword && (params.keyword = this.page_params.keyword)
      this.begin_date && (params.begin_date = this.begin_date)
      this.end_date && (params.end_date = this.end_date)
      this.$request.getChannelsData(this.$route.params.id, params).then(res => {
        this.tableLoading = false
        if (res.ret) {
          this.transactionList = res.data
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
    // 获取左侧详情数据
    getDetails() {
      this.$request.getAloneChannel(this.$route.params.id).then(res => {
        if (res.ret) {
          this.ruleForm = res.data
          this.urlImg = `${this.$baseUrl.IMAGE_URL}${res.data.app_code}`
          console.log(this.urlImg, 'this.urlImg')
        }
      })
    },
    onTime(val) {
      this.begin_date = val ? val[0] : ''
      this.end_date = val ? val[1] : ''
      this.page_params.page = 1
      this.page_params.handleQueryChange('times', `${this.begin_date} ${this.end_date}`)
      this.getList()
    },
    // 下载小程序码
    uploadImg() {
      window.open(this.urlImg, '_black')
      // const aLink = document.createElement('a')
      // aLink.download = '1.jpg'
      // aLink.href = this.urlImg
      // console.log('aki', aLink.href, aLink.download)
      // aLink.click()
      // aLink.dispatchEvent(new MouseEvent('click', {}))
      // let param = {
      //   responseType: 'blob'
      // }
      // this.$request.getCodeImg(this.$route.params.id, param).then(res => {
      //   downloadStreamFile(res, 'codes', 'jpg')
      // })
    },
    copyNumber(orderSn) {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', orderSn)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success(this.$t('复制成功'))
      }
      document.body.removeChild(input)
    }
  }
}
</script>

<style lang="scss">
.drainage-container {
  .poster-left {
    width: 330px;
    height: 640px;
    overflow: hidden;
    vertical-align: top;
    display: inline-block;
    // text-align: center;
    background-color: #fff;
    padding: 20px 30px;
    position: relative;
    margin-right: 40px;
    .left-top {
      img {
        width: 80px;
        height: 80px;
        padding: 5px;
        border-radius: 50%;
        border: 1px solid #ccc;
      }
    }
  }
  .poster-right {
    width: calc(100%-430px);
    width: -moz-calc(100% - 430px);
    width: -webkit-calc(100% - 430px);
    vertical-align: top;
    display: inline-block;
    // background-color: #fff;
    padding: 15px;
    height: 616px;
    box-sizing: border-box;
  }
  .left-name {
    display: inline-block;
    // margin-right: 30px;
    width: 130px;
  }
  .code-font {
    margin-top: 60px;
  }
  .left-bottom {
    // position: absolute;
    // bottom: 170px;
    // left: 50%;
    // transform: translateX(-50%);
    margin-top: 20px;
    text-align: center;
    img {
      // width: 100%;
      // height: 100%;
      width: 200px;
      // height: 60px;
      padding: 5px;
    }
  }
  .upload-btn {
    text-align: center;
    position: absolute;
    left: 67px;
    bottom: 50px;
    .el-button--primary {
      width: 50%;
    }
  }
  .share {
    font-size: 13px;
    color: gray;
  }
  .search-group .pull-right {
    width: 30% !important;
  }
  .path-sty {
    width: 130px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .page-sty {
    display: flex;
    align-items: center;
    // justify-content: space-between;
  }
  .copy-sty {
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
