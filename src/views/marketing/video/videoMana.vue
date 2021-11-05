<template>
  <div class="video-list-container">
    <div>
      <search-group v-model="page_params.keyword" @search="goSearch"> </search-group>
    </div>
    <div class="select-box">
      <add-btn @click.native="addVip">{{ $t('添加') }}</add-btn>
    </div>
    <el-table
      :data="videoList"
      stripe
      border
      class="data-list"
      v-loading="tableLoading"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column :label="$t('标题')" prop="title"></el-table-column>
      <el-table-column :label="$t('内容介绍')" prop="content"></el-table-column>
      <el-table-column :label="$t('状态')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeShow($event, scope.row.id)"
            :active-text="$t('开')"
            :inactive-text="$t('关')"
            active-color="#13ce66"
            inactive-color="gray"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="$t('创建时间')" prop="created_at"></el-table-column>
      <el-table-column
        :label="item.name"
        v-for="item in formatLangData"
        :key="item.id"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row['trans_' + item.language_code]"
            class="el-icon-check icon-sty"
            @click="onLang(scope.row, item)"
          ></span>
          <span v-else class="el-icon-plus icon-sty" @click="onLang(scope.row, item)"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button class="btn-green" @click="editVip(scope.row.id)">{{ $t('修改') }}</el-button>
          <!-- 预览 -->
          <el-button class="btn-main" @click="Preview(scope.row.video)">{{ $t('预览') }}</el-button>
        </template>
      </el-table-column>
      <template slot="append">
        <div class="append-box">
          <el-button size="small" class="btn-light-red" @click="deleteData">{{
            $t('删除')
          }}</el-button>
        </div>
      </template>
    </el-table>
    <nle-pagination :pageParams="page_params" :notNeedInitQuery="false"></nle-pagination>
    <el-dialog :title="$t('预览')" :visible.sync="videoVisible" :before-close="close" width="60%">
      <video-player
        v-if="playerOptions.sources.length"
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      />
    </el-dialog>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import AddBtn from '@/components/addBtn'
import { pagination } from '@/mixin'
import dialog from '@/components/dialog'
import { videoPlayer as VideoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
const videoUrl = 'http://q55zf5gh1.bkt.clouddn.com/'
export default {
  name: 'videoList',
  components: {
    SearchGroup,
    NlePagination,
    AddBtn,
    VideoPlayer
  },
  mixins: [pagination],
  data() {
    return {
      videoList: [
        {
          enabled: true
        }
      ],
      tableLoading: false,
      deleteNum: [],
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [],
        poster: '../../static/images/test.jpg', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: this.$t('此视频暂无法播放请稍后再试'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      videoVisible: false,
      languageData: [],
      transCode: ''
    }
  },
  mounted() {
    this.getList()
    this.getLanguageList()
  },
  computed: {
    formatLangData() {
      return this.languageData.filter(item => item.language_code !== 'zh_CN')
    }
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.$request
        .getVideoList({
          keyword: this.page_params.keyword,
          page: this.page_params.page,
          size: this.page_params.size
        })
        .then(res => {
          this.tableLoading = false
          if (res.ret) {
            this.videoList = res.data.map(item => ({ ...item, enabled: Boolean(item.enabled) }))
            // this.videoList = res.data
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
    changeShow(event, id) {
      console.log(typeof event, '我是event')
      console.log(event, 'event')
      this.$request.closeVideo(id, Number(event)).then(res => {
        if (res.ret) {
          this.$notify({
            type: 'success',
            title: this.$t('操作成功'),
            message: res.msg
          })
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    close() {
      this.playerOptions.sources = []
      this.videoVisible = false
    },
    // 用户组分类选择值加载
    goSearchType(val) {
      this.page_params.page = 1
      this.page_params.name_cn = val
      this.getList()
    },
    // 添加视频
    addVip() {
      dialog({ type: 'videoList', state: 'add' }, () => {
        this.getList()
      })
    },
    // 修改资料
    editVip(id) {
      console.log(id, 'id')
      dialog({ type: 'videoList', id: id, state: 'edit' }, () => {
        this.getList()
      })
    },
    // 预览
    Preview(video) {
      this.videoVisible = true
      this.playerOptions.sources = [{ src: videoUrl + video }]
    },
    selectionChange(selection) {
      this.deleteNum = selection.map(item => item.id)
    },
    // 删除
    deleteData() {
      console.log(this.deleteNum, 'this.deleteNum')
      if (!this.deleteNum || !this.deleteNum.length) {
        return this.$message.error(this.$t('请选择'))
      }
      this.$confirm(this.$t('是否确认删除'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$request
          .videoDelete({
            DELETE: this.deleteNum
          })
          .then(res => {
            if (res.ret) {
              this.$notify({
                title: this.$t('操作成功'),
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
      })
    },
    // 获取全部语言
    getLanguageList() {
      this.$request.languageList().then(res => {
        if (res.ret) {
          this.languageData = res.data
        }
      })
    },
    // 转账 修改语言
    onLang(line, lang) {
      console.log(line, lang)
      this.transCode = line['trans_' + lang.language_code]
      // console.log(line['trans_' + lang.language_code])
      dialog({ type: 'videoLang', line: line, lang: lang, transCode: this.transCode }, () => {
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss">
.video-list-container {
  .select-box {
    overflow: hidden;
  }
  .video-js .vjs-big-play-button {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
