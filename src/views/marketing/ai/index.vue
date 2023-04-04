<template>
  <div class="ai-container">
    <div class="content-box flex-item">
      <div class="title font-bold">{{ $t('海鸥AI文案助手') }}</div>
      <div class="messages-box" ref="messages">
        <div v-for="item in recordList" :key="item.time">
          <div v-if="item.role === 'user'" class="flex-item chat-user">
            <img src="../../../assets/user-chat.jpeg" class="img-chat" />
            <div class="chat-content-box text-right">
              <div>
                <span class="font-bold">{{ $store.state.userName }}</span>
                <span class="grey-text chat-time">{{ item.time }}</span>
              </div>
              <div class="chat-content">{{ item.message }}</div>
            </div>
          </div>
          <div v-else class="flex-item chat-assistant">
            <img src="../../../assets/top.png" class="img-chat" />
            <div class="chat-content-box">
              <div class="flex-item align-center">
                <span class="font-bold">{{ $t('海鸥AI') }}</span>
                <span class="grey-text chat-time">{{ item.time }}</span>
                <div class="sync-btn text-right">
                  <el-button
                    size="small"
                    v-show="item.message"
                    @click="onSyncArticle(item.message)"
                    >{{ $t('同步到文章中') }}</el-button
                  >
                </div>
              </div>
              <div class="chat-content">
                <div class="markdown-body" v-if="item.message" v-html="item.message" />
                <div v-else class="message-loading" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sender-box flex-item">
        <el-input
          v-model="sendMessage"
          type="textarea"
          :placeholder="
            $t('请输入: 类似于帮我写一篇类似于中国到美国的集运转运的软文 (Shift + Enter = 换行)')
          "
          @keydown.native="onKeyDown"
          autofocus
          autosize
          resize="none"
        />
        <el-button
          type="primary"
          class="send-btn"
          @click="onSender"
          :loading="$store.state.btnLoading"
          icon="el-icon-s-promotion"
        ></el-button>
      </div>
    </div>
    <sync-drawer :show.sync="syncShow" :content="artileContent" />
  </div>
</template>
<script>
import MarkdownIt from 'markdown-it'
import SyncDrawer from './sync_drawer.vue'
import { formatDate } from '@/utils'

const md = new MarkdownIt()

export default {
  data() {
    return {
      sendMessage: '',
      recordList: [],
      syncShow: false,
      artileContent: ''
    }
  },
  methods: {
    onSender() {
      if (this.$store.state.btnLoading) return
      if (!this.sendMessage.trim()) {
        return this.$message.info(this.$t('消息不能为空'))
      }
      const message = this.sendMessage
      this.sendMessage = ''
      const messages = [
        {
          role: 'user',
          message,
          time: formatDate()
        },
        {
          role: 'assistant',
          message: ''
        }
      ]
      this.recordList = this.recordList.concat(messages)
      this.onScrollBottom()
      this.$request
        .aiChat({
          content: message
        })
        .then(res => {
          const length = this.recordList.length - 1
          this.$set(this.recordList, length, {
            role: 'assistant',
            message: res.ret ? md.render(res.data.content) : res.msg,
            time: formatDate()
          })
          this.onScrollBottom()
        })
    },
    onScrollBottom() {
      const messageRef = this.$refs['messages']
      this.$nextTick(() => {
        messageRef.scrollTop = messageRef.scrollHeight
      })
    },
    // 同步文章
    onSyncArticle(content) {
      this.artileContent = content
      this.syncShow = true
    },
    onKeyDown(e) {
      if (e.shiftKey && e.keyCode === 13) {
        e.stopPropagation()
        e.preventDefault()
        this.sendMessage += '\n'
      } else if (e.keyCode === 13) {
        e.stopPropagation()
        e.preventDefault()
        this.onSender()
      }
    }
  },
  components: {
    SyncDrawer
  }
}
</script>
<style lang="scss">
@import '../../../styles/markdown.scss';
@import '../../../styles/markdown_style.scss';
@keyframes block-loading {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.ai-container {
  height: 100%;
  box-sizing: border-box;
  .messages-box {
    padding: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .flex-item {
    display: flex;
    align-items: flex-start;
  }
  .content-box {
    background-color: #fff;
    height: 100%;
    flex-direction: column;
  }
  .title {
    background-color: #3540a5;
    color: #fff;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
  }
  .sync-btn {
    flex: 1;
    margin-left: 15px;
  }
  .messages-box {
    flex: 1;
    font-size: 14px;
    box-shadow: 0 0 10px 0 rgba(162, 162, 163, 0.35);
  }
  .sender-box {
    background-color: #f5f5f5;
    padding-top: 15px;
    width: 100%;
  }
  .send-btn {
    margin-left: 15px;
    min-width: 80px;
    padding: 0 20px;
    font-size: 20px;
    line-height: 32px;
  }
  .grey-text {
    color: #b4bbc4;
  }
  .text-right {
    text-align: right;
  }
  .img-chat {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .align-center {
    align-items: center;
  }
  .chat-content {
    margin-top: 5px;
    background-color: #d2f9d1;
    padding: 8px 15px;
    border-radius: 5px;
    display: inline-block;
    position: relative;
    text-align: left;
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      right: -8px;
      top: 10px;
      border-top: 6px solid transparent;
      border-left: 8px solid #d2f9d1;
      border-bottom: 6px solid transparent;
    }
  }
  .chat-time {
    margin-left: 10px;
    font-size: 12px;
  }
  .chat-assistant,
  .chat-user {
    margin-bottom: 15px;
  }
  .chat-user {
    flex-direction: row-reverse;
    .img-chat {
      margin-left: 20px;
    }
    .chat-content {
      white-space: pre-line;
    }
  }
  .chat-assistant {
    .img-chat {
      margin-right: 20px;
    }

    .chat-content {
      box-sizing: border-box;
      width: 100%;
      background-color: #f4f6f8;
      &::after {
        border-left: none;
        border-right: 8px solid #f4f6f8;
        left: -8px;
      }
    }
  }
  .message-loading {
    width: 8px;
    height: 15px;
    background-color: #9a9a9a;
    animation: block-loading 0.6s infinite alternate;
  }
}
</style>
